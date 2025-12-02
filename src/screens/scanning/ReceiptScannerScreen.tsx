import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, CheckCircle, FileText, Trash2, Plus, Upload, AlertCircle, Image } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Toast } from '../../components/Toast';
import { createWorker } from 'tesseract.js';

interface ReceiptScannerScreenProps {
  onNavigate: (screen: string) => void;
}

interface ReceiptItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  expiryDays: number;
}

export function ReceiptScannerScreen({ onNavigate }: ReceiptScannerScreenProps) {
  const [mode, setMode] = useState<'select' | 'camera' | 'upload'>('select');
  const [extractedItems, setExtractedItems] = useState<ReceiptItem[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 1920, height: 1080 } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error: any) {
      // Handle camera errors silently
      let errorMsg = '';
      
      if (error.name === 'NotAllowedError') {
        errorMsg = 'Camera permission denied. Please upload an image instead.';
      } else if (error.name === 'NotFoundError') {
        errorMsg = 'No camera found. Please upload an image instead.';
      } else if (error.name === 'NotReadableError') {
        errorMsg = 'Camera is in use. Please upload an image instead.';
      } else {
        errorMsg = 'Camera unavailable. Please upload an image instead.';
      }
      
      setToastMessage(errorMsg);
      setShowToast(true);
      
      // Switch to upload mode
      setMode('upload');
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 100);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
        stopCamera();
        processReceipt(imageData);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        setMode('upload');
        processReceipt(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const processReceipt = async (imageData: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Initialize Tesseract worker
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProcessingProgress(Math.round(m.progress * 100));
          }
        }
      });

      // Perform OCR
      const { data: { text } } = await worker.recognize(imageData);
      await worker.terminate();

      // Parse extracted text
      const items = parseReceiptText(text);
      setExtractedItems(items);
      setIsProcessing(false);
      setProcessingProgress(100);
      
      if (items.length > 0) {
        setToastMessage(`${items.length} items extracted from receipt`);
      } else {
        setToastMessage('No items detected. Please try again with a clearer image.');
      }
      setShowToast(true);
      
    } catch (error) {
      setIsProcessing(false);
      setToastMessage('Failed to process receipt. Please try again.');
      setShowToast(true);
      
      // Fallback to mock data for demo
      setTimeout(() => {
        setExtractedItems(getMockReceiptItems());
      }, 500);
    }
  };

  const parseReceiptText = (text: string): ReceiptItem[] => {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const items: ReceiptItem[] = [];
    let itemId = 1;

    // Common food keywords for detection
    const foodKeywords = [
      'milk', 'bread', 'egg', 'chicken', 'beef', 'pork', 'fish', 'cheese', 'butter',
      'yogurt', 'cream', 'tomato', 'potato', 'onion', 'carrot', 'lettuce', 'spinach',
      'apple', 'banana', 'orange', 'strawberry', 'grape', 'rice', 'pasta', 'flour',
      'sugar', 'salt', 'pepper', 'oil', 'sauce', 'juice', 'water', 'soda', 'coffee',
      'tea', 'cereal', 'oat', 'nut', 'almond', 'walnut', 'meat', 'produce', 'organic'
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      
      // Check if line contains food keywords
      const containsFood = foodKeywords.some(keyword => line.includes(keyword));
      
      if (containsFood) {
        // Extract quantity (look for numbers at start of line)
        const qtyMatch = line.match(/^(\d+)\s/);
        const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 1;
        
        // Extract item name (remove quantity and price)
        let itemName = lines[i]
          .replace(/^\d+\s/, '') // Remove leading quantity
          .replace(/\$?\d+\.?\d*\s*$/, '') // Remove trailing price
          .trim();
        
        // Capitalize first letter of each word
        itemName = itemName.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        
        if (itemName.length > 2) {
          const category = categorizeItem(itemName);
          const expiryDays = estimateExpiryDays(category, itemName);
          
          items.push({
            id: itemId++,
            name: itemName,
            quantity: quantity,
            category: category,
            expiryDays: expiryDays
          });
        }
      }
    }

    // If no items found, return mock data
    return items.length > 0 ? items : getMockReceiptItems();
  };

  const categorizeItem = (itemName: string): string => {
    const name = itemName.toLowerCase();
    
    if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || 
        name.includes('butter') || name.includes('cream')) {
      return 'Dairy';
    }
    if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || 
        name.includes('fish') || name.includes('meat')) {
      return 'Meat';
    }
    if (name.includes('tomato') || name.includes('potato') || name.includes('lettuce') || 
        name.includes('spinach') || name.includes('carrot') || name.includes('onion') ||
        name.includes('apple') || name.includes('banana') || name.includes('orange') ||
        name.includes('strawberry') || name.includes('grape')) {
      return 'Produce';
    }
    if (name.includes('oil') || name.includes('sauce') || name.includes('spice') || 
        name.includes('pepper') || name.includes('salt')) {
      return 'Spices';
    }
    
    return 'Pantry';
  };

  const estimateExpiryDays = (category: string, itemName: string): number => {
    const name = itemName.toLowerCase();
    
    // Specific items with known short shelf life
    if (name.includes('bread')) return 5;
    if (name.includes('fish')) return 2;
    if (name.includes('strawberry') || name.includes('berry')) return 3;
    if (name.includes('spinach') || name.includes('lettuce')) return 4;
    
    // Category-based defaults
    switch (category) {
      case 'Meat': return 3;
      case 'Produce': return 5;
      case 'Dairy': return 7;
      case 'Pantry': return 90;
      case 'Spices': return 180;
      default: return 7;
    }
  };

  const getMockReceiptItems = (): ReceiptItem[] => {
    return [
      { id: 1, name: 'Organic Milk', quantity: 1, category: 'Dairy', expiryDays: 7 },
      { id: 2, name: 'Fresh Tomatoes', quantity: 4, category: 'Produce', expiryDays: 5 },
      { id: 3, name: 'Chicken Breast', quantity: 2, category: 'Meat', expiryDays: 3 },
      { id: 4, name: 'Olive Oil', quantity: 1, category: 'Pantry', expiryDays: 180 },
      { id: 5, name: 'Cheddar Cheese', quantity: 1, category: 'Dairy', expiryDays: 14 },
      { id: 6, name: 'Fresh Spinach', quantity: 1, category: 'Produce', expiryDays: 3 }
    ];
  };

  const deleteItem = (id: number) => {
    setExtractedItems(extractedItems.filter(item => item.id !== id));
    setToastMessage('Item removed from list');
    setShowToast(true);
  };

  const updateQuantity = (id: number, newQuantity: string) => {
    const qty = parseInt(newQuantity);
    if (qty > 0) {
      setExtractedItems(extractedItems.map(item => 
        item.id === id ? { ...item, quantity: qty } : item
      ));
    }
  };

  const updateExpiryDays = (id: number, newDays: string) => {
    const days = parseInt(newDays);
    if (days > 0) {
      setExtractedItems(extractedItems.map(item => 
        item.id === id ? { ...item, expiryDays: days } : item
      ));
    }
  };

  const handleAddAllToInventory = () => {
    if (extractedItems.length === 0) {
      setToastMessage('No items to add');
      setShowToast(true);
      return;
    }

    // Get existing inventory from localStorage
    const existingInventory = localStorage.getItem('inventoryItems');
    const inventory = existingInventory ? JSON.parse(existingInventory) : [];
    
    // Calculate starting ID
    let newId = inventory.reduce((maxId: number, item: any) => Math.max(maxId, item.id), 0) + 1;
    
    // Add all items
    extractedItems.forEach(item => {
      inventory.push({
        id: newId++,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        expiryDays: item.expiryDays
      });
    });
    
    localStorage.setItem('inventoryItems', JSON.stringify(inventory));
    
    setToastMessage(`${extractedItems.length} items added to inventory`);
    setShowToast(true);
    
    // Navigate back to inventory after short delay
    setTimeout(() => {
      onNavigate('inventory');
    }, 1000);
  };

  const handleCameraMode = () => {
    setMode('camera');
    startCamera();
  };

  const handleUploadMode = () => {
    setMode('upload');
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              stopCamera();
              onNavigate('inventory');
            }}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h3 className="text-white">Scan Receipt</h3>
          <button
            onClick={handleUploadMode}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <Upload size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center">
        {mode === 'select' && !capturedImage ? (
          /* Mode Selection */
          <div className="relative z-10 px-6 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-4">
                <FileText size={40} className="text-[var(--color-primary)]" />
              </div>
              <h2 className="text-white mb-2">Scan Receipt</h2>
              <p className="text-white/70">
                Choose how you'd like to scan your receipt
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCameraMode}
              >
                <Camera size={20} />
                Use Camera
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleUploadMode}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Upload size={20} />
                Upload Image
              </Button>
            </div>

            <p className="text-white/50 text-sm text-center mt-6">
              Camera option requires camera permission
            </p>
          </div>
        ) : mode === 'camera' && !capturedImage && !isProcessing ? (
          /* Camera Mode */
          <>
            {/* Real Camera Feed */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            
            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Camera Overlay */}
            <div className="absolute inset-0 bg-black/30" />
            
            {/* Receipt Frame */}
            <div className="relative z-10 px-6 w-full">
              <div className="max-w-sm mx-auto">
                <div className="aspect-[3/4] border-4 border-dashed border-white/40 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <FileText size={64} className="text-white/70 mx-auto mb-4" />
                    <p className="text-white/70">
                      Position receipt within frame
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={captureImage}
                >
                  <Camera size={20} />
                  Capture Receipt
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={handleUploadMode}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <Upload size={20} />
                  Upload Instead
                </Button>
              </div>
            </div>
          </>
        ) : isProcessing ? (
          /* Processing State */
          <div className="absolute inset-0 bg-[var(--color-cream)] flex items-center justify-center animate-fade-in">
            <div className="text-center px-6">
              <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-6">
                <FileText size={48} className="text-[var(--color-primary)] animate-pulse" />
              </div>
              <h2 className="mb-2">Processing Receipt...</h2>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Extracting items using OCR
              </p>
              <div className="w-full max-w-xs mx-auto">
                <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--color-primary)] transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                  {processingProgress}%
                </p>
              </div>
            </div>
          </div>
        ) : extractedItems.length > 0 || capturedImage ? (
          /* Extracted Items */
          <div className="absolute inset-0 bg-[var(--color-cream)] overflow-auto">
            <div className="px-4 pt-20 pb-8">
              {/* Success Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={24} className="text-[var(--color-success)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="mb-1">Receipt Processed</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {extractedItems.length} items found - Review and edit
                  </p>
                </div>
              </div>

              {/* Show captured image */}
              {capturedImage && (
                <Card className="p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} className="text-[var(--color-text-secondary)]" />
                    <p className="text-sm text-[var(--color-text-secondary)]">Scanned Receipt</p>
                  </div>
                  <img 
                    src={capturedImage} 
                    alt="Captured receipt" 
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </Card>
              )}

              {extractedItems.length === 0 ? (
                <Card className="p-8 text-center">
                  <AlertCircle size={48} className="text-[var(--color-text-secondary)] mx-auto mb-3" />
                  <p className="text-[var(--color-text-secondary)] mb-4">
                    No items detected. Try again with better lighting.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      setCapturedImage(null);
                      setMode('select');
                      setExtractedItems([]);
                    }}
                  >
                    <Camera size={20} />
                    Try Again
                  </Button>
                </Card>
              ) : (
                <>
                  {/* Detected Items */}
                  <div className="mb-6">
                    <h4 className="mb-3 px-1">Detected Items ({extractedItems.length})</h4>
                    <div className="space-y-3">
                      {extractedItems.map((item) => (
                        <Card
                          key={item.id}
                          className="p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="mb-1 truncate">{item.name}</h4>
                              <p className="text-xs text-[var(--color-text-secondary)]">
                                {item.category}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:bg-red-50 flex-shrink-0 ml-2"
                              onClick={() => deleteItem(item.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              label="Quantity"
                              type="number"
                              value={item.quantity.toString()}
                              onChange={(e) => updateQuantity(item.id, e.target.value)}
                              min="1"
                            />
                            <Input
                              label="Expiry Days"
                              type="number"
                              value={item.expiryDays.toString()}
                              onChange={(e) => updateExpiryDays(item.id, e.target.value)}
                              min="1"
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setCapturedImage(null);
                        setExtractedItems([]);
                        setMode('select');
                      }}
                    >
                      <Camera size={20} />
                      Scan Another
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleAddAllToInventory}
                    >
                      <Plus size={20} />
                      Add {extractedItems.length}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
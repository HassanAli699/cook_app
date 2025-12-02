import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Zap, Camera, CheckCircle, Plus, AlertCircle, Keyboard } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Toast } from '../../components/Toast';
import { BrowserMultiFormatReader } from '@zxing/library';

interface BarcodeScannerScreenProps {
  onNavigate: (screen: string) => void;
}

interface ScannedProduct {
  name: string;
  brand: string;
  category: string;
  barcode: string;
}

export function BarcodeScannerScreen({ onNavigate }: BarcodeScannerScreenProps) {
  const [mode, setMode] = useState<'select' | 'camera' | 'manual'>('select');
  const [scannedItem, setScannedItem] = useState<ScannedProduct | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [expiryDays, setExpiryDays] = useState('7');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Product database (simulated - in real app would be API call)
  const productDatabase: { [key: string]: ScannedProduct } = {
    '012345678905': { name: 'Organic Whole Milk', brand: 'Happy Farm', category: 'Dairy', barcode: '012345678905' },
    '087654321098': { name: 'Fresh Strawberries', brand: 'Berry Best', category: 'Produce', barcode: '087654321098' },
    '456789012345': { name: 'Chicken Breast', brand: 'Farm Fresh', category: 'Meat', barcode: '456789012345' },
    '789012345678': { name: 'Whole Wheat Bread', brand: 'Baker\'s Choice', category: 'Pantry', barcode: '789012345678' },
    '321098765432': { name: 'Greek Yogurt', brand: 'Dairy Delight', category: 'Dairy', barcode: '321098765432' },
    '555666777888': { name: 'Extra Virgin Olive Oil', brand: 'Mediterranean Gold', category: 'Pantry', barcode: '555666777888' },
    '111222333444': { name: 'Fresh Spinach', brand: 'Green Valley', category: 'Produce', barcode: '111222333444' },
    '999888777666': { name: 'Cheddar Cheese', brand: 'Cheese Masters', category: 'Dairy', barcode: '999888777666' },
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError('');
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Initialize barcode reader
        codeReaderRef.current = new BrowserMultiFormatReader();
        
        // Start scanning
        scanBarcode();
      }
    } catch (error: any) {
      // Handle camera errors silently
      let errorMsg = '';
      
      if (error.name === 'NotAllowedError') {
        errorMsg = 'Camera permission denied. Please use manual entry instead.';
      } else if (error.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device. Please use manual entry.';
      } else if (error.name === 'NotReadableError') {
        errorMsg = 'Camera is already in use by another application.';
      } else {
        errorMsg = 'Unable to access camera. Please use manual entry.';
      }
      
      setCameraError(errorMsg);
      setToastMessage(errorMsg);
      setShowToast(true);
      
      // Switch to manual mode
      setMode('manual');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
    
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
  };

  const scanBarcode = async () => {
    if (!codeReaderRef.current || !videoRef.current) return;

    try {
      setIsProcessing(true);
      
      // Continuous scanning
      const result = await codeReaderRef.current.decodeFromVideoElement(videoRef.current);
      
      if (result) {
        const barcodeValue = result.getText();
        handleBarcodeDetected(barcodeValue);
      }
    } catch (error) {
      // Continue scanning if no barcode found
      if (!scannedItem && mode === 'camera') {
        setTimeout(scanBarcode, 100);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBarcodeDetected = (barcode: string) => {
    // Look up product in database
    const product = productDatabase[barcode];
    
    if (product) {
      setScannedItem(product);
      setQuantity('1');
      setExpiryDays('7');
      stopCamera();
      setToastMessage('Barcode detected!');
      setShowToast(true);
    } else {
      // Unknown barcode - create generic entry
      const category = detectCategory(barcode);
      setScannedItem({
        name: 'Unknown Product',
        brand: 'Generic',
        category: category,
        barcode: barcode
      });
      setQuantity('1');
      setExpiryDays('7');
      stopCamera();
      setToastMessage('Barcode detected - Please update product name');
      setShowToast(true);
    }
  };

  const detectCategory = (barcode: string): string => {
    // Simple category detection based on barcode prefix (simplified)
    const prefix = barcode.substring(0, 2);
    if (['01', '02', '03'].includes(prefix)) return 'Dairy';
    if (['04', '05'].includes(prefix)) return 'Produce';
    if (['45', '46'].includes(prefix)) return 'Meat';
    return 'Pantry';
  };

  const handleManualBarcodeSubmit = () => {
    if (manualBarcode.length >= 8) {
      handleBarcodeDetected(manualBarcode);
      setManualBarcode('');
    } else {
      setToastMessage('Please enter a valid barcode (at least 8 digits)');
      setShowToast(true);
    }
  };

  const handleAddToInventory = () => {
    if (scannedItem && parseInt(quantity) > 0 && parseInt(expiryDays) > 0) {
      // Get existing inventory from localStorage
      const existingInventory = localStorage.getItem('inventoryItems');
      const inventory = existingInventory ? JSON.parse(existingInventory) : [];
      
      // Calculate new ID
      const newId = inventory.reduce((maxId: number, item: any) => Math.max(maxId, item.id), 0) + 1;
      
      // Add new item
      const newItem = {
        id: newId,
        name: scannedItem.name,
        category: scannedItem.category,
        quantity: parseInt(quantity),
        expiryDays: parseInt(expiryDays)
      };
      
      inventory.push(newItem);
      localStorage.setItem('inventoryItems', JSON.stringify(inventory));
      
      setToastMessage('Item added to inventory');
      setShowToast(true);
      
      // Navigate back to inventory after short delay
      setTimeout(() => {
        onNavigate('inventory');
      }, 1000);
    } else {
      setToastMessage('Please enter valid quantity and expiry days');
      setShowToast(true);
    }
  };

  const handleCameraMode = () => {
    setMode('camera');
    startCamera();
  };

  const handleManualMode = () => {
    setMode('manual');
    stopCamera();
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
          <h3 className="text-white">Barcode Scanner</h3>
          <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center">
        {mode === 'select' && !scannedItem ? (
          /* Mode Selection */
          <div className="relative z-10 px-6 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-4">
                <Camera size={40} className="text-[var(--color-primary)]" />
              </div>
              <h2 className="text-white mb-2">Scan Barcode</h2>
              <p className="text-white/70">
                Choose how you'd like to add the item
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
                Use Camera Scanner
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleManualMode}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Keyboard size={20} />
                Enter Barcode Manually
              </Button>
            </div>

            <p className="text-white/50 text-sm text-center mt-6">
              Camera scanner requires camera permission
            </p>
          </div>
        ) : mode === 'camera' && !scannedItem ? (
          /* Camera Scanning Mode */
          <>
            {/* Real Camera Feed */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            
            {/* Scanning Overlay */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Scanning Frame */}
            <div className="relative z-10">
              <div className="w-64 h-64 border-4 border-white/30 rounded-2xl relative">
                {/* Corner Markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[var(--color-primary)] rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[var(--color-primary)] rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[var(--color-primary)] rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[var(--color-primary)] rounded-br-2xl" />
                
                {/* Scanning Line */}
                <div className="absolute inset-x-0 top-1/2 h-1 bg-[var(--color-primary)] opacity-75 animate-pulse" />
              </div>
              
              <p className="text-white text-center mt-6">
                {isProcessing ? 'Scanning...' : 'Align barcode within the frame'}
              </p>
            </div>

            {/* Camera Error Message */}
            {cameraError && (
              <div className="absolute bottom-40 left-0 right-0 px-6">
                <Card className="p-4 bg-yellow-50 border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-yellow-800">{cameraError}</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Switch to Manual */}
            <div className="absolute bottom-20 left-0 right-0 px-6">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleManualMode}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Keyboard size={20} />
                Switch to Manual Entry
              </Button>
            </div>
          </>
        ) : mode === 'manual' && !scannedItem ? (
          /* Manual Entry Mode */
          <div className="relative z-10 px-6 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-4">
                <Keyboard size={40} className="text-[var(--color-primary)]" />
              </div>
              <h2 className="text-white mb-2">Manual Entry</h2>
              <p className="text-white/70">
                Enter the barcode number from the product
              </p>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Enter barcode (e.g., 012345678905)"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                className="bg-white text-[var(--color-text-primary)]"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleManualBarcodeSubmit();
                  }
                }}
              />

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleManualBarcodeSubmit}
              >
                <Plus size={20} />
                Scan Barcode
              </Button>

              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleCameraMode}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Camera size={20} />
                Switch to Camera
              </Button>
            </div>

            {/* Example Barcodes */}
            <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-white/70 text-sm mb-2">Example barcodes to try:</p>
              <div className="space-y-1">
                {Object.keys(productDatabase).slice(0, 4).map(barcode => (
                  <button
                    key={barcode}
                    onClick={() => {
                      setManualBarcode(barcode);
                      handleBarcodeDetected(barcode);
                    }}
                    className="block w-full text-left text-white/90 text-sm py-2 px-3 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {barcode} - {productDatabase[barcode].name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : scannedItem ? (
          /* Scanned Item Result */
          <div className="absolute inset-0 bg-[var(--color-cream)] overflow-auto">
            <div className="px-4 pt-20 pb-8">
              {/* Success Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={24} className="text-[var(--color-success)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="mb-1">Barcode Detected!</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] truncate">
                    {scannedItem?.barcode}
                  </p>
                </div>
              </div>

              {/* Product Details Card */}
              <Card className="p-5 mb-4">
                <h4 className="mb-4">Product Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm text-[var(--color-text-secondary)]">
                      Product Name
                    </label>
                    <Input
                      value={scannedItem?.name || ''}
                      onChange={(e) => setScannedItem(prev => prev ? {...prev, name: e.target.value} : null)}
                      placeholder="Enter product name"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm text-[var(--color-text-secondary)]">
                      Brand
                    </label>
                    <div className="px-4 py-3 bg-[var(--color-surface)] border-2 border-[var(--color-border)] rounded-xl">
                      <p className="text-[var(--color-text-primary)]">{scannedItem?.brand}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm text-[var(--color-text-secondary)]">
                      Category
                    </label>
                    <select
                      value={scannedItem?.category || 'Pantry'}
                      onChange={(e) => setScannedItem(prev => prev ? {...prev, category: e.target.value} : null)}
                      className="w-full px-4 py-3 bg-[var(--color-surface)] border-2 border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    >
                      <option value="Produce">Produce</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Meat">Meat</option>
                      <option value="Pantry">Pantry</option>
                      <option value="Spices">Spices</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Inventory Details Card */}
              <Card className="p-5 mb-6">
                <h4 className="mb-4">Inventory Details</h4>
                <div className="space-y-4">
                  <Input
                    label="Quantity"
                    type="number"
                    placeholder="e.g., 2"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  />
                  <Input
                    label="Days Until Expiry"
                    type="number"
                    placeholder="e.g., 7"
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(e.target.value)}
                    min="1"
                  />
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setScannedItem(null);
                    setMode('select');
                  }}
                >
                  Scan Another
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToInventory}
                >
                  <Plus size={20} />
                  Add Item
                </Button>
              </div>
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
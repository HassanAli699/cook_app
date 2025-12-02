import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Plus, X, Image as ImageIcon, AlertCircle, Crown, Lock } from 'lucide-react';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { PremiumLock } from '../../components/PremiumLock';

interface PostRecipeScreenProps {
  onNavigate: (screen: string) => void;
  onPostRecipe: (posts: any[]) => void;
  userPosts: any[];
  onSetShowMyPosts: (show: boolean) => void;
  isPremium: boolean;
}

interface PhotoFile {
  url: string;
  file: File;
}

export function PostRecipeScreen({ onNavigate, onPostRecipe, userPosts, onSetShowMyPosts, isPremium }: PostRecipeScreenProps) {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [showPhotoSourceModal, setShowPhotoSourceModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cookTime, setCookTime] = useState('30');
  
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-hide error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const availableTags = ['Italian', 'Thai', 'Mexican', 'Vegan', 'Vegetarian', 'Healthy', 'Quick', 'Budget', 'Dessert'];

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: PhotoFile[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newPhotos.push({ url, file });
    });

    setPhotos([...photos, ...newPhotos]);
    setShowPhotoSourceModal(false);
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    URL.revokeObjectURL(newPhotos[index].url);
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const openGallery = () => {
    galleryInputRef.current?.click();
  };

  const openCamera = async () => {
    // Check if running on secure context (HTTPS or localhost)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // Browser doesn't support camera API, use file input
      setErrorMessage('Camera not available. Using file picker instead.');
      cameraInputRef.current?.click();
      setShowPhotoSourceModal(false);
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      setStream(mediaStream);
      setShowCameraModal(true);
      setShowPhotoSourceModal(false);
      
      // Wait for video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (error: any) {
      // Handle different error types
      if (error.name === 'NotAllowedError') {
        // User denied camera permission - just use file picker
        setShowPhotoSourceModal(false);
        cameraInputRef.current?.click();
      } else if (error.name === 'NotFoundError') {
        setErrorMessage('No camera found. Using file picker instead.');
        setShowPhotoSourceModal(false);
        cameraInputRef.current?.click();
      } else {
        // Other errors - fallback to file input
        setShowPhotoSourceModal(false);
        cameraInputRef.current?.click();
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            const url = URL.createObjectURL(file);
            setPhotos([...photos, { url, file }]);
            closeCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCameraModal(false);
  };

  const handlePublish = () => {
    // Validate required fields
    if (!title.trim()) {
      setErrorMessage('Please enter a recipe title');
      return;
    }
    
    const validIngredients = ingredients.filter(i => i.trim() !== '');
    if (validIngredients.length === 0) {
      setErrorMessage('Please add at least one ingredient');
      return;
    }
    
    const validSteps = steps.filter(s => s.trim() !== '');
    if (validSteps.length === 0) {
      setErrorMessage('Please add at least one cooking step');
      return;
    }
    
    // Create new post object
    const newPost = {
      id: `user-post-${Date.now()}`,
      user: { name: 'You', avatar: '👤', isPremium: true },
      recipe: title,
      image: photos.length > 0 ? photos[0].url : 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kfGVufDF8fHx8MTc2NDE0NTM3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 0,
      comments: 0,
      tags: selectedTags,
      timeAgo: 'Just now',
      time: `${cookTime} min`,
      rating: '0.0',
      ingredients: validIngredients,
      steps: validSteps
    };
    
    // Add new post to the beginning of user posts array
    onPostRecipe([newPost, ...userPosts]);
    
    // Show success modal
    setShowSuccessModal(true);
    
    // Set flag to show My Posts tab when returning to community
    onSetShowMyPosts(true);
    
    // Auto-redirect after 2.5 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      onNavigate('community');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] relative">
      <Header onBack={() => onNavigate('community')} title="Post Recipe" />
      
      {/* Premium Lock Overlay */}
      {!isPremium && (
        <PremiumLock 
          feature="Recipe posting" 
          onUpgrade={() => onNavigate('subscription')} 
        />
      )}

      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Photo Upload */}
        <Card className="p-6">
          <h4 className="mb-3">Recipe Photos</h4>
          
          {/* Hidden file inputs */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoSelect}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture
            onChange={handlePhotoSelect}
            className="hidden"
          />

          {/* Selected Photos Grid */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img
                    src={photo.url}
                    alt={`Recipe photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-[var(--color-error)] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Photo Button */}
          <button 
            onClick={() => setShowPhotoSourceModal(true)}
            className="w-full aspect-video bg-[var(--color-cream)] rounded-xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-3 hover:border-[var(--color-primary)] transition-colors"
          >
            <Camera size={32} className="text-[var(--color-text-secondary)]" />
            <span className="text-sm text-[var(--color-text-secondary)]">
              {photos.length > 0 ? 'Add more photos' : 'Add photos'}
            </span>
          </button>
        </Card>

        {/* Recipe Title */}
        <Card className="p-6">
          <h4 className="mb-3">Recipe Title</h4>
          <Input
            placeholder="e.g., Creamy Mushroom Risotto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <h4 className="mb-3 mt-4">Cook Time (minutes)</h4>
          <Input
            type="number"
            placeholder="30"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
          />
        </Card>

        {/* Ingredients */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h4>Ingredients</h4>
            <Button variant="ghost" size="sm" onClick={addIngredient}>
              <Plus size={16} />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Ingredient ${index + 1}`}
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                />
                {ingredients.length > 1 && (
                  <button
                    onClick={() => removeIngredient(index)}
                    className="px-3 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Steps */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h4>Instructions</h4>
            <Button variant="ghost" size="sm" onClick={addStep}>
              <Plus size={16} />
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center flex-shrink-0 text-sm mt-2">
                  {index + 1}
                </div>
                <div className="flex-1 flex gap-2">
                  <textarea
                    placeholder={`Step ${index + 1} instructions...`}
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-[var(--color-surface)] border-2 border-[var(--color-border)] rounded-xl resize-none focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    rows={3}
                  />
                  {steps.length > 1 && (
                    <button
                      onClick={() => removeStep(index)}
                      className="px-3 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Tags */}
        <Card className="p-6">
          <h4 className="mb-3">Category Tags</h4>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-cream)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] p-4 z-50">
        <div className="max-w-[428px] mx-auto">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handlePublish}
          >
            Publish Recipe
          </Button>
        </div>
      </div>

      {/* Photo Source Modal */}
      {showPhotoSourceModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] flex items-end animate-fade-in"
          onClick={() => setShowPhotoSourceModal(false)}
        >
          <div 
            className="bg-[var(--color-surface)] w-full rounded-t-3xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-[var(--color-border)] rounded-full mx-auto mb-6" />
            
            <h3 className="mb-6">Add Photos</h3>
            
            <div className="space-y-3">
              <button
                onClick={openCamera}
                className="w-full flex items-center gap-4 p-4 bg-[var(--color-cream)] rounded-xl hover:bg-[var(--color-border)] transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center">
                  <Camera size={24} className="text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium">Take Photo</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Use your camera
                  </p>
                </div>
              </button>

              <button
                onClick={openGallery}
                className="w-full flex items-center gap-4 p-4 bg-[var(--color-cream)] rounded-xl hover:bg-[var(--color-border)] transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-sage-green)] to-[var(--color-sage-green)] flex items-center justify-center">
                  <ImageIcon size={24} className="text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium">Choose from Gallery</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Select from your photos
                  </p>
                </div>
              </button>
            </div>

            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onClick={() => setShowPhotoSourceModal(false)}
              className="mt-4"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black z-[110] flex flex-col">
          {/* Camera Preview */}
          <div className="flex-1 relative overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Camera Overlay */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
              <button
                onClick={closeCamera}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Camera Controls */}
          <div className="bg-black/90 backdrop-blur-sm p-6 pb-8">
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={closeCamera}
                className="px-6 py-3 text-white/70 hover:text-white transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-lg hover:scale-105 transition-transform"
              >
                <div className="w-full h-full rounded-full bg-white" />
              </button>
              
              <div className="w-20" /> {/* Spacer for symmetry */}
            </div>
          </div>
        </div>
      )}

      {/* Error Toast Notification */}
      {errorMessage && (
        <div className="fixed top-20 left-4 right-4 z-[120] animate-slide-down">
          <div className="max-w-[428px] mx-auto bg-[var(--color-surface)] border-2 border-[var(--color-warning)] rounded-xl p-4 shadow-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
            <p className="text-sm flex-1">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center px-4 animate-fade-in">
          <div className="bg-[var(--color-surface)] rounded-3xl p-8 max-w-sm w-full text-center animate-scale-in shadow-2xl">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-success)] to-[var(--color-sage-green)] mx-auto mb-6 flex items-center justify-center animate-bounce-in">
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={3}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            
            <h2 className="mb-2">Recipe Published!</h2>
            <p className="text-[var(--color-text-secondary)] mb-1">
              Your delicious recipe has been shared with the community
            </p>
            
            {/* Loading indicator */}
            <div className="mt-6 flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce-delay-0" />
              <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce-delay-1" />
              <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce-delay-2" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

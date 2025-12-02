import React from 'react';
import { X, Instagram, MessageCircle } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  shareUrl?: string;
  shareText?: string;
}

export function ShareModal({ isOpen, onClose, title = 'Share', shareUrl = '', shareText = '' }: ShareModalProps) {
  if (!isOpen) return null;

  const handleInstagramShare = () => {
    const textToShare = `${shareText}\n${shareUrl}`;
    
    // Check if we're on mobile (more likely to support Instagram sharing)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Try Web Share API only on mobile devices with proper support
    if (isMobile && navigator.share && navigator.canShare) {
      const shareData = {
        text: textToShare
      };
      
      // Check if this data can be shared
      if (navigator.canShare(shareData)) {
        navigator.share(shareData)
          .then(() => {
            onClose();
          })
          .catch((error) => {
            // User cancelled or share failed
            if (error.name !== 'AbortError') {
              // Fall back to clipboard
              copyTextFallback(textToShare);
            } else {
              onClose();
            }
          });
        return;
      }
    }
    
    // Fallback: Copy to clipboard for Instagram
    copyTextFallback(textToShare);
  };

  const copyTextFallback = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      alert('Content copied! Open Instagram and paste it in your story or post.');
      onClose();
    } catch (err) {
      // If all copy methods fail, show the text
      alert(`Share this content:\n\n${text}`);
      onClose();
    }
    
    document.body.removeChild(textarea);
  };

  const handleWhatsAppShare = () => {
    const textToShare = `${shareText}\n${shareUrl}`;
    
    // Check if we're on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Try Web Share API only on mobile devices
    if (isMobile && navigator.share && navigator.canShare) {
      const shareData = {
        text: textToShare
      };
      
      if (navigator.canShare(shareData)) {
        navigator.share(shareData)
          .then(() => {
            onClose();
          })
          .catch((error) => {
            // User cancelled or share failed
            if (error.name !== 'AbortError') {
              // Fall back to direct WhatsApp link
              openWhatsAppDirect(textToShare);
            } else {
              onClose();
            }
          });
        return;
      }
    }
    
    // Direct WhatsApp link (works on desktop and as fallback)
    openWhatsAppDirect(textToShare);
  };

  const openWhatsAppDirect = (text: string) => {
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in">
      <div className="w-full max-w-md bg-[var(--color-surface)] rounded-t-3xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h3 className="text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[var(--color-cream)] transition-colors flex items-center justify-center"
          >
            <X size={20} className="text-[var(--color-text-primary)]" />
          </button>
        </div>

        {/* Share Options */}
        <div className="p-4 space-y-3">
          {/* Instagram */}
          <Card
            onClick={handleInstagramShare}
            className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Instagram size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-1">Instagram</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Share to Instagram Story or Feed
              </p>
            </div>
          </Card>

          {/* WhatsApp */}
          <Card
            onClick={handleWhatsAppShare}
            className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
              <MessageCircle size={24} className="text-white" fill="white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-1">WhatsApp</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Share directly via WhatsApp
              </p>
            </div>
          </Card>
        </div>

        {/* Cancel Button */}
        <div className="p-4 pt-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Plus, Camera, FileText, AlertCircle, CheckCircle, Clock, Lock, Crown, X, Trash2 } from 'lucide-react';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PremiumBadge } from '../../components/PremiumLock';
import { Toast } from '../../components/Toast';

interface InventoryTrackerScreenProps {
  onNavigate: (screen: string) => void;
  isPremium: boolean;
}

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  expiryDays: number;
  isPremium?: boolean;
}

export function InventoryTrackerScreen({ onNavigate, isPremium }: InventoryTrackerScreenProps) {
  // Initialize items from localStorage or use defaults
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('inventoryItems');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 1, name: 'Fresh Milk', category: 'Dairy', quantity: 1, expiryDays: 2 },
      { id: 2, name: 'Chicken Breast', category: 'Meat', quantity: 4, expiryDays: 1 },
      { id: 3, name: 'Tomatoes', category: 'Produce', quantity: 6, expiryDays: 5 },
      { id: 4, name: 'Olive Oil', category: 'Pantry', quantity: 1, expiryDays: 180 },
      { id: 5, name: 'Cheddar Cheese', category: 'Dairy', quantity: 1, expiryDays: 10 },
      { id: 6, name: 'Rice', category: 'Pantry', quantity: 2, expiryDays: 365 }
    ];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Produce');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemExpiryDays, setNewItemExpiryDays] = useState('7');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const categories = ['Produce', 'Dairy', 'Meat', 'Pantry', 'Spices', 'Other'];

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
  }, [items]);

  const getExpiryStatus = (days: number) => {
    if (days <= 1) return { label: 'Urgent', color: 'text-[var(--color-error)] bg-[var(--color-error)]/10', icon: AlertCircle };
    if (days <= 5) return { label: 'Soon', color: 'text-[var(--color-warning)] bg-[var(--color-warning)]/10', icon: Clock };
    return { label: 'Fresh', color: 'text-[var(--color-success)] bg-[var(--color-success)]/10', icon: CheckCircle };
  };

  const urgentItems = items.filter(item => item.expiryDays <= 5);

  const addItem = () => {
    if (newItemName && newItemCategory && parseInt(newItemQuantity) > 0 && parseInt(newItemExpiryDays) > 0) {
      const currentId = items.reduce((maxId, item) => Math.max(maxId, item.id), 0);
      setItems([...items, {
        id: currentId + 1,
        name: newItemName,
        category: newItemCategory,
        quantity: parseInt(newItemQuantity),
        expiryDays: parseInt(newItemExpiryDays)
      }]);
      setNewItemName('');
      setNewItemCategory('Produce');
      setNewItemQuantity('1');
      setNewItemExpiryDays('7');
      setShowAddModal(false);
      setToastMessage('Item added successfully');
      setShowToast(true);
    } else {
      setToastMessage('Please fill in all fields');
      setShowToast(true);
    }
  };

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    setToastMessage('Item deleted successfully');
    setShowToast(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pb-20">
      <Header 
        title="Inventory" 
        onBack={() => onNavigate('home')}
      />

      <div className="px-4 py-4 space-y-4">
        {/* Premium Features Banner */}
        {!isPremium && (
          <Card className="bg-gradient-to-br from-[var(--color-premium-gold)] to-[var(--color-premium-gold-dark)] p-4 text-white border-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Lock size={20} />
                  <h4 className="text-white">Smart Inventory Pro</h4>
                </div>
                <p className="text-white/90 text-sm mb-3">
                  AI predictions, barcode & receipt scanning
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-[var(--color-surface)] text-[var(--color-premium-gold)] border-[var(--color-surface)] hover:bg-[var(--color-cream)]"
                  onClick={() => onNavigate('subscription')}
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            Add Item
          </Button>
          <Button
            variant={isPremium ? 'secondary' : 'outline'}
            size="sm"
            fullWidth
            onClick={() => isPremium && onNavigate('barcode-scanner')}
            disabled={!isPremium}
          >
            <Camera size={16} />
            {!isPremium && <Crown size={12} className="text-[var(--color-premium-gold)]" />}
            Scan
          </Button>
          <Button
            variant={isPremium ? 'secondary' : 'outline'}
            size="sm"
            fullWidth
            onClick={() => isPremium && onNavigate('receipt-scanner')}
            disabled={!isPremium}
          >
            <FileText size={16} />
            {!isPremium && <Crown size={12} className="text-[var(--color-premium-gold)]" />}
            Receipt
          </Button>
        </div>

        {/* Expiry Alerts */}
        {urgentItems.length > 0 && (
          <Card className="p-4 border-2 border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-orange-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="mb-1 text-orange-900">Expiring Soon</h4>
                <p className="text-sm text-orange-700">
                  {urgentItems.length} item{urgentItems.length > 1 ? 's' : ''} expiring in the next 5 days
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <p className="text-2xl mb-1">{items.length}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">Total Items</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl mb-1 text-orange-600">{urgentItems.length}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">Expiring Soon</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl mb-1 text-green-600">
              {items.filter(i => i.expiryDays > 5).length}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">Fresh</p>
          </Card>
        </div>

        {/* Inventory List */}
        <div>
          <h3 className="mb-3">All Items</h3>
          <div className="space-y-2">
            {items.map(item => {
              const status = getExpiryStatus(item.expiryDays);
              const StatusIcon = status.icon;
              
              return (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${status.color} flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm truncate">{item.name}</h4>
                        {item.isPremium && <PremiumBadge />}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${status.color.split(' ')[0]}`}>
                        {item.expiryDays}d
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {status.label}
                      </p>
                    </div>
                    <div className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Add New Item Form */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 animate-fade-in" onClick={() => setShowAddModal(false)}>
            <Card className="p-4 bg-[var(--color-surface)] max-w-md w-full animate-slide-up" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h4>Add New Item</h4>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-[var(--color-cream)] rounded-lg transition-colors"
                >
                  <X size={20} className="text-[var(--color-text-primary)]" />
                </button>
              </div>
              <div className="space-y-3">
                <Input
                  label="Item Name"
                  placeholder="e.g., Fresh Milk"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <div>
                  <label className="block mb-2 text-sm text-[var(--color-text-secondary)]">
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--color-surface)] border-2 border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Quantity"
                  type="number"
                  placeholder="e.g., 2"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                  min="1"
                />
                <Input
                  label="Days Until Expiry"
                  type="number"
                  placeholder="e.g., 7"
                  value={newItemExpiryDays}
                  onChange={(e) => setNewItemExpiryDays(e.target.value)}
                  min="1"
                />
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={addItem}
                  >
                    <Plus size={16} />
                    Add Item
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Premium Features Preview */}
        {!isPremium && (
          <Card className="p-4 bg-[var(--color-cream-dark)]">
            <h4 className="mb-3">Premium Features</h4>
            <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-[var(--color-premium-gold)]" />
                <span>AI expiry prediction</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-[var(--color-premium-gold)]" />
                <span>Barcode scanning</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-[var(--color-premium-gold)]" />
                <span>Receipt OCR scanning</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-[var(--color-premium-gold)]" />
                <span>Early expiry reminders</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />

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
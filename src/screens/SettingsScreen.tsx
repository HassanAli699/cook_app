import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Bell, Palette, Info, FileText, Shield, 
  LogOut, ChevronRight, Camera, Chrome, Edit, Crown,
  Apple, X, Plus, Heart
} from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Toast } from '../components/Toast';

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
  isPremium?: boolean;
}

export function SettingsScreen({ onNavigate, isPremium = false }: SettingsScreenProps) {
  const { favorites } = useFavorites();
  const { theme } = useTheme();
  const { masterEnabled, getEnabledCount } = useNotifications();
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showDietaryPreferences, setShowDietaryPreferences] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Dietary Preferences State
  const [selectedDiets, setSelectedDiets] = useState<string[]>(['Vegetarian']);
  const [allergies, setAllergies] = useState<string[]>(['Peanuts', 'Shellfish']);
  const [newAllergy, setNewAllergy] = useState('');
  
  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'keto', label: 'Keto', icon: '🥑' },
    { id: 'paleo', label: 'Paleo', icon: '🍖' },
    { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
    { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
    { id: 'low-carb', label: 'Low-Carb', icon: '🥒' },
    { id: 'halal', label: 'Halal', icon: '☪️' },
    { id: 'kosher', label: 'Kosher', icon: '✡️' },
    { id: 'pescatarian', label: 'Pescatarian', icon: '🐟' }
  ];

  const toggleDiet = (dietId: string) => {
    setSelectedDiets(prev => 
      prev.includes(dietId) 
        ? prev.filter(d => d !== dietId)
        : [...prev, dietId]
    );
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies(allergies.filter(a => a !== allergy));
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        setShowPhotoMenu(false);
        setToastMessage('Profile photo updated successfully!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = handlePhotoSelect;
    input.click();
  };

  const handleChooseFromGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handlePhotoSelect;
    input.click();
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setShowPhotoMenu(false);
    setToastMessage('Profile photo removed');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveProfile = () => {
    // TODO: Save profile updates to backend
    // Example:
    // try {
    //   const authToken = localStorage.getItem('authToken');
    //   await api.put('/user/profile', 
    //     { 
    //       name, 
    //       phone,
    //       profilePhoto 
    //     },
    //     {
    //       headers: { 'Authorization': `Bearer ${authToken}` }
    //     }
    //   );
    //   
    //   setToastMessage('Profile updated successfully!');
    //   setShowToast(true);
    //   setTimeout(() => setShowToast(false), 3000);
    //   setShowEditProfile(false);
    // } catch (error) {
    //   console.error('Failed to update profile:', error);
    //   setToastMessage('Failed to update profile');
    //   setShowToast(true);
    //   setTimeout(() => setShowToast(false), 3000);
    // }

    // TEMPORARY: Frontend-only implementation (remove when backend is ready)
    setToastMessage('Profile updated successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setShowEditProfile(false);
  };

  const handleSaveDietaryPreferences = () => {
    // TODO: Save dietary preferences to backend
    // Example:
    // try {
    //   const authToken = localStorage.getItem('authToken');
    //   await api.put('/user/dietary-preferences', 
    //     { 
    //       dietaryPreferences: selectedDiets,
    //       allergies 
    //     },
    //     {
    //       headers: { 'Authorization': `Bearer ${authToken}` }
    //     }
    //   );
    //   
    //   setToastMessage('Dietary preferences saved!');
    //   setShowToast(true);
    //   setTimeout(() => setShowToast(false), 3000);
    //   setShowDietaryPreferences(false);
    // } catch (error) {
    //   console.error('Failed to save dietary preferences:', error);
    //   setToastMessage('Failed to save preferences');
    //   setShowToast(true);
    //   setTimeout(() => setShowToast(false), 3000);
    // }

    // TEMPORARY: Frontend-only implementation (remove when backend is ready)
    setToastMessage('Dietary preferences saved!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setShowDietaryPreferences(false);
  };

  const settingsSections = [
    {
      title: 'Profile',
      items: [
        { icon: User, label: 'Edit Profile', onClick: () => setShowEditProfile(true) },
        { icon: Heart, label: 'My Favorites', onClick: () => onNavigate('favorites'), badge: `${favorites.length}` },
        { icon: Lock, label: 'Change Password', onClick: () => onNavigate('change-password') },
        { icon: Chrome, label: 'Linked Accounts', onClick: () => onNavigate('linked-accounts'), badge: 'Google' }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Apple, label: 'Dietary Preferences', onClick: () => setShowDietaryPreferences(true), badge: `${selectedDiets.length} active` },
        { icon: Bell, label: 'Notifications', onClick: () => onNavigate('notifications'), badge: masterEnabled ? `${getEnabledCount()} active` : 'Off' },
        { icon: Palette, label: 'App Theme', onClick: () => onNavigate('app-theme'), badge: theme.charAt(0).toUpperCase() + theme.slice(1) }
      ]
    },
    {
      title: 'About',
      items: [
        { icon: FileText, label: 'Terms of Service', onClick: () => onNavigate('terms-of-service') },
        { icon: Shield, label: 'Privacy Policy', onClick: () => onNavigate('privacy-policy') },
        { icon: Info, label: 'About Smart Chef', onClick: () => onNavigate('about'), badge: 'v1.0.0' }
      ]
    }
  ];

  // Load profile photo from localStorage on mount
  useEffect(() => {
    // TODO: Fetch user profile data from backend
    // Example:
    // const fetchUserProfile = async () => {
    //   try {
    //     const authToken = localStorage.getItem('authToken');
    //     const result = await api.get('/user/profile', {
    //       headers: { 'Authorization': `Bearer ${authToken}` }
    //     });
    //     
    //     const { name, email, phone, profilePhoto, dietaryPreferences, allergies } = result.data;
    //     
    //     setName(name || 'John Doe');
    //     setEmail(email || '');
    //     setPhone(phone || '');
    //     setProfilePhoto(profilePhoto || null);
    //     setSelectedDiets(dietaryPreferences || []);
    //     setAllergies(allergies || []);
    //   } catch (error) {
    //     console.error('Failed to fetch profile:', error);
    //   }
    // };
    // fetchUserProfile();

    // TEMPORARY: Load from localStorage (remove when backend is ready)
    const savedPhoto = localStorage.getItem('userProfilePhoto');
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }

    // Check if user logged in with Google
    const googleUser = localStorage.getItem('googleUser');
    if (googleUser) {
      const userData = JSON.parse(googleUser);
      setName(userData.name);
      setEmail(userData.email);
      
      // If no custom profile photo, use Google photo
      if (!savedPhoto && userData.picture) {
        setProfilePhoto(userData.picture);
      }
    }
  }, []);

  // Save profile photo to localStorage whenever it changes
  useEffect(() => {
    if (profilePhoto) {
      localStorage.setItem('userProfilePhoto', profilePhoto);
    } else {
      localStorage.removeItem('userProfilePhoto');
    }
  }, [profilePhoto]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Header title="Settings" onBack={() => onNavigate('home')} />

      <div className="px-4 py-6 space-y-6">
        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center text-3xl">
                  👨‍🍳
                </div>
              )}
              <button
                onClick={() => setShowPhotoMenu(true)}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--color-surface)] border-2 border-[var(--color-border)] flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
              >
                <Camera size={16} className="text-[var(--color-text-primary)]" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3>{name}</h3>
                {isPremium && (
                  <Crown size={18} className="text-[var(--color-premium-gold)]" />
                )}
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">{email}</p>
              {!isPremium && (
                <button
                  onClick={() => onNavigate('subscription')}
                  className="inline-flex items-center gap-1 text-sm text-[var(--color-premium-gold)] hover:underline"
                >
                  <Crown size={14} />
                  Upgrade to Premium
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h4 className="mb-3 text-[var(--color-text-secondary)]">{section.title}</h4>
            <Card className="divide-y divide-[var(--color-border)]">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-cream)] transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-cream)] flex items-center justify-center">
                        <Icon size={20} className="text-[var(--color-text-primary)]" />
                      </div>
                      <span className="text-[var(--color-text-primary)]">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight size={20} className="text-[var(--color-text-secondary)]" />
                    </div>
                  </button>
                );
              })}
            </Card>
          </div>
        ))}

        {/* Logout Button */}
        <Button
          variant="destructive"
          size="lg"
          fullWidth
          onClick={() => onNavigate('login')}
        >
          <LogOut size={20} />
          Logout
        </Button>
      </div>

      {/* Photo Menu Modal */}
      {showPhotoMenu && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-fade-in"
          onClick={() => setShowPhotoMenu(false)}
        >
          <div 
            className="w-full max-w-[428px] mx-auto bg-[var(--color-surface)] rounded-t-3xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-[var(--color-border)] rounded-full mx-auto mb-6" />
            <div className="space-y-2">
              <button 
                onClick={handleTakePhoto}
                className="w-full p-4 text-left rounded-xl hover:bg-[var(--color-cream)] transition-colors active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <Camera size={20} className="text-[var(--color-text-primary)]" />
                  <span>Take Photo</span>
                </div>
              </button>
              <button 
                onClick={handleChooseFromGallery}
                className="w-full p-4 text-left rounded-xl hover:bg-[var(--color-cream)] transition-colors active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <Edit size={20} className="text-[var(--color-text-primary)]" />
                  <span>Choose from Gallery</span>
                </div>
              </button>
              <button 
                onClick={handleRemovePhoto}
                className="w-full p-4 text-left rounded-xl hover:bg-[var(--color-cream)] transition-colors text-[var(--color-error)] active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={20} />
                  <span>Remove Photo</span>
                </div>
              </button>
            </div>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => setShowPhotoMenu(false)}
              className="mt-4"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setShowEditProfile(false)}
        >
          <Card 
            className="w-full max-w-md p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-6">Edit Profile</h3>
            <div className="space-y-4 mb-6">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User size={20} />}
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
              <Input
                label="Phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => setShowEditProfile(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Dietary Preferences Modal */}
      {showDietaryPreferences && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-fade-in"
          onClick={() => setShowDietaryPreferences(false)}
        >
          <div 
            className="w-full max-w-[428px] mx-auto bg-[var(--color-surface)] rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--color-border)]">
              <div className="w-12 h-1 bg-[var(--color-border)] rounded-full mx-auto mb-4" />
              <h3 className="text-center mb-1">Dietary Preferences</h3>
              <p className="text-center text-sm text-[var(--color-text-secondary)]">
                Customize your recipe recommendations
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Dietary Restrictions */}
              <div>
                <h4 className="mb-3 flex items-center gap-2">
                  <span className="text-xl">🥗</span>
                  Dietary Restrictions
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {dietaryOptions.map((diet) => (
                    <button
                      key={diet.id}
                      onClick={() => toggleDiet(diet.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedDiets.includes(diet.id)
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/30'
                      }`}
                    >
                      <div className="text-2xl mb-2">{diet.icon}</div>
                      <div className="text-sm">{diet.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergies & Intolerances */}
              <div>
                <h4 className="mb-3 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  Allergies & Intolerances
                </h4>
                
                {/* Add Allergy Input */}
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add an allergy (e.g., Eggs, Soy)"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                  />
                  <button
                    onClick={addAllergy}
                    className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-primary-hover)] transition-colors flex-shrink-0"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {/* Allergies List */}
                {allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy) => (
                      <div
                        key={allergy}
                        className="flex items-center gap-2 px-3 py-2 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-lg"
                      >
                        <span className="text-sm text-[var(--color-error)]">{allergy}</span>
                        <button
                          onClick={() => removeAllergy(allergy)}
                          className="text-[var(--color-error)] hover:bg-[var(--color-error)]/20 rounded-full p-1 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-text-secondary)] text-center py-4 bg-[var(--color-cream)] rounded-xl">
                    No allergies added yet
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-[var(--color-sage-green)]/10 border border-[var(--color-sage-green)]/20 rounded-xl p-4">
                <div className="flex gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <p className="text-sm text-[var(--color-text-primary)] mb-1">
                      Personalized Recommendations
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Your dietary preferences help us suggest recipes that match your lifestyle and health needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-[var(--color-border)] space-y-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleSaveDietaryPreferences}
              >
                Save Preferences
              </Button>
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => setShowDietaryPreferences(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast 
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
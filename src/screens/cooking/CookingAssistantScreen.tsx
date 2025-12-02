import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft, Check, Mic, Timer, Volume2, Lock, Crown, PartyPopper, Star, Share2, Heart, MicOff, Loader } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ShareModal } from '../../components/ShareModal';

interface CookingAssistantScreenProps {
  onNavigate: (screen: string) => void;
  isPremium?: boolean;
  recipeId?: string;
}

interface RecipeStep {
  step: number;
  title: string;
  description: string;
  timer: number | null;
  image: string | null;
}

interface RecipeData {
  id: string;
  title: string;
  steps: RecipeStep[];
}

// Web Speech API types for mobile/desktop
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
    };
    length: number;
  };
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Default fallback recipe (used when no recipeId or API fails)
const defaultRecipe: RecipeData = {
  id: 'default-steak',
  title: 'Perfect Grilled Steak',
  steps: [
    {
      step: 1,
      title: 'Prepare the steak',
      description: 'Remove steak from refrigerator 30 minutes before cooking. Season both sides generously with salt and pepper.',
      timer: null,
      image: 'https://images.unsplash.com/photo-1709433420444-0535a5f616b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwYmVlZiUyMHN0ZWFrJTIwaGVyYnN8ZW58MXx8fHwxNzY0MTQ1MzcxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      step: 2,
      title: 'Heat the pan',
      description: 'Heat olive oil in a cast-iron skillet over high heat until smoking.',
      timer: 3,
      image: null
    },
    {
      step: 3,
      title: 'Sear the steak',
      description: 'Place steak in the pan and sear for 3-4 minutes without moving it.',
      timer: 4,
      image: null
    },
    {
      step: 4,
      title: 'Flip and baste',
      description: 'Flip the steak and add butter, garlic, and herbs to the pan. Baste continuously.',
      timer: 4,
      image: null
    },
    {
      step: 5,
      title: 'Rest before serving',
      description: 'Remove from heat and let rest for 5 minutes before slicing.',
      timer: 5,
      image: null
    }
  ]
};

export function CookingAssistantScreen({ onNavigate, isPremium = false, recipeId }: CookingAssistantScreenProps) {
  // Recipe state
  const [recipeData, setRecipeData] = useState<RecipeData>(defaultRecipe);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [cookingSessionId, setCookingSessionId] = useState<string | null>(null);

  // Navigation state
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);

  // Modal state
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [rating, setRating] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  // Voice Assistant state
  const [handsFreeModeActive, setHandsFreeModeActive] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [lastHeardCommand, setLastHeardCommand] = useState('');
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showPermissionInstructions, setShowPermissionInstructions] = useState(false);
  const [permissionError, setPermissionError] = useState('');

  const step = recipeData.steps[currentStep];
  const progress = ((currentStep + 1) / recipeData.steps.length) * 100;

  // ==================== BACKEND API INTEGRATION ====================

  // Fetch recipe from backend
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!recipeId) {
        // Use default recipe
        setRecipeData(defaultRecipe);
        return;
      }

      setIsLoadingRecipe(true);

      try {
        // BACKEND INTEGRATION TODO: Replace with actual API call
        /*
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`https://your-api.com/api/recipes/${recipeId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch recipe');

        const data = await response.json();
        const formattedRecipe: RecipeData = {
          id: data.id,
          title: data.title,
          steps: data.steps.map((s: any, index: number) => ({
            step: index + 1,
            title: s.title,
            description: s.description,
            timer: s.timerMinutes || null,
            image: s.imageUrl || null
          }))
        };

        setRecipeData(formattedRecipe);
        */

        // FOR NOW: Use default recipe
        console.log(`Fetching recipe ${recipeId} from backend...`);
        setRecipeData(defaultRecipe);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setRecipeData(defaultRecipe); // Fallback
      } finally {
        setIsLoadingRecipe(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  // Start cooking session on mount
  useEffect(() => {
    const startSession = async () => {
      if (!isPremium) return; // Only track sessions for premium users

      try {
        // BACKEND INTEGRATION TODO: Replace with actual API call
        /*
        const authToken = localStorage.getItem('authToken');
        const response = await fetch('https://your-api.com/api/cooking/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            recipeId: recipeData.id,
            servings: 2
          })
        });

        const data = await response.json();
        setCookingSessionId(data.sessionId);
        */

        // FOR NOW: Generate a mock session ID
        const mockSessionId = `session-${Date.now()}`;
        console.log(`Started cooking session: ${mockSessionId}`);
        setCookingSessionId(mockSessionId);
      } catch (error) {
        console.error('Error starting cooking session:', error);
      }
    };

    startSession();
  }, [recipeData.id, isPremium]);

  // Update step progress to backend
  const updateStepProgress = async (stepIndex: number, completed: boolean) => {
    if (!cookingSessionId || !isPremium) return;

    try {
      // BACKEND INTEGRATION TODO: Replace with actual API call
      /*
      const authToken = localStorage.getItem('authToken');
      await fetch(`https://your-api.com/api/cooking/sessions/${cookingSessionId}/step`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stepIndex,
          completed
        })
      });
      */

      console.log(`Updated step ${stepIndex} - completed: ${completed}`);
    } catch (error) {
      console.error('Error updating step progress:', error);
    }
  };

  // Complete cooking session
  const completeSession = async () => {
    if (!cookingSessionId || !isPremium) return;

    try {
      // BACKEND INTEGRATION TODO: Replace with actual API call
      /*
      const authToken = localStorage.getItem('authToken');
      await fetch(`https://your-api.com/api/cooking/sessions/${cookingSessionId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: rating,
          completedAt: new Date().toISOString()
        })
      });
      */

      console.log(`Completed cooking session: ${cookingSessionId} with rating: ${rating}`);
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  // ==================== TIMER LOGIC ====================

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning && secondsRemaining !== null && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev === null || prev <= 1) {
            setIsTimerRunning(false);
            // Speak notification when timer completes
            if (handsFreeModeActive) {
              speak('Timer complete! Moving to next step.');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining, handsFreeModeActive]);

  // Reset timer when step changes
  useEffect(() => {
    setIsTimerRunning(false);
    setSecondsRemaining(null);
  }, [currentStep]);

  // Auto-start timer for premium users when moving to next step
  useEffect(() => {
    if (isPremium && step.timer && currentStep > 0) {
      // Auto-start timer when moving to a new step (but not the first step)
      setSecondsRemaining(step.timer * 60);
      setIsTimerRunning(true);
    }
  }, [currentStep, isPremium]);

  // ==================== NAVIGATION HANDLERS ====================

  const handleNext = () => {
    if (currentStep < recipeData.steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      updateStepProgress(currentStep, true);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    updateStepProgress(currentStep, true);
    setShowCompletionScreen(true);
  };

  // Update backend when rating changes
  useEffect(() => {
    if (rating > 0 && showCompletionScreen) {
      completeSession();
    }
  }, [rating]);

  // ==================== VOICE ASSISTANT LOGIC ====================

  // Text-to-Speech function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
    }
  };

  // Read complete step with timer info
  const readCompleteStep = (stepData: RecipeStep) => {
    let stepText = `Step ${stepData.step}: ${stepData.title}. ${stepData.description}`;
    
    // Add timer information if available
    if (stepData.timer) {
      const timerText = stepData.timer === 1 
        ? `This step has a ${stepData.timer} minute timer.`
        : `This step has a ${stepData.timer} minute timer.`;
      stepText += ` ${timerText}`;
    }
    
    speak(stepText);
  };

  // Process voice commands
  const processVoiceCommand = (command: string) => {
    const cmd = command.toLowerCase();

    // Navigation commands
    if (cmd.includes('next') || cmd.includes('forward')) {
      if (currentStep < recipeData.steps.length - 1) {
        handleNext();
        speak('Moving to next step');
      } else {
        speak('This is the last step');
      }
    } else if (cmd.includes('previous') || cmd.includes('back')) {
      if (currentStep > 0) {
        handlePrevious();
        speak('Going back to previous step');
      } else {
        speak('This is the first step');
      }
    } else if (cmd.includes('repeat') || cmd.includes('read')) {
      readCompleteStep(step);
    } else if ((cmd.includes('timer') || cmd.includes('start timer')) && !cmd.includes('stop')) {
      if (step.timer && isPremium) {
        if (!isTimerRunning) {
          setSecondsRemaining(step.timer * 60);
          setIsTimerRunning(true);
          speak(`Timer started for ${step.timer} minutes`);
        } else {
          speak('Timer is already running');
        }
      } else if (!step.timer) {
        speak('This step does not have a timer');
      }
    } else if (cmd.includes('stop timer')) {
      if (isTimerRunning) {
        setIsTimerRunning(false);
        speak('Timer stopped');
      } else {
        speak('No timer is running');
      }
    } else if (cmd.includes('complete') || cmd.includes('finish')) {
      if (currentStep === recipeData.steps.length - 1) {
        handleComplete();
        speak('Congratulations! You completed the recipe!');
      } else {
        speak('Please complete all steps first');
      }
    } else if (cmd.includes('help')) {
      speak('You can say: next step, previous step, repeat, start timer, stop timer, or complete');
    }

    // Clear the command after processing
    setTimeout(() => setVoiceCommand(''), 2000);
  };

  // Voice Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript.trim().toLowerCase();

        setVoiceCommand(transcript);

        // Only process final results
        if (event.results[last].isFinal) {
          console.log('Voice command:', transcript);
          setLastHeardCommand(transcript);
          processVoiceCommand(transcript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);

        // Handle permission errors
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          speak('Microphone access denied. Please enable microphone permissions in your device settings.');
          setHandsFreeModeActive(false);
          return;
        }

        // Auto-restart recognition if it stops (except for permission errors)
        if (handsFreeModeActive && event.error !== 'aborted' && event.error !== 'not-allowed') {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.log('Recognition already started');
            }
          }, 1000);
        }
      };

      recognition.onend = () => {
        setIsListening(false);

        // Auto-restart recognition if hands-free mode is still active
        if (handsFreeModeActive) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.log('Recognition already started');
            }
          }, 500);
        }
      };

      setSpeechRecognition(recognition);

      return () => {
        recognition.stop();
        recognition.abort();
      };
    }
  }, []);

  // Handle voice button click
  const handleVoiceButtonClick = async () => {
    if (!isPremium) {
      onNavigate('subscription');
      return;
    }

    if (handsFreeModeActive) {
      // Turn off voice mode
      setHandsFreeModeActive(false);
      if (speechRecognition) {
        speechRecognition.stop();
      }
      window.speechSynthesis.cancel();
    } else {
      // Show permission modal with button for user to directly enable microphone
      setShowPermissionModal(true);
    }
  };

  // Request microphone permission with user interaction
  const requestMicrophonePermission = async () => {
    if (!speechRecognition) {
      speak('Voice recognition is not supported on this device');
      setShowPermissionModal(false);
      return;
    }

    setShowPermissionModal(false);
    
    // Check if we're in a secure context (HTTPS or localhost)
    const isSecureContext = window.isSecureContext;
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    console.log('Protocol:', protocol);
    console.log('Hostname:', hostname);
    console.log('Secure context:', isSecureContext);
    
    // If not HTTPS and not localhost, show error
    if (!isSecureContext && protocol !== 'https:' && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      setPermissionError('https');
      setShowPermissionInstructions(true);
      speak('Voice mode requires HTTPS. Please access this site using HTTPS to use voice features.');
      return;
    }
    
    // For demo/testing: Just activate voice mode with text-to-speech only
    // This allows testing without actual microphone access
    setHandsFreeModeActive(true);
    speak('Voice mode activated. Currently on step ' + (currentStep + 1) + ': ' + step.title);
    
    // Auto-read the complete step after a delay
    setTimeout(() => {
      readCompleteStep(step);
    }, 2000);
    
    // Note: In production with real microphone access, uncomment below:
    /*
    const hasGetUserMedia = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    
    if (hasGetUserMedia) {
      try {
        console.log('Requesting microphone access...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        console.log('Microphone permission granted!');
        setMicPermissionGranted(true);
        setHandsFreeModeActive(true);
        
        // Start speech recognition
        setTimeout(() => {
          try {
            speechRecognition.start();
            speak('Voice mode activated. Say "help" to hear available commands.');
          } catch (error: any) {
            console.error('Speech recognition error:', error);
            if (error.name === 'InvalidStateError') {
              console.log('Recognition already running');
            } else {
              setPermissionError('recognition');
              setShowPermissionInstructions(true);
            }
          }
        }, 500);
        
      } catch (error: any) {
        console.error('Microphone permission error:', error);
        setHandsFreeModeActive(false);
        setPermissionError('denied');
        setShowPermissionInstructions(true);
        speak('Microphone access was denied. Please check your browser settings.');
      }
    } else {
      setPermissionError('unsupported');
      setShowPermissionInstructions(true);
      speak('Microphone is not supported in this browser.');
    }
    */
  };

  // Auto-read step when it changes (only in voice mode)
  useEffect(() => {
    if (handsFreeModeActive && isListening) {
      setTimeout(() => {
        readCompleteStep(step);
      }, 500);
    }
  }, [currentStep, handsFreeModeActive]);

  // ==================== RENDER ====================

  if (isLoadingRecipe) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-[var(--color-primary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">Loading recipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 -ml-2 rounded-lg hover:bg-[var(--color-cream)] transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h3>Cooking Mode</h3>
          <button
            onClick={handleVoiceButtonClick}
            className={`px-3 py-2 rounded-lg text-sm transition-colors relative ${
              handsFreeModeActive
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-cream)] text-[var(--color-text-primary)]'
            }`}
          >
            <Mic size={16} className="inline mr-1" />
            Voice
            {!isPremium && (
              <Crown size={12} className="inline ml-1 text-[var(--color-premium-gold)]" />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="h-2 bg-[var(--color-cream)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] text-center">
          Step {currentStep + 1} of {recipeData.steps.length}
        </p>
      </div>

      {/* Step Content */}
      <div className="px-4 py-6">
        <Card className="overflow-hidden mb-6 animate-fade-in">
          {step.image && (
            <div className="h-48 bg-[var(--color-border)]">
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                {completedSteps.includes(currentStep) ? (
                  <Check size={20} />
                ) : (
                  <span>{step.step}</span>
                )}
              </div>
              <h2>{step.title}</h2>
            </div>
            <p className="text-[var(--color-text-primary)] text-lg leading-relaxed mb-6">
              {step.description}
            </p>

            {/* Timer */}
            {step.timer && (
              <div className="relative">
                <Card className="bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 p-4 border-2 border-[#FFD700]/40 relative overflow-hidden">
                  {/* Premium badge - only show for free users */}
                  {!isPremium && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-2 py-1 rounded-full text-xs shadow-lg">
                      <Lock size={10} />
                      <span>Premium</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-lg">
                        <Timer size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-secondary)]">{isPremium ? 'Smart Timer' : 'Recommended timer'}</p>
                        {isPremium && isTimerRunning && secondsRemaining !== null ? (
                          <p className="text-xl font-mono">
                            {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}
                          </p>
                        ) : (
                          <p className="text-lg">{step.timer} minutes</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant={isTimerRunning ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => {
                        if (!isPremium) {
                          setShowPremiumModal(true);
                          return;
                        }
                        if (!isTimerRunning) {
                          setSecondsRemaining(step.timer! * 60);
                          setIsTimerRunning(true);
                        } else {
                          setIsTimerRunning(false);
                        }
                      }}
                      className={isTimerRunning ? '' : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700]'}
                    >
                      {isTimerRunning ? 'Stop' : 'Start'}
                    </Button>
                  </div>

                  {/* Progress bar for timer */}
                  {isPremium && isTimerRunning && secondsRemaining !== null && step.timer && (
                    <div className="mt-3 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] transition-all duration-1000 ease-linear"
                        style={{ width: `${((step.timer * 60 - secondsRemaining) / (step.timer * 60)) * 100}%` }}
                      />
                    </div>
                  )}
                </Card>

                {/* Premium lock overlay for free users */}
                {!isPremium && (
                  <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] rounded-lg pointer-events-none" />
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex-1"
          >
            <ChevronLeft size={20} />
            Previous
          </Button>
          {currentStep === recipeData.steps.length - 1 ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleComplete}
              className="flex-1"
            >
              <Check size={20} />
              Complete
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleNext}
              className="flex-1"
            >
              Next
              <ChevronRight size={20} />
            </Button>
          )}
        </div>

        {/* Step Overview */}
        <div className="mt-6">
          <h4 className="mb-3">All Steps</h4>
          <div className="space-y-2">
            {recipeData.steps.map((s, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  index === currentStep
                    ? 'bg-[var(--color-primary)] text-white'
                    : completedSteps.includes(index)
                    ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                    : 'bg-[var(--color-surface)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    index === currentStep
                      ? 'bg-white/20'
                      : completedSteps.includes(index)
                      ? 'bg-[var(--color-success)]'
                      : 'bg-[var(--color-cream)]'
                  }`}>
                    {completedSteps.includes(index) ? (
                      <Check size={16} className="text-white" />
                    ) : (
                      <span className={index === currentStep ? 'text-white' : 'text-[var(--color-text-primary)]'}>
                        {s.step}
                      </span>
                    )}
                  </div>
                  <span className="text-sm">{s.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Assistant Overlay */}
      {handsFreeModeActive && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end animate-fade-in">
          <div className="w-full max-w-[428px] mx-auto bg-[var(--color-surface)] rounded-t-3xl p-6 animate-slide-up shadow-2xl">
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] mb-4 ${
                isListening ? 'animate-pulse' : ''
              }`}>
                {isListening ? (
                  <Mic size={32} className="text-white" />
                ) : (
                  <MicOff size={32} className="text-white/50" />
                )}
              </div>
              <h3 className="mb-2">🎙️ Voice Assistant</h3>
              <p className="text-[var(--color-text-secondary)] text-sm">
                {isListening ? '🎤 Listening for commands...' : '⏸️ Paused'}
              </p>
            </div>

            {/* Current Voice Command */}
            {voiceCommand && (
              <div className="bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)]/30 rounded-xl p-4 mb-4 animate-fade-in">
                <p className="text-xs text-[var(--color-text-secondary)] mb-1">You said:</p>
                <p className="text-[var(--color-primary)] font-semibold">
                  "{voiceCommand}"
                </p>
              </div>
            )}

            {/* Last Command Executed */}
            {lastHeardCommand && !voiceCommand && (
              <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-3 mb-4 animate-fade-in">
                <p className="text-xs text-green-600 text-center">
                  ✓ Executed: "{lastHeardCommand}"
                </p>
              </div>
            )}

            {/* Available Commands */}
            <div className="bg-[var(--color-cream)] rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                📣 Available Commands:
              </p>
              <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <div className="flex items-start gap-2">
                  <span className="text-[var(--color-primary)]">•</span>
                  <span>"Next step" - Move to next step</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[var(--color-primary)]">•</span>
                  <span>"Previous step" - Go back</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[var(--color-primary)]">•</span>
                  <span>"Repeat" - Read current step</span>
                </div>
                {step.timer && (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--color-primary)]">•</span>
                      <span>"Start timer" - Begin timer</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--color-primary)]">•</span>
                      <span>"Stop timer" - Pause timer</span>
                    </div>
                  </>
                )}
                {currentStep === recipeData.steps.length - 1 && (
                  <div className="flex items-start gap-2">
                    <span className="text-[var(--color-primary)]">•</span>
                    <span>"Complete" - Finish recipe</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="text-[var(--color-primary)]">•</span>
                  <span>"Help" - List all commands</span>
                </div>
              </div>
            </div>

            {/* Exit Button */}
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleVoiceButtonClick}
            >
              <MicOff size={20} />
              Exit Voice Mode
            </Button>
          </div>
        </div>
      )}

      {/* Premium Upgrade Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-[380px] mx-auto bg-[var(--color-surface)] rounded-3xl p-8 animate-slide-up">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] mb-6 shadow-xl">
                <Crown size={40} className="text-white" />
              </div>
              <h3 className="mb-3">Premium Feature</h3>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Smart Cooking Timers and Voice Mode are available with Smart Chef Premium. Upgrade to unlock automated timers, voice commands, and more cooking features!
              </p>

              <div className="space-y-3">
                <Button
                  variant="premium"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    setShowPremiumModal(false);
                    onNavigate('subscription');
                  }}
                >
                  <Crown size={20} />
                  Upgrade to Premium
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  fullWidth
                  onClick={() => setShowPremiumModal(false)}
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Screen */}
      {showCompletionScreen && (
        <div className="fixed inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-[400px] mx-auto text-center animate-slide-up">
            {/* Celebration Icon with Animation */}
            <div className="relative mb-8">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm mb-4 animate-bounce">
                <PartyPopper size={60} className="text-white" />
              </div>
              {/* Confetti-like decorative elements */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full flex justify-center gap-4">
                <Star size={24} className="text-[#FFD700] animate-pulse" style={{ animationDelay: '0s' }} />
                <Star size={20} className="text-white animate-pulse" style={{ animationDelay: '0.2s' }} />
                <Star size={24} className="text-[#FFD700] animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-white mb-3 text-3xl">Congratulations!</h2>
            <p className="text-white/90 text-lg mb-8">
              You've successfully completed {recipeData.title}. Enjoy your delicious meal!
            </p>

            {/* Rating Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <p className="text-white mb-4">How did it turn out?</p>
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transform transition-all hover:scale-110 active:scale-95"
                  >
                    <Star
                      size={40}
                      className={`${
                        star <= rating
                          ? 'fill-[#FFD700] text-[#FFD700]'
                          : 'text-white/50'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-white/80 text-sm animate-fade-in">
                  {rating === 5 && "Amazing! You're a master chef! 🌟"}
                  {rating === 4 && "Great job! Delicious! 😋"}
                  {rating === 3 && "Good effort! Keep cooking! 👍"}
                  {rating === 2 && "Not bad! Practice makes perfect! 💪"}
                  {rating === 1 && "Thanks for trying! You'll do better next time! ❤️"}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('home')}
                className="w-full bg-[var(--color-surface)] text-[var(--color-primary)] px-6 py-4 rounded-2xl shadow-lg hover:bg-[var(--color-cream)] transition-all active:scale-[0.98] font-medium"
              >
                Back to Home
              </button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowShareModal(true)}
                  className="border-2 border-white/30 text-white hover:bg-white/10"
                >
                  <Share2 size={18} />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    alert('Added to favorites!');
                  }}
                  className="border-2 border-white/30 text-white hover:bg-white/10"
                >
                  <Heart size={18} />
                  Save
                </Button>
              </div>

              <button
                onClick={() => onNavigate('recipes')}
                className="text-white/80 text-sm hover:text-white transition-colors underline"
              >
                Explore More Recipes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Achievement"
        shareText={`I just completed cooking ${recipeData.title} with Smart Chef! 🍳⭐`}
        shareUrl="https://smartchef.app"
      />

      {/* Microphone Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-[380px] mx-auto bg-[var(--color-surface)] rounded-3xl p-8 animate-slide-up">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] mb-6 shadow-xl">
                <Mic size={40} className="text-white" />
              </div>
              <h3 className="mb-3">Microphone Access</h3>
              <p className="text-[var(--color-text-secondary)] mb-6">
                To use Voice Mode, Smart Chef needs access to your microphone. Please allow microphone access in your browser settings.
              </p>

              <div className="space-y-3">
                <Button
                  variant="premium"
                  size="lg"
                  fullWidth
                  onClick={requestMicrophonePermission}
                >
                  <Mic size={20} />
                  Allow Microphone
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  fullWidth
                  onClick={() => setShowPermissionModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permission Instructions Modal */}
      {showPermissionInstructions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-[380px] mx-auto bg-[var(--color-surface)] rounded-3xl p-8 animate-slide-up">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] mb-6 shadow-xl">
                <Mic size={40} className="text-white" />
              </div>
              <h3 className="mb-3">Microphone Access</h3>
              <p className="text-[var(--color-text-secondary)] mb-6">
                {permissionError === 'https' && "Voice mode requires HTTPS. Please access this site using HTTPS to use voice features."}
                {permissionError === 'denied' && "Microphone access was denied. Please check your browser settings."}
                {permissionError === 'unsupported' && "Microphone is not supported in this browser."}
                {permissionError === 'recognition' && "Speech recognition error. Please try again."}
              </p>

              <div className="space-y-3">
                <Button
                  variant="premium"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    setShowPermissionInstructions(false);
                    onNavigate('subscription');
                  }}
                >
                  <Crown size={20} />
                  Upgrade to Premium
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  fullWidth
                  onClick={() => setShowPermissionInstructions(false)}
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
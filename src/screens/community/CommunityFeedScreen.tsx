import React, { useState, useEffect, useRef } from 'react';
import { Plus, Heart, MessageCircle, Share2, Bookmark, TrendingUp, Filter, MoreVertical, Flag, EyeOff, UserX, Send, Crown } from 'lucide-react';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { ShareModal } from '../../components/ShareModal';
import { Toast } from '../../components/Toast';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PremiumBadge } from '../../components/PremiumLock';
import { useFavorites } from '../../contexts/FavoritesContext';

interface CommunityFeedScreenProps {
  onNavigate: (screen: string) => void;
  isPremium: boolean;
  userPosts: any[];
  onUpdatePosts: (posts: any[]) => void;
  showMyPostsOnReturn: boolean;
  setShowMyPostsOnReturn: (show: boolean) => void;
}

const mockPosts = [
  {
    id: 'community-1',
    user: { name: 'Sarah Johnson', avatar: '👩‍🍳', isPremium: true },
    recipe: 'Creamy Mushroom Risotto',
    image: 'https://images.unsplash.com/photo-1714385988516-85f063e4fcdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNvb2tpbmclMjBpdGFsaWFufGVufDF8fHx8MTc2NDE0NTM3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 234,
    comments: 42,
    tags: ['Italian', 'Vegetarian'],
    timeAgo: '2h ago',
    time: '35 min',
    rating: '4.8'
  },
  {
    id: 'community-2',
    user: { name: 'Mike Chen', avatar: '👨‍🍳', isPremium: true },
    recipe: 'Spicy Thai Basil Chicken',
    image: 'https://images.unsplash.com/photo-1740727665746-cfe80ababc23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGtpdGNoZW58ZW58MXx8fHwxNzY0MTA5MDIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 189,
    comments: 28,
    tags: ['Thai', 'Spicy'],
    timeAgo: '5h ago',
    time: '30 min',
    rating: '4.7'
  },
  {
    id: 'community-3',
    user: { name: 'Emma Wilson', avatar: '👩', isPremium: true },
    recipe: 'Healthy Buddha Bowl',
    image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTY0MDczNTgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 312,
    comments: 56,
    tags: ['Healthy', 'Vegan'],
    timeAgo: '1d ago',
    time: '20 min',
    rating: '4.9'
  }
];

export function CommunityFeedScreen({ onNavigate, isPremium, userPosts, onUpdatePosts, showMyPostsOnReturn, setShowMyPostsOnReturn }: CommunityFeedScreenProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [activeFilter, setActiveFilter] = useState('trending');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareContent, setShareContent] = useState({ title: '', author: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showPostMenu, setShowPostMenu] = useState<string | null>(null);
  const [hiddenPosts, setHiddenPosts] = useState<string[]>([]);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [activePostComments, setActivePostComments] = useState<any>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{ [key: string]: any[] }>({});
  const [displayedPosts, setDisplayedPosts] = useState(mockPosts);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Check if we should show My Posts tab when returning from post recipe
  useEffect(() => {
    if (showMyPostsOnReturn) {
      setActiveFilter('my-posts');
      setShowMyPostsOnReturn(false);
    }
  }, [showMyPostsOnReturn, setShowMyPostsOnReturn]);

  // Infinite scroll observer
  useEffect(() => {
    if (activeFilter === 'my-posts') return; // Don't load more for My Posts tab

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isLoadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isLoadingMore, activeFilter]);

  // Filter posts based on active filter
  const getFilteredPosts = () => {
    if (activeFilter === 'my-posts') {
      return userPosts.filter(post => !hiddenPosts.includes(post.id));
    }
    
    let posts = [...displayedPosts].filter(post => !hiddenPosts.includes(post.id));
    
    if (activeFilter === 'new') {
      // Sort by most recent first (newest posts at top)
      // Convert timeAgo to sortable format: 2h ago < 5h ago < 1d ago
      posts.sort((a, b) => {
        const getTimeValue = (timeAgo: string) => {
          const value = parseInt(timeAgo);
          if (timeAgo.includes('h')) return value;
          if (timeAgo.includes('d')) return value * 24;
          if (timeAgo.includes('m')) return value / 60;
          return value;
        };
        return getTimeValue(a.timeAgo) - getTimeValue(b.timeAgo);
      });
    } else if (activeFilter === 'trending') {
      // Sort by likes (already sorted, but explicit)
      posts.sort((a, b) => b.likes - a.likes);
    }
    
    return posts;
  };

  const handleDeletePost = (postId: string) => {
    onUpdatePosts(userPosts.filter(post => post.id !== postId));
    setShowDeleteConfirm(null);
    setToastMessage('Recipe deleted successfully');
    setShowToast(true);
  };

  const handlePostMenuAction = (action: string, postId: string) => {
    setShowPostMenu(null);
    
    switch (action) {
      case 'hide':
        setHiddenPosts(prev => [...prev, postId]);
        setToastMessage('Post hidden');
        setShowToast(true);
        break;
      case 'report':
        setToastMessage('Post reported');
        setShowToast(true);
        break;
      case 'block':
        setToastMessage('User blocked');
        setShowToast(true);
        break;
    }
  };

  const openComments = (post: any) => {
    setActivePostComments(post);
    setShowCommentsModal(true);
  };

  const addComment = () => {
    if (!newComment.trim() || !activePostComments) return;

    const comment = {
      id: Date.now().toString(),
      user: { name: 'You', avatar: '👤' },
      text: newComment,
      timeAgo: 'Just now'
    };

    setComments(prev => ({
      ...prev,
      [activePostComments.id]: [
        ...(prev[activePostComments.id] || []),
        comment
      ]
    }));

    setNewComment('');
    setToastMessage('Comment added!');
    setShowToast(true);
  };

  const getPostComments = (postId: string) => {
    const defaultComments = [
      {
        id: '1',
        user: { name: 'Alex Martin', avatar: '👨' },
        text: 'This looks absolutely delicious! Can\'t wait to try it 😍',
        timeAgo: '1h ago'
      },
      {
        id: '2',
        user: { name: 'Jessica Lee', avatar: '👩' },
        text: 'Great recipe! I added some extra spices and it was amazing',
        timeAgo: '3h ago'
      }
    ];
    
    return [...defaultComments, ...(comments[postId] || [])];
  };

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const toggleFavorite = (post: any) => {
    const recipeData = {
      id: post.id,
      title: post.recipe,
      image: post.image,
      time: post.time,
      rating: post.rating,
      category: post.tags[0] || 'Community'
    };

    if (isFavorite(post.id)) {
      removeFromFavorites(post.id);
      setToastMessage('Removed from favorites');
    } else {
      addToFavorites(recipeData);
      setToastMessage('Added to favorites!');
    }
    setShowToast(true);
  };

  const loadMorePosts = () => {
    setIsLoadingMore(true);
    
    // Simulate loading more posts
    setTimeout(() => {
      const morePosts = [
        {
          id: `community-${displayedPosts.length + 1}`,
          user: { name: 'Alex Martinez', avatar: '👨‍🍳', isPremium: true },
          recipe: 'Classic Beef Tacos',
          image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWNvcyUyMG1leGljYW58ZW58MXx8fHwxNzY0MTQ1Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
          likes: 156,
          comments: 34,
          tags: ['Mexican', 'Quick'],
          timeAgo: '3h ago',
          time: '25 min',
          rating: '4.6'
        },
        {
          id: `community-${displayedPosts.length + 2}`,
          user: { name: 'Lisa Park', avatar: '👩‍🍳', isPremium: true },
          recipe: 'Homemade Pizza Margherita',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMG1hcmdoZXJpdGF8ZW58MXx8fHwxNzY0MTQ1Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
          likes: 289,
          comments: 67,
          tags: ['Italian', 'Comfort Food'],
          timeAgo: '6h ago',
          time: '45 min',
          rating: '4.9'
        },
        {
          id: `community-${displayedPosts.length + 3}`,
          user: { name: 'David Brown', avatar: '👨', isPremium: true },
          recipe: 'Grilled Salmon with Asparagus',
          image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBkaW5uZXJ8ZW58MXx8fHwxNzY0MTQ1Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
          likes: 201,
          comments: 45,
          tags: ['Healthy', 'Seafood'],
          timeAgo: '1d ago',
          time: '30 min',
          rating: '4.8'
        }
      ];
      
      setDisplayedPosts([...displayedPosts, ...morePosts]);
      setIsLoadingMore(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pb-20">
      <Header 
        title={activeFilter === 'my-posts' ? 'My Posts' : 'Community'} 
        onBack={() => onNavigate('home')}
      />

      <div className="px-4 py-4 space-y-4">
        {/* View Only Banner for Free Users */}
        {!isPremium && (
          <Card className="p-4 bg-gradient-to-r from-[var(--color-premium-gold)]/10 to-[var(--color-premium-gold)]/5 border-2 border-[var(--color-premium-gold)]/20">
            <div className="flex items-center gap-3">
              <Crown size={20} className="text-[var(--color-premium-gold)] flex-shrink-0" />
              <div className="flex-1">
                <h5 className="mb-1">Viewing Mode</h5>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Upgrade to Premium to post and share your recipes
                </p>
              </div>
              <button
                onClick={() => onNavigate('subscription')}
                className="text-sm text-[var(--color-premium-gold)] hover:underline whitespace-nowrap"
              >
                Upgrade
              </button>
            </div>
          </Card>
        )}
        
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['trending', 'new', 'my-posts'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeFilter === filter
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-primary)]'
              }`}
            >
              {filter === 'trending' && <TrendingUp size={16} />}
              {filter === 'my-posts' && <span className="text-lg">👤</span>}
              <span className="capitalize">{filter === 'my-posts' ? 'My Posts' : filter}</span>
              {filter === 'my-posts' && userPosts.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === filter 
                    ? 'bg-white/20 text-white' 
                    : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                }`}>
                  {userPosts.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Post Recipe CTA */}
        <Card 
          onClick={() => onNavigate(isPremium ? 'post-recipe' : 'subscription')}
          className="p-4 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 border-2 border-[var(--color-primary)]/20 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center">
              <Plus size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1">Share Your Recipe</h4>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Inspire the community with your creations
              </p>
            </div>
          </div>
        </Card>

        {/* Feed Posts */}
        <div className="space-y-4">
          {getFilteredPosts().length === 0 && activeFilter === 'my-posts' ? (
            <Card className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-[var(--color-cream)] mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mb-2">No Recipes Yet</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Share your first recipe with the community!
              </p>
              <Button onClick={() => onNavigate(isPremium ? 'post-recipe' : 'subscription')}>
                Create Recipe
              </Button>
            </Card>
          ) : (
            getFilteredPosts().map((post) => (
              <Card key={post.id} className="overflow-hidden">
              {/* User Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center text-xl">
                    {post.user.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{post.user.name}</p>
                      {post.user.isPremium && (
                        <Crown size={16} className="text-[var(--color-premium-gold)]" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)]">{post.timeAgo}</p>
                  </div>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setShowPostMenu(showPostMenu === post.id ? null : post.id)}
                    className="p-2 hover:bg-[var(--color-cream)] rounded-lg transition-colors"
                  >
                    <MoreVertical size={20} className="text-[var(--color-text-secondary)]" />
                  </button>
                  
                  {/* Post Menu Dropdown */}
                  {showPostMenu === post.id && (
                    <>
                      {/* Backdrop to close menu */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowPostMenu(null)}
                      />
                      
                      {/* Menu */}
                      <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-surface)] rounded-xl shadow-lg border border-[var(--color-border)] overflow-hidden z-50">
                        {activeFilter === 'my-posts' ? (
                          // Menu for user's own posts
                          <>
                            <button
                              onClick={() => {
                                setShowPostMenu(null);
                                // Edit functionality (could navigate to edit screen)
                                setToastMessage('Edit coming soon');
                                setShowToast(true);
                              }}
                              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-[var(--color-cream)] transition-colors text-[var(--color-text-primary)]"
                            >
                              <svg className="w-[18px] h-[18px] text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span className="text-sm">Edit Recipe</span>
                            </button>
                            <button
                              onClick={() => {
                                setShowPostMenu(null);
                                setShowDeleteConfirm(post.id);
                              }}
                              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-[var(--color-cream)] transition-colors border-t border-[var(--color-border)]"
                            >
                              <svg className="w-[18px] h-[18px] text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="text-sm text-red-500">Delete Recipe</span>
                            </button>
                          </>
                        ) : (
                          // Menu for other users' posts
                          <>
                            <button
                              onClick={() => handlePostMenuAction('report', post.id)}
                              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-[var(--color-cream)] transition-colors text-[var(--color-text-primary)]"
                            >
                              <Flag size={18} className="text-[var(--color-text-secondary)]" />
                              <span className="text-sm">Report Post</span>
                            </button>
                            <button
                              onClick={() => handlePostMenuAction('hide', post.id)}
                              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-[var(--color-cream)] transition-colors text-[var(--color-text-primary)]"
                            >
                              <EyeOff size={18} className="text-[var(--color-text-secondary)]" />
                              <span className="text-sm">Hide Post</span>
                            </button>
                            <button
                              onClick={() => handlePostMenuAction('block', post.id)}
                              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-[var(--color-cream)] transition-colors border-t border-[var(--color-border)]"
                            >
                              <UserX size={18} className="text-red-500" />
                              <span className="text-sm text-red-500">Block User</span>
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Recipe Image */}
              <div 
                className="relative h-64 bg-[var(--color-border)] cursor-pointer"
                onClick={() => {
                  const recipeData = {
                    id: post.id,
                    title: post.recipe,
                    image: post.image,
                    time: post.time,
                    rating: post.rating
                  };
                  onNavigate('recipe-detail', { recipe: recipeData });
                }}
              >
                <img
                  src={post.image}
                  alt={post.recipe}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Post Content */}
              <div className="p-4">
                <h4 
                  className="mb-2 cursor-pointer hover:text-[var(--color-primary)] transition-colors"
                  onClick={() => {
                    const recipeData = {
                      id: post.id,
                      title: post.recipe,
                      image: post.image,
                      time: post.time,
                      rating: post.rating
                    };
                    onNavigate('recipe-detail', { recipe: recipeData });
                  }}
                >
                  {post.recipe}
                </h4>
                
                {/* Tags */}
                <div className="flex gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[var(--color-cream)] text-xs rounded-full text-[var(--color-text-secondary)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      <Heart
                        size={20}
                        className={likedPosts.includes(post.id) ? 'fill-red-500 text-red-500' : ''}
                      />
                      <span className="text-sm">{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                    </button>
                    <button 
                      onClick={() => openComments(post)}
                      className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      <MessageCircle size={20} />
                      <span className="text-sm">{post.comments + (comments[post.id]?.length || 0)}</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShareContent({ title: post.title, author: post.author });
                        setShowShareModal(true);
                      }}
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleFavorite(post)}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Bookmark
                      size={20}
                      className={isFavorite(post.id) ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : ''}
                    />
                  </button>
                </div>
              </div>
            </Card>
            ))
          )}
        </div>

        {/* Load More - Only show for community posts, not for My Posts */}
        {activeFilter !== 'my-posts' && (
          <div ref={loadMoreRef} className="py-8 flex items-center justify-center">
            {isLoadingMore && (
              <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                <div className="w-5 h-5 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading more recipes...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav active="community" onNavigate={onNavigate} />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Post"
        shareText={`Check out this recipe from ${shareContent.author}: ${shareContent.title}`}
        shareUrl="https://kitchennova.app/community"
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Comments Modal */}
      {showCommentsModal && activePostComments && (
        <div className="fixed inset-0 z-[150] flex items-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCommentsModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-[428px] mx-auto bg-[var(--color-surface)] rounded-t-3xl shadow-2xl animate-slide-up max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <h3>Comments</h3>
              <button
                onClick={() => setShowCommentsModal(false)}
                className="w-8 h-8 rounded-full bg-[var(--color-cream)] flex items-center justify-center hover:bg-[var(--color-border)] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Post Info */}
            <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-cream)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center text-xl">
                  {activePostComments.user.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{activePostComments.user.name}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{activePostComments.recipe}</p>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {getPostComments(activePostComments.id).map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-sage-green-light)] flex items-center justify-center text-sm flex-shrink-0">
                    {comment.user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="bg-[var(--color-cream)] rounded-2xl px-4 py-2">
                      <p className="font-semibold text-sm">{comment.user.name}</p>
                      <p className="text-sm mt-1">{comment.text}</p>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 ml-4">{comment.timeAgo}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment Input */}
            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addComment()}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-3 bg-[var(--color-cream)] rounded-full border-none outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                />
                <button
                  onClick={addComment}
                  disabled={!newComment.trim()}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center px-4 animate-fade-in">
          <div className="bg-[var(--color-surface)] rounded-3xl p-6 max-w-sm w-full animate-scale-in shadow-2xl">
            {/* Warning Icon */}
            <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 className="text-center mb-2">Delete Recipe?</h3>
            <p className="text-center text-[var(--color-text-secondary)] mb-6">
              Are you sure you want to delete this recipe? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={() => handleDeletePost(showDeleteConfirm)}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
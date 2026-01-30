import { useState, useEffect, useRef } from "react";
import { useFlashcardsForReview, useReviewFlashcard } from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type FlashcardData = {
  _id: string;
  front: string;
  back: string;
  topic: string;
  difficulty: string;
  dueDate: Date;
  status: string;
  repetitionCount?: number;
  easinessFactor?: number;
  nextReviewDate?: Date;
  lastReviewScore?: number;
  tags?: string[];
};

type ReviewDifficulty = 'again' | 'hard' | 'good' | 'easy';

export function FlashcardDeck({ topicId }: { topicId?: string }) {
  // State management
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [reviewStartTime, setReviewStartTime] = useState<number>(0);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    timeSpent: 0
  });
  const [isFlipping, setIsFlipping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Swipe gesture handling
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // API hooks
  const { data: flashcardsResponse, isLoading, refetch } = useFlashcardsForReview(topicId);
  const reviewFlashcardMutation = useReviewFlashcard();

  const flashcards = flashcardsResponse?.success ? flashcardsResponse.data || [] : [];
  const currentCard = flashcards[currentCardIndex] as FlashcardData;
  const hasCards = flashcards.length > 0;

  // Start review timer when card is shown
  useEffect(() => {
    if (currentCard && !showBack) {
      setReviewStartTime(Date.now());
    }
  }, [currentCard, showBack]);

  const handleFlipCard = () => {
    if (isAnimating) return;
    setIsFlipping(true);
    setTimeout(() => {
      setShowBack(!showBack);
      setIsFlipping(false);
    }, 150);
  };

  const handleReview = async (difficulty: ReviewDifficulty) => {
    if (!currentCard || isAnimating) return;

    const responseTime = Date.now() - reviewStartTime;
    const isCorrect = difficulty === 'good' || difficulty === 'easy';

    // Set swipe direction based on difficulty
    setSwipeDirection(isCorrect ? 'right' : 'left');
    setIsAnimating(true);

    try {
      await reviewFlashcardMutation.mutateAsync({
        flashcardId: currentCard._id,
        difficulty,
        responseTime
      });

      // Update session stats
      setSessionStats(prev => ({
        reviewed: prev.reviewed + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        timeSpent: prev.timeSpent + Math.floor(responseTime / 1000)
      }));

      // Wait for animation to complete before moving to next card
      setTimeout(() => {
        if (currentCardIndex < flashcards.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1);
          setShowBack(false);
        } else {
          // Session completed - refetch for updated spaced repetition
          refetch();
          setCurrentCardIndex(0);
          setShowBack(false);
        }
        setIsAnimating(false);
        setSwipeDirection(null);
      }, 500);

    } catch (error) {
      console.error('Failed to review flashcard:', error);
      setIsAnimating(false);
      setSwipeDirection(null);
    }
  };

  // Handle touch/mouse events for swipe gestures
  const handleDragStart = (clientX: number, clientY: number) => {
    if (!showBack || isAnimating) return;
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !showBack || isAnimating) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!isDragging || !showBack || isAnimating) return;
    
    setIsDragging(false);
    
    const threshold = 100;
    const absX = Math.abs(dragOffset.x);
    
    if (absX > threshold) {
      if (dragOffset.x > 0) {
        // Swipe right - easy/good
        handleReview('good');
      } else {
        // Swipe left - again/hard
        handleReview('again');
      }
    } else {
      // Snap back to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Helper function to get card transform styles
  const getCardTransform = (index: number) => {
    const isCurrentCard = index === currentCardIndex;
    const offset = index - currentCardIndex;
    
    if (isAnimating && isCurrentCard && swipeDirection) {
      return swipeDirection === 'right' 
        ? 'translateX(400px) rotate(30deg)' 
        : 'translateX(-400px) rotate(-30deg)';
    }
    
    if (isDragging && isCurrentCard && showBack) {
      const rotation = dragOffset.x * 0.1;
      return `translateX(${dragOffset.x}px) translateY(${dragOffset.y * 0.1}px) rotate(${rotation}deg)`;
    }
    
    if (offset === 0) return 'translateX(0px) translateY(0px) scale(1)';
    if (offset === 1) return 'translateX(0px) translateY(-10px) scale(0.95)';
    if (offset === 2) return 'translateX(0px) translateY(-20px) scale(0.9)';
    return `translateX(0px) translateY(-${10 + offset * 5}px) scale(${1 - offset * 0.05})`;
  };

  // Helper function to get card opacity
  const getCardOpacity = (index: number) => {
    const offset = index - currentCardIndex;
    if (isAnimating && index === currentCardIndex) return swipeDirection ? 0 : 1;
    if (offset === 0) return 1;
    if (offset <= 2) return 0.8 - (offset * 0.2);
    return 0.4;
  };

  // Helper function to get card z-index
  const getCardZIndex = (index: number) => {
    const offset = index - currentCardIndex;
    return 100 - offset;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-[600px] mx-auto flex flex-col gap-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="relative h-[500px] bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // No cards available
  if (!hasCards) {
    return (
      <div className="max-w-[600px] mx-auto flex flex-col gap-8 px-4">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-2xl font-bold mb-2">No cards due for review</h2>
          <p className="text-gray-600 mb-4">
            Great job! You're up to date with your flashcard reviews.
          </p>
          <Button onClick={() => window.history.back()}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentCardIndex + 1) / flashcards.length) * 100;
  const accuracy = sessionStats.reviewed > 0 ? (sessionStats.correct / sessionStats.reviewed) * 100 : 0;

  return (
    <div className="max-w-[600px] mx-auto flex flex-col gap-8 px-4 py-6">
      {/* Header with stats */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Flashcard Review</h1>
        <p className="text-gray-600">
          Card {currentCardIndex + 1} of {flashcards.length}
        </p>
      </div>

      {/* Progress and stats */}
      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        
        <div className="flex justify-center gap-6 text-sm">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{sessionStats.reviewed}</div>
            <div className="text-gray-600">Reviewed</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{Math.round(accuracy)}%</div>
            <div className="text-gray-600">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">{sessionStats.timeSpent}s</div>
            <div className="text-gray-600">Time</div>
          </div>
        </div>
      </div>

      {/* Card Stack Container */}
      <div className="relative h-[500px] perspective-1000">
        {flashcards.slice(currentCardIndex, currentCardIndex + 3).map((card, index) => {
          const cardIndex = currentCardIndex + index;
          const isCurrentCard = index === 0;
          
          return (
            <div
              key={`${card._id}-${cardIndex}`}
              ref={isCurrentCard ? cardRef : null}
              className="absolute inset-0 cursor-pointer select-none"
              style={{
                transform: getCardTransform(cardIndex),
                opacity: getCardOpacity(cardIndex),
                zIndex: getCardZIndex(cardIndex),
                transition: isDragging || isAnimating ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: isCurrentCard ? 'auto' : 'none'
              }}
              onClick={isCurrentCard ? handleFlipCard : undefined}
              onMouseDown={isCurrentCard ? handleMouseDown : undefined}
              onMouseMove={isCurrentCard ? handleMouseMove : undefined}
              onMouseUp={isCurrentCard ? handleMouseUp : undefined}
              onMouseLeave={isCurrentCard ? handleMouseUp : undefined}
              onTouchStart={isCurrentCard ? handleTouchStart : undefined}
              onTouchMove={isCurrentCard ? handleTouchMove : undefined}
              onTouchEnd={isCurrentCard ? handleTouchEnd : undefined}
            >
              <div
                className={`h-full w-full rounded-2xl border-2 shadow-xl transition-all duration-300 ${
                  isFlipping ? 'scale-95' : 'scale-100'
                } ${
                  isCurrentCard ? 'border-blue-200 bg-white' : 'border-gray-200 bg-gray-50'
                }`}
                style={{
                  transform: isFlipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <Badge className={getDifficultyColor(card.difficulty)}>
                      {card.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      #{((card as FlashcardData).repetitionCount || 0) + 1}
                    </span>
                  </div>
                  {(card as FlashcardData).tags && (card as FlashcardData).tags!.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(card as FlashcardData).tags!.slice(0, 3).map((tag: string, tagIndex: number) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-8 flex flex-col justify-center items-center text-center h-[calc(100%-120px)]">
                  {!showBack || !isCurrentCard ? (
                    // Front of card
                    <div className="space-y-6">
                      <div className="text-4xl text-blue-500">🤔</div>
                      <h2 className="text-2xl font-bold leading-relaxed">{card.front}</h2>
                      <p className="text-gray-500">Tap to reveal answer</p>
                    </div>
                  ) : (
                    // Back of card
                    <div className="space-y-6 w-full">
                      <div className="text-4xl text-green-500">💡</div>
                      <div className="text-lg leading-relaxed text-gray-800 max-w-md">
                        {card.back}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Swipe Instructions & Action Buttons */}
      {showBack && !isAnimating ? (
        <div className="space-y-6">
          {/* Swipe indicators */}
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-200"></div>
              <span>← Swipe left: Need review</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Swipe right: Got it! →</span>
              <div className="w-3 h-3 rounded-full bg-green-200"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="flex flex-col gap-1 h-16 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleReview('again')}
              disabled={reviewFlashcardMutation.isPending}
            >
              <span className="text-xl">😰</span>
              <span className="text-xs">Again</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex flex-col gap-1 h-16 text-orange-600 border-orange-200 hover:bg-orange-50"
              onClick={() => handleReview('hard')}
              disabled={reviewFlashcardMutation.isPending}
            >
              <span className="text-xl">🤔</span>
              <span className="text-xs">Hard</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex flex-col gap-1 h-16 text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => handleReview('good')}
              disabled={reviewFlashcardMutation.isPending}
            >
              <span className="text-xl">👍</span>
              <span className="text-xs">Good</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex flex-col gap-1 h-16 text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => handleReview('easy')}
              disabled={reviewFlashcardMutation.isPending}
            >
              <span className="text-xl">🚀</span>
              <span className="text-xs">Easy</span>
            </Button>
          </div>
        </div>
      ) : (
        !isAnimating && (
          <div className="text-center">
            <Button size="lg" onClick={handleFlipCard} className="px-8">
              <span className="material-symbols-outlined mr-2">flip</span>
              Reveal Answer
            </Button>
          </div>
        )
      )}

      {/* Session Complete */}
      {currentCardIndex === flashcards.length - 1 && sessionStats.reviewed > 0 && !isAnimating && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 text-center space-y-4">
          <div className="text-4xl">🎉</div>
          <h2 className="text-2xl font-bold text-green-800">Session Complete!</h2>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{sessionStats.reviewed}</div>
              <div className="text-sm text-green-700">Cards</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{Math.round(accuracy)}%</div>
              <div className="text-sm text-blue-700">Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{Math.floor(sessionStats.timeSpent / 60)}m</div>
              <div className="text-sm text-purple-700">Time</div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={() => refetch()}>
              Review More Cards
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
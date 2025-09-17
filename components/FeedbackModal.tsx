
import React, { useState, useEffect } from 'react';
import { CloseIcon, PaperAirplaneIcon, CheckCircleIcon } from './icons';
import Card from './Card';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, t }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Reset state when modal is closed
    if (!isOpen) {
      setTimeout(() => {
        setFeedbackText('');
        setIsSubmitting(false);
        setIsSubmitted(false);
      }, 300); // Delay to allow for closing animation
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Close modal after showing success message
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
    >
      <div 
        className="relative w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <Card className="p-6 animate-fade-in-up">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                aria-label={t('cancel')}
            >
                <CloseIcon className="w-6 h-6" />
            </button>
            
            {!isSubmitted ? (
                <>
                    <h2 id="feedback-title" className="text-xl font-bold text-brand-dark">{t('feedback_title')}</h2>
                    <p className="text-sm text-gray-600 mt-1 mb-4">{t('feedback_prompt')}</p>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder={t('feedback_placeholder')}
                            className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none"
                            required
                            aria-label={t('feedback_placeholder')}
                        />
                        <div className="flex justify-end items-center mt-4 space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !feedbackText.trim()}
                                className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-md hover:bg-brand-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                <PaperAirplaneIcon className="w-4 h-4" />
                                <span>{isSubmitting ? t('sending') : t('submit')}</span>
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                <div className="text-center py-8">
                    <CheckCircleIcon className="w-16 h-16 text-status-safe mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">{t('feedback_thanks')}</h2>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};

export default FeedbackModal;

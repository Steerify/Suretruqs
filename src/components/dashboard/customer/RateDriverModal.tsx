import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '../../ui/Button';

export const RateDriverModal = ({ onClose, onRate, driverName, trackingId }: { onClose: () => void, onRate: (rating: number, review: string) => void, driverName: string, trackingId: string }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        try {
            await onRate(rating, review);
            onClose();
        } catch (error) {
            console.error("Failed to rate driver", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 p-8 animate-[scaleIn_0.2s_ease-out] text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-slate-400">
                  {driverName ? driverName.charAt(0) : 'D'}
              </div>
              <h3 className="font-bold text-2xl text-slate-900 mb-1">Rate {driverName}</h3>
              <p className="text-slate-500 text-sm mb-6">How was the delivery for shipment #{trackingId}?</p>

              <div className="flex justify-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                      <button
                          key={star}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          onClick={() => setRating(star)}
                          className="transition-transform hover:scale-110 focus:outline-none"
                      >
                          <Star 
                              size={32} 
                              fill={(hoveredStar || rating) >= star ? "#fbbf24" : "transparent"} 
                              className={(hoveredStar || rating) >= star ? "text-yellow-400" : "text-slate-300"} 
                          />
                      </button>
                  ))}
              </div>

              <div className="mb-6">
                  <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary outline-none resize-none"
                      rows={3}
                      placeholder="Share your experience (optional)..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                  ></textarea>
              </div>

              <div className="flex gap-3">
                  <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
                  <Button 
                      disabled={rating === 0} 
                      isLoading={submitting} 
                      onClick={handleSubmit} 
                      className="flex-1 font-bold shadow-lg shadow-brand-primary/20"
                  >
                      Submit Review
                  </Button>
              </div>
          </div>
      </div>
    );
};

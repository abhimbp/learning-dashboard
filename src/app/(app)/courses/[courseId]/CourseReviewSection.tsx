"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";
import { submitReview } from "./actions";
import { cn } from "@/lib/utils";

export function CourseReviewSection({ 
  courseId, 
  hasPurchased, 
  reviews,
  userId
}: { 
  courseId: string, 
  hasPurchased: boolean, 
  reviews: any[],
  userId?: string
}) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const hasReviewed = reviews.some(r => r.user_id === userId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a star rating');
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append('rating', rating.toString());
    formData.append('course_id', courseId);
    
    const result = await submitReview(formData);
    
    if (result.error) {
      alert(result.error);
    } else {
      setSubmitted(true);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-surface-900/50 border border-white/5 rounded-3xl p-6 md:p-8 mt-8">
      <h2 className="text-2xl font-bold text-white mb-6">Student Reviews</h2>

      {hasPurchased && !hasReviewed && !submitted && (
        <div className="bg-surface-800/50 rounded-2xl p-6 mb-8 border border-white/5">
          <h3 className="font-bold text-white mb-4">Leave a Review</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star className={cn("w-8 h-8", (hoveredRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-500")} />
                </button>
              ))}
            </div>
            <textarea 
              name="comment" 
              required 
              rows={3} 
              className="w-full px-4 py-3 bg-surface-900 rounded-xl text-sm text-white focus:outline-none border border-white/5 focus:border-primary-500 transition-colors resize-none" 
              placeholder="What did you think of this course?"
            ></textarea>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all self-start flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Review</>}
            </button>
          </form>
        </div>
      )}

      {submitted && (
        <div className="bg-green-500/10 text-green-400 p-4 rounded-xl border border-green-500/20 mb-8 font-medium">
          Thank you for your review!
        </div>
      )}

      <div className="flex flex-col gap-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="p-5 bg-surface-800 rounded-2xl border border-white/5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{review.student_name}</h4>
                  <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4", i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600")} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-300 mt-2">{review.comment}</p>
              
              {review.reply && (
                <div className="mt-4 p-4 bg-primary-500/10 border-l-2 border-primary-500 rounded-r-xl">
                  <p className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-1">Instructor Reply</p>
                  <p className="text-sm text-gray-300">{review.reply}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
            No reviews yet.
          </div>
        )}
      </div>
    </div>
  );
}

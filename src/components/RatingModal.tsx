import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, X, Check } from 'lucide-react';

const FOOD_TAGS = ['Delicious', 'Generous portion', 'Perfect spice', 'Fresh & hot', 'Great packaging'];
const RIDER_TAGS = ['On time', 'Friendly', 'Careful handling', 'Followed instructions'];

export const RatingModal: React.FC = () => {
  const { ratingOrder, setRatingOrder, showToast } = useApp();
  const [foodRating, setFoodRating] = useState(5);
  const [riderRating, setRiderRating] = useState(5);
  const [selectedFoodTags, setSelectedFoodTags] = useState<string[]>(['Delicious', 'Fresh & hot']);
  const [selectedRiderTags, setSelectedRiderTags] = useState<string[]>(['On time']);
  const [comment, setComment] = useState('');

  if (!ratingOrder) return null;

  const toggleFoodTag = (tag: string) => {
    setSelectedFoodTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleRiderTag = (tag: string) => {
    setSelectedRiderTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    showToast(`Thank you for reviewing ${ratingOrder.restaurantName}!`);
    setRatingOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-[420px] bg-white rounded-[28px] p-6 shadow-2xl border border-[#E8E8E8] max-h-[90vh] overflow-y-auto no-scrollbar space-y-4"
        role="dialog"
        aria-modal="true"
        aria-label="Rate your order"
      >
        <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#171717]">Rate your order</h3>
            <p className="text-xs text-[#858585]">
              #{ratingOrder.id} · {ratingOrder.restaurantName}
            </p>
          </div>
          <button
            onClick={() => setRatingOrder(null)}
            className="w-8 h-8 rounded-full bg-[#F6F6F6] flex items-center justify-center text-[#171717]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Food & Restaurant Rating */}
        <div className="bg-[#F6F6F6] rounded-[20px] p-4 text-center space-y-2">
          <div className="text-xs font-bold text-[#171717]">How was the food?</div>
          <div className="flex justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFoodRating(star)}
                className="p-1 focus:outline-hidden"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= foodRating
                      ? 'fill-[#FF641B] text-[#FF641B]'
                      : 'text-[#E8E8E8]'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center pt-1">
            {FOOD_TAGS.map((tag) => {
              const active = selectedFoodTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleFoodTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                    active
                      ? 'bg-[#171717] text-white border-[#171717]'
                      : 'bg-white text-[#626262] border-[#E8E8E8]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Rider Rating */}
        <div className="bg-[#F6F6F6] rounded-[20px] p-4 text-center space-y-2">
          <div className="text-xs font-bold text-[#171717]">How was delivery by Babatunde?</div>
          <div className="flex justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRiderRating(star)}
                className="p-1 focus:outline-hidden"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= riderRating
                      ? 'fill-[#05DF00] text-[#05DF00]'
                      : 'text-[#E8E8E8]'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center pt-1">
            {RIDER_TAGS.map((tag) => {
              const active = selectedRiderTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleRiderTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                    active
                      ? 'bg-[#171717] text-white border-[#171717]'
                      : 'bg-white text-[#626262] border-[#E8E8E8]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Comment */}
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a short comment (optional)..."
          className="w-full bg-[#F6F6F6] border border-[#E8E8E8] rounded-full px-4 py-2 text-xs text-[#171717] placeholder-[#858585] focus:outline-hidden"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full h-11 bg-[#171717] text-white text-xs font-semibold rounded-full hover:bg-[#05DF00] hover:text-black transition-colors"
        >
          Submit review
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCard } from './FoodCard';
import { Sparkles, Send, ArrowRight, CornerDownLeft, RefreshCw } from 'lucide-react';

const SUGGESTIONS = [
  'Something spicy',
  'Under ₦5,000',
  'High protein',
  'Surprise me',
  'Comfort swallow for dinner',
  'Quick sweet dessert',
];

export const AiAssistantTab: React.FC = () => {
  const { dishes, addToBasket, showToast } = useApp();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(
    "I'm your Food101 assistant. Tell me what you're craving, your budget, or your mood, and I'll curate real dishes from our kitchens."
  );
  const [recommendedDishIds, setRecommendedDishIds] = useState<string[]>(['d1', 'd2']);
  const [tip, setTip] = useState<string | null>('Try pairing swallows with fresh chilled zobo for authentic balance.');

  const handleSearch = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;
    setLoading(true);
    setQuery(userPrompt);

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userPrompt,
          availableDishes: dishes.map((d) => ({
            id: d.id,
            name: d.name,
            restaurantName: d.restaurantName,
            price: d.price,
            category: d.category,
            description: d.description,
            prepTime: d.prepTime,
            spiciness: d.spiciness,
          })),
        }),
      });

      const data = await response.json();
      setAiMessage(data.message || 'Here are our top recommended dishes for your craving:');
      if (data.recommendedDishIds && data.recommendedDishIds.length > 0) {
        setRecommendedDishIds(data.recommendedDishIds);
      } else {
        setRecommendedDishIds(['d1', 'd4']);
      }
      setTip(data.tip || null);
    } catch {
      // Offline fallback
      setAiMessage(`Found authentic matches for "${userPrompt}":`);
      setRecommendedDishIds(['d1', 'd3']);
    } finally {
      setLoading(false);
    }
  };

  const recommendedDishes = dishes.filter((d) => recommendedDishIds.includes(d.id));

  const handleAddAll = () => {
    recommendedDishes.forEach((dish) => {
      addToBasket(dish);
    });
    showToast(`Added ${recommendedDishes.length} curated dishes to basket`);
  };

  return (
    <div className="pb-36 px-5 space-y-5 pt-3">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF641B] uppercase tracking-wide">
          <Sparkles className="w-4 h-4 text-[#FF641B]" />
          <span>Food101 AI</span>
        </div>
        <h1 className="text-xl font-bold text-[#171717] mt-1">What are you craving?</h1>
        <p className="text-xs text-[#858585]">
          Conversational food discovery to find and build your meal fast.
        </p>
      </div>

      {/* Suggestion Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleSearch(s)}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-[99px] bg-[#F6F6F6] border border-[#E8E8E8] text-xs font-semibold text-[#171717] whitespace-nowrap hover:border-[#171717] transition-colors shrink-0 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Field with 99px radius */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }}
        className="relative"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Food101... e.g. 'Spicy swallow under ₦5k'"
          disabled={loading}
          className="w-full bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] pl-4 pr-12 py-3 text-sm text-[#171717] placeholder-[#858585] focus:outline-hidden focus:border-[#171717]"
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="absolute right-1.5 top-1.5 bottom-1.5 w-9 rounded-[99px] bg-[#171717] text-white flex items-center justify-center hover:bg-[#FF641B] disabled:bg-[#858585] disabled:cursor-not-allowed transition-colors"
          aria-label="Send query"
        >
          {loading ? (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </form>

      {/* AI Message Card */}
      {aiMessage && (
        <div className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-4 px-5">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-[99px] bg-[#FF641B] text-white flex items-center justify-center shrink-0 text-xs">
              <Sparkles className="w-3 h-3" />
            </div>
            <div className="text-xs text-[#171717] leading-relaxed font-medium">
              {aiMessage}
              {tip && (
                <div className="mt-1.5 text-[11px] text-[#858585] italic font-normal">
                  💡 {tip}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rendered Dish Recommendations (Normal Food101 Dish Cards per PRD) */}
      {recommendedDishes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#171717]">Recommended Dishes</h2>
            {recommendedDishes.length > 1 && (
              <button
                onClick={handleAddAll}
                className="text-xs font-semibold text-[#FF641B] hover:underline"
              >
                Add all to basket
              </button>
            )}
          </div>

          <div className="space-y-3">
            {recommendedDishes.map((dish) => (
              <FoodCard key={dish.id} dish={dish} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

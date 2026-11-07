import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Dish, OptionChoice, BasketItemCustomization } from '../types';
import { X, Plus, Minus, Check, Utensils } from 'lucide-react';

export const DishCustomizerModal: React.FC = () => {
  const { customizingDish, setCustomizingDish, addToBasket } = useApp();
  const [selectedChoices, setSelectedChoices] = useState<Record<string, OptionChoice[]>>({});
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [imageError, setImageError] = useState(false);

  // Initialize defaults when a dish opens
  useEffect(() => {
    if (customizingDish && customizingDish.optionGroups) {
      const defaults: Record<string, OptionChoice[]> = {};
      customizingDish.optionGroups.forEach((group) => {
        if (group.required && group.choices.length > 0) {
          defaults[group.id] = [group.choices[0]];
        } else {
          defaults[group.id] = [];
        }
      });
      setSelectedChoices(defaults);
      setQuantity(1);
      setSpecialInstructions('');
      setImageError(false);
    } else {
      setSelectedChoices({});
      setQuantity(1);
      setSpecialInstructions('');
      setImageError(false);
    }
  }, [customizingDish]);

  if (!customizingDish) return null;

  const handleSelectChoice = (groupId: string, choice: OptionChoice, required: boolean) => {
    setSelectedChoices((prev) => {
      const current = prev[groupId] || [];
      if (required) {
        // Single selection for required groups (like radio)
        return { ...prev, [groupId]: [choice] };
      } else {
        // Multi selection for optional groups (like checkbox)
        const exists = current.some((c) => c.id === choice.id);
        if (exists) {
          return { ...prev, [groupId]: current.filter((c) => c.id !== choice.id) };
        } else {
          return { ...prev, [groupId]: [...current, choice] };
        }
      }
    });
  };

  // Check required groups
  const isRequiredSatisfied = (customizingDish.optionGroups || []).every((group) => {
    if (!group.required) return true;
    return (selectedChoices[group.id] || []).length > 0;
  });

  // Calculate current unit and total price
  const extraPrice = Object.values(selectedChoices)
    .flat()
    .reduce((acc, c) => acc + c.priceDelta, 0);

  const unitPrice = customizingDish.price + extraPrice;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    if (!isRequiredSatisfied) return;

    const flattenedCustomizations: BasketItemCustomization[] = [];
    (customizingDish.optionGroups || []).forEach((group) => {
      const choices = selectedChoices[group.id] || [];
      choices.forEach((choice) => {
        flattenedCustomizations.push({
          groupName: group.name,
          choiceName: choice.name,
          priceDelta: choice.priceDelta,
        });
      });
    });

    addToBasket(customizingDish, {
      customizations: flattenedCustomizations,
      quantity,
      note: specialInstructions.trim(),
    });

    setCustomizingDish(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-[440px] bg-white rounded-t-[28px] border-t border-[#E8E8E8] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
        role="dialog"
        aria-modal="true"
        aria-label={`Customize ${customizingDish.name}`}
      >
        {/* Drag handle / top bar */}
        <div className="pt-3 pb-1 flex flex-col items-center relative">
          <div className="w-10 h-1 bg-[#E8E8E8] rounded-full" />
          <button
            onClick={() => setCustomizingDish(null)}
            className="absolute top-2 right-4 w-9 h-9 rounded-full bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center text-[#171717] hover:bg-[#E8E8E8]"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-3 space-y-5 no-scrollbar">
          {/* Dish Image Banner with 22px radius */}
          <div className="w-full h-48 rounded-[22px] bg-[#F4F4F6] border border-[#E8E8E8] overflow-hidden flex items-center justify-center">
            {imageError ? (
              <Utensils className="w-10 h-10 text-[#858585]" />
            ) : (
              <img
                src={customizingDish.imageUrl}
                alt={customizingDish.name}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Dish Header */}
          <div>
            <div className="text-xs text-[#858585] font-medium">
              {customizingDish.restaurantName}
            </div>
            <h2 className="text-xl font-bold text-[#171717] mt-0.5">{customizingDish.name}</h2>
            <div className="text-lg font-extrabold text-[#171717] mt-1 tabular-nums">
              ₦{customizingDish.price.toLocaleString()}
            </div>
            <p className="text-sm text-[#626262] mt-2 leading-relaxed">
              {customizingDish.description}
            </p>
          </div>

          {/* Option Groups */}
          {(customizingDish.optionGroups || []).map((group) => {
            const currentSelected = selectedChoices[group.id] || [];
            return (
              <div key={group.id} className="pt-3 border-t border-[#E8E8E8]">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold text-[#171717]">{group.name}</h3>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      group.required
                        ? 'bg-[#171717] text-white'
                        : 'bg-[#F6F6F6] text-[#858585] border border-[#E8E8E8]'
                    }`}
                  >
                    {group.required ? 'Required' : 'Optional'}
                  </span>
                </div>

                <div className="space-y-2">
                  {group.choices.map((choice) => {
                    const isSelected = currentSelected.some((c) => c.id === choice.id);
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => handleSelectChoice(group.id, choice, group.required)}
                        className={`w-full p-3 px-4 rounded-[16px] border flex items-center justify-between transition-colors text-left ${
                          isSelected
                            ? 'bg-[#171717] text-white border-[#171717]'
                            : 'bg-white text-[#171717] border-[#E8E8E8] hover:border-[#171717]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-[#05DF00] bg-[#05DF00] text-black'
                                : 'border-[#858585]'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="text-sm font-medium">{choice.name}</span>
                        </div>

                        {choice.priceDelta > 0 && (
                          <span
                            className={`text-xs font-semibold tabular-nums ${
                              isSelected ? 'text-[#05DF00]' : 'text-[#626262]'
                            }`}
                          >
                            +₦{choice.priceDelta.toLocaleString()}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special Instructions Note */}
          <div className="pt-3 border-t border-[#E8E8E8]">
            <label
              htmlFor="special_instructions"
              className="text-sm font-bold text-[#171717] block mb-2"
            >
              Add a note for the kitchen
            </label>
            <input
              id="special_instructions"
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra spicy, no onions, pack stew separately"
              className="w-full bg-[#F6F6F6] border border-[#E8E8E8] rounded-full px-4 py-2.5 text-xs text-[#171717] placeholder-[#858585] focus:outline-hidden focus:border-[#171717]"
            />
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 border-t border-[#E8E8E8] bg-white flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-2 bg-[#F6F6F6] border border-[#E8E8E8] rounded-full p-1.5 shrink-0">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full bg-white border border-[#E8E8E8] flex items-center justify-center text-[#171717] disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-[#171717] tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-full bg-white border border-[#E8E8E8] flex items-center justify-center text-[#171717]"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Basket Button */}
          <button
            onClick={handleAdd}
            disabled={!isRequiredSatisfied}
            className="flex-1 h-12 rounded-full bg-[#171717] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#05DF00] hover:text-black disabled:bg-[#858585] disabled:cursor-not-allowed transition-colors"
          >
            <span>Add to basket</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-bold">₦{totalPrice.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

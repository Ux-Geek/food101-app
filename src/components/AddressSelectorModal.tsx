import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Address } from '../types';
import { X, MapPin, Plus, Check, Navigation } from 'lucide-react';

export const AddressSelectorModal: React.FC = () => {
  const {
    isAddressSelectorOpen,
    setIsAddressSelectorOpen,
    savedAddresses,
    currentAddress,
    setCurrentAddress,
    addSavedAddress,
    basketItems,
    showToast,
  } = useApp();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newArea, setNewArea] = useState('Lekki Phase 1, Lagos');
  const [newFullAddress, setNewFullAddress] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newInstructions, setNewInstructions] = useState('');

  if (!isAddressSelectorOpen) return null;

  const handleSelectAddress = (addr: Address) => {
    if (basketItems.length > 0 && addr.id !== currentAddress.id) {
      showToast('Delivery address updated. Delivery ETA and fees verified.');
    }
    setCurrentAddress(addr);
    setIsAddressSelectorOpen(false);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullAddress.trim()) {
      showToast('Please enter a street address or landmark');
      return;
    }

    addSavedAddress({
      label: newLabel,
      area: newArea,
      fullAddress: newFullAddress.trim(),
      landmark: newLandmark.trim(),
      instructions: newInstructions.trim(),
      isDefault: false,
    });

    setIsAddingNew(false);
    setIsAddressSelectorOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-[420px] bg-white rounded-[99px] p-6 shadow-2xl border border-[#E8E8E8] max-h-[90vh] overflow-y-auto no-scrollbar space-y-4"
        role="dialog"
        aria-modal="true"
        aria-label="Delivery address"
      >
        <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#171717]">Where should we deliver?</h3>
            <p className="text-xs text-[#858585]">Choose or add a delivery destination</p>
          </div>
          <button
            onClick={() => {
              setIsAddingNew(false);
              setIsAddressSelectorOpen(false);
            }}
            className="w-8 h-8 rounded-[99px] bg-[#F6F6F6] flex items-center justify-center text-[#171717]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isAddingNew ? (
          <div className="space-y-3">
            {/* Quick GPS Location Detection */}
            <button
              onClick={() => {
                showToast('Current GPS detected: Lekki Phase 1, Lagos');
              }}
              className="w-full bg-[#12E600]/10 border border-[#12E600] rounded-[99px] p-3 px-4 flex items-center justify-between text-left hover:bg-[#12E600]/20 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Navigation className="w-4 h-4 text-[#171717]" />
                <span className="text-xs font-bold text-[#171717]">Use my current location</span>
              </div>
              <span className="text-[10px] font-bold text-[#171717] bg-[#12E600] px-2 py-0.5 rounded-[99px]">
                GPS
              </span>
            </button>

            {/* Saved Addresses List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#858585] uppercase tracking-wide">
                Saved Locations
              </div>

              {savedAddresses.map((addr) => {
                const isSelected = addr.id === currentAddress.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectAddress(addr)}
                    className={`cursor-pointer p-3 px-4 rounded-[99px] border flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#171717] text-white border-[#171717]'
                        : 'bg-[#F6F6F6] text-[#171717] border-[#E8E8E8] hover:border-[#171717]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-[99px] border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#FF641B] bg-[#FF641B]' : 'border-[#858585]'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3] text-white" />}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">
                          {addr.label} · {addr.area}
                        </div>
                        <div
                          className={`text-[11px] truncate mt-0.5 ${
                            isSelected ? 'text-[#858585]' : 'text-[#626262]'
                          }`}
                        >
                          {addr.fullAddress}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Address Button */}
            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full h-11 border border-dashed border-[#858585] rounded-[99px] text-xs font-semibold text-[#171717] hover:border-[#171717] flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#FF641B]" />
              <span>Enter a new address</span>
            </button>
          </div>
        ) : (
          /* Add New Address Form */
          <form onSubmit={handleSaveNew} className="space-y-3 text-left">
            <div>
              <label className="text-xs font-bold text-[#171717] block mb-1">Label</label>
              <div className="flex gap-2">
                {(['Home', 'Work', 'Other'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setNewLabel(l)}
                    className={`flex-1 py-1.5 rounded-[99px] text-xs font-semibold border ${
                      newLabel === l
                        ? 'bg-[#171717] text-white border-[#171717]'
                        : 'bg-[#F6F6F6] text-[#626262] border-[#E8E8E8]'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#171717] block mb-1">Area in Lagos</label>
              <select
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="w-full bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] px-3.5 py-2 text-xs font-semibold text-[#171717] focus:outline-hidden"
              >
                <option value="Lekki Phase 1, Lagos">Lekki Phase 1, Lagos</option>
                <option value="Victoria Island, Lagos">Victoria Island, Lagos</option>
                <option value="Ikoyi, Lagos">Ikoyi, Lagos</option>
                <option value="Ikeja GRA, Lagos">Ikeja GRA, Lagos</option>
                <option value="Yaba, Lagos">Yaba, Lagos</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#171717] block mb-1">Street Address</label>
              <input
                type="text"
                required
                value={newFullAddress}
                onChange={(e) => setNewFullAddress(e.target.value)}
                placeholder="e.g. 24 Admiralty Way, Block 3 Flat 2"
                className="w-full bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] px-3.5 py-2 text-xs text-[#171717] placeholder-[#858585] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#171717] block mb-1">
                Landmark (Optional)
              </label>
              <input
                type="text"
                value={newLandmark}
                onChange={(e) => setNewLandmark(e.target.value)}
                placeholder="e.g. Beside Filmhouse Cinemas"
                className="w-full bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] px-3.5 py-2 text-xs text-[#171717] placeholder-[#858585] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#171717] block mb-1">
                Delivery Instructions
              </label>
              <input
                type="text"
                value={newInstructions}
                onChange={(e) => setNewInstructions(e.target.value)}
                placeholder="e.g. Gate code #1234 or leave with concierge"
                className="w-full bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] px-3.5 py-2 text-xs text-[#171717] placeholder-[#858585] focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 h-11 bg-[#171717] text-white text-xs font-semibold rounded-[99px] hover:bg-[#FF641B]"
              >
                Save address
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 h-11 bg-[#F6F6F6] text-[#171717] text-xs font-semibold rounded-[99px]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

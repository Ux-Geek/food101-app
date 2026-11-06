import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrackingStatus } from '../types';
import {
  X,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Store,
  Navigation,
} from 'lucide-react';

const STATUS_STEPS: { key: TrackingStatus; label: string; desc: string }[] = [
  { key: 'submitted', label: 'Order submitted', desc: 'Sent to kitchen' },
  { key: 'accepted', label: 'Restaurant accepted', desc: 'Order confirmed' },
  { key: 'preparing', label: 'Preparing food', desc: 'Kitchen is cooking' },
  { key: 'ready_for_pickup', label: 'Ready for pickup', desc: 'Awaiting rider' },
  { key: 'picked_up', label: 'Picked up', desc: 'Rider has food' },
  { key: 'on_the_way', label: 'On the way', desc: 'Rider is en route' },
  { key: 'arriving', label: 'Arriving', desc: 'At delivery address' },
  { key: 'delivered', label: 'Delivered', desc: 'Enjoy your meal!' },
];

export const LiveTrackingView: React.FC = () => {
  const {
    isTrackingOpen,
    setIsTrackingOpen,
    activeOrder,
    advanceTrackingStage,
    setTrackingStatusManual,
    cancelActiveOrder,
    setRatingOrder,
    setViewingReceiptOrder,
    showToast,
  } = useApp();

  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of plans');
  const [showRiderContactModal, setShowRiderContactModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  if (!isTrackingOpen || !activeOrder) return null;

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === activeOrder.status);
  const isDelivered = activeOrder.status === 'delivered';
  const isCancelled = activeOrder.status === 'cancelled';
  const progressRatio = Math.max(
    0.05,
    Math.min(1, (currentStepIndex + 1) / STATUS_STEPS.length)
  );

  // Map coordinates simulation along a scenic Lagos route (e.g. Admiralty Way -> Lekki 1)
  // Rider coordinates along an SVG path from (40, 160) [Restaurant] to (360, 40) [Destination]
  const riderX = 40 + (360 - 40) * progressRatio;
  const riderY = 160 + (40 - 160) * progressRatio;

  const handleCancel = () => {
    cancelActiveOrder(cancelReason);
    setShowCancelPrompt(false);
    setIsTrackingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-[440px] h-full sm:h-[94vh] bg-white sm:rounded-[99px] shadow-2xl flex flex-col overflow-hidden relative"
        role="dialog"
        aria-modal="true"
        aria-label="Order Tracking"
      >
        {/* Top Floating App Bar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
          <button
            onClick={() => setIsTrackingOpen(false)}
            className="w-10 h-10 rounded-[99px] bg-white border border-[#E8E8E8] shadow-md flex items-center justify-center text-[#171717] hover:bg-[#F6F6F6]"
            aria-label="Close tracking"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="bg-white/95 backdrop-blur-xs border border-[#E8E8E8] shadow-md px-4 py-1.5 rounded-[99px] text-xs font-bold text-[#171717]">
            Order #{activeOrder.id}
          </div>

          <button
            onClick={() => setShowIssueModal(true)}
            className="w-10 h-10 rounded-[99px] bg-white border border-[#E8E8E8] shadow-md flex items-center justify-center text-[#171717] hover:bg-[#F6F6F6]"
            aria-label="Report issue"
          >
            <AlertTriangle className="w-4 h-4 text-[#858585]" />
          </button>
        </div>

        {/* Live Vector Delivery Map Canvas */}
        <div className="relative w-full h-[260px] bg-[#F6F6F6] shrink-0 border-b border-[#E8E8E8] overflow-hidden flex items-center justify-center">
          {/* Subtle stylized street grid lines */}
          <svg className="absolute inset-0 w-full h-full text-[#E8E8E8]" fill="none">
            <line x1="0" y1="60" x2="440" y2="60" stroke="currentColor" strokeWidth="6" />
            <line x1="0" y1="140" x2="440" y2="140" stroke="currentColor" strokeWidth="8" />
            <line x1="0" y1="210" x2="440" y2="210" stroke="currentColor" strokeWidth="4" />
            <line x1="100" y1="0" x2="100" y2="260" stroke="currentColor" strokeWidth="8" />
            <line x1="220" y1="0" x2="220" y2="260" stroke="currentColor" strokeWidth="6" />
            <line x1="330" y1="0" x2="330" y2="260" stroke="currentColor" strokeWidth="8" />
            
            {/* Delivery Route Path */}
            <path
              d="M 40 160 Q 140 160 180 120 T 360 40"
              stroke="#171717"
              strokeWidth="4"
              strokeDasharray="6 6"
              fill="none"
            />
          </svg>

          {/* Restaurant Pin */}
          <div className="absolute left-[30px] top-[140px] z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-[99px] bg-[#171717] text-white flex items-center justify-center shadow-md">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-bold text-[#171717] bg-white px-2 py-0.5 rounded-[99px] shadow-xs mt-1 border border-[#E8E8E8] max-w-[90px] truncate">
              {activeOrder.restaurantName}
            </span>
          </div>

          {/* Destination Pin */}
          <div className="absolute right-[35px] top-[20px] z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-[99px] bg-[#FF641B] text-white flex items-center justify-center shadow-md">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-bold text-[#171717] bg-white px-2 py-0.5 rounded-[99px] shadow-xs mt-1 border border-[#E8E8E8]">
              {activeOrder.deliveryAddress.label}
            </span>
          </div>

          {/* Rider Moving Marker */}
          {!isDelivered && (
            <div
              className="absolute z-10 flex flex-col items-center transition-all duration-700 ease-out"
              style={{
                left: `${riderX - 16}px`,
                top: `${riderY - 16}px`,
              }}
            >
              <div className="w-9 h-9 rounded-[99px] bg-[#12E600] text-[#171717] border-2 border-white shadow-lg flex items-center justify-center font-bold">
                <Navigation className="w-4 h-4 fill-current rotate-45" />
              </div>
              <span className="text-[9px] font-bold text-[#171717] bg-white px-2 py-0.5 rounded-[99px] shadow-xs mt-0.5 border border-[#E8E8E8]">
                Babatunde
              </span>
            </div>
          )}

          {/* Lagos Area Watermark Label */}
          <div className="absolute bottom-2 left-4 text-[10px] text-[#858585] font-semibold">
            Lekki Phase 1 · Live GPS Tracking
          </div>
        </div>

        {/* Scrollable Tracking Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
          {/* Distinctive Electric-Green Delivery Tracker Card */}
          <div className="bg-[#12E600] text-[#171717] rounded-[99px] p-5 border border-[#12E600] shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#171717]/80">
                {isDelivered
                  ? 'Order Delivered'
                  : STATUS_STEPS[currentStepIndex]?.label || 'Active delivery'}
              </div>
              <div className="text-base font-extrabold text-[#171717] mt-0.5">
                {isDelivered ? 'Delivered safely' : 'Rider is on the way'}
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-black text-[#171717] tabular-nums leading-none">
                {isDelivered ? '0' : activeOrder.etaMinutes}
                <span className="text-sm font-bold ml-1">min</span>
              </div>
              <div className="text-[10px] font-bold text-[#171717]/70 mt-1 uppercase">
                Estimated arrival
              </div>
            </div>
          </div>

          {/* Rider Information Card */}
          {activeOrder.rider && (
            <div className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-3 px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-[99px] bg-white border border-[#E8E8E8] flex items-center justify-center font-bold text-sm text-[#171717]">
                  {activeOrder.rider.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#171717]">
                      {activeOrder.rider.name}
                    </span>
                    <span className="text-[10px] font-bold text-[#171717] bg-[#12E600] px-1.5 py-0.2 rounded-[99px]">
                      ★ {activeOrder.rider.rating}
                    </span>
                  </div>
                  <div className="text-xs text-[#626262] mt-0.5">
                    {activeOrder.rider.vehicle}
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRiderContactModal(true)}
                  className="w-9 h-9 rounded-[99px] bg-white border border-[#E8E8E8] flex items-center justify-center text-[#171717] hover:bg-[#171717] hover:text-white transition-colors"
                  aria-label="Call rider"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowRiderContactModal(true)}
                  className="w-9 h-9 rounded-[99px] bg-white border border-[#E8E8E8] flex items-center justify-center text-[#171717] hover:bg-[#171717] hover:text-white transition-colors"
                  aria-label="Message rider"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 8-Stage Tracking State Progress Timeline */}
          <div className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-4 px-5">
            <div className="text-xs font-bold text-[#858585] uppercase tracking-wide mb-3">
              Delivery progress
            </div>

            <div className="relative pl-6 space-y-4">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="relative flex items-start justify-between">
                    {/* Connecting line */}
                    {idx < STATUS_STEPS.length - 1 && (
                      <div
                        className={`absolute -left-[18px] top-4 w-0.5 h-7 ${
                          idx < currentStepIndex ? 'bg-[#12E600]' : 'bg-[#E8E8E8]'
                        }`}
                      />
                    )}

                    {/* Step Dot */}
                    <div
                      className={`absolute -left-6 top-1 w-4 h-4 rounded-[99px] flex items-center justify-center ${
                        isPassed
                          ? 'bg-[#12E600] text-[#171717]'
                          : 'bg-white border border-[#E8E8E8]'
                      }`}
                    >
                      {isPassed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div>
                      <div
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-[#171717]'
                            : isPassed
                            ? 'text-[#626262]'
                            : 'text-[#858585]'
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-[11px] text-[#858585]">{step.desc}</div>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] font-bold text-[#171717] bg-[#12E600] px-2 py-0.5 rounded-[99px]">
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Summary Accordion */}
          <div className="bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] p-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#858585] uppercase tracking-wide">
                Items ({activeOrder.items.length})
              </span>
              <button
                onClick={() => setViewingReceiptOrder(activeOrder)}
                className="text-xs font-semibold text-[#FF641B] hover:underline"
              >
                View receipt
              </button>
            </div>

            <div className="space-y-1 text-xs text-[#626262]">
              {activeOrder.items.map((i) => (
                <div key={i.id} className="flex justify-between">
                  <span>
                    {i.quantity}x {i.dish.name}
                  </span>
                  <span className="font-semibold text-[#171717] tabular-nums">
                    ₦{i.itemTotalPrice.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#E8E8E8] flex justify-between text-xs font-bold text-[#171717]">
              <span>Total paid</span>
              <span className="tabular-nums">₦{activeOrder.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Interactive Simulation Bar for QA Testing */}
          <div className="bg-white border border-[#E8E8E8] rounded-[99px] p-3 px-4 flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-[#858585]">
              Simulate delivery:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={advanceTrackingStage}
                disabled={isDelivered}
                className="px-3 py-1.5 bg-[#171717] text-white text-xs font-semibold rounded-[99px] hover:bg-[#FF641B] disabled:opacity-40 transition-colors"
              >
                Next Stage →
              </button>
              {isDelivered && (
                <button
                  onClick={() => setRatingOrder(activeOrder)}
                  className="px-3 py-1.5 bg-[#FF641B] text-white text-xs font-semibold rounded-[99px]"
                >
                  Rate Order
                </button>
              )}
            </div>
          </div>

          {/* Cancel Order Trigger (Only before pickup per PRD rules) */}
          {!isDelivered && currentStepIndex <= 3 && (
            <div className="text-center pt-1 pb-4">
              <button
                onClick={() => setShowCancelPrompt(true)}
                className="text-xs font-semibold text-[#D92D20] hover:underline"
              >
                Cancel order
              </button>
            </div>
          )}
        </div>

        {/* Cancellation Confirmation Modal */}
        {showCancelPrompt && (
          <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-[99px] p-6 max-w-sm w-full border border-[#E8E8E8] shadow-2xl text-center space-y-3">
              <h3 className="text-base font-bold text-[#171717]">Cancel order #{activeOrder.id}?</h3>
              <p className="text-xs text-[#626262]">
                The kitchen has not yet completed preparation. You are eligible for a full refund of ₦
                {activeOrder.total.toLocaleString()} to your payment method.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleCancel}
                  className="w-full h-11 bg-[#D92D20] text-white rounded-[99px] text-xs font-semibold"
                >
                  Confirm cancellation
                </button>
                <button
                  onClick={() => setShowCancelPrompt(false)}
                  className="w-full h-11 bg-[#F6F6F6] text-[#171717] rounded-[99px] text-xs font-semibold"
                >
                  Keep order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rider Contact Modal */}
        {showRiderContactModal && (
          <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-[99px] p-6 max-w-sm w-full border border-[#E8E8E8] shadow-2xl text-center space-y-3">
              <h3 className="text-base font-bold text-[#171717]">Contact Babatunde</h3>
              <p className="text-xs text-[#626262]">
                Your rider is on a motorbike with your order from {activeOrder.restaurantName}.
              </p>
              <div className="p-3 bg-[#F6F6F6] rounded-[99px] text-xs font-mono font-bold text-[#171717]">
                +234 812 345 6789
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    showToast('Calling rider (+234 812 345 6789)...');
                    setShowRiderContactModal(false);
                  }}
                  className="w-full h-11 bg-[#171717] text-white rounded-[99px] text-xs font-semibold"
                >
                  Call rider
                </button>
                <button
                  onClick={() => {
                    showToast('Delivery note sent to rider: "Buzzer at the gate"');
                    setShowRiderContactModal(false);
                  }}
                  className="w-full h-11 bg-[#F6F6F6] text-[#171717] rounded-[99px] text-xs font-semibold"
                >
                  Send instructions SMS
                </button>
                <button
                  onClick={() => setShowRiderContactModal(false)}
                  className="text-xs text-[#858585] pt-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Issue Reporting Modal (Screen 28) */}
        {showIssueModal && (
          <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-[99px] p-6 max-w-sm w-full border border-[#E8E8E8] shadow-2xl text-center space-y-3">
              <h3 className="text-base font-bold text-[#171717]">Report an issue</h3>
              <p className="text-xs text-[#626262]">
                Order #{activeOrder.id} with {activeOrder.restaurantName}
              </p>
              <div className="space-y-1.5 text-left text-xs">
                {['Order taking longer than expected', 'Rider cannot find address', 'Change delivery note', 'Payment issue'].map(
                  (issue) => (
                    <button
                      key={issue}
                      onClick={() => {
                        showToast(`Support ticket opened: "${issue}"`);
                        setShowIssueModal(false);
                      }}
                      className="w-full p-2.5 px-4 bg-[#F6F6F6] hover:bg-[#E8E8E8] rounded-[99px] text-[#171717] font-medium"
                    >
                      {issue}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="w-full h-10 bg-[#171717] text-white rounded-[99px] text-xs font-semibold mt-2"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

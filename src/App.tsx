/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { ExploreTab } from './components/ExploreTab';
import { AiAssistantTab } from './components/AiAssistantTab';
import { AccountTab } from './components/AccountTab';
import { RestaurantDetailView } from './components/RestaurantDetailView';
import { DishCustomizerModal } from './components/DishCustomizerModal';
import { BasketDrawer } from './components/BasketDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LiveTrackingView } from './components/LiveTrackingView';
import { SearchModal } from './components/SearchModal';
import { AddressSelectorModal } from './components/AddressSelectorModal';
import { AuthModal } from './components/AuthModal';
import { RatingModal } from './components/RatingModal';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { ConflictModal } from './components/ConflictModal';
import { QATestDrawer } from './components/QATestDrawer';
import { Smartphone, Monitor } from 'lucide-react';

function MainApp() {
  const { currentTab, selectedRestaurant, toastMessage } = useApp();
  const [deviceFrameMode, setDeviceFrameMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#171717] flex flex-col items-center justify-start sm:py-6 selection:bg-[#FF641B]/20">
      {/* Top Device View Toggle on Desktop */}
      <div className="hidden sm:flex items-center gap-2 mb-3 bg-white border border-[#E8E8E8] rounded-[99px] p-1 px-3 shadow-xs text-xs">
        <span className="text-[#858585] font-medium mr-1">Food101 Lagos:</span>
        <button
          onClick={() => setDeviceFrameMode(true)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-[99px] font-semibold transition-colors ${
            deviceFrameMode ? 'bg-[#171717] text-white' : 'text-[#626262] hover:text-[#171717]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile Canvas (402px)</span>
        </button>
        <button
          onClick={() => setDeviceFrameMode(false)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-[99px] font-semibold transition-colors ${
            !deviceFrameMode ? 'bg-[#171717] text-white' : 'text-[#626262] hover:text-[#171717]'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Full Responsive</span>
        </button>
      </div>

      {/* Main Mobile App Container */}
      <div
        className={`w-full bg-white transition-all duration-300 relative ${
          deviceFrameMode
            ? 'max-w-[440px] sm:min-h-[860px] sm:rounded-[99px] sm:shadow-2xl sm:border sm:border-[#E8E8E8] overflow-hidden'
            : 'max-w-xl min-h-screen sm:rounded-[99px] sm:shadow-xl sm:border sm:border-[#E8E8E8]'
        }`}
      >
        {/* Sticky Header with Location and Basket */}
        <Header />

        {/* Dynamic Screen View */}
        <main className="w-full">
          {selectedRestaurant ? (
            <RestaurantDetailView />
          ) : (
            <>
              {currentTab === 'home' && <HomeTab />}
              {currentTab === 'explore' && <ExploreTab />}
              {currentTab === 'ai' && <AiAssistantTab />}
              {currentTab === 'account' && <AccountTab />}
            </>
          )}
        </main>

        {/* Floating Bottom Navigation */}
        <BottomNav />

        {/* Global Modals & Overlays */}
        <DishCustomizerModal />
        <BasketDrawer />
        <CheckoutModal />
        <LiveTrackingView />
        <SearchModal />
        <AddressSelectorModal />
        <AuthModal />
        <RatingModal />
        <OrderReceiptModal />
        <ConflictModal />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#171717] text-white text-xs font-semibold px-4 py-2.5 rounded-[99px] shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-150 max-w-[340px] truncate">
            {toastMessage}
          </div>
        )}
      </div>

      {/* Floating QA Test Drawer Trigger */}
      <QATestDrawer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

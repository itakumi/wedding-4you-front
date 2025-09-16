import React, { useState } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { CoupleHome } from './components/CoupleHome';
import { GuestRegistration } from './components/GuestRegistration';
import { GuestList } from './components/GuestList';
import { MessageSetup } from './components/MessageSetup';
import { MessagePreparation } from './components/MessagePreparation';
import { VideoPreparation } from './components/VideoPreparation';
import { ImagePreparation } from './components/ImagePreparation';
import { MessageInput } from './components/MessageInput';
import { MessageConfirm } from './components/MessageConfirm';
import { NameConflict } from './components/NameConflict';
import { GuestLogin } from './components/GuestLogin';
// import { GuestFlow } from './components/GuestFlow';
import './App.css';

export type UserType = 'couple' | 'guest';
export type Screen = 'onboarding' | 'guest-login' | 'name-conflict' | 'couple-home' | 'guest-registration' | 'guest-list' | 'message-setup' | 'message-preparation'| 'message-input' | 'message-confirm' | 'video-preparation' | 'image-preparation'| 'guest-flow';

export interface CoupleData {
  groom_name: string;
  bride_name: string;
}

export interface Guest {
  id?: number;
  couple_id: number;
  guest_name: string;
  invited_by: '新郎' | '新婦';
  community: string;
}

export interface Card {
  template_url: string;
  message_content: string;
}

export interface GuestWithMessage extends Guest {
  messages: {
    cards: Card[];
    videos: string[];
    images: string[];
  };
}

export interface AppState {
  currentScreen: Screen;
  userType: UserType | null;
  coupleData: CoupleData;
  selectedGuest?: Guest | null;
  message: Card;
  messages: {
    cards: Card[];
    videos: string[];
    images: string[];
  };
}

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'onboarding',
    userType: null,
    message: { template_url: '', message_content: '' },
    coupleData: { groom_name: '', bride_name: '' },
    selectedGuest: null,
    messages: { cards: [], videos: [], images: [] }
  });

  const updateState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  const renderCurrentScreen = () => {
    switch (appState.currentScreen) {
      case 'onboarding':
        console.log('onboarding');
        // return <NameConflict appState={appState} updateState={updateState} />;
        // return <GuestLogin appState={appState} updateState={updateState} />;
        return <OnboardingScreen appState={appState} updateState={updateState} />;
      case 'guest-login':
        return <GuestLogin appState={appState} updateState={updateState} />;
      case 'name-conflict':
        return <NameConflict appState={appState} updateState={updateState} />;
      case 'couple-home':
        return <CoupleHome appState={appState} updateState={updateState} />;
      case 'guest-registration':
        return <GuestRegistration appState={appState} updateState={updateState} />;
      case 'guest-list':
        return <GuestList appState={appState} updateState={updateState} />;
      case 'message-setup':
        return <MessageSetup appState={appState} updateState={updateState} />;
      case 'message-preparation':
        return <MessagePreparation appState={appState} updateState={updateState} />;
      case 'message-input':
        return <MessageInput appState={appState} updateState={updateState} />;
      case 'message-confirm':
        return <MessageConfirm appState={appState} updateState={updateState} />;
      case 'video-preparation':
        return <VideoPreparation appState={appState} updateState={updateState} />;
      case 'image-preparation':
        return <ImagePreparation appState={appState} updateState={updateState} />;
      case 'guest-flow':
        // return <GuestFlow appState={appState} updateState={updateState} />;
        return <div>Guest Flow Placeholder</div>; // 仮
      default:
        console.log("default");
        return <div>default</div>;
    }
  };

  return (
    <>
      {renderCurrentScreen()}
    </>
  );
}
export default App;

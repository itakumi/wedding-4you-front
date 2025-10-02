import React, { useState, useEffect, useCallback } from 'react';
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
import { SignIn } from './components/UserSignIn';
import { ViewMessage } from './components/ViewMessage';
import './App.css';

//TODO:
// 自分のIDのレコードのみしかアクセスできないようにする
// ユーザー登録完了してメールでのリンクの挙動を確認
// iconとタイトル
// csvのvalidationで失敗した場合は、原因詳細をユーザーに伝える
// template.pngが反映されていない
// guestテーブルに重複しているかのfieldを追加して、同姓同名の人がいる場合はtrueにする

export type UserType = 'couple' | 'guest';
export type Screen = 'sign-in' | 'onboarding' | 'guest-login' | 'view-message' | 'name-conflict' | 'couple-home' | 'guest-registration' | 'guest-list' | 'message-setup' | 'message-preparation'| 'message-input' | 'message-confirm' | 'video-preparation' | 'image-preparation';

export interface CoupleData {
  id: number;
  groom_name: string;
  bride_name: string;
}

export interface Guest {
  id: number;
  guest_id: number;
  couple_id: number;
  guest_name: string;
  invited_by: '新郎' | '新婦';
  community: string;
  has_message: boolean;
  has_image: boolean;
  has_video: boolean;
}

export interface Card {
  template_url: string;
  message_content: string;
  image_url?: string;
  video_url?: string;
}

export interface GuestLoginInfo {
  inviter_name: string;
  guest_name: string;
  serial_code?: string;
}

export interface AppState {
  currentScreen: Screen;
  userType: UserType | null;
  coupleData: CoupleData | null;
  selectedGuest?: Guest | null;
  message: Card | null;
  guestLoginInfo?: GuestLoginInfo | null;
}

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'sign-in',
    userType: null,
    message: null,
    coupleData: null,
    selectedGuest: null,
    guestLoginInfo: {
      inviter_name: '',
      guest_name: '',
    },
  });

  const updateState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  const blockBrowserBack = useCallback(() => {
    alert("ブラウザの戻るボタンは使用できません。アプリ内のナビゲーションを使用してください。");
  }, [])

  useEffect(() => {
      window.history.pushState(null, '', window.location.href)
      window.addEventListener('popstate', blockBrowserBack)
      return () => {
          window.removeEventListener('popstate', blockBrowserBack)
      }
  }, [blockBrowserBack])

  const renderCurrentScreen = () => {
    switch (appState.currentScreen) {
      case 'sign-in':
        return <SignIn appState={appState} updateState={updateState} />;
      case 'onboarding':
        return <OnboardingScreen appState={appState} updateState={updateState} />;
      case 'view-message':
        return <ViewMessage appState={appState} updateState={updateState} />;
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

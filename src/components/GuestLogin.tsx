import React, { useState, useRef } from 'react';
import { AppState } from '../App';
import styles from './OnboardingScreen.module.css';
import { callApi } from '../utils/api';

interface GuestLoginProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function GuestLogin({ appState, updateState }: GuestLoginProps) {
  const [invitedName, setInvitedName] = useState('');
  const [guestName, setGuestName] = useState('');
  const isComposing = useRef(false);

  const handleInvitedNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isComposing.current) {
      setInvitedName(e.target.value);
      return;
    }
    const inputValue = e.target.value;
    const filteredValue = inputValue.replace(/[^ぁ-んー]/g, '');
    setInvitedName(filteredValue);
  };

  const handleGuestNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isComposing.current) {
      setGuestName(e.target.value);
      return;
    }
    const inputValue = e.target.value;
    const filteredValue = inputValue.replace(/[^ぁ-んー]/g, '');
    setGuestName(filteredValue);
  };

  const handleNext = async () => {
    if (invitedName.trim() && guestName.trim()) {
      const postData = {
        inviter_name: invitedName.trim(),
        guest_name: guestName.trim()
      }
      try {
        const data = await callApi(
          process.env.REACT_APP_BACKEND_ENTRYPOINT + "/guest/login",
          "POST",
          postData
        );
        if (data.status === 'multiple_found'){
          updateState({
            currentScreen: 'name-conflict',
            guestLoginInfo: {
              inviter_name: invitedName.trim(),
              guest_name: guestName.trim(),
            },
          });
          return;
        } else if (data.status === 'not_found') {
          alert(data.message || "招待者名、またはゲスト名が一致しません");
          return;
        } else {
          console.log("ログイン成功:", data);
          updateState({
            currentScreen: 'view-message',
            userType: 'guest',
            message: data.card,
          });
        }
      } catch (error: any) {
        alert(error?.message || "招待者名、またはゲスト名が一致しません");
        console.error("ログインに失敗しました", error);
      }
    }
  };

  return (
    <>
    <div className="mt-5" />
    <div className="center-container">
      <label className={styles.name_label}>
        招待者のお名前
      </label>
      <div className="mt-2" />
      <p className={styles.comment}>性が変わっている場合は、旧姓を入力してください</p>
      <div className="mt-2" />
      <input
        type="text"
        value={invitedName}
        onChange={handleInvitedNameChange}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={e => {
          isComposing.current = false;
          const filteredValue = e.currentTarget.value.replace(/[^ぁ-んー]/g, '');
          setInvitedName(filteredValue);
        }}
        placeholder="フルネームで入力"
        className={styles.name_input}
      />
      <div className="mt-5" />
      <label className={styles.name_label}>
        ゲストのお名前
      </label>
      <div className="mt-2" />
      <input
        type="text"
        value={guestName}
        onChange={handleGuestNameChange}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={e => {
          isComposing.current = false;
          const filteredValue = e.currentTarget.value.replace(/[^ぁ-んー]/g, '');
          setGuestName(filteredValue);
        }}
        placeholder="フルネームで入力"
        className={styles.name_input}
      />
      <div className="mt-4" />
      <p className={styles.comment}>ご自身の名前を入力してください</p>
      <div className="mt-4" />
      <button
        onClick={handleNext}
        disabled={!invitedName.trim() || !guestName.trim()}
        className={styles.next_button}
      >
        <span className={styles.next_text}>つぎへ→</span>
      </button>
    </div>
    </>
  );
}
import React, { useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { AppState } from '../App';
import styles from './OnboardingScreen.module.css';
import { callApi } from '../utils/api';

interface OnboardingScreenProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function OnboardingScreen({ appState, updateState }: OnboardingScreenProps) {
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const isComposing = useRef(false);
  const [cookies,, removeCookie] = useCookies(["access_token", "id", "groom_name", "bride_name"]);

  const handleGroomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isComposing.current) {
      setGroomName(e.target.value); // 変換中はそのまま
      return;
    }
    const inputValue = e.target.value;
    const filteredValue = inputValue.replace(/[^ぁ-んー]/g, '');
    setGroomName(filteredValue);
  };

  const handleBrideNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isComposing.current) {
      setBrideName(e.target.value); // 変換中はそのまま
      return;
    }
    const inputValue = e.target.value;
    const filteredValue = inputValue.replace(/[^ぁ-んー]/g, '');
    setBrideName(filteredValue);
  };

  const handleNext = async () => {
    const postData = {
      id: cookies.id,
      groom_name: groomName.trim(),
      bride_name: brideName.trim(),
    }
    try {
      const data = await callApi(
        process.env.REACT_APP_BACKEND_ENTRYPOINT + "/couple/register",
        "POST",
        postData,
        cookies.access_token
      );
      if (data.status === "success") {
        alert(data.message);
        updateState({
          coupleData: { id: data.couple.id, groom_name: groomName.trim(), bride_name: brideName.trim() },
          currentScreen: 'couple-home',
          userType: 'couple'
        });
      }else{
        alert(data.message);
      }
    } catch (error) {
      console.error("データの取得に失敗しました", error);
    }
  };
  const handleLogOut = () => {
    removeCookie("access_token");
    removeCookie("id");
    removeCookie("groom_name");
    removeCookie("bride_name");
    updateState({
      currentScreen: 'sign-in',
      userType: null,
      coupleData: null,
      selectedGuest: null,
      message: { template_url: '', message_content: '' },
    });
  }
  return (
    <>
    <button onClick={handleLogOut}>ログアウト</button>
    <div className="mt-5" />
    <div className="center-container">
    {/* <div className={styles.thank_you_logo}>
      Thank you
    </div> */}
      <label className={styles.name_label}>
        新郎のお名前
      </label>
      <div className="mt-2" />
      <input
        type="text"
        value={groomName}
        onChange={handleGroomNameChange}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={e => {
          isComposing.current = false;
          const filteredValue = e.currentTarget.value.replace(/[^ぁ-んー]/g, '');
          setGroomName(filteredValue);
        }}
        placeholder="フルネームで入力"
        className={styles.name_input}
      />
      <div className="mt-5" />
      <label className={styles.name_label}>
        新婦のお名前
      </label>
      <div className="mt-2" />
      <input
        type="text"
        value={brideName}
        onChange={handleBrideNameChange}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={e => {
          isComposing.current = false;
          const filteredValue = e.currentTarget.value.replace(/[^ぁ-んー]/g, '');
          setBrideName(filteredValue);
        }}
        placeholder="フルネームで入力"
        className={styles.name_input}
      />
      <div className="mt-4" />
      <p className={styles.comment}>※性が変わっている場合は、旧姓を入力してください</p>
      <div className="mt-5" />
      <button
        onClick={handleNext}
        disabled={!groomName.trim() || !brideName.trim()}
        className={styles.next_button}
      >
        <span className={styles.next_text}>つぎへ→</span>
      </button>
    </div>
    </>
  );
}
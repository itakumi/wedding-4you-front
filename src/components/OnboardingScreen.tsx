import React, { useState, useRef } from 'react';
import { AppState } from '../App';
import styles from './OnboardingScreen.module.css';

interface OnboardingScreenProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function OnboardingScreen({ appState, updateState }: OnboardingScreenProps) {
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const hiraganaRegex = /^[\u3040-\u309F]*$/;
  const isComposing = useRef(false);

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
    console.log('新郎:', groomName.trim(), '新婦:', brideName.trim());
    // const postData = {
    //   groom_name: groomName.trim(),
    //   bride_name: brideName.trim()
    // }
    //   try {
    //     const response = await fetch(
    //       process.env.REACT_APP_BACKEND_ENTRYPOINT + "/couple/register",
    //       {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(postData),
    //       }
    //     );
    //     const data = await response.text();
    //     console.log(data);
    //     // console.log("取得したデータ:", data);
    //   } catch (error) {
    //     console.error("データの取得に失敗しました", error);
    //   }    
    if (groomName.trim() && brideName.trim()) {
      updateState({
        coupleData: { groom_name: groomName.trim(), bride_name: brideName.trim() },
        currentScreen: 'couple-home',
        userType: 'couple'
      });
    }
  };

  return (
    <>
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
    

      {/* <div className="flex-1 px-6 py-8">
        <div className="max-w-sm mx-auto space-y-8">

          <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  placeholder="フルネームで入力"
                  className="name_input"
                />
              </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                新婦のお名前
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  placeholder="フルネームで入力"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              ※姓が変わっている場合は、旧姓を入力してください
            </p>
          </div>

          <button
            onClick={handleNext}
            disabled={!groomName.trim() || !brideName.trim()}
            className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
              groomName.trim() && brideName.trim()
                ? 'bg-primary text-primary-foreground hover:shadow-card-hover transform hover:-translate-y-0.5'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            次へ
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <button
              onClick={() => updateState({ currentScreen: 'guest-flow', userType: 'guest' })}
              className="text-primary font-medium hover:underline transition-colors duration-200"
            >
              ゲストとしてログイン
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-[34px]" />
    </div> */}
    </>
  );
}
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { AppState } from '../App';
import styles from './UserSignIn.module.css';
import { callApi } from '../utils/api';

interface SignInProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function SignIn({ appState, updateState }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookie] = useCookies(["access_token", "id"]);

  useEffect(() => {
    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        setCookie("access_token", accessToken);
      }
    }
  }, []);

  const handleNext = async () => {
    const postData = {
      email: email.trim(),
      password: password.trim(),
    };
    try {
      const data = await callApi(
        process.env.REACT_APP_BACKEND_ENTRYPOINT + "/user/login",
        "POST",
        postData,
        cookies.access_token
      );
      if (data.status === 'success') {
        setCookie("access_token", data.access_token);
        setCookie("id", data.id);
        updateState({
          currentScreen: 'couple-home',
          userType: 'couple',
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("ログインに失敗しました。時間をおいて再度お試しください");
      console.error("ログインに失敗しました", error);
    }
  };
  if ('access_token' in cookies) {
    updateState({
      currentScreen: 'couple-home',
      userType: 'couple',
    });
    return <></>;
  }
  return (
    <>
    <div className="mt-5" />
    <div className="center-container">
    {/* <div className={styles.thank_you_logo}>
      Thank you
    </div> */}
      <label className={styles.name_label}>
        メールアドレス
      </label>
      <div className="mt-2" />
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレスを入力"
        className={styles.name_input}
      />
      <div className="mt-5" />
      <label className={styles.name_label}>
        パスワード
      </label>
      <div className="mt-2" />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワードを入力"
        className={styles.name_input}
      />
      <div className="mt-4" />
      <p className={styles.comment}>※性が変わっている場合は、旧姓を入力してください</p>
      <div className="mt-5" />
      <button
        onClick={handleNext}
        disabled={!email.trim() || !password.trim()}
        className={styles.next_button}
      >
        <span className={styles.next_text}>つぎへ→</span>
      </button>
    </div>
    <div className="mt-5" />
    <button
      onClick={() => updateState({ currentScreen: 'guest-login', userType: 'guest' })}
      >
      <span>ゲストの方はこちら→</span>
    </button>
    </>
  );
}
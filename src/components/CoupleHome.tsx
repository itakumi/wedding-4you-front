import React, { useState, useEffect } from 'react';
import { AppState } from '../App';
import styles from './CoupleHome.module.css';
import '../index.css';
import { separateButtons } from '../utils/utils';
import { callApi } from '../utils/api';
import { useCookies } from 'react-cookie';

interface CoupleHomeProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function CoupleHome({ appState, updateState }: CoupleHomeProps) {
  const [cookies, setCookie, removeCookie] = useCookies(["access_token", "id", "groom_name", "bride_name"]);
  const [loading, setLoading] = useState(true);
  const menuItems = [
    {
      title: 'ゲスト登録/変更',
      action: () => updateState({ currentScreen: 'guest-registration' }),
    },
    {
      title: 'メッセージ準備',
      action: () => updateState({ currentScreen: 'guest-list' }),
    },
    {
      title: '事前チェック',
      action: () => alert('事前チェック機能は準備中です'),
    },
    {
      title: '同姓同名の方がいる場合',
      action: () => alert(`同姓同名の方がいる場合は、招待状に記載の「招待コード」をゲストの方にお伝えください。\n\n招待コードは、ゲスト登録画面で確認できます。`),
    },
    {
      title: '使い方',
      action: () => alert('使い方ガイドは準備中です'),
    }
  ];
  useEffect(() => {
    const fetchData = async () => {
      const postData = {
        id: cookies.id,
      }
      try {
        const data = await callApi(
          process.env.REACT_APP_BACKEND_ENTRYPOINT + "/couple/check",
          "POST",
          postData,
          cookies.access_token
        );
        if (data.status === "success") {
          setCookie("groom_name", encodeURIComponent(data.couple.groom_name));
          setCookie("bride_name", encodeURIComponent(data.couple.bride_name));
          setLoading(false);
        } else{
          alert("不正なアクセスです。再度ログインしてください。");
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
          handleLogOut();
        }
      } catch (error) {
        console.error("データの取得に失敗しました", error);
        updateState({ currentScreen: 'onboarding' });
      }
    };
    if (cookies.access_token && cookies.id && (!cookies.groom_name || !cookies.bride_name)) {
      fetchData();
    }else{
      setLoading(false);
    }
  }, []);
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
    {/* <button onClick={() => updateState({ currentScreen: 'onboarding' })}>カップル名変更</button> */}
    {loading ? (
      <div className="center-container">
        <p className={styles.loading_text}>情報を取得しています...</p>
      </div>
    ) : (
      <div className="center-container">
        <div className="mt-5" />
        <label className={styles.prepare_text_label}>準備を進めましょう</label>
        <div className="mt-5" />
        <div className={styles.menu_items_area}>
        {separateButtons(menuItems, 2).map((pair, idx) => (
          <div className={styles.menu_items_row} key={idx} >
            {pair.map((item, index) => (
              <button
                key={item.title}
                onClick={item.action}
                className={styles.menu_button}
              >
                {item.title}
              </button>
            ))}
          </div>
        ))}
      </div>      
      <p className={styles.inquiry_text}>お問い合わせ先：4youcard.official@gmail.com</p>
    </div>
    )}
    </>
  );
}
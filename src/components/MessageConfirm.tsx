import React, { useState } from 'react';
import { AppState } from '../App';
import styles from './MessageConfirm.module.css'
import { useCookies } from 'react-cookie';
import { callApi } from '../utils/api';
interface MessageConfirmProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function MessageConfirm({ appState, updateState }: MessageConfirmProps) {
  const [cookies,, removeCookie] = useCookies(["access_token", "id", "groom_name", "bride_name"]);
  const [loading, setLoading] = useState(false);
  const handleComplete = async () => {
    const postData = {
      couple_id: cookies.id,
      guest_id: appState.selectedGuest?.guest_id,
      template_url: appState.message?.template_url,
      message_content: appState.message?.message_content,
    };
    setLoading(true);
    try {
      const data = await callApi(
        `${process.env.REACT_APP_BACKEND_ENTRYPOINT}/card/register`,
        'POST',
        postData,
        cookies.access_token
      );
      if (data.status === 'success'){
        alert(data.message);
        updateState({ 
          currentScreen: 'guest-list', 
        });    
      }else if (data.status === 'error' && data.message === 'access_tokenが必要です。'){
        alert("不正なアクセスです。再度ログインしてください。");
        const handleLogOut = () => {
          removeCookie("access_token");
          removeCookie("id");
          removeCookie("groom_name");
          removeCookie("bride_name");
          updateState({ currentScreen: 'sign-in', message: null, selectedGuest: null });
        }
        handleLogOut();
        return;        
      }else{
        alert("エラーが発生しました。もう一度お試しください");
        console.error(data.message);
      }
    } catch (error) {
      console.error('メッセージカードの登録中にエラーが発生しました:', error);
      throw error;
    }
    setLoading(false);
  };
  return (
    <>
    <button 
      onClick={() => updateState({ currentScreen: 'message-setup' })}
    >
      戻る
    </button>
    <div className='center-container'>
      <div className='mt-5'/>
      <label className={styles.title_text}>
        完成イメージ
      </label>
      <div className='mt-5'/>
      <img className={styles.output_image} src={appState.message?.template_url} alt='template'/>
      <div className='mt-5'/>
      <button
          onClick={handleComplete}
          className={styles.complete_button}
        >
          <span className={styles.complete_text}>確認する→</span>
      </button>
      {loading &&<p>メッセージを登録中...</p>}
    </div>
    </>
    );
}
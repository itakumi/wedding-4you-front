import React, { useState } from 'react';
import { AppState } from '../App';
import styles from './ImagePreparation.module.css'
import { useCookies } from 'react-cookie';
import { callApi } from '../utils/api';

interface ImagePreparationProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function ImagePreparation({ appState, updateState }: ImagePreparationProps) {
  const [cookies,, removeCookie] = useCookies(["access_token", "id", "groom_name", "bride_name"]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async() => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const postData = {
          image_data: arrayBuffer,
          image_type: file.type,
          couple_id: cookies.id,
          guest_id: appState.selectedGuest?.guest_id,
        }
        setLoading(true);
        try {
          const data = await callApi(
            process.env.REACT_APP_BACKEND_ENTRYPOINT + "/media/image/upload",
            "POST",
            postData,
            cookies.access_token
          );
          if (data.status === 'success'){
            alert(data.message);
            updateState({
              currentScreen: 'guest-list'
            });
          } else if (data.status === 'error' && data.message === 'access_tokenが必要です。'){
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
          } else if (data.status === 'exceed_max_payload'){
            alert(data.message);
          } else{
            alert("エラーが発生しました。もう一度お試しください");
            console.error(data.message);
          }
        } catch (error) {
          alert("エラーが発生しました。もう一度お試しください");
          console.error(error);
        }
        setLoading(false);
      };
      reader.readAsDataURL(file);
      event.target.value = "";
    }
  }
  return (
    <>
    <button 
      onClick={() => updateState({ currentScreen: 'message-setup' })}
    >
      戻る
    </button>
    {loading && <p>画像をアップロード中...</p>}
    <div className='center-container'>
      <div className='mt-5'/>
      <label className={styles.title_text}>
        画像アップロード
      </label>
      <div className='mt-5'/>
      <div className={styles.subtitle_text}>思い出の画像をアップロードしましょう</div>
      <div className={styles.video_upload_area}>
        <div className={styles.video_upload_box}>
          <label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
            <div className={styles.video_upload_icon}>
              <img src='images/upload_icon.png' alt='upload icon' />
              <div className={styles.video_upload_text}>画像アップロード</div>
            </div>
          </label>          
          
        </div>
      </div>
    </div>
    </>
    );
}
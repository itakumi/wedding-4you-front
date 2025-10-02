import React, { useState } from 'react';
import { AppState } from '../App';
import styles from './GuestRegistration.module.css'
import { useCookies } from 'react-cookie';
import { callApi } from '../utils/api';

interface GuestRegistrationProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

interface GuestPostData {
  couple_id?: number;
  guest_name: string;
  invited_by: '新郎' | '新婦';
  community: string;
}

export function GuestRegistration({ appState, updateState }: GuestRegistrationProps) {
  const [cookies, setCookie, removeCookie] = useCookies(["access_token", "id", "groom_name", "bride_name"]);
  const [loading, setLoading] = useState(false);

  const uploadGuestsBatch = async (guests: GuestPostData[]): Promise<void> => {
    try {
      const data = await callApi(
        `${process.env.REACT_APP_BACKEND_ENTRYPOINT}/guest/register/batch`,
        'POST',
        guests,
        cookies.access_token
      );
      if (data.status === 'success') {
        alert(data.message);
      } else if (data.status === 'partial_success') {
        alert(data.message);
        console.log('部分的に失敗したゲストデータ:', data.failed_guests_details);
      } else if (data.status === 'error') {
        alert(data.message);
        console.log('失敗したゲストデータ:', data.failed_guests_details);
      }
      console.log(data);
    } catch (error) {
      alert('ゲストの追加中にエラーが発生しました。再度お試しください');
      console.error('ゲストデータのアップロード中にエラーが発生しました:', error);
      throw error;
    }
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        setLoading(true);
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const guests: GuestPostData[] = [];

        lines.slice(1).forEach((line, index) => {
          const parts = line.split(',');
          if (parts.length < 3) {
              return;
          }
          const [name, inviter, community] = parts;

          if (name && name.trim()) {
            guests.push({
              couple_id: cookies["id"],
              guest_name: name.trim(),
              invited_by: inviter?.trim().toLowerCase() === '新婦' ? '新婦' : '新郎',
              community: community?.trim() || '未設定',
            });
          }
        });

        if (guests.length > 0) {
          await uploadGuestsBatch(guests);
        } else {
          alert('有効なゲストデータが見つかりませんでした。');
        }
        setLoading(false);
      };
      reader.readAsText(file);
      event.target.value = "";
    }
  };

  const handleManualAdd = async () => {
    const postGuest = {
      couple_id: cookies["id"],
      guest_name: 'げすと',
      invited_by: '新郎',
      community: '未設定'
    };    
    setLoading(true);
    try {
      const data = await callApi(
        `${process.env.REACT_APP_BACKEND_ENTRYPOINT}/guest/register`,
        'POST',
        postGuest,
        cookies.access_token
      );
      if (data.status === 'success') {
        alert(data.message);
      } else if (data.status === 'error' && data.message === "access_tokenが必要です。") {
        alert("不正なアクセスです。再度ログインしてください。");
        const handleLogOut = () => {
          removeCookie("access_token");
          removeCookie("id");
          removeCookie("groom_name");
          removeCookie("bride_name");
          updateState({ currentScreen: 'sign-in', userType: null, coupleData: null, message: null, selectedGuest: null });
        }
        handleLogOut();
        return;
      }else{
        alert(data.message);
      }
    } catch (error) {
      console.error('ゲストデータのアップロード中にエラーが発生しました:', error);
      throw error;
    }
    setLoading(false);
  };
  return (
    <>
    <button 
      onClick={() => updateState({ currentScreen: 'couple-home' })}
    >
      戻る
    </button>
    <div className="center-container">
      <div className="mt-5" />
      <label className={styles.title_text}>
        ゲストを登録しましょう
      </label>
      <div className="mt-5" />
      <label>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          hidden
        />
        <div className={styles.register_option_button}>
          <span className={styles.register_option_text}>CSVでアップロードする→</span>
        </div>
      </label>
      <div className="mt-3" />
        <button
          className={styles.register_option_button}
          onClick={handleManualAdd}
        >
          <span className={styles.register_option_text}>手動で入力する→</span>
        </button>
    {loading && <p>アップロード中...</p>}
    </div>
    </> 
  );
}
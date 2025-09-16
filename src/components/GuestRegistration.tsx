import React, { useState } from 'react';
import { AppState, Guest } from '../App';
import styles from './GuestRegistration.module.css'

interface GuestRegistrationProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function GuestRegistration({ appState, updateState }: GuestRegistrationProps) {
  const [showManualInput, setShowManualInput] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [invitedBy, setInvitedBy] = useState<'新郎' | '新婦'>('新郎');

  const uploadGuestsBatch = async (guests: Guest[]): Promise<void> => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_ENTRYPOINT}/guest/register/batch`, { // エンドポイントはバックエンドに合わせて調整
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 必要に応じて認証ヘッダーなどを追加
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify(guests),
      });
      const data = await response.json();
      if (response.ok){
        alert(data.message || "ゲストデータが正常にアップロードされました。");
      }else{
        alert(data.message || "ゲストのアップロードに失敗しました");
        throw new Error(data.message || 'ゲストのアップロードに失敗しました');
      }

    } catch (error) {
      console.error('ゲストデータのアップロード中にエラーが発生しました:', error);
      throw error;
    }
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const guests: Guest[] = [];

        lines.slice(1).forEach((line, index) => {
          const parts = line.split(',');
          if (parts.length < 3) {
              return;
          }
          const [name, inviter, community] = parts;

          if (name && name.trim()) {
            guests.push({
              couple_id: 1,
              guest_name: name.trim(),
              invited_by: inviter?.trim().toLowerCase() === '新婦' ? '新婦' : '新郎',
              community: community?.trim() || '未設定', // communityがundefinedになる可能性を考慮
            });
          }
        });

        if (guests.length > 0) {
          try {
            // バックエンドにデータを送信
            console.log('Uploading guests to backend:', guests);
            await uploadGuestsBatch(guests);
            // 成功した場合のみ、フロントエンドのステートを更新
            alert(`${guests.length}名のゲストを追加しました`);
          } catch (error) {
            alert(`ゲストの追加中にエラーが発生しました: ${
              typeof error === 'object' && error !== null && 'message' in error
                ? (error as { message: string }).message
                : String(error)
            }`);
          }
        } else {
          alert('有効なゲストデータが見つかりませんでした。');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleManualAdd = async () => {
    const guest: Guest = {
      couple_id: 1,
      guest_name: 'ゲスト名前',
      invited_by: '新郎',
      community: '未設定'
    };    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_ENTRYPOINT}/guest/register`, { // エンドポイントはバックエンドに合わせて調整
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 必要に応じて認証ヘッダーなどを追加
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify(guest),
      });
      const data = await response.json();
      if (response.ok){
        alert(data.message || "ゲストデータが正常にアップロードされました。");
      }else{
        alert(data.message || "ゲストのアップロードに失敗しました");
        throw new Error(data.message || 'ゲストのアップロードに失敗しました');
      }

    } catch (error) {
      console.error('ゲストデータのアップロード中にエラーが発生しました:', error);
      throw error;
    }
    // if (guestName.trim()) {
    //   const newGuest: Guest = {
    //     couple_id: 1,
    //     guest_name: guestName.trim(),
    //     invited_by: invitedBy === '新郎' ? '新郎' : '新婦',
    //     community: '未設定'
    //   };
    //   // updateState({ guests: [...appState.guests, newGuest] });
    //   setGuestName('');
    //   alert('ゲストを追加しました');
    // }
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
    </div>
    </> 
  );
}
import React, { useState, useMemo, useEffect } from 'react';
import { AppState, Guest } from '../App';
import styles from './GuestList.module.css'

interface GuestListProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function GuestList({ appState, updateState }: GuestListProps) {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState('すべて');
    const [selectedCommunity, setSelectedCommunity] = useState('すべて'); 

    useEffect(() => {
      const fetchGuests = async () => {
        try {
          // APIコールを開始する前にローディング状態をtrueに設定
          setLoading(true);
          setError(null); // エラーをリセット

          // バックエンドのAPIエンドポイント (couple_id=1のデータを取得)
          const response = await fetch(`${process.env.REACT_APP_BACKEND_ENTRYPOINT}/guest/get/1`);

          // レスポンスが成功したかチェック (HTTPステータスコード 200番台)
          if (!response.ok) {
            // エラーレスポンスの場合、エラーメッセージをスロー
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
          }

          // レスポンスボディをJSONとしてパース
          const data = await response.json();
          
          console.log("got data:", data);
          console.log("guests:", data.guests);
          console.log('Fetched guests:', data.guests);

          // data オブジェクトに 'guests' というキーが存在し、その値だけを格納したい場合
          updateState({ guests: data.guests });
        } catch (e: any) {
          // エラーが発生した場合、エラーメッセージをstateに格納
          console.error("Failed to fetch guests:", e);
          setError(`データの取得に失敗しました: ${e.message}`);
        } finally {
          // APIコールが完了したらローディング状態をfalseに設定 (成功/失敗に関わらず)
          setLoading(false);
        }
      };

      fetchGuests();

    }, []); 

    const communities = useMemo(() => {
    const uniqueCommunities = [...new Set(appState.guests.map(guest => guest.community))];
        return ['すべて', ...uniqueCommunities];
    }, []);

    // フィルターされたゲストリストの計算（useMemoで最適化）
    const filteredGuests = useMemo(() => {
        return appState.guests.filter(guest => {
        const matchesType = selectedType === 'すべて' || guest.invited_by === selectedType;
        const matchesCommunity = selectedCommunity === 'すべて' || guest.community === selectedCommunity;
        return matchesType && matchesCommunity;
        });
    }, [selectedType, selectedCommunity]); 

    const editGuest = (guest: Guest) => {
      updateState({ currentScreen: 'message-setup', selectedGuest: guest });
    }
    console.log(appState.guests);
    console.log(filteredGuests)

    if (loading) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>ゲストデータを読み込み中...</p>
          {/* ローディングスピナーなどのUIを追加することもできます */}
        </div>
      );
    }

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
        ゲストへのメッセージを登録する
      </label>
      <div className="mt-5" />

      <div className={styles.filters_section}>
        <div className={styles.filter_group}>
          <select
            id="type-select"
            className={styles.groom_bride_filter_dropdown}
            value={selectedType}
            onChange={(event)=>setSelectedType(event.target.value)}
          >
            <option value="すべて" className={styles.filtering_text}>すべて</option>
            <option value="新郎" className={styles.filtering_text}>新郎</option>
            <option value="新婦" className={styles.filtering_text}>新婦</option>
          </select>
        </div>
        <div className={styles.filter_group}>
          <select
            id="community-select"
            className={styles.community_filter_dropdown}
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
          >
            {communities.map(community => (
              <option key={community} value={community} className={styles.filtering_text}>
                {community}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className={styles.guest_list_section}>
        {filteredGuests.length > 0 ? (
          <div>
            {filteredGuests.map(guest => (
              <React.Fragment key={guest.id}>
                <div className='mt-3'/>
                <div className={styles.guest_item}>
                  <span className={styles.guest_name}>{guest.guest_name}様</span>
                  <div className={styles.guest_edit_section}>
                    <div className={styles.guest_edit_text} onClick={()=> editGuest(guest)}>編集する</div>
                    <img className={styles.edit_img} onClick={()=> editGuest(guest)} src='images/edit.svg' alt='edit'/>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p>該当するゲストはいません。</p>
        )}
      </div>
    </div>
    </>
  );
}
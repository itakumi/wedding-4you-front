import React, { useState, useMemo, useEffect } from 'react';
import { AppState, Guest } from '../App';
import { useCookies } from 'react-cookie';
import { callApi } from '../utils/api';
import styles from './GuestList.module.css'

interface GuestListProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function GuestList({ appState, updateState }: GuestListProps) {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedType, setSelectedType] = useState('すべて');
    const [selectedCommunity, setSelectedCommunity] = useState('すべて'); 
    const [cookies,, removeCookie] = useCookies(["access_token", "id", "groom_name", "bride_name"]);

    useEffect(() => {
      const fetchGuests = async () => {
        try {
          setLoading(true);
          const data = await callApi(
            `${process.env.REACT_APP_BACKEND_ENTRYPOINT}/guest/get/${cookies.id}`,
            'GET',
            null,
            cookies.access_token
          );
          if (data.status === 'success' || data.status === 'not_found') {
            setGuests(data.guests);
          } else{
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
          }
        } catch (e: any) {
          console.error("Failed to fetch guests:", e);
        } finally {
          setLoading(false);
        }
      };
      fetchGuests();
    }, [cookies.access_token, cookies.id, removeCookie, updateState]); 

    const communities = useMemo(() => {
    const uniqueCommunities = [...new Set(guests.map(guest => guest.community))];
        return ['すべて', ...uniqueCommunities];
    }, [guests]);

    const filteredGuests = useMemo(() => {
        return guests.filter(guest => {
          const matchesType = selectedType === 'すべて' || guest.invited_by === selectedType;
          const matchesCommunity = selectedCommunity === 'すべて' || guest.community === selectedCommunity;
        return matchesType && matchesCommunity;
        });
    }, [guests, selectedType, selectedCommunity]); 
    console.log(filteredGuests);
    filteredGuests.sort((a, b) => a.guest_id - b.guest_id);
    console.log(filteredGuests);
    const createCard = (guest: Guest) => {
      updateState({ currentScreen: 'message-setup', selectedGuest: guest });
    }

    const editCard = (guest: Guest) => {
      updateState({ currentScreen: 'message-setup', selectedGuest: guest });
    }

    if (loading) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>ゲストデータを読み込み中...</p>
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
              <React.Fragment key={guest.guest_id}>
                <div className='mt-3'/>
                <div className={styles.guest_item}>
                  <span className={styles.guest_name}>{guest.guest_id}: {guest.guest_name}様</span>
                  <div className={styles.guest_edit_section}>
                    {guest.has_message ? (
                      <>
                        <div className={styles.guest_edit_text} onClick={()=> editCard(guest)}>編集する</div>
                        <img className={styles.edit_img} onClick={()=> editCard(guest)} src='images/edit.svg' alt='edit'/>
                      </>
                    ) : (
                      <>
                        <div className={styles.guest_edit_text} onClick={()=> createCard(guest)}>新規作成</div>
                        <img className={styles.edit_img} onClick={()=> createCard(guest)} src='images/edit.svg' alt='edit'/>
                      </>
                    )}
                    {guest.has_message ? 1 : 0}
                    {guest.has_image ? 1 : 0}
                    {guest.has_video ? 1 : 0}
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
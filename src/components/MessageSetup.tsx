import React from 'react';
import { AppState } from '../App';
import styles from './MessageSetup.module.css'
import { separateButtons } from '../utils/utils';

interface MessageSetupProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function MessageSetup({ appState, updateState }: MessageSetupProps) {
  const menuItems = [
    {
      title: 'メッセージ',
      action: () => updateState({ currentScreen: 'message-preparation' }),
    },
    {
      title: '動画',
      action: () => updateState({ currentScreen: 'video-preparation' }),
    },
    {
      title: '画像',
      action: () => updateState({ currentScreen: 'image-preparation' }),
    }
  ];
  return (
    <>
    <button 
      onClick={() => updateState({ currentScreen: 'guest-list' })}
    >
      戻る
    </button>
    <div className='center-container'>
      <div className='mt-5'/>
      <label className={styles.title_text}>
        {appState.selectedGuest?.guest_name}様へのメッセージを{appState.selectedGuest?.has_message ? '編集' : '作成'}する
      </label>
      <div className='mt-5'/>
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
      <div className='mt-5'/>
    </div>
    </>
  );
}
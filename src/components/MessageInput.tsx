import { use, useState } from 'react';
import { AppState, Guest } from '../App';
import styles from './MessageInput.module.css'

interface MessageInputProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function MessageInput({ appState, updateState }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const handleConfirm = () => {
        updateState({ currentScreen: 'message-confirm', message: { ...appState.message, content: message } });
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
        メッセージ入力
      </label>
      <div className='mt-5'/>
      <textarea 
        className={styles.text_area}
        placeholder={`${appState.selectedGuest?.guest_name}様へのメッセージを入力してください。`}
        onChange={(e) => setMessage(e.target.value)}
        />
    </div>
    <button
        onClick={handleConfirm}
        className={styles.confirm_button}
      >
        <span className={styles.confirm_text}>確認する→</span>
      </button>
    </>
    );
}
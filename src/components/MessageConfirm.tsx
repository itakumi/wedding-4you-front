import { AppState, Guest } from '../App';
import styles from './MessageConfirm.module.css'

interface MessageConfirmProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function MessageConfirm({ appState, updateState }: MessageConfirmProps) {
    const handleComplete = () => {
        updateState({ 
          currentScreen: 'guest-list', 
          messages: { 
            ...appState.messages,
            cards: [...appState.messages.cards, appState.message],
            videos: appState.messages.videos,
            images: appState.messages.images
          }  
        });    
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
      <img className={styles.output_image} src={appState.message.template} alt='template'/>
      <div className='mt-5'/>
      <button
          onClick={handleComplete}
          className={styles.complete_button}
        >
          <span className={styles.complete_text}>確認する→</span>
      </button>
    </div>
    {/* {appState.message.content} */}
    </>
    );
}
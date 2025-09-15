import { AppState, Guest } from '../App';
import styles from './ImagePreparation.module.css'

interface ImagePreparationProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function ImagePreparation({ appState, updateState }: ImagePreparationProps) {

const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you can handle the uploaded video file
      alert(`画像「${file.name}」をアップロードしました`);
      // For example, you might want to store the file in the app state or upload it to a server
    }
  }
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
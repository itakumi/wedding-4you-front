import { AppState, Guest } from '../App';
import styles from './VideoPreparation.module.css'

interface VideoPreparationProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function VideoPreparation({ appState, updateState }: VideoPreparationProps) {

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you can handle the uploaded video file
      alert(`動画「${file.name}」をアップロードしました`);
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
        動画アップロード
      </label>
      <div className='mt-5'/>
      <div className={styles.subtitle_text}>思い出の動画をアップロードしましょう</div>
      <div className={styles.video_upload_area}>
        <div className={styles.video_upload_box}>
          <label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              hidden
            />
            <div className={styles.video_upload_icon}>
              <img src='images/upload_icon.png' alt='upload icon' />
              <div className={styles.video_upload_text}>動画アップロード</div>
            </div>
          </label>          
          
        </div>
      </div>
    </div>
    </>
    );
}
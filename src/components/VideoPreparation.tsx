import { AppState } from '../App';
import styles from './VideoPreparation.module.css'
import { callApi } from '../utils/api';
import { useCookies } from 'react-cookie';

interface VideoPreparationProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function VideoPreparation({ appState, updateState }: VideoPreparationProps) {
  const [cookies] = useCookies(["id"]);
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async() => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const postData = {
          video_data: arrayBuffer,
          video_type: file.type,
          id: appState.selectedGuest?.id,
          couple_id: cookies["id"],
          guest_id: appState.selectedGuest?.guest_id,
        }
        try {
          const data = await callApi(
            process.env.REACT_APP_BACKEND_ENTRYPOINT + "/media/video/upload",
            "POST",
            postData
          );
          alert("動画アップロード成功");
          updateState({
            currentScreen: 'guest-list'
          });
        } catch (error) {
          alert((error as any)?.message || "動画のアップロードに失敗しました");
          console.error("データの取得に失敗しました", error);
        }
      };
      reader.readAsDataURL(file);
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
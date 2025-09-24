import { AppState } from '../App';
import styles from './ImagePreparation.module.css'
import { useCookies } from 'react-cookie';
import { callApi } from '../utils/api';

interface ImagePreparationProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function ImagePreparation({ appState, updateState }: ImagePreparationProps) {
  const [cookies] = useCookies(["access_token"]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async() => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const postData = {
          image_data: arrayBuffer,
          image_type: file.type,
          couple_id: appState.coupleData?.id,
          guest_id: appState.selectedGuest?.guest_id,
        }
        try {
          const data = await callApi(
            process.env.REACT_APP_BACKEND_ENTRYPOINT + "/media/image/upload",
            "POST",
            postData,
            cookies.access_token
          );
          alert("画像アップロード成功");
          updateState({
            currentScreen: 'guest-list'
          });
        } catch (error) {
          alert((error as any)?.message || "画像のアップロードに失敗しました");
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
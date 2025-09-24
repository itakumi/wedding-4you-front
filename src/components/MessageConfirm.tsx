import { AppState } from '../App';
import styles from './MessageConfirm.module.css'
import { useCookies } from 'react-cookie';
import { callApi } from '../utils/api';
interface MessageConfirmProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function MessageConfirm({ appState, updateState }: MessageConfirmProps) {
  const [cookies] = useCookies(["access_token"]);
  const handleComplete = async () => {
    const postData = {
      couple_id: appState.coupleData?.id,
      guest_id: appState.selectedGuest?.guest_id,
      template_url: appState.message?.template_url,
      message_content: appState.message?.message_content,
    };
    try {
      const data = await callApi(
        `${process.env.REACT_APP_BACKEND_ENTRYPOINT}/card/register`,
        'POST',
        postData,
        cookies.access_token
      );
      alert(data.message);
      updateState({ 
        currentScreen: 'guest-list', 
      });    
    } catch (error) {
      console.error('メッセージカードの登録中にエラーが発生しました:', error);
      throw error;
    }      
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
      <img className={styles.output_image} src={appState.message?.template_url} alt='template'/>
      <div className='mt-5'/>
      <button
          onClick={handleComplete}
          className={styles.complete_button}
        >
          <span className={styles.complete_text}>確認する→</span>
      </button>
    </div>
    </>
    );
}
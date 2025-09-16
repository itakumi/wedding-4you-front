import { AppState, Guest } from '../App';
import styles from './MessageConfirm.module.css'

interface MessageConfirmProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function MessageConfirm({ appState, updateState }: MessageConfirmProps) {
  console.log(appState.message.message_content)
    const handleComplete = async () => {
      const postData = {
        couple_id: 1, // 仮のカップルID
        guest_id: appState.selectedGuest?.id,
        template_url: appState.message.template_url,
        message_content: appState.message.message_content
      };
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_ENTRYPOINT}/card/register`, { // エンドポイントはバックエンドに合わせて調整
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 必要に応じて認証ヘッダーなどを追加
            // 'Authorization': `Bearer ${yourAuthToken}`,
          },
          body: JSON.stringify(postData),
        });
        const data = await response.json();
        if (response.ok){
          alert(data.message || "メッセージカードが正常に登録されました。");
          updateState({ 
            currentScreen: 'guest-list', 
          });    
        }else{
          alert(data.message || "メッセージカードの登録に失敗しました");
          throw new Error(data.message || 'メッセージカードの登録に失敗しました');
        }

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
      <img className={styles.output_image} src={appState.message.template_url} alt='template'/>
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
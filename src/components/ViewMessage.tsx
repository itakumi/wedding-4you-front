import { AppState } from '../App';
import styles from './NameConflict.module.css'

interface ViewMessageProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function ViewMessage({ appState, updateState }: ViewMessageProps) {
  return (
    <>
    <div className="center-container">
      <div className="mt-5" />
      <label className={styles.name_label}>
        あなたへのメッセージカード
      </label>
      <div className="mt-2" />
        <img src={appState.message?.template_url} alt="Card Template" style={{ maxWidth: '100%', height: 'auto' }} />
        <br />
        {appState.message?.message_content}
        <br />
        {appState.message?.image_url && (
          <img src={appState.message?.image_url} alt="Card Image" style={{ maxWidth: '100%', height: 'auto' }} />
        )}
        <br />
        {appState.message?.video_url && (
          <video controls style={{ maxWidth: '100%', height: 'auto' }}>
            <source src={appState.message.video_url} />
            お使いのブラウザは video タグをサポートしていません。
          </video>
        )}
        <br />
    </div>
    </>
    );
}
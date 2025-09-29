import { useState } from 'react';
import { AppState } from '../App';
import styles from './NameConflict.module.css'
import { callApi } from '../utils/api';


interface NameConflictProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function NameConflict({ appState, updateState }: NameConflictProps) {
  const [serialCode, setSerialCode] = useState('');

  const handleNext = async () => {
    if (serialCode.trim()) {
      const postData = {
        inviter_name: appState.guestLoginInfo?.inviter_name,
        guest_name: appState.guestLoginInfo?.guest_name,
        serial_code: serialCode.trim()
      }
      try {
        const data = await callApi(
          process.env.REACT_APP_BACKEND_ENTRYPOINT + "/guest/login/serial",
          "POST",
          postData
        );
        if (data.status === 'success'){
          console.log("ログイン成功:", data);
          updateState({
            currentScreen: 'view-message',
            userType: 'guest',
            message: data.card,
          });
        } else if (data.status === 'not_found') {
          alert("シリアルコードが一致しません");
          return;
        } else if (data.status === 'multiple_found') {
          alert("同じシリアルコードの方が複数います。運営にお問い合わせください");
          return;
        } else {
          alert("エラーが発生しました。もう一度お試しください");
          console.error("ログインエラー:", data.message);
        }
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    }
  };
  return (
    <>
    <div className="center-container">
      <div className="mt-5" />
      <label className={styles.name_label}>
        同姓同名の方がいます
      </label>
      <div className="mt-2" />
      <p className={styles.comment}>お手数ですが、台紙に記載のシリアルコードを入力してください</p>
      <input
        type="text"
        value={serialCode}
        onChange={(e) => setSerialCode(e.target.value)}
        placeholder="シリアルコード"
        className={styles.serialcode_input}
      />
      <div className="mt-4" />
      <button
        onClick={handleNext}
        disabled={!serialCode.trim()}
        className={styles.next_button}
      >
        <span className={styles.next_text}>つぎへ→</span>
      </button>
    </div>
    </>
    );
}
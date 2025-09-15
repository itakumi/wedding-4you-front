import { useState } from 'react';
import { AppState } from '../App';
import styles from './NameConflict.module.css'

interface NameConflictProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function NameConflict({ appState, updateState }: NameConflictProps) {
  const [serialCode, setSerialCode] = useState('');

  const handleNext = () => {
    if (serialCode.trim()) {
      // 仮の処理。実際にはシリアルコードの検証などを行う。
      console.log('シリアルコード:', serialCode.trim());

      // updateState({
      //   currentScreen: 'couple-home',
      //   userType: 'couple'
      // });
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
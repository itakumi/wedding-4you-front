import React from 'react';
import { AppState } from '../App';
import styles from './CoupleHome.module.css';
import '../index.css';
import { separateButtons } from '../utils/utils';

interface CoupleHomeProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function CoupleHome({ appState, updateState }: CoupleHomeProps) {
  const menuItems = [
    {
      title: 'ゲスト登録/変更',
      action: () => updateState({ currentScreen: 'guest-registration' }),
    },
    {
      title: 'メッセージ準備',
      action: () => updateState({ currentScreen: 'guest-list' }),
    },
    {
      title: '事前チェック',
      action: () => alert('事前チェック機能は準備中です'),
    },
    {
      title: '同姓同名の方がいる場合',
      action: () => alert(`同姓同名の方がいる場合は、招待状に記載の「招待コード」をゲストの方にお伝えください。\n\n招待コードは、ゲスト登録画面で確認できます。`),
    },
    {
      title: '使い方',
      action: () => alert('使い方ガイドは準備中です'),
    }
  ];
  return (
    <>
    <div className="center-container">
      <div className="mt-5" />
      <label className={styles.prepare_text_label}>準備を進めましょう</label>
      <div className="mt-5" />
      <div className={styles.menu_items_area}>
        {separateButtons(menuItems, 2).map((pair, idx) => (
          <div className={styles.menu_items_row} key={idx} >
            {pair.map((item, index) => (
              <button
                key={item.title}
                onClick={item.action}
                className={styles.menu_button}
              >
                {item.title}
              </button>
            ))}
          </div>
        ))}
      </div>      
      <p className={styles.inquiry_text}>お問い合わせ先：4youcard.official@gmail.com</p>
    </div>
    </>
  );
}
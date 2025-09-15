import React from 'react';
import { AppState } from '../App';
import styles from './CoupleHome.module.css';
import '../index.css';

interface CoupleHomeProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}
function separateButtons<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
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
      {/* <div className="mb-5" /> */}
      <p className={styles.inquiry_text}>お問い合わせ先：4youcard.official@gmail.com</p>
    </div>
    {/* <div className="flex flex-col min-h-screen bg-background">
      <div className="h-[50px]" />
      
      <div className="flex-1 px-6 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold text-foreground">準備を進めましょう</h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm font-medium text-foreground">
                {appState.coupleData.groomName} & {appState.coupleData.brideName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {menuItems.map((item, index) => {
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className="p-6 bg-card rounded-xl border border-border hover:shadow-card-hover transition-all duration-200 transform hover:-translate-y-1 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${item.color}`}>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">準備状況</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">登録済みゲスト</span>
                <span className="font-medium text-foreground">{appState.guests.length}名</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">メッセージカード</span>
                <span className="font-medium text-foreground">{appState.messages.cards.length}件</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">アップロード画像</span>
                <span className="font-medium text-foreground">{appState.messages.images.length}件</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              お問い合わせ先：4youcard.official@gmail.com
            </p>
          </div>
        </div>
      </div>
      
      <div className="h-[34px]" />
    </div> */}
    </>
  );
}
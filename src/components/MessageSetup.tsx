import React, { useState } from 'react';
import { AppState } from '../App';
import styles from './MessageSetup.module.css'

interface MessageSetupProps {
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
export function MessageSetup({ appState, updateState }: MessageSetupProps) {
  const [messageText, setMessageText] = useState('');
  const [uploadType, setUploadType] = useState<'card' | 'video' | 'image'>('card');

  const menuItems = [
    {
      title: 'メッセージ',
      action: () => updateState({ currentScreen: 'message-preparation' }),
    },
    {
      title: '動画',
      action: () => updateState({ currentScreen: 'video-preparation' }),
    },
    {
      title: '画像',
      action: () => updateState({ currentScreen: 'image-preparation' }),
    }
  ];

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (files) {
  //     const fileNames = Array.from(files).map(file => file.name);
  //     const updatedMessages = { ...appState.messages };
      
  //     if (uploadType === 'card') {
  //       updatedMessages.cards = [...updatedMessages.cards, ...fileNames];
  //     } else if (uploadType === 'video') {
  //       updatedMessages.videos = [...updatedMessages.videos, ...fileNames];
  //     } else {
  //       updatedMessages.images = [...updatedMessages.images, ...fileNames];
  //     }
      
  //     updateState({ messages: updatedMessages });
  //     alert(`${fileNames.length}個のファイルをアップロードしました`);
  //   }
  // };

  // const saveMessage = () => {
  //   if (messageText.trim()) {
  //     const updatedMessages = { ...appState.messages };
  //     updatedMessages.cards = [...updatedMessages.cards, messageText.trim()];
  //     updateState({ messages: updatedMessages });
  //     setMessageText('');
  //     alert('メッセージを保存しました');
  //   }
  // };

  // const removeItem = (type: 'cards' | 'videos' | 'images', index: number) => {
  //   const updatedMessages = { ...appState.messages };
  //   updatedMessages[type] = updatedMessages[type].filter((_, i) => i !== index);
  //   updateState({ messages: updatedMessages });
  // };

  const uploadTypes = [
    { key: 'card', label: 'カード', color: 'bg-blue-50 text-blue-600' },
    { key: 'video', label: '動画', color: 'bg-purple-50 text-purple-600' },
    { key: 'image', label: '画像', color: 'bg-green-50 text-green-600' }
  ] as const;

  return (
    <>
    <button 
      onClick={() => updateState({ currentScreen: 'couple-home' })}
    >
      戻る
    </button>
    <div className='center-container'>
      <div className='mt-5'/>
      <label className={styles.title_text}>
        {appState.selectedGuest?.guest_name}様へのメッセージを登録する
      </label>
      <div className='mt-5'/>
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
      <div className='mt-5'/>
    </div>
    {/* <div className="flex flex-col min-h-screen bg-background">
      <div className="h-[50px]" />
      
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button 
          onClick={() => updateState({ currentScreen: 'couple-home' })}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          戻る
        </button>
        <h1 className="font-bold text-foreground">メッセージ準備</h1>
        <div className="w-12" />
      </div>

      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                Filetext
              </div>
              <h3 className="text-lg font-semibold text-foreground">メッセージカード</h3>
            </div>
            
            <div className="space-y-3">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="ゲストへの心のこもったメッセージを入力してください"
                rows={4}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              <button
                onClick={saveMessage}
                disabled={!messageText.trim()}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  messageText.trim() 
                    ? 'bg-primary text-primary-foreground hover:shadow-card-hover transform hover:-translate-y-0.5'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                メッセージを保存
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                Upload
              </div>
              <h3 className="text-lg font-semibold text-foreground">ファイルアップロード</h3>
            </div>
            
            <div className="flex gap-2">
              {uploadTypes.map((type) => {
                return (
                  <button
                    key={type.key}
                    onClick={() => setUploadType(type.key)}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      uploadType === type.key 
                        ? 'bg-primary text-primary-foreground shadow-card' 
                        : 'bg-secondary border border-border text-foreground hover:bg-accent'
                    }`}
                  >
                    Icon here
                    {type.label}
                  </button>
                );
              })}
            </div>

            <label className="block w-full p-6 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-accent transition-all cursor-pointer">
              <input
                type="file"
                multiple
                accept={uploadType === 'video' ? 'video/*' : uploadType === 'image' ? 'image/*' : '*'}
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="text-center space-y-3">
                Upload
                <div>
                  <p className="font-medium text-foreground">
                    {uploadType === 'card' && 'メッセージカードファイルを選択'}
                    {uploadType === 'video' && '動画ファイルを選択'}
                    {uploadType === 'image' && '画像ファイルを選択'}
                  </p>
                  <p className="text-sm text-muted-foreground">クリックしてファイルを選択、または複数選択可能</p>
                </div>
              </div>
            </label>
          </div>

          <div className="space-y-6">
            {(['cards', 'videos', 'images'] as const).map((type) => {
              const items = appState.messages[type];
              const typeConfig = {
                cards: { title: 'メッセージカード', color: 'bg-blue-50 text-blue-600' },
                videos: { title: '動画', color: 'bg-purple-50 text-purple-600' },
                images: { title: '画像', color: 'bg-green-50 text-green-600' }
              };
              const config = typeConfig[type];
              
              if (items.length === 0) return null;
              
              return (
                <div key={type} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${config.color}`}>
                        Icon here
                      </div>
                      <h4 className="font-semibold text-foreground">{config.title}</h4>
                    </div>
                    <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {items.length}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg group hover:shadow-card transition-all">
                        <span className="font-medium text-foreground truncate flex-1 mr-3">
                          {item}
                        </span>
                        <button
                          onClick={() => removeItem(type, index)}
                          className="p-1 text-destructive hover:bg-destructive/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                        >
                          Trash
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 bg-card border border-border rounded-xl">
            <h4 className="font-semibold text-foreground mb-4">準備状況</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">メッセージカード</span>
                <span className="font-medium text-foreground">{appState.messages.cards.length}件</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">動画ファイル</span>
                <span className="font-medium text-foreground">{appState.messages.videos.length}件</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">画像ファイル</span>
                <span className="font-medium text-foreground">{appState.messages.images.length}件</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-[34px]" />
    </div> */}
    </>
  );
}
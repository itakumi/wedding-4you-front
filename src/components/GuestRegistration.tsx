import React, { useState } from 'react';
import { AppState, Guest } from '../App';
import styles from './GuestRegistration.module.css'

interface GuestRegistrationProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function GuestRegistration({ appState, updateState }: GuestRegistrationProps) {
  const [showManualInput, setShowManualInput] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [invitedBy, setInvitedBy] = useState<'新郎' | '新婦'>('新郎');

  const uploadGuests = async (guests: Guest[]): Promise<void> => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_ENTRYPOINT}/guest/register/batch`, { // エンドポイントはバックエンドに合わせて調整
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 必要に応じて認証ヘッダーなどを追加
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify(guests),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ゲストのアップロードに失敗しました');
      }

      console.log('ゲストデータが正常にアップロードされました。');
    } catch (error) {
      console.error('ゲストデータのアップロード中にエラーが発生しました:', error);
      throw error; // エラーを呼び出し元に伝播させる
    }
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => { // asyncを追加
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const guests: Guest[] = [];

        lines.slice(1).forEach((line, index) => {
          // 空行や不正な行をスキップするロジックを強化
          const parts = line.split(',');
          if (parts.length < 3) {
              // カラム数が足りない場合はスキップ
              return;
          }
          const [name, inviter, community] = parts;

          if (name && name.trim()) {
            guests.push({
              couple_id: 1,
              guest_name: name.trim(),
              invited_by: inviter?.trim().toLowerCase() === '新婦' ? '新婦' : '新郎',
              community: community?.trim() || '未設定', // communityがundefinedになる可能性を考慮
            });
          }
        });

        if (guests.length > 0) {
          try {
            // バックエンドにデータを送信
            console.log('Uploading guests to backend:', guests);
            await uploadGuests(guests);

            // 成功した場合のみ、フロントエンドのステートを更新
            updateState({ guests: [...appState.guests, ...guests] });
            alert(`${guests.length}名のゲストを追加しました`);
          } catch (error) {
            alert(`ゲストの追加中にエラーが発生しました: ${
              typeof error === 'object' && error !== null && 'message' in error
                ? (error as { message: string }).message
                : String(error)
            }`);
          }
        } else {
          alert('有効なゲストデータが見つかりませんでした。');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleManualAdd = () => {
    if (guestName.trim()) {
      const newGuest: Guest = {
        couple_id: 1,
        guest_name: guestName.trim(),
        invited_by: invitedBy === '新郎' ? '新郎' : '新婦',
        community: '未設定'
      };
      updateState({ guests: [...appState.guests, newGuest] });
      setGuestName('');
      alert('ゲストを追加しました');
    }
  };

  // const removeGuest = (guestId: string) => {
  //   updateState({ guests: appState.guests.filter(g => g.id !== guestId) });
  // };

  return (
    <>
    <button 
      onClick={() => updateState({ currentScreen: 'couple-home' })}
    >
      戻る
    </button>
    <div className="center-container">
      <div className="mt-5" />
      <label className={styles.title_text}>
        ゲストを登録しましょう
      </label>
      <div className="mt-5" />
      <label>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          hidden
        />
        <div className={styles.register_option_button}>
          <span className={styles.register_option_text}>CSVでアップロードする→</span>
        </div>
      </label>
      <div className="mt-3" />
        <button
          className={styles.register_option_button}
        >
          <span className={styles.register_option_text}>手動で入力する→</span>
        </button>
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
        <h1 className="font-bold text-foreground">ゲスト登録</h1>
        <div className="w-12" />
      </div>
      
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-6">
          
          {!showManualInput ? (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-foreground">ゲストを登録しましょう</h2>
                <p className="text-sm text-muted-foreground">
                  CSVファイルまたは手動でゲストを追加できます
                </p>
              </div>

              <label className="block w-full p-6 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-accent transition-all cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
                <div className="text-center space-y-3">
                  <div>
                    <p className="font-medium text-foreground">CSVファイルをアップロード</p>
                    <p className="text-sm text-muted-foreground">クリックしてファイルを選択</p>
                  </div>
                </div>
              </label>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">または</span>
                </div>
              </div>

              <button
                onClick={() => setShowManualInput(true)}
                className="w-full p-4 bg-secondary border border-border rounded-xl hover:bg-accent transition-colors flex items-center justify-center gap-3"
              >
                <span className="font-medium text-foreground">手動で入力する</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground">ゲストを追加</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">ゲストのお名前</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="フルネームで入力"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-foreground">招待者</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="groom"
                        checked={invitedBy === 'groom'}
                        onChange={(e) => setInvitedBy(e.target.value as 'groom' | 'bride')}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">新郎側</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="bride"
                        checked={invitedBy === 'bride'}
                        onChange={(e) => setInvitedBy(e.target.value as 'groom' | 'bride')}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">新婦側</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleManualAdd}
                  disabled={!guestName.trim()}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    guestName.trim() 
                      ? 'bg-primary text-primary-foreground hover:shadow-card-hover' 
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  追加
                </button>
                <button
                  onClick={() => setShowManualInput(false)}
                  className="px-6 py-3 border border-border rounded-lg font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  戻る
                </button>
              </div>
            </div>
          )}

          {appState.guests.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">登録済みゲスト</h3>
                <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {appState.guests.length}名
                </span>
              </div>
              
              <div className="max-h-64 overflow-y-auto space-y-2">
                {appState.guests.map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{guest.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {guest.invitedBy === 'groom' ? '新郎側' : '新婦側'}
                      </p>
                    </div>
                    <button
                      onClick={() => removeGuest(guest.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      trash
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="h-[34px]" />
    </div>*/}
    </> 
  );
}
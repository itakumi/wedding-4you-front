import { AppState } from '../App';
import styles from './NameConflict.module.css'
import html2canvas from 'html2canvas';

interface ViewMessageProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function ViewMessage({ appState, updateState }: ViewMessageProps) {
  // デバイスがiOSかどうかを判定
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };

  // Canvas から Blob を生成
  const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas to blob conversion failed'));
        }
      }, 'image/png', 1.0);
    });
  };

  const downloadMessageCard = async () => {
    try {
      // メッセージカード部分の要素を取得
      const messageCardElement = document.getElementById('message-card-content');
      if (!messageCardElement) {
        alert('メッセージカードが見つかりません');
        return;
      }

      // メッセージカード部分のみをキャプチャ
      const canvas = await html2canvas(messageCardElement, {
        allowTaint: true,
        useCORS: true,
        background: '#ffffff',
        logging: false
      });
      console.log('Canvas created:', canvas);

      if (isIOS() && navigator.share) {
        // iOSでWeb Share APIが利用可能な場合
        try {
          const blob = await canvasToBlob(canvas);
          const file = new File([blob], `wedding-message-card-${new Date().getTime()}.png`, { type: 'image/png' });
          
          await navigator.share({
            files: [file],
            title: 'ウェディングメッセージカード',
            text: 'あなたへのメッセージカードです'
          });
          console.log('メッセージカードが共有されました');
        } catch (shareError) {
          console.log('Web Share API failed, falling back to download:', shareError);
          // Web Share APIが失敗した場合は従来の方法を使用
          fallbackDownload(canvas);
        }
      } else {
        // Web Share APIが利用できない場合は従来の方法
        fallbackDownload(canvas);
      }
    } catch (error) {
      console.error('メッセージカードの保存中にエラーが発生しました:', error);
      alert('メッセージカードの保存に失敗しました。再度お試しください。');
    }
  };

  // 従来のダウンロード方法
  const fallbackDownload = (canvas: HTMLCanvasElement) => {
    const imageDataUrl = canvas.toDataURL('image/png', 1.0);
    
    if (isIOS()) {
      // iOSの場合は新しいウィンドウで画像を表示（長押しで保存可能）
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>メッセージカード</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { margin: 0; padding: 20px; text-align: center; background: #f0f0f0; }
                img { max-width: 100%; height: auto; border: 1px solid #ddd; background: white; }
                .instruction { margin: 20px 0; font-family: Arial, sans-serif; color: #333; }
              </style>
            </head>
            <body>
              <div class="instruction">画像を長押しして「写真に保存」を選択してください</div>
              <img src="${imageDataUrl}" alt="ウェディングメッセージカード" />
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    } else {
      // デスクトップやAndroidの場合は通常のダウンロード
      const link = document.createElement('a');
      link.download = `wedding-message-card-${new Date().getTime()}.png`;
      link.href = imageDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    console.log('メッセージカードが保存されました');
  };
  return (
    <>
    <div className="center-container">
      <button onClick={downloadMessageCard}>
        {isIOS() ? 'メッセージカードを保存・共有' : 'メッセージカードを保存'}
      </button>
      <div className="mt-5" />
      <label className={styles.name_label}>
        あなたへのメッセージカード
      </label>
      <div className="mt-2" />
      <div id="message-card-content" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
        <img src={appState.message?.template_url} alt="Card Template" style={{ maxWidth: '100%', height: 'auto' }} />
        <br />
        {appState.message?.message_content}
        <br />
        {appState.message?.image_url && (
          <img src={appState.message?.image_url} alt="" style={{ maxWidth: '100%', height: 'auto' }} />
        )}
        <br />
      </div>
      {appState.message?.video_url && (
        <video 
          controls 
          style={{ maxWidth: '100%', height: 'auto' }}
          playsInline
          disablePictureInPicture
          webkit-playsinline="true"
        >
          <source src={appState.message.video_url} />
          お使いのブラウザは video タグをサポートしていません。
        </video>
      )}

    </div>
    </>
    );
}
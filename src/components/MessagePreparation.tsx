import React from 'react';
import { AppState } from '../App';
import styles from './MessagePreparation.module.css'
import { separateButtons } from '../utils/utils';

interface MessagePreparationProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function MessagePreparation({ appState, updateState }: MessagePreparationProps) {
  const templates = [
    {
      src: 'images/sample_template.png',
      action: () => updateState({ currentScreen: 'message-input', message: { template_url: 'images/sample_template.png', message_content: '' } }),
    },
    {
      src: 'images/sample_template.png',
      action: () => alert("clicked template!"),
    },
    {
      src: 'images/sample_template.png',
      action: () => alert("clicked template!"),
    },
    {
      src: 'images/sample_template.png',
      action: () => alert("clicked template!"),
    },
    {
      src: 'images/sample_template.png',
      action: () => alert("clicked template!"),
    }
  ];
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
        テンプレート選択
      </label>
      <div className='mt-5'/>
      <div className={styles.templates_area}>
        <React.Fragment key={'template-fragment'}>        
          {separateButtons(templates, 2).map((pair, idx) => (
            <div className={styles.template_row} key={idx} >
              {pair.map((template, index) => (
                <img className={styles.template} onClick={template.action} src={template.src} alt='template'/>
              ))}
            </div>
          ))}
        </ React.Fragment>
      </div>
    </div>
    </>
    );
}
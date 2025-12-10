'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        ready: () => void;
        expand: () => void;
        sendData: (data: string) => void;
        close: () => void;
      };
    };
  }
}

export default function Home() {
  const [text, setText] = useState('');
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      setIsTelegram(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      alert('Пожалуйста, введите текст');
      return;
    }

    if (isTelegram && window.Telegram?.WebApp) {
      // Отправка данных в бот через Telegram WebApp API
      window.Telegram.WebApp.sendData(JSON.stringify({ text }));
      setText('');
      alert('Сообщение отправлено в бот!');
    } else {
      // Для тестирования вне Telegram
      console.log('Text to send:', text);
      alert(`Текст для отправки: ${text}\n(В Telegram это будет отправлено в бот)`);
      setText('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>📱 Habit Tracker WebApp</h1>
        <p className={styles.description}>
          Введите текст, который будет отправлен в бот
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите ваш текст здесь..."
            rows={6}
            maxLength={1000}
          />
          
          <div className={styles.counter}>
            {text.length} / 1000
          </div>
          
          <button type="submit" className={styles.button}>
            Отправить в бот
          </button>
        </form>
        
        {!isTelegram && (
          <div className={styles.warning}>
            ⚠️ Откройте это приложение через Telegram бота для полной функциональности
          </div>
        )}
      </div>
    </div>
  );
}


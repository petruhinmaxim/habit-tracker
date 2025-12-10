// Telegram WebApp SDK placeholder
// In production, this should be loaded from https://telegram.org/js/telegram-web-app.js
// For development, we'll create a mock

if (typeof window !== 'undefined' && !window.Telegram) {
  window.Telegram = {
    WebApp: {
      initData: '',
      initDataUnsafe: {
        user: {
          id: 123456789,
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser',
        },
      },
      ready: () => console.log('Telegram WebApp ready'),
      expand: () => console.log('Telegram WebApp expanded'),
      sendData: (data) => {
        console.log('Telegram WebApp sendData:', data);
        // In development, we can simulate sending data
        if (window.parent !== window) {
          window.parent.postMessage({ type: 'webapp_data', data }, '*');
        }
      },
      close: () => console.log('Telegram WebApp close'),
    },
  };
}


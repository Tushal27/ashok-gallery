// src/

// Register the service worker for PWA support
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(reg => console.log('✅ Service Worker registered:', reg.scope))
        .catch(err => console.error('❌ Service Worker registration failed:', err));
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => registration.unregister())
      .catch(err => console.error(err));
  }
}
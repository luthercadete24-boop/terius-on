import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ignore WebSocket errors (HMR disabled in AI Studio) and ResizeObserver notifications
if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    const msg = String(e?.message || "");
    const src = String(e?.filename || "");
    if (
      msg.includes("ResizeObserver loop") ||
      msg.includes("WebSocket") ||
      msg.includes("createWebSocketModuleRunnerTransport") ||
      src.includes("@vite/client")
    ) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return true;
    }
  }, true);

  window.addEventListener("unhandledrejection", (e) => {
    const reasonStr = String(e?.reason?.message || e?.reason?.stack || e?.reason || "");
    if (
      reasonStr.includes("WebSocket") ||
      reasonStr.includes("createWebSocketModuleRunnerTransport") ||
      reasonStr.includes("@vite/client")
    ) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

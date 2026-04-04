import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WorkerProvider } from './context/WorkerContext'; // <-- Import it here

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Now the ENTIRE app is wrapped in the Context */}
    <WorkerProvider>
      <App />
    </WorkerProvider>
  </React.StrictMode>
);
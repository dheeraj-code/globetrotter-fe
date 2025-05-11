import React from 'react';
import App from './App';
import './main.css';

import '@ant-design/v5-patch-for-react-19';
import { unstableSetRender } from 'antd';
import { createRoot } from 'react-dom/client';

unstableSetRender((node, container) => {
  container._reactRoot ||= createRoot(container);
  const root = container._reactRoot;
  root.render(node);
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    root.unmount();
  };
});

const container = document.getElementById('root');
if (container) {
  // Render the app with Ant Design patch
  container._reactRoot ||= createRoot(container);
  container._reactRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

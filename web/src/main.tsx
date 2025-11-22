import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<h1 style="color: red">ERROR: Root element not found!</h1>';
  throw new Error('Root element not found');
}

console.log('Root element found:', rootElement);
console.log('Creating React root...');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

console.log('React app rendered');

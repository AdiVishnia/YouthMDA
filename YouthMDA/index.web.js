import { createRoot } from 'react-dom/client';
import { Platform } from 'react-native';
import App from './App';

// Register the app
if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  const root = createRoot(rootTag);
  root.render(<App />);
} 
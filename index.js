/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import { ThemeProvider } from './ThemeContext';  // Your theme provider
import {name as appName} from './app.json';


const Main = () => (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );

AppRegistry.registerComponent(appName, () => Main);

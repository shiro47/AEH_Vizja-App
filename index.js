/**
 * @format
 */

import {AppRegistry, useColorScheme} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {  DefaultTheme, MD3DarkTheme , PaperProvider } from 'react-native-paper';
import AuthProvider from './src/utils/AuthProvider';
import { enGB, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en-GB', enGB)

export default function Main() {
    const scheme = useColorScheme();
    return (
      <PaperProvider theme={scheme === 'dark' ? MD3DarkTheme : DefaultTheme}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PaperProvider>
    );
  }

AppRegistry.registerComponent(appName, () => Main);

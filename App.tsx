import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, useColorScheme, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import NavigationDrawer from './src/components/NavigationDrawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthContext } from './src/utils/AuthProvider';
import TimetableScreen from './src/screens/TimetableScreen';
import { ActivityIndicator } from 'react-native-paper';
import {DarkTheme, DefaultTheme} from '@react-navigation/native';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
  const { isAuthenticated, login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const scheme = useColorScheme();

  const backgroundStyle = {
    flex: 1,
  };

  useEffect(() => {
    const handleLogin = async () => {
      try {
        setIsLoading(true); 
        await login(); 
      } catch (error) {
        console.error('Error logging in:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    if (!isAuthenticated) {
      handleLogin();
    }
  }, [])

  return (
    <SafeAreaView style={backgroundStyle}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        {isLoading ? ( // Display the activity indicator when isLoading is true
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <Drawer.Navigator drawerContent={(props) => <NavigationDrawer {...props} />}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Timetable" component={TimetableScreen} />
          </Drawer.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;

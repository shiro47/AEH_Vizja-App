import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Checkbox, ActivityIndicator, Snackbar } from 'react-native-paper';
import { AuthContext } from '../utils/AuthProvider';
import * as Keychain from "react-native-keychain";

const LoginScreen = (props: any) => {
  const [Login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const { login } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);
  const { navigation } = props
  const [isLoading, setIsLoading] = useState(false);
  const navigateToScreen = (screenName: string) => {
    navigation.navigate(screenName);
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const loginResult = await login(Login, password);
      if (!loginResult){
        throw new Error('Invalid login or password.')
      }
      if (checked) {
        await Keychain.setGenericPassword(Login, password);
      }
      console.log('Login attempt with:', Login, password);
      navigateToScreen('Home');
    } catch (error) {
      setErrorMessage('Invalid login or password. Please try again.');
      setVisible(true);
      console.error('Error logging in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View>
        <View style={styles.logoContainer}>
          <Image
            style={styles.AEHlogo}
            source={{
              uri: 'https://rekrutacja.vizja.pl/img/default/aeh/logo_pl_PL.png',
            }}
          />
        </View>
        <View style={styles.container}>
          <TextInput
            label="Login"
            value={Login}
            onChangeText={(text) => setLogin(text)}
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
          />
          <Checkbox.Item
            label="Stay logged in"
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(!checked);
            }}
          />
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button mode="contained" onPress={handleLogin} style={styles.button}>
              Login
            </Button>)}
          <Snackbar
            visible={visible}
            onDismiss={() => setVisible(false)}
            action={{
              label: 'Close',
              onPress: () => {
                setVisible(false);
              },
            }}
          >
            {errorMessage}
          </Snackbar>
        </View>
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
  },
  button: {
    width: '100%',
    marginTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  AEHlogo: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
  },
});

export default LoginScreen;

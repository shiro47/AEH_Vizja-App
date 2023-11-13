import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as Keychain from "react-native-keychain";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (login?: string, password?: string) => void;
    logout: () => void;
    phpsessid: string | null;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
    phpsessid: null,
});

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [phpsessid, setPhpsessid] = useState<string | null>(null);

    const get_phpsessid = async () => {
        try {
            const response = await fetch('https://extranet.vizja.net/', {
                method: 'GET',
                credentials: 'omit'
            });
            const cookies = response.headers.get('set-cookie');
            if (cookies) {
                const phpsessid = cookies.split(';')[0];
                if (phpsessid) {
                    setPhpsessid(phpsessid)
                    console.log('phpsessid:', phpsessid);
                    return phpsessid
                } else {
                    throw new Error("Error fetching phpsessid");
                }
            } else {
                throw new Error("Error fetching cookies");

            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const login = async (login = '', password = '') => {
        try {
          const phpsessid = await get_phpsessid();
          if (!phpsessid) {
            throw new Error('No phpsessid found.');
          }
      
          let savedCredentials = await Keychain.getGenericPassword();
          if (savedCredentials) {
            login = savedCredentials.username;
            password = savedCredentials.password;
          } else if (!login || !password) {
            throw new Error('No saved credentials or provided login/password.');
          }
      
          const loginData = new URLSearchParams();
          loginData.append('login', login);
          loginData.append('haslo', password);
          loginData.append('submit', '');
      
          const headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          headers.append('Cookie', phpsessid);
      
          const loginResponse = await fetch('https://extranet.vizja.net/', {
            method: 'POST',
            credentials: 'include',
            headers: headers,
            body: loginData.toString(),
          });
      
          if (loginResponse.ok) {
            const responseText = await loginResponse.text();
            const pattern = /<span style="color:\s*red;">\s*Nieprawidłowy login lub hasło\s*<\/span>/i;
            if (pattern.test(responseText)) {
              throw new Error('Invalid login or password.');
            }
            setIsAuthenticated(true);
            console.log('Login successful with', phpsessid);
            return true;
          } else {
            console.error('Login request failed with status:', loginResponse.status);
            return false; 
          }
        } catch (error) {
          console.error('Error logging in:', error);
          return false; 
        }
      };
      
    const logout = async () => {
        try {
            if (!phpsessid){
                throw new Error('No phpsessid to logout')
            }
            const headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            headers.append('Cookie', phpsessid);

            const response = await fetch('https://extranet.vizja.net/index/wyloguj', {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                setPhpsessid(null)
                setIsAuthenticated(false)
                await Keychain.resetGenericPassword()
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         login();
    //     } 
    // }, [phpsessid]);

    return <AuthContext.Provider value={{ isAuthenticated, login, logout, phpsessid }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

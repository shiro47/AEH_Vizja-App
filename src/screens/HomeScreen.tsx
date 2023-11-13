import React, {useContext} from 'react';
import { View, StyleSheet} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { AuthContext } from '../utils/AuthProvider';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const {isAuthenticated, logout} = useContext(AuthContext)

    const navigateToScreen = (screenName: keyof RootStackParamList) => {
        navigation.navigate(screenName);
      };

    return (
        <>
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to the AEH Vizja</Text>
            {isAuthenticated ? (<Button mode="contained" onPress={() => logout()} style={styles.button}>
                Logout
            </Button>): (<Button mode="contained" onPress={() => navigateToScreen('Login')} style={styles.button}>
                Go to Login
            </Button>)}
        </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        width: '50%',
        marginTop: 10,
    },
});

export default HomeScreen;

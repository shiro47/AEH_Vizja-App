import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer, IconButton } from 'react-native-paper';
import { AuthContext } from '../utils/AuthProvider';


const NavigationDrawer = (props: any) => {
    const { navigation } = props
    const { isAuthenticated, logout } = React.useContext(AuthContext);
    const navigateToScreen = (screenName: string) => {
        navigation.navigate(screenName);
    };

    const handleLogout = async () => {
        await logout();
        navigateToScreen('Home');
    };
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.logoContainer}>
                    <Image style={styles.AEHlogo} source={{ uri: "https://rekrutacja.vizja.pl/img/default/aeh/logo_pl_PL.png" }} />
                </View>
                <Drawer.Section>
                    <Drawer.Item label="Home" onPress={() => { navigateToScreen('Home') }} />
                    {isAuthenticated ?
                        (<Drawer.Item label="Timetable" onPress={() => { navigateToScreen('Timetable') }} />) :
                        (<Drawer.Item label="Login" onPress={() => { navigateToScreen('Login') }} />)}


                </Drawer.Section>

            </DrawerContentScrollView>
            <View style={styles.logoutContainer}>
                {isAuthenticated ?
                    (<IconButton icon="logout" size={20} onPress={handleLogout} />) :
                    (<></>)}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    AEHlogo: {
        width: 150,
        height: 50,
        resizeMode: 'contain',
    },
    logoutContainer: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: 10,
    },
});

export default NavigationDrawer;

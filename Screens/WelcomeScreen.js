import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const backgroundImage = require('../Images/mdawelcome.jpg');
const WelcomeScreen = ({ navigation }) => {
    return (
        <ImageBackground 
            source={backgroundImage}
            style={styles.background}
            blurRadius={2} // Reduced blur radius for less blur
        >
            <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.container}
            >
                <Image 
                    source={require('../Images/mda-noar (1).png')}
                    style={[styles.logo, { width: 200, height: 200 }]} // Increased size of the logo
                    resizeMode="contain"
                />
                
                <Text style={styles.welcomeText}>ברוכים הבאים למד״א נוער!</Text>
                <Text style={styles.subText}>הצטרפו אלינו להצלת חיים</Text>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity 
                        style={[styles.button, styles.signUpButton]}
                        onPress={() => navigation.navigate('הרשמה')}
                    >
                        <Text style={styles.buttonText}>הרשמה</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.button, styles.loginButton]}
                        onPress={() => navigation.navigate('התחברות')}
                    >
                        <Text style={[styles.buttonText, styles.loginText]}>התחברות</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerText}>מגן דוד אדום</Text>
            </LinearGradient>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#E32017',
        marginBottom: 10,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subText: {
        fontSize: 18,
        color: '#444',
        marginBottom: 40,
        textAlign: 'center',
    },
    buttonsContainer: {
        width: '100%',
        paddingHorizontal: 30,
        gap: 15,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    signUpButton: {
        backgroundColor: '#E32017',
    },
    loginButton: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#E32017',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginText: {
        color: '#E32017',
    },
    footerText: {
        position: 'absolute',
        bottom: 20,
        color: '#666',
        fontSize: 16,
    },
});

export default WelcomeScreen;
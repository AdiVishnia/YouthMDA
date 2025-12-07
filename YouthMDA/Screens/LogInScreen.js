import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ImageBackground, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../Firebase/Config';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User logged in:', user);
            setError('');
            setSuccessMessage('התחברת בהצלחה!');
            setEmail('');
            setPassword('');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });
        } catch (error) {
            console.error('Error logging in:', error);
            if (error.code === 'auth/invalid-credential') {
                setError('שגיאה: אימייל או סיסמה לא נכונים');
            } else {
                setError('שגיאה בהתחברות. אנא נסה שנית');
            }
            setSuccessMessage('');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.background}>
                <ImageBackground 
                    source={require('../Images/AmbulanceBackround.jpg')}
                    style={styles.background}
                    blurRadius={3}
                >
                    <LinearGradient
                        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                        style={styles.container}
                    >
                        <Image 
                            source={require('../Images/mda-noar (1).png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        
                        <Text style={styles.title}>ברוכים השבים!</Text>
                        <Text style={styles.subtitle}>התחברו כדי להמשיך</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="אימייל"
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                                keyboardType="email-address"
                                placeholderTextColor="#666"
                            />
                            <TextInput
                                placeholder="סיסמה"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={styles.input}
                                placeholderTextColor="#666"
                            />
                        </View>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

                        <TouchableOpacity 
                            style={styles.loginButton}
                            onPress={handleLogin}
                        >
                            <Text style={styles.loginButtonText}>התחברות</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.signUpLink}
                            onPress={() => navigation.navigate('הרשמה')}
                        >
                            <Text style={styles.signUpText}>אין לך חשבון? הירשם עכשיו</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#E32017',
        marginBottom: 10,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        fontSize: 18,
        color: '#444',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'white',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        textAlign: 'right',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    loginButton: {
        backgroundColor: '#E32017',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#E32017',
        backgroundColor: 'rgba(227, 32, 23, 0.1)',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 14,
        fontWeight: '500',
    },
    successText: {
        color: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 14,
        fontWeight: '500',
    },
    signUpLink: {
        marginTop: 20,
    },
    signUpText: {
        color: '#E32017',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    ImageBackground 
} from 'react-native';
import { updatePassword } from 'firebase/auth';
import { auth } from '../Firebase/Config';
import { LinearGradient } from 'expo-linear-gradient';

const ChangePassword = ({ navigation }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = async () => {
        if (newPassword.length < 6) {
            setError('הסיסמה חייבת להכיל לפחות 6 תווים');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('הסיסמאות אינן תואמות');
            return;
        }

        try {
            await updatePassword(auth.currentUser, newPassword);
            Alert.alert(
                'הצלחה',
                'הסיסמה שונתה בהצלחה',
                [{ text: 'אישור', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            console.error('Error updating password:', error);
            setError('אירעה שגיאה בשינוי הסיסמה. אנא נסה שוב מאוחר יותר');
        }
    };

    return (
        <ImageBackground 
            source={require('../Images/AmbulanceBackround.jpg')}
            style={styles.background}
            blurRadius={3}
        >
            <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.container}
            >
                <View style={styles.formContainer}>
                    <Text style={styles.title}>שינוי סיסמה</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="סיסמה חדשה"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        placeholderTextColor="#666"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="אימות סיסמה חדשה"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholderTextColor="#666"
                    />

                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : null}

                    <TouchableOpacity 
                        style={styles.button}
                        onPress={handlePasswordChange}
                    >
                        <Text style={styles.buttonText}>עדכן סיסמה</Text>
                    </TouchableOpacity>
                </View>
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
        padding: 20,
        justifyContent: 'center',
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E32017',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        textAlign: 'right',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    button: {
        backgroundColor: '#E32017',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#E32017',
        backgroundColor: 'rgba(227, 32, 23, 0.1)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default ChangePassword; 
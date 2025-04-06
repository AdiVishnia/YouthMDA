import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    Switch, 
    StyleSheet, 
    ImageBackground,
    Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const NotificationSettings = () => {
    const [streakReminders, setStreakReminders] = useState(true);
    const [fridayThanks, setFridayThanks] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const streakSetting = await AsyncStorage.getItem('streakReminders');
            const fridaySetting = await AsyncStorage.getItem('fridayThanks');
            
            setStreakReminders(streakSetting === null ? true : streakSetting === 'true');
            setFridayThanks(fridaySetting === null ? true : fridaySetting === 'true');
        } catch (error) {
            console.error('Error loading notification settings:', error);
        }
    };

    const handleStreakToggle = async (value) => {
        try {
            await AsyncStorage.setItem('streakReminders', value.toString());
            setStreakReminders(value);
            Alert.alert(
                'הגדרות עודכנו',
                value ? 'תקבל תזכורות על הרצף שלך' : 'לא תקבל תזכורות על הרצף שלך'
            );
        } catch (error) {
            console.error('Error saving streak setting:', error);
        }
    };

    const handleFridayToggle = async (value) => {
        try {
            await AsyncStorage.setItem('fridayThanks', value.toString());
            setFridayThanks(value);
            Alert.alert(
                'הגדרות עודכנו',
                value ? 'תקבל הודעות תודה בימי שישי' : 'לא תקבל הודעות תודה בימי שישי'
            );
        } catch (error) {
            console.error('Error saving Friday setting:', error);
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
                <View style={styles.settingsContainer}>
                    <Text style={styles.title}>הגדרות התראות</Text>

                    <View style={styles.settingCard}>
                        <View style={styles.settingRow}>
                            <Switch
                                value={streakReminders}
                                onValueChange={handleStreakToggle}
                                trackColor={{ false: "#767577", true: "#E32017" }}
                                thumbColor={streakReminders ? "#fff" : "#f4f3f4"}
                            />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingTitle}>תזכורות רצף</Text>
                                <Text style={styles.settingDescription}>
                                    קבל התראה כשהרצף שלך בסכנה
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.settingCard}>
                        <View style={styles.settingRow}>
                            <Switch
                                value={fridayThanks}
                                onValueChange={handleFridayToggle}
                                trackColor={{ false: "#767577", true: "#E32017" }}
                                thumbColor={fridayThanks ? "#fff" : "#f4f3f4"}
                            />
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingTitle}>הודעות תודה</Text>
                                <Text style={styles.settingDescription}>
                                    קבל הודעת תודה בכל יום שישי
                                </Text>
                            </View>
                        </View>
                    </View>
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
    },
    settingsContainer: {
        flex: 1,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E32017',
        marginBottom: 20,
        textAlign: 'center',
    },
    settingCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingTextContainer: {
        flex: 1,
        marginRight: 15,
        alignItems: 'flex-end',
    },
    settingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    settingDescription: {
        fontSize: 14,
        color: '#666',
    },
});

export default NotificationSettings; 
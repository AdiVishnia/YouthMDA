import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../Firebase/Config';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import NotificationService from './Notification';
import * as Notifications from 'expo-notifications';

const StreakScreen = () => {
    const [currentStreak, setCurrentStreak] = useState(0);
    const [highestStreak, setHighestStreak] = useState(0);
    const [lastShiftDate, setLastShiftDate] = useState(null);
    const [shiftDay, setShiftDay] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [completedMessage, setCompletedMessage] = useState('');

    // Fetch user's streak data when component mounts       
    useEffect(() => {
        fetchStreakData();
    }, []);

    // Check for streak break every time the component mounts
    useEffect(() => {
        checkStreakBreak();
    }, [lastShiftDate]);

    useEffect(() => {
        // Set up notifications
        NotificationService.setNotificationHandler();
        NotificationService.registerForPushNotificationsAsync();
        NotificationService.scheduleFridayThankYou();
        
        // Set up notification listener
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            console.log(notification);
        });

        return () => {
            notificationListener.remove();
        };
    }, []);

    const fetchStreakData = async () => {
        try {
            const userId = auth.currentUser.uid;
            const userDoc = await getDoc(doc(db, 'users', userId));
            
            if (userDoc.exists()) {
                const data = userDoc.data();
                setCurrentStreak(data.currentStreak || 0);
                setHighestStreak(data.highestStreak || 0);
                setLastShiftDate(data.lastShiftDate || null);
                setShiftDay(data.shiftDay || '');
                checkButtonAvailability(data.lastShiftDate, data.shiftDay);
                
                // Schedule streak reminder if there's a last shift date
                if (data.lastShiftDate) {
                    NotificationService.scheduleStreakReminder(data.lastShiftDate);
                }
            }
        } catch (error) {
            console.error('Error fetching streak data:', error);
        }
    };

    const checkStreakBreak = () => {
        if (!lastShiftDate) return;

        const lastShift = new Date(lastShiftDate);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - lastShift);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If more than 7 days have passed, reset streak
        if (diffDays > 7) {
            resetStreak();
        }
    };

    const resetStreak = async () => {
        try {
            const userId = auth.currentUser.uid;
            await updateDoc(doc(db, 'users', userId), {
                currentStreak: 0,
                lastShiftDate: new Date().toISOString()
            });
            setCurrentStreak(0);
        } catch (error) {
            console.error('Error resetting streak:', error);
        }
    };

    const getTodayName = () => {
        const today = new Date();
        const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
        return dayNames[today.getDay()];
    };

    const checkButtonAvailability = (lastDate, userShiftDay) => {
        const today = new Date();
        const currentDayName = getTodayName();

        // Check if already completed shift this week
        if (lastDate) {
            const lastPress = new Date(lastDate);
            const diffTime = Math.abs(today - lastPress);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // If less than 7 days have passed since last shift
            if (diffDays < 7) {
                setButtonDisabled(true);
                setCompletedMessage('ביצעת את המשמרת השבועית שלך, כל הכבוד!');
                return;
            }
        }

        // If shiftDay is "אין", enable button regardless of day
        if (userShiftDay === 'אין') {
            setButtonDisabled(false);
            setCompletedMessage('');
            return;
        }

        // For specific shift days, check if today matches
        if (currentDayName !== userShiftDay) {
            setButtonDisabled(true);
            setCompletedMessage(''); // Clear message if it's not shift day
            return;
        }

        setButtonDisabled(false);
        setCompletedMessage('');
    };

    const handleShiftComplete = async () => {
        try {
            const currentDayName = getTodayName();
            const today = new Date();

            // Check if already completed shift this week
            if (lastShiftDate) {
                const lastPress = new Date(lastShiftDate);
                const diffTime = Math.abs(today - lastPress);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays < 7) {
                    alert('כבר ביצעת את המשמרת השבועית שלך!');
                    return;
                }
            }

            // Check shift day only if it's not "אין"
            if (shiftDay !== 'אין' && currentDayName !== shiftDay) {
                alert('היום לא יום המשמרת שלך!');
                return;
            }

            const userId = auth.currentUser.uid;
            const newStreak = currentStreak + 1;
            const newHighestStreak = Math.max(newStreak, highestStreak);
            
            // Update Firestore
            await updateDoc(doc(db, 'users', userId), {
                currentStreak: newStreak,
                highestStreak: newHighestStreak,
                lastShiftDate: today.toISOString()
            });

            // Update local state
            setCurrentStreak(newStreak);
            setHighestStreak(newHighestStreak);
            setLastShiftDate(today.toISOString());
            setButtonDisabled(true);
            setCompletedMessage('ביצעת את המשמרת השבועית שלך, כל הכבוד!');
            
        } catch (error) {
            console.error('Error updating streak:', error);
            alert('שגיאה בעת רישום המשמרת');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.shiftDayTitle}>יום משמרת: {shiftDay}</Text>
            
            <View style={styles.streakContainer}>
                <Text style={styles.streakTitle}>רצף משמרות שבועי</Text>
                <Text style={styles.streakNumber}>{currentStreak}</Text>
                <Text style={styles.streakSubtitle}>משמרות ברצף</Text>
            </View>

            <View style={styles.highestStreakContainer}>
                <Text style={styles.highestStreakTitle}>שיא אישי</Text>
                <Text style={styles.highestStreakNumber}>{highestStreak}</Text>
                <Text style={styles.streakSubtitle}>משמרות ברצף</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[
                        styles.button,
                        buttonDisabled && styles.buttonDisabled
                    ]}
                    onPress={handleShiftComplete}
                    disabled={buttonDisabled}
                >
                    <Text style={[
                        styles.buttonText,
                        buttonDisabled && styles.buttonTextDisabled
                    ]}>
                        סיימתי משמרת
                    </Text>
                </TouchableOpacity>
                
                {completedMessage ? (
                    <Text style={styles.completedMessage}>
                        {completedMessage}
                    </Text>
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    streakContainer: {
        alignItems: 'center',
        marginBottom: 40,
        backgroundColor: '#f8f8f8',
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
    streakTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    streakNumber: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ff1744', // MDA Red color
        marginBottom: 5,
    },
    streakSubtitle: {
        fontSize: 16,
        color: '#666',
    },
    highestStreakContainer: {
        alignItems: 'center',
        marginBottom: 40,
        backgroundColor: '#fff3f3',
        padding: 20,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#ff1744',
    },
    highestStreakTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ff1744',
        marginBottom: 10,
    },
    highestStreakNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ff1744',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#ff1744',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
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
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    shiftDayTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
        opacity: 0.7,
    },
    buttonTextDisabled: {
        color: '#666666',
    },
    buttonContainer: {
        alignItems: 'center',
        width: '100%',
    },
    completedMessage: {
        color: '#ff1744',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default StreakScreen;

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

class NotificationService {
    static async registerForPushNotificationsAsync() {
        let token;
        
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
            alert('נכשל בקבלת אישור להתראות!');
            return;
        }

        // Requesting token for iOS
        if (Platform.OS === 'ios') {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            
            if (finalStatus !== 'granted') {
                alert('נכשל בקבלת אישור להתראות!');
                return;
            }
        }

        // Get the token that uniquely identifies this device
        token = await Notifications.getExpoPushTokenAsync();
        console.log('Expo push token:', token);

        return token;
    }

    static async scheduleStreakReminder(lastShiftDate) {
        try {
            const lastShift = new Date(lastShiftDate);
            const warningDate = new Date(lastShift);
            warningDate.setDate(warningDate.getDate() + 6); // Notify 1 day before streak break
            
            // Cancel existing streak notifications
            await this.cancelStreakNotifications();
            
            // Schedule new reminder
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "⚠️ תזכורת חשובה",
                    body: "נותר לך יום אחד לשמור על רצף המשמרות שלך! אל תשכח להשלים את המשמרת מחר",
                    sound: true,
                    priority: 'high',
                },
                trigger: {
                    date: warningDate,
                },
            });
        } catch (error) {
            console.error('Error scheduling streak reminder:', error);
        }
    }

    static async scheduleFridayThankYou() {
        try {
            // Get next Friday
            const now = new Date();
            const nextFriday = new Date();
            nextFriday.setDate(now.getDate() + ((5 + 7 - now.getDay()) % 7));
            nextFriday.setHours(16, 0, 0, 0); // Set to 18:30

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "❤️ תודה רבה!",
                    body: "תודה על התנדבותך השבוע במד״א. אתה עושה עבודת קודש!",
                    sound: true,
                    priority: 'high',
                },
                trigger: {
                    date: nextFriday,
                    repeats: true,
                    weekday: 5, // Friday
                },
            });
        } catch (error) {
            console.error('Error scheduling Friday thank you:', error);
        }
    }

    static async cancelStreakNotifications() {
        try {
            const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
            const streakNotifications = scheduledNotifications.filter(
                notification => notification.content.title.includes('תזכורת')
            );
            
            for (const notification of streakNotifications) {
                await Notifications.cancelScheduledNotificationAsync(notification.identifier);
            }
        } catch (error) {
            console.error('Error canceling streak notifications:', error);
        }
    }

    static async cancelAllNotifications() {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
        } catch (error) {
            console.error('Error canceling all notifications:', error);
        }
    }

    static setNotificationHandler() {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });
    }
}

export default NotificationService;

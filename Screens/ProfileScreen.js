import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet, ImageBackground, Platform, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, getUserData } from '../Firebase/Config';
import { updatePassword } from 'firebase/auth';

//נמצא בספר פרוייקט
const One = ({ children }) => {
    return (
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            {children}
        </Text>
    );
};

const Two = ({ children }) => {
    return (
        <Text style={{ fontSize: 20, fontWeight: 'normal' }}>
            {children}
        </Text>
    );
};

function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const { uid, email } = user; // Added email to the destructured properties
          const userDataFromFirestore = await getUserData(uid); 
          setUserData({ ...userDataFromFirestore, uid, email }); // Added email to the state
        } else {
          console.log('No user is signed in');
          setIsSignedIn(false); 
        }
      } catch (error) {
        console.error('Error fetching user data for user ID:', user?.uid, error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { userData });
  };

  const handleChangePassword = () => {
    Alert.alert(
      "שינוי סיסמה",
      "האם אתה בטוח שברצונך לשנות את הסיסמה?",
      [
        {
          text: "ביטול",
          style: "cancel"
        },
        {
          text: "אישור",
          onPress: () => navigation.navigate('ChangePassword')
        }
      ]
    );
  };

  const handleNotificationSettings = () => {
    navigation.navigate('NotificationSettings');
  };

  if (!isSignedIn) {
    return (
      <ImageBackground
        source={require('../Images/AmbulanceBackround.jpg')}
        style={styles.backgroundImage}
        blurRadius={3}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
          style={styles.container}
        >
          <Text style={styles.errorMessage}>עליך להתחבר כדי לגשת לדף זה.</Text>
        </LinearGradient>
      </ImageBackground>
    );
  }

  if (!userData) {
    return (
      <ImageBackground
      source={require('../Images/AmbulanceBackround.jpg')}
        style={styles.backgroundImage}
        blurRadius={3}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
          style={styles.container}
        >
          <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
            <Text style={styles.loadingText}>טוען...</Text>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  const isUserDataIncomplete = !userData.username || !userData.age || !userData.gender || 
    !userData.volunteeringTime || !userData.station || !userData.shiftDay || 
    !userData.name || !userData.surname;



  return (
    <ImageBackground
    source={require('../Images/AmbulanceBackround.jpg')}
      style={styles.backgroundImage}
      blurRadius={3}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>

            <Text style={styles.title}>הפרופיל שלי</Text>
            <Image
              source={require('../Images/mda-noar-blackwhitenew.png')}
              style={styles.logo}
            />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>חשבון</Text>
              <View style={styles.card}>
                <Text style={styles.infoText}>שם משתמש: {userData.username}</Text>
                <Text style={styles.infoText}>אימייל: {userData.email}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>פרטים אישיים</Text>
              <View style={styles.card}>
                <Text style={styles.infoText}>שם פרטי: {userData.name}</Text>
                <Text style={styles.infoText}>שם משפחה: {userData.surname}</Text>
                <Text style={styles.infoText}>גיל: {userData.age}</Text>
                <Text style={styles.infoText}>מין: {userData.gender}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>פרטי התנדבות</Text>
              <View style={styles.card}>
                <Text style={styles.infoText}>הכשרה: מע"ר</Text>
                <Text style={styles.infoText}>שנות התנדבות: {userData.volunteeringTime}</Text>
                <Text style={styles.infoText}>תחנה: {userData.station}</Text>
                <Text style={styles.infoText}>יום משמרת: {userData.shiftDay}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>הגדרות</Text>
              <View style={styles.settingsContainer}>
                <TouchableOpacity 
                  style={styles.settingButton}
                  onPress={handleEditProfile}
                >
                  <Text style={styles.settingButtonText}>עריכת פרופיל</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.settingButton}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.settingButtonText}>שינוי סיסמה</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.settingButton}
                  onPress={handleNotificationSettings}
                >
                  <Text style={styles.settingButtonText}>העדפות התראות</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E32017',
    marginTop: 60,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'right',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  errorMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E32017',
    textAlign: 'center',
    backgroundColor: 'rgba(227, 32, 23, 0.1)',
    padding: 15,
    borderRadius: 12,
    margin: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#E32017',
    fontWeight: 'bold',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  settingsContainer: {
    width: '100%',
    gap: 10,
  },
  settingButton: {
    backgroundColor: '#E32017',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;

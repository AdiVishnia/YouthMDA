
import React from 'react';
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainScreen from './Screens/MainScreen';
import CheckScreen from './Screens/CheckScreen';
import VitalSignsScreen from "./Screens/VitalSignsScreen";
import VitalSignsTableScreen from "./Screens/VitalSignsTableScreen";
import WelcomeScreen from "./Screens/WelcomeScreen";
import SignUpScreen from "./Screens/SignUpScreen";
import LogInScreen from './Screens/LogInScreen';
import MyDataScreen from './Screens/MyDataScreen';
import ProfileScreen from './Screens/ProfileScreen';
import ChatScreen from './Screens/ChatScreen';
import MyStreakScreen from './Screens/MyStreakScreen';
import StoreScreen from './Screens/StoreScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import LoadingScreen from './Screens/LoadingScreen';
import Timer from './Screens/TimerScreen';
import MetronomeScreen from './Screens/MetronomeScreen';
import EditProfile from './Screens/EditProfile';
import ChangePassword from './Screens/ChangePassword';
import NotificationSettings from './Screens/NotificationSettings';
//נמצא בספר פרוייקט
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught in ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <Text>Something went wrong.</Text>; // Display error message
        }

        return this.props.children; // Render child components
    }
}

function MyDrawer() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="מסך ראשי" component={MainScreen} />
            <Drawer.Screen name="בדיקת אמבולנס" component={CheckScreen} />
            <Drawer.Screen name="מדדים של מטופל" component={VitalSignsScreen} />
            <Drawer.Screen name="טבלת מדדים תקינים" component={VitalSignsTableScreen} />
            <Drawer.Screen name="YouthMDA-AI" component={ChatScreen} />
        </Drawer.Navigator>
    );
}

export default function App() {
    return (
      <ErrorBoundary>
          <NavigationContainer>
              <Stack.Navigator initialRouteName="Loading" screenOptions={{
                  headerStyle: {
                      backgroundColor: '#ff0000',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                      fontWeight: 'bold',
                  },
              }}>
                  <Stack.Screen 
                      name="Loading" 
                      component={LoadingScreen} 
                      options={{ title: 'מדא-נוער' }}
                  />
                  <Stack.Screen 
                      name="WelcomeScreen" 
                      component={WelcomeScreen} 
                      options={{ title: 'מדא-נוער' }}
                  />
                  <Stack.Screen 
                      name="Main" 
                      component={MyDrawer} 
                      options={{ title: 'מדא-נוער' }}
                  />

                  <Stack.Screen name="Welcome" component={WelcomeScreen} />
                  <Stack.Screen name="התחברות" component={LogInScreen} />
                  <Stack.Screen name="הרשמה" component={SignUpScreen} />
                  <Stack.Screen name="הרצף שלי" component={MyStreakScreen} options={{ headerShown: true }} />
                  <Stack.Screen name="טיימר" component={Timer} options={{ headerShown: true }} />
                  <Stack.Screen name="הפרופיל שלי" component={ProfileScreen} options={{ headerShown: true }} />
                  <Stack.Screen name="חנות מדא" component={StoreScreen} options={{ headerShown: true }} />
                  <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: 'עריכת פרופיל' }} />
                  <Stack.Screen 
                      name="ChangePassword" 
                      component={ChangePassword} 
                      options={{ 
                          title: 'שינוי סיסמה',
                          headerTitleAlign: 'center',
                          headerTitleStyle: {
                              color: '#E32017',
                          },
                      }} 
                  />
                  <Stack.Screen 
                      name="NotificationSettings" 
                      component={NotificationSettings}
                      options={{ 
                          title: 'הגדרות התראות',
                          headerTitleAlign: 'center',
                          headerTitleStyle: {
                              color: '#E32017',
                          },
                      }} 
                  />
                  <Stack.Screen 
                      name="Metronome" 
                      component={MetronomeScreen}
                      options={{
                          title: 'מטרונום',
                          headerTitleAlign: 'center',
                      }}
                  />
              </Stack.Navigator>
          </NavigationContainer>
      </ErrorBoundary>
    );
}
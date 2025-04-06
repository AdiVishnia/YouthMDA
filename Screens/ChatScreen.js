import React, { useState, useCallback, useEffect } from 'react'
import { 
    GiftedChat, 
    Bubble,
    InputToolbar,
    Send
} from 'react-native-gifted-chat';
import { 
    Alert, 
    View, 
    Text, 
    StyleSheet, 
    ImageBackground, 
    Platform,
    SafeAreaView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import uuid from 'react-native-uuid';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
import Markdown from 'react-native-markdown-display';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Rate limiting configuration
const RATE_LIMIT_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 1 week
const MAX_REQUESTS_PER_WEEK = 10;
const QUOTA_RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

const API_URL = "https://api.openai.com/v1/chat/completions";

export function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);

  // Check quota status on component mount
  useEffect(() => {
    checkQuotaStatus();
  }, []);

  const checkQuotaStatus = async () => {
    try {
      const quotaExceeded = await AsyncStorage.getItem('quotaExceeded');
      const quotaResetTime = await AsyncStorage.getItem('quotaResetTime');
      
      if (quotaExceeded === 'true' && quotaResetTime) {
        const resetTime = parseInt(quotaResetTime);
        if (Date.now() < resetTime) {
          setIsQuotaExceeded(true);
          return true;
        } else {
          // Reset quota status if time has passed
          await AsyncStorage.multiSet([
            ['quotaExceeded', 'false'],
            ['quotaResetTime', '0']
          ]);
          setIsQuotaExceeded(false);
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking quota status:', error);
      return false;
    }
  };

  const handleRateLimit = async () => {
    try {
      const currentTime = Date.now();
      const requestTimes = JSON.parse(await AsyncStorage.getItem('requestTimes') || '[]');
      
      // Remove requests older than 1 week
      const recentRequests = requestTimes.filter(time => 
        currentTime - time < RATE_LIMIT_INTERVAL
      );

      if (recentRequests.length >= MAX_REQUESTS_PER_WEEK) {
        Alert.alert(
          "Rate Limit Reached",
          "Please wait a week before sending more messages.",
          [{ text: "OK" }]
        );
        return false;
      }

      // Add current request time
      recentRequests.push(currentTime);
      await AsyncStorage.setItem('requestTimes', JSON.stringify(recentRequests));
      return true;
    } catch (error) {
      console.error('Error handling rate limit:', error);
      return false;
    }
  };

  const handleQuotaExceeded = async () => {
    try {
      const resetTime = Date.now() + QUOTA_RESET_INTERVAL;
      await AsyncStorage.multiSet([
        ['quotaExceeded', 'true'],
        ['quotaResetTime', resetTime.toString()]
      ]);
      setIsQuotaExceeded(true);
      
      Alert.alert(
        "API Quota Exceeded",
        "You've exceeded your API quota. Please try again in 24 hours.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Error handling quota exceeded:', error);
    }
  };

  const getFallbackResponse = (userMessage) => {
    return "I apologize, but I'm currently unable to process your request due to API limitations. Please try again later or contact support for assistance.";
  };

  const processMessage = async (userMessage) => {
    if (!apiAvailable) {
        const fallbackMessage = {
            _id: uuid.v4(),
            text: getFallbackResponse(userMessage),
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'YouthMDA-AI',
                avatar: require('../Images/mda-noar.png'), // Update avatar to MDA logo
            },
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, [fallbackMessage]));
        return;
    }

    if (isQuotaExceeded) {
        Alert.alert(
            "חריגה ממכסה",
            "אנא נסה שוב מאוחר יותר כאשר המכסה תתאפס.",
            [{ text: "אישור" }]
        );
        return;
    }

    if (!(await handleRateLimit())) return;

    try {
        setIsTyping(true);
        
        const response = await axios.post(API_URL, {
            model: "gpt-3.5-turbo",  
            messages: [
                { 
                    role: "system", 
                    content: "אתה YouthMDA-AI, מומחה בחינוך לרפואת חירום טרום-אשפוזית. אתה עוזר למתנדבי נוער צעירים במד\"א להבין ולתרגל נושאים רפואיים. אתה עונה בעברית ומשתמש במונחים מקצועיים מדויקים." 
                },
                { 
                    role: "user", 
                    content: userMessage 
                }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const aiMessage = response.data.choices[0].message.content;
        const newMessage = {
            _id: uuid.v4(),
            text: aiMessage,
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'YouthMDA-AI',
                avatar: require('../Images/mda-noar.png'),
            },
        };

        setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
    } catch (error) {
        console.error("YouthMDA-AI Error:", error);
        
        if (error.response?.status === 429) {
            setApiAvailable(false);
            await handleQuotaExceeded();
            Alert.alert(
                "השירות אינו זמין",
                "שירות ה-AI אינו זמין כרגע עקב מגבלות מכסה. הצ'אט ימשיך במצב מוגבל.",
                [{ text: "אישור" }]
            );
            
            const fallbackMessage = {
                _id: uuid.v4(),
                text: "מצטער, אני לא יכול לעבד את בקשתך כרגע עקב מגבלות מערכת. אנא נסה שוב מאוחר יותר או פנה לתמיכה.",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'YouthMDA-AI',
                    avatar: require('../Images/mda-noar.png'),
                },
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, [fallbackMessage]));
        } else {
            Alert.alert(
                "שגיאה",
                "אירעה שגיאה בעיבוד הבקשה שלך. אנא נסה שוב.",
                [{ text: "אישור" }]
            );
        }
    } finally {
        setIsTyping(false);
    }
  };
  
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    const userMessage = messages[0].text;
    processMessage(userMessage);
  }, []);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
          right: {
            backgroundColor: '#E32017',
          },
        }}
        textStyle={{
          left: {
            color: '#333',
          },
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.inputPrimary}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send
        {...props}
        containerStyle={styles.sendContainer}
      >
        <Text style={styles.sendText}>שלח</Text>
      </Send>
    );
  };

  const CustomMessageText = (props) => {
    const { currentMessage } = props;
    const textColor = currentMessage.user._id === 1 ? "white" : "#333";

    return (
      <Markdown style={{
        body: {
          marginHorizontal: 10,
          fontSize: 16,
          color: textColor,
        },
        lineHeight: 20,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
      }}>
        {currentMessage.text}
      </Markdown>
    );
  };

  return (
    <ImageBackground 
      source={require('../Images/mda-noar (1).png')} 
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {!apiAvailable && (
            <View style={styles.warningBanner}>
              <Text style={styles.warningText}>
                השירות אינו זמין כרגע. פועל במצב מוגבל.
              </Text>
            </View>
          )}
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: 1,
            }}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            renderSend={renderSend}
            renderMessageText={CustomMessageText}
            isTyping={isTyping}
            placeholder="שאל את YouthMDA-AI..."
            timeTextStyle={{
              left: { color: '#666' },
              right: { color: 'rgba(255,255,255,0.7)' }
            }}
            alwaysShowSend
            locale="he"
          />
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.8,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  warningBanner: {
    backgroundColor: 'rgba(227, 32, 23, 0.1)', // Light MDA red
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E32017',
  },
  warningText: {
    color: '#E32017',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputToolbar: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputPrimary: {
    paddingHorizontal: 10,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: '#E32017', // MDA red color
    width: 60,
    height: 35,
    borderRadius: 17.5,
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ChatScreen;
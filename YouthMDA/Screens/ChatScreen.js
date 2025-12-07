import React, { useState, useEffect, useRef } from 'react'
import { 
    View, 
    Text, 
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet, 
    ImageBackground, 
    SafeAreaView,
    Alert
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
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);
  const isMounted = useRef(true);
  const isProcessing = useRef(false);
  const flatListRef = useRef();

  // Check quota status on component mount
  useEffect(() => {
    isMounted.current = true;
    checkQuotaStatus();
    
    return () => {
      isMounted.current = false;
    };
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

  const getFallbackResponse = () => {
    return "I apologize, but I'm currently unable to process your request due to API limitations. Please try again later or contact support for assistance.";
  };

  const addMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, message]);
    
    // Scroll to bottom after adding message
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  const getAIResponse = async (userMessageText) => {
    if (!apiAvailable) {
      return getFallbackResponse();
    }
    
    if (isQuotaExceeded) {
      Alert.alert("חריגה ממכסה", "אנא נסה שוב מאוחר יותר כאשר המכסה תתאפס.");
      return null;
    }
    
    if (!(await handleRateLimit())) return null;
    
    try {
      const response = await axios.post(API_URL, {
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: "אתה YouthMDA-AI, מומחה בחינוך לרפואת חירום טרום-אשפוזית. אתה עוזר למתנדבי נוער צעירים במד\"א להבין ולתרגל נושאים רפואיים. אתה עונה בעברית ומשתמש במונחים מקצועיים מדויקים." 
          },
          { 
            role: "user", 
            content: userMessageText 
          }
        ]
      }, {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      });
      
      return response.data.choices[0].message.content;
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
        
        return "מצטער, אני לא יכול לעבד את בקשתך כרגע עקב מגבלות מערכת. אנא נסה שוב מאוחר יותר או פנה לתמיכה.";
      } else {
        Alert.alert(
          "שגיאה",
          "אירעה שגיאה בעיבוד הבקשה שלך. אנא נסה שוב.",
          [{ text: "אישור" }]
        );
        return null;
      }
    }
  };
  
  const handleSend = async () => {
    if (!inputText.trim() || isProcessing.current) return;
    
    isProcessing.current = true;
    
    try {
      const userMessageText = inputText.trim();
      setInputText('');
      
      // Create and add user message
      const userMessage = {
        _id: uuid.v4(),
        text: userMessageText,
        createdAt: new Date(),
        isUser: true
      };
      
      addMessage(userMessage);
      
      // Show typing indicator
      setIsTyping(true);
      
      // Get AI response
      const aiResponseText = await getAIResponse(userMessageText);
      
      if (!aiResponseText || !isMounted.current) return;
      
      // Create and add AI message
      const aiMessage = {
        _id: uuid.v4(),
        text: aiResponseText,
        createdAt: new Date(),
        isUser: false
      };
      
      addMessage(aiMessage);
    } finally {
      setIsTyping(false);
      isProcessing.current = false;
    }
  };

  const renderMessageItem = ({ item }) => {
    const isUserMessage = item.isUser;
    
    return (
      <View style={[
        styles.messageBubble, 
        isUserMessage ? styles.userBubble : styles.aiBubble
      ]}>
        <Text style={[
          styles.messageText,
          isUserMessage ? styles.userText : styles.aiText
        ]}>
          {item.text}
        </Text>
        <Text style={styles.timeText}>
          {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </Text>
      </View>
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
          
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.chatContainer}
            keyboardVerticalOffset={90}
          >
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.messagesList}
              inverted={false}
            />
            
            {isTyping && (
              <View style={styles.typingContainer}>
                <Text style={styles.typingText}>YouthMDA-AI מקליד...</Text>
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="שאל את YouthMDA-AI..."
                placeholderTextColor="#999"
                multiline
                returnKeyType="send"
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSend}
                disabled={!inputText.trim() || isProcessing.current}
              >
                <Text style={styles.sendText}>שלח</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
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
  chatContainer: {
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
  messagesList: {
    padding: 10,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  userBubble: {
    backgroundColor: '#E32017',
    alignSelf: 'flex-end',
    marginLeft: '20%',
    borderTopRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignSelf: 'flex-start',
    marginRight: '20%',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#333',
  },
  timeText: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.5)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingContainer: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginHorizontal: 10,
    marginBottom: 5,
  },
  typingText: {
    color: '#555',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    textAlign: 'right',
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
  sendButton: {
    marginLeft: 10,
    marginBottom: 5,
    backgroundColor: '#E32017', // MDA red color
    width: 60,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ChatScreen;
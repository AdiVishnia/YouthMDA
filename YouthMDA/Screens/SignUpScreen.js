import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableWithoutFeedback, ScrollView, Platform, TouchableOpacity, Image } from 'react-native';
import { auth, db } from '../Firebase/Config'; // Ensure both auth and db are imported
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDocs, query, collection, where } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const SignUpAndProfileScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [shiftDay, setShiftDay] = useState('לא נבחר');
    const [station, setStation] = useState('לא נבחר');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('לא נבחר');
    const [volunteeringTime, setVolunteeringTime] = useState('לא נבחר');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [error, setError] = useState('');
    const [greeting, setGreeting] = useState('');
    const [showPicker, setShowPicker] = useState('');

    const handleSignUpAndCreateProfile = async () => {
        try {
            setError('');
            
            // Validate all inputs first
            let validationErrors = [];

            // Email validation
            if (!email.endsWith('@gmail.com')) {
                validationErrors.push('Please use a valid Gmail address');
            }

            // Password validation
            const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/;
            if (!passwordRegex.test(password)) {
                validationErrors.push('Password must be at least 6 characters long and contain only English letters, numbers, or special characters');
            }

            // Username validation
                if (!username || !/[a-zA-Z]/.test(username)) {
                validationErrors.push('שם המשתמש חייב להיות באנגלית,נא לרשום שם משתמש חדש');
            }

            // Check if username is already taken
                const usernameQuery = await getDocs(query(collection(db, 'users'), where('username', '==', username)));
                if (!usernameQuery.empty) {
                validationErrors.push('שגיאה: שם המשתמש כבר תפוס. נא לבחור שם משתמש אחר.');
            }

            // Age validation
            if (!age || isNaN(age) || age < 15 || age > 18) {
                validationErrors.push('שגיאה: הגיל חייב להיות מספר בין 15 ל-18.');
            }

            // Name validation
            if (!name || !/[א-ת]/.test(name)) {
                validationErrors.push('שגיאה: שם פרטי חייב להיות בעברית, נא לרשום שם חדש');
            }

            // Surname validation
            if (!surname || !/[א-ת]/.test(surname)) {
                validationErrors.push('שגיאה: שם משפחה חייב להיות בעברית, נא לרשום שם משפחה חדש');
            }

            // Dropdown selections validation
            if (gender === 'לא נבחר' || volunteeringTime === 'לא נבחר' || 
                station === 'לא נבחר' || shiftDay === 'לא נבחר') {
                validationErrors.push('שגיאה: יש למלא את כל השדות הנדרשים.');
            }

            // If there are any validation errors, show them and return
            if (validationErrors.length > 0) {
                setError(validationErrors.join('\n'));
                return;
            }

            // If all validations pass, proceed with signup
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            if (userCredential) {
                console.log("User signed up:", userCredential.user);

                // Save profile data
                const data = {
                    username,
                    shiftDay,
                    station,
                    age,
                    gender,
                    volunteeringTime,
                    userId: auth.currentUser.uid,
                    createdAt: new Date().toISOString(),
                    name,
                    surname,
                };

                await setDoc(doc(db, 'users', auth.currentUser.uid), data);
                console.log("Profile created successfully");
                
                // Clear all fields and show success message
                setGreeting(`יצרת משתמש! ברוך הבא: ${name} ${surname}`);
                setError('');
                setEmail('');
                setPassword('');
                setUsername('');
                setShiftDay('');
                setStation('');
                setAge('');
                setGender('');
                setVolunteeringTime('');
                setName('');
                setSurname('');

                // Navigate to Main screen
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                });
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => setShowPicker('')}>
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Image 
                        source={require('../Images/mda-noar-blackwhitenew.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>הצטרפו למשפחת מד״א</Text>
                    <Text style={styles.subtitle}>יחד מצילים חיים</Text>
                </View>

                <View style={styles.formContainer}>
                    {greeting ? <Text style={styles.greetingText}>{greeting}</Text> : null}
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>שם משתמש</Text>
                        <TextInput
                            placeholder="הזן שם משתמש באנגלית"
                            value={username}
                            onChangeText={setUsername}
                            style={styles.input}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>אימייל</Text>
                        <TextInput
                            placeholder="הזן כתובת Gmail"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            style={styles.input}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>סיסמא</Text>
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.nameSurnameContainer}>
                        <View style={styles.surnameContainer}>
                        <Text style={[styles.label, styles.rightAlignedText]}>שם משפחה</Text>
                            <TextInput
                                placeholder="הזן שם משפחה"
                                value={surname}
                                onChangeText={setSurname}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.nameContainer}>
                        <Text style={[styles.label, styles.rightAlignedText]}>שם פרטי</Text>
                            <TextInput
                                placeholder="הזן שם פרטי"
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                            />
                        </View>
                    </View>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>גיל</Text>
                        <TextInput
                            placeholder="הזן גיל"
                            value={age}
                            onChangeText={setAge}
                            style={styles.input}
                        />
                    </View>

                    <View>
                    <Text style={[styles.label, styles.rightAlignedText]}>מין</Text>
                        <TouchableWithoutFeedback onPress={() => {
                            setShowPicker('gender');
                        }}>
                            <View style={styles.input}>
                                <Text style={styles.rightAlignedText}>{gender}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        {showPicker === 'gender' && (
                            <Picker
                                selectedValue={gender}
                                onValueChange={(itemValue) => {
                                    setGender(itemValue);
                                    setShowPicker('');
                                }}
                                style={styles.picker}
                            >
                                <Picker.Item label="זכר" value="זכר" />
                                <Picker.Item label="נקבה" value="נקבה" />
                                <Picker.Item label="אחר" value="אחר" />
                            </Picker>
                        )}
                    </View>

                    <View style={{ height: 40 }} />

                    <View>
                    <Text style={[styles.label, styles.rightAlignedText]}>שנות התנדבות</Text>
                        <TouchableWithoutFeedback onPress={() => {
                            setShowPicker('volunteering');
                        }}>
                            <View style={styles.input}>
                                <Text style={styles.rightAlignedText}>{volunteeringTime}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        {showPicker === 'volunteering' && (
                            <Picker
                                selectedValue={volunteeringTime}
                                onValueChange={(itemValue) => {
                                    setVolunteeringTime(itemValue);
                                    setShowPicker('');
                                }}
                                style={styles.picker}
                            >
                                <Picker.Item label="1" value="1" />
                                <Picker.Item label="2" value="2" />
                                <Picker.Item label="3" value="3" />
                            </Picker>
                        )}
                    </View>

                    <View style={{ height: 40 }} />

                    <View>
                    <Text style={[styles.label, styles.rightAlignedText]}>תחנה</Text>
                        <TouchableWithoutFeedback onPress={() => {
                            setShowPicker('station');
                        }}>
                            <View style={styles.input}>
                                <Text style={styles.rightAlignedText}>{station}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        {showPicker === 'station' && (
                            <Picker
                                selectedValue={station}
                                onValueChange={(itemValue) => {
                                    setStation(itemValue);
                                    setShowPicker('');
                                }}
                                style={styles.picker}
                            >
                                <Picker.Item label="אופקים" value="אופקים" />
                                <Picker.Item label="אור עקיבא" value="אור עקיבא" />
                                <Picker.Item label="אילת" value="אילת" />
                                <Picker.Item label="אלעד" value="אלעד" />
                                <Picker.Item label="אשדוד" value="אשדוד" />
                                <Picker.Item label="אשקלון" value="אשקלון" />
                                <Picker.Item label="באר שבע" value="באר שבע" />
                                <Picker.Item label="בית שאן" value="בית שאן" />
                                <Picker.Item label="בית שמש" value="בית שמש" />
                                <Picker.Item label="בני ברק" value="בני ברק" />
                                <Picker.Item label="בת ים" value="בת ים" />
                                <Picker.Item label="גבעת שמואל" value="גבעת שמואל" />
                                <Picker.Item label="גבעתיים" value="גבעתיים" />
                                <Picker.Item label="דימונה" value="דימונה" />
                                <Picker.Item label="הוד השרון" value="הוד השרון" />
                                <Picker.Item label="הרצליה" value="הרצליה" />
                                <Picker.Item label="חדרה" value="חדרה" />
                                <Picker.Item label="חולון" value="חולון" />
                                <Picker.Item label="חיפה" value="חיפה" />
                                <Picker.Item label="טבריה" value="טבריה" />
                                <Picker.Item label="טירה" value="טירה" />
                                <Picker.Item label="יבנה" value="יבנה" />
                                <Picker.Item label="יהוד" value="יהוד" />
                                <Picker.Item label="ירושלים" value="ירושלים" />
                                <Picker.Item label="כפר סבא" value="כפר סבא" />
                                <Picker.Item label="כפר קאסם" value="כפר קאסם" />
                                <Picker.Item label="כרמיאל" value="כרמיאל" />
                                <Picker.Item label="לוד" value="לוד" />
                                <Picker.Item label="מבשרת ציון" value="מבשרת ציון" />
                                <Picker.Item label="מגדל העמק" value="מגדל העמק" />
                                <Picker.Item label="מודיעין-מכבים-רעות" value="מודיעין-מכבים-רעות" />
                                <Picker.Item label="נהריה" value="נהריה" />
                                <Picker.Item label="נוף הגליל" value="נוף הגליל" />
                                <Picker.Item label="נתיבות" value="נתיבות" />
                                <Picker.Item label="נתניה" value="נתניה" />
                                <Picker.Item label="עכו" value="עכו" />
                                <Picker.Item label="עפולה" value="עפולה" />
                                <Picker.Item label="ערד" value="ערד" />
                                <Picker.Item label="פתח תקווה" value="פתח תקווה" />
                                <Picker.Item label="צפת" value="צפת" />
                                <Picker.Item label="קצרין" value="קצרין" />
                                <Picker.Item label="קרית אתא" value="קרית אתא" />
                                <Picker.Item label="קרית גת" value="קרית גת" />
                                <Picker.Item label="קרית מלאכי" value="קרית מלאכי" />
                                <Picker.Item label="קרית מוצקין" value="קרית מוצקין" />
                                <Picker.Item label="ראשון לציון" value="ראשון לציון" />
                                <Picker.Item label="רחובות" value="רחובות" />
                                <Picker.Item label="רמלה" value="רמלה" />
                                <Picker.Item label="רמת גן" value="רמת גן" />
                                <Picker.Item label="רמת השרון" value="רמת השרון" />
                                <Picker.Item label="רעננה" value="רעננה" />
                                <Picker.Item label="שדרות" value="שדרות" />
                                <Picker.Item label="תל אביב" value="תל אביב" />
                            </Picker>
                        )}
                    </View>

                    <View style={{ height: 40 }} />

                    <View>
                    <Text style={[styles.label, styles.rightAlignedText]}>יום משמרת</Text>
                        <TouchableWithoutFeedback onPress={() => {
                            setShowPicker('shiftDay');
                        }}>
                            <View style={styles.input}>
                                <Text style={styles.rightAlignedText}>{shiftDay}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        {showPicker === 'shiftDay' && (
                            <Picker
                                selectedValue={shiftDay}
                                onValueChange={(itemValue) => {
                                    setShiftDay(itemValue);
                                    setShowPicker('');
                                }}
                                style={styles.picker}
                            >
                                <Picker.Item label="אין" value="אין" />
                                <Picker.Item label="ראשון" value="ראשון" />
                                <Picker.Item label="שני" value="שני" />
                                <Picker.Item label="שלישי" value="שלישי" />
                                <Picker.Item label="רביעי" value="רביעי" />
                                <Picker.Item label="חמישי" value="חמישי" />
                                <Picker.Item label="שישי" value="שישי" />
                            </Picker>
                        )}
                    </View>
                </View>
                    <Text> </Text>
                    <Text> </Text>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity 
                    style={styles.signUpButton}
                    onPress={handleSignUpAndCreateProfile}
                >
                    <Text style={styles.signUpButtonText}>צור משתמש</Text>
                </TouchableOpacity>
            </ScrollView>
            
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#E32017',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    logo: {
        width: 1000,
        height: 200,
        marginBottom: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#ffffff',
        opacity: 0.9,
        marginBottom: 10,
    },
    formContainer: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 8,
        textAlign: 'right',
    },
    input: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        textAlign: 'right',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    picker: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 20,
        overflow: 'hidden',
    },
    pickerItem: {
        textAlign: 'right',
        fontSize: 16,
    },
    signUpButton: {
        backgroundColor: '#E32017',
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 30,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    signUpButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        color: '#E32017',
        backgroundColor: 'rgba(227, 32, 23, 0.1)',
        padding: 15,
        borderRadius: 12,
        marginVertical: 10,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
    },
    greetingText: {
        color: '#4CAF50',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        padding: 15,
        borderRadius: 12,
    },
    nameSurnameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    nameContainer: {
        flex: 1,
    },
    surnameContainer: {
        flex: 1,
    },
    rightAlignedText: {
        textAlign: 'right',
    },
});

export default SignUpAndProfileScreen;    
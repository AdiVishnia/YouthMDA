import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { db } from '../Firebase/Config'; // Import the db instance
import { auth } from '../Firebase/Config'; // Import the auth instance
import { getFirestore, setDoc, doc, getDocs, query, collection, where } from 'firebase/firestore'; // Import Firestore operations
import { Picker } from '@react-native-picker/picker'; // Import the Picker component
//נמצא בספר פרוייקט
const MyDataScreen = () => {
    const [username, setUsername] = useState('');
    const [shiftDay, setShiftDay] = useState('לא נבחר');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [greeting, setGreeting] = useState('');
    const [station, setStation] = useState('לא נבחר');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('לא נבחר');
    const [volunteeringTime, setVolunteeringTime] = useState('לא נבחר');
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [showPicker, setShowPicker] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleCreate = async () => {
        let errorCount = 0;
        if (!username || !/[a-zA-Z]/.test(username)) {
            setError('שגיאה: שם המשתמש חייב להיות באנגלית,נא לרשום שם משתמש חדש');
            errorCount++;
        }

        if (!age || isNaN(age) || age < 15 || age > 18) {
            setError('שגיאה: הגיל חייב להיות מספר בין 15 ל-18.');
            errorCount++;
        }

        // Check if username already exists
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const usernameQuery = await getDocs(query(collection(db, 'users'), where('username', '==', username)));

        if (!usernameQuery.empty) {
            setError('שגיאה: שם המשתמש כבר תפוס. נא לבחור שם משתמש אחר.');
            errorCount++;
        }
        // Check if name contains at least one Hebrew letter
        if (!name || !/[א-ת]/.test(name)) {
            setError('שגיאה: שם פרטי חייב להיות בעברית, נא לרשום שם חדש');
            errorCount++;
        }

        
        // Check if surname contains at least one Hebrew letter
        if (!surname || !/[א-ת]/.test(surname)) {
            setError('שגיאה: שם משפחה חייב להיות בעברית, נא לרשום שם משפחה חדש');
            errorCount++;
        }

        // Check if picker values are selected
        if (gender === 'לא נבחר') {
            setError('שגיאה: יש לבחור מין.');
            errorCount++;
        }
        if (volunteeringTime === 'לא נבחר') {
            setError('שגיאה: יש לבחור שנות התנדבות.');
            errorCount++;
        }
        if (station === 'לא נבחר') {
            setError('שגיאה: יש לבחור תחנה.');
            errorCount++;
        }
        if (shiftDay === 'לא נבחר') {
            setError('שגיאה: יש לבחור יום משמרת.');
            errorCount++;
        }

        if (errorCount >= 2) {
            setError('שגיאה: לפחות שניים מן השדות שהקלדת שגויים או ריקים!');
            return;
        }

        if(errorCount === 1){
            setError("שגיאה אחד מן השדות לא נבחר!");
            return;
        }

        const data = {
            username: username,
            shiftDay: shiftDay,
            station: station,
            age: age,
            gender: gender,
            volunteeringTime: volunteeringTime,
            userId: auth.currentUser.uid,
            createdAt: new Date().toISOString(),
            name: name,
            surname: surname,
        };

        try {
            await setDoc(doc(db, 'users', auth.currentUser.uid), data);
            console.log("Data saved successfully");
            setGreeting(`יצרת משתמש! ברוך הבא: ${name+" "+surname}`);
            setError(''); // Clear error on successful save

            // Clear all text boxes
            setUsername('');
            setShiftDay('');
            setStation('');
            setAge('');
            setGender('');
            setVolunteeringTime('');
            setName('');
            setSurname('');
        } catch (error) {
            console.error("Error saving data: ", error);
        }
    };

    if (!isAuthenticated) {
        return (
            <View style={styles.centeredView}>
                <Text style={styles.errorText}>עליך להתחבר כדי לגשת לדף זה.</Text>
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={() => {
            setShowPicker('');
        }}>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>יצירת פרופיל</Text>
                {greeting ? <Text style={[styles.greetingText, styles.rightAlignedText]}>{greeting}</Text> : null}
                <Text style={[styles.label, styles.rightAlignedText]}>שם משתמש</Text>
                <TextInput
                    placeholder="הזן שם משתמש"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />
                                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <View style={styles.nameSurnameContainer}>
                    <View style={styles.nameContainer}>
                    <Text style={[styles.label, styles.rightAlignedText]}>שם פרטי</Text>
                        <TextInput
                            placeholder="הזן שם פרטי"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.surnameContainer}>
                    <Text style={[styles.label, styles.rightAlignedText]}>שם משפחה</Text>
                        <TextInput
                            placeholder="הזן שם משפחה"
                            value={surname}
                            onChangeText={setSurname}
                            style={styles.input}
                        />
                    </View>
                </View>
                
                <Text style={[styles.label, styles.rightAlignedText]}>גיל</Text>
                <TextInput
                    placeholder="הזן גיל"
                    value={age}
                    onChangeText={setAge}
                    style={styles.input}
                />

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
                            <Picker.Item label="ראשון" value="ראשון" />
                            <Picker.Item label="שני" value="שני" />
                            <Picker.Item label="שלישי" value="שלישי" />
                            <Picker.Item label="רביעי" value="רביעי" />
                            <Picker.Item label="חמישי" value="חמישי" />
                            <Picker.Item label="שישי" value="שישי" />
                        </Picker>
                    )}
                </View>
                <View style={{ height: 100 }} />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <Button title="צור משתמש" onPress={handleCreate} style={styles.button} />
                
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
    },
    greetingText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        textAlign: 'right',
        padding: Platform.OS === 'ios' ? 10 : 0,
        ...Platform.select({
            ios: {
                backgroundColor: '#f0f0f0',
                borderRadius: 8,
            },
            android: {
                backgroundColor: '#fff',
            },
        }),
    },
    picker: {
        height: 150,
        width: '100%',
        marginBottom: 20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    pickerItem: {
        textAlign: 'right',
        padding: 10,
    },
    button: {
        backgroundColor: 'blue',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'right',
        marginBottom: 20,
    },
    rightAlignedText: {
        textAlign: 'right',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
});

export default MyDataScreen;

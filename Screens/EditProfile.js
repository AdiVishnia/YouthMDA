import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    ImageBackground,
    ScrollView 
} from 'react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../Firebase/Config';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

const EditProfile = ({ route, navigation }) => {
    const { userData } = route.params;
    const [formData, setFormData] = useState({
        name: userData.name || '',
        surname: userData.surname || '',
        age: userData.age || '',
        station: userData.station || '',
        shiftDay: userData.shiftDay || '',
    });

    // Add these arrays for picker options
    const stations = [
        "אופקים",
        "אור עקיבא",
        "אילת",
        "אלעד",
        "אשדוד",
        "אשקלון",
        "באר שבע",
        "בית שאן",
        "בית שמש",
        "בני ברק",
        "בת ים",
        "גבעת שמואל",
        "גבעתיים",
        "דימונה",
        "הוד השרון",
        "הרצליה",
        "חדרה",
        "חולון",
        "חיפה",
        "טבריה",
        "טירה",
        "יבנה",
        "יהוד",
        "ירושלים",
        "כפר סבא",
        "כפר קאסם",
        "כרמיאל",
        "לוד",
        "מבשרת ציון",
        "מגדל העמק",
        "מודיעין-מכבים-רעות",
        "נהריה",
        "נוף הגליל",
        "נתיבות",
        "נתניה",
        "עכו",
        "עפולה",
        "ערד",
        "פתח תקווה",
        "צפת",
        "קצרין",
        "קרית אתא",
        "קרית גת",
        "קרית מלאכי",
        "קרית מוצקין",
        "ראשון לציון",
        "רחובות",
        "רמלה",
        "רמת גן",
        "רמת השרון",
        "רעננה",
        "שדרות",
        "תל אביב"
    ];

    const shiftDays = [
        "אין",
        "ראשון",
        "שני",
        "שלישי",
        "רביעי",
        "חמישי",
        "שישי",
        "שבת"
    ];

    const handleUpdate = async () => {
        try {
            await updateDoc(doc(db, 'users', userData.uid), formData);
            Alert.alert(
                'הצלחה',
                'הפרופיל עודכן בהצלחה',
                [{ text: 'אישור', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('שגיאה', 'אירעה שגיאה בעדכון הפרופיל');
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
                <ScrollView style={styles.scrollView}>
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>עריכת פרופיל</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>שם פרטי</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(text) => setFormData({...formData, name: text})}
                                placeholder="שם פרטי"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>שם משפחה</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.surname}
                                onChangeText={(text) => setFormData({...formData, surname: text})}
                                placeholder="שם משפחה"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>גיל</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.age.toString()}
                                onChangeText={(text) => setFormData({...formData, age: text})}
                                placeholder="גיל"
                                keyboardType="numeric"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>תחנה</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={formData.station}
                                    onValueChange={(itemValue) =>
                                        setFormData({...formData, station: itemValue})
                                    }
                                    style={styles.picker}
                                >
                                    {stations.map((station, index) => (
                                        <Picker.Item 
                                            key={index} 
                                            label={station} 
                                            value={station === "בחר תחנה" ? "" : station}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>יום משמרת</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={formData.shiftDay}
                                    onValueChange={(itemValue) =>
                                        setFormData({...formData, shiftDay: itemValue})
                                    }
                                    style={styles.picker}
                                >
                                    {shiftDays.map((day, index) => (
                                        <Picker.Item 
                                            key={index} 
                                            label={day} 
                                            value={day === "בחר יום" ? "" : day}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.updateButton}
                            onPress={handleUpdate}
                        >
                            <Text style={styles.updateButtonText}>עדכן פרופיל</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
    },
    scrollView: {
        flex: 1,
    },
    formContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E32017',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        textAlign: 'right',
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
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
    updateButton: {
        backgroundColor: '#E32017',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    updateButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    pickerContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
        height: 50,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    picker: {
        marginTop: -8,
        marginBottom: -8,
        backgroundColor: 'white',
        width: '100%',
        color: '#333',
    },
});

export default EditProfile; 
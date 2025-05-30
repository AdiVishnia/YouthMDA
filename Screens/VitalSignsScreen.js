import { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ScrollView, ImageBackground, Platform } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

const MeasurementInput = ({ label, value, onChangeText, placeholder, onClear, unit, icon }) => (
    <View style={styles.measurementCard}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputContainer}>
            <TextInput 
                style={styles.input}
                keyboardType='phone-pad'
                placeholder={placeholder}
                value={value}
                onChangeText={(text) => {
                    if (label === "לחץ דם" && text.length === 3) {
                        onChangeText(text + '/');
                    } else {
                        onChangeText(text);
                    }
                }}
                placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.clearButton} onPress={onClear}>
                <Text style={styles.clearButtonText}>נקה</Text>
            </TouchableOpacity>
        </View>
        <Text style={styles.result}>{value ? `${value} ${unit} ${icon}` : ''}</Text>
    </View>
);

const VitalSignsScreen = () => {
    const [heartbeat, setHeartBeat] = useState('');
    const [bloodpressure, setBloodpressure] = useState('');
    const [breathing, setBreathing] = useState('');
    const [saturation, setSaturation] = useState('');
    const [sugar, setSugar] = useState('');
    const [notes, setNotes] = useState('');

    const clearAll = () => {
        setHeartBeat('');
        setBloodpressure('');
        setBreathing('');
        setSaturation('');
        setSugar('');
        setNotes('');
    };

    return (    
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ImageBackground 
                source={require('../Images/AmbulanceBackround.jpg')}
                style={styles.backgroundImage}
                blurRadius={3}
            >
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                    style={styles.gradient}
                >
                    <ScrollView 
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.container}>
                            <Text style={styles.title}>מדדים של מטופל</Text>
                            
                            <MeasurementInput 
                                label="דופק"
                                value={heartbeat}
                                onChangeText={setHeartBeat}
                                placeholder="60-100 פעימות לדקה"
                                onClear={() => setHeartBeat('')}
                                unit="פעימות לדקה"
                                icon="❤️"
                            />

                            <MeasurementInput 
                                label="לחץ דם"
                                value={bloodpressure}
                                onChangeText={(text) => {
                                    if (text.length === 3) {
                                        setBloodpressure(text + '/');
                                    } else {
                                        setBloodpressure(text);
                                    }
                                }}
                                placeholder="140-90/90-60"
                                onClear={() => setBloodpressure('')}
                                unit=""
                                icon="🩺"
                            />

                            <MeasurementInput 
                                label="נשימות לדקה"
                                value={breathing}
                                onChangeText={setBreathing}
                                placeholder="12-20"
                                onClear={() => setBreathing('')}
                                unit="לדקה"
                                icon="🌬️"
                            />

                            <MeasurementInput 
                                label="סטורציה"
                                value={saturation}
                                onChangeText={setSaturation}
                                placeholder="95%-100%"
                                onClear={() => setSaturation('')}
                                unit="%"
                                icon="💨"
                            />

                            <MeasurementInput 
                                label="סוכר"
                                value={sugar}
                                onChangeText={setSugar}
                                placeholder="60-110"
                                onClear={() => setSugar('')}
                                unit="mg/dl"
                                icon="📊"
                            />

                            <Text style={styles.label}>הערות</Text>
                            <TextInput 
                                style={styles.notesInput}
                                multiline={true}
                                numberOfLines={4}
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="הוסף הערות כאן"
                                placeholderTextColor="#999"
                            />

                            <TouchableOpacity 
                                style={styles.clearAllButton}
                                onPress={clearAll}
                            >
                                <Text style={styles.clearAllText}>נקה הכל</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </LinearGradient>
            </ImageBackground>
        </TouchableWithoutFeedback>
    );      
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    gradient: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 30,
        color: '#E32017',
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
        overflow: 'hidden',
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
    measurementCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        width: '90%',
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
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        marginRight: 10,
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'white',
    },
    clearButton: {
        backgroundColor: '#E32017',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
    },
    clearButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    result: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        textAlign: 'center',
        marginTop: 5,
    },
    clearAllButton: {
        backgroundColor: '#333',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 20,
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
    clearAllText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    notesInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'white',
        marginTop: 10,
    },
});

export default VitalSignsScreen;
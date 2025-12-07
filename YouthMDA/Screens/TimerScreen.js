import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image} from 'react-native';
import { Audio } from 'expo-av';

const Timer = ({ route }) => {
    // Get initial time from navigation params, default to 300 if not provided
    const initialTime = route.params?.initialTime || 300;
    const [time, setTime] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const logoAnim = useRef(new Animated.Value(1)).current;
    const intervalRef = useRef(null);
    const [sound, setSound] = useState();
    const [zeroSecSound, setZeroSecSound] = useState(); // Added for the sound when timer hits 0
    const soundDelayRef = useRef(null);

    useEffect(() => {
        // Update time when initialTime changes
        setTime(initialTime);
        loadSound();
        loadZeroSecSound(); // Load the sound for when timer hits 0
        return () => {
            // Clear timers immediately
            clearInterval(intervalRef.current);
            clearTimeout(soundDelayRef.current);
            
            // Stop sound immediately
            if (sound) {
                sound.stopAsync()
                    .then(() => sound.unloadAsync())
                    .catch(error => console.log("Error cleaning up sound:", error));
            }
            // Stop zeroSecSound immediately
            if (zeroSecSound) {
                zeroSecSound.stopAsync()
                    .then(() => zeroSecSound.unloadAsync())
                    .catch(error => console.log("Error cleaning up zeroSecSound:", error));
            }
        };
    }, [initialTime]);

    const loadSound = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                staysActiveInBackground: true,
            });

            const { sound } = await Audio.Sound.createAsync(
                require('../Sound/smooth-completed-notify-starting-alert-274739.mp3'),
                {
                    shouldPlay: false,
                    isLooping: true,
                    volume: 1.0,
                }
            );
            setSound(sound);
        } catch (error) {
            console.log("Error loading sound:", error);
        }
    };

    const loadZeroSecSound = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                staysActiveInBackground: true,
            });

            const { sound } = await Audio.Sound.createAsync(
                require('../Sound/smooth-completed-notify-starting-alert-274739.mp3'), // Assuming this is the sound for when timer hits 0
                {
                    shouldPlay: false,
                    isLooping: false,
                    volume: 1.0,
                }
            );
            setZeroSecSound(sound);
        } catch (error) {
            console.log("Error loading zeroSecSound:", error);
        }
    };

    const startLogoAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(logoAnim, {
                    toValue: 1.2,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(logoAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(logoAnim, {
                    toValue: 1.2,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(logoAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const stopLogoAnimation = () => {
        logoAnim.setValue(1);
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const startTimer = async () => {
        setIsActive(true);
        setIsPaused(false);
        startLogoAnimation();
        
        // Clear any existing sound delay timer
        if (soundDelayRef.current) {
            clearTimeout(soundDelayRef.current);
        }

        intervalRef.current = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalRef.current);
                    clearTimeout(soundDelayRef.current);
                    setIsActive(false);
                    stopLogoAnimation();
                    if (zeroSecSound) { // Play the sound when timer hits 0
                        zeroSecSound.playAsync().catch(error => console.log("Error playing zeroSecSound:", error));
                    }
                    setTimeout(() => setTime(initialTime), 1000);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const pauseTimer = async () => {
        clearInterval(intervalRef.current);
        setIsPaused(true);
        stopLogoAnimation();
    };

    const resetTimer = async () => {
        // Clear timers immediately
        clearInterval(intervalRef.current);
        clearTimeout(soundDelayRef.current);
        
        // Stop zeroSecSound immediately before other actions
        if (zeroSecSound) {
            try {
                await zeroSecSound.stopAsync();
                await zeroSecSound.setPositionAsync(0);
            } catch (error) {
                console.log("Error stopping zeroSecSound:", error);
            }
        }

        // Reset other states
        setTime(initialTime);
        setIsActive(false);
        setIsPaused(false);
        stopLogoAnimation();
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.logoContainer,
                {
                    transform: [{ scale: logoAnim }]
                }
            ]}>
                <Image 
                    source={initialTime === 60 ? 
                        require('../Images/breathlogo.png') : 
                        require('../Images/heartbeatlogo2.png')}
                    style={[
                        styles.logoImage,
                        { tintColor: initialTime === 60 ? '#4CAF50' : '#ff1744' }
                    ]}
                    resizeMode="contain"
                />
            </Animated.View>

            <Animated.View 
                style={[
                    styles.timerCircle,
                    {
                        transform: [{ scale: pulseAnim }],
                        backgroundColor: isActive ? '#ff1744' : '#ff4081',
                    }
                ]}
            >
                <Text style={styles.timerText}>{formatTime(time)}</Text>
            </Animated.View>

            <View style={styles.buttonContainer}>
                {!isActive && !isPaused ? (
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={startTimer}
                    >
                        <Text style={styles.buttonText}>התחל</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        {!isPaused ? (
                            <TouchableOpacity 
                                style={[styles.button, styles.pauseButton]}
                                onPress={pauseTimer}
                            >
                                <Text style={styles.buttonText}>עצור</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity 
                                style={styles.button}
                                onPress={startTimer}
                            >
                                <Text style={styles.buttonText}>המשך</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}

                <TouchableOpacity 
                    style={[styles.button, styles.resetButton]}
                    onPress={resetTimer}
                >
                    <Text style={styles.buttonText}>אפס</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    logoContainer: {
        position: 'absolute',
        top: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: 150,
        height: 150,
    },
    timerCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#ff4081',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        marginBottom: 30,
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    button: {
        backgroundColor: '#ff1744',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        minWidth: 120,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pauseButton: {
        backgroundColor: '#ff9100',
    },
    resetButton: {
        backgroundColor: '#757575',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Timer;

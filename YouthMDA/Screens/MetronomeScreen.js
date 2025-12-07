import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { Audio } from 'expo-av';

const MetronomeScreen = () => {
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState(0);
    const [sound, setSound] = useState(null);
    const [soundLoaded, setSoundLoaded] = useState(false);
    const logoAnim = useRef(new Animated.Value(1)).current;
    const intervalRef = useRef(null);
    const metronomeRef = useRef(null);
    const soundRef = useRef(null);
    const BPM = 100; // 100 beats per minute
    const interval = (60 / BPM) * 1000; // Convert BPM to milliseconds

    useEffect(() => {
        loadSound();
        return () => {
            if (soundRef.current) {
                soundRef.current.pauseAsync().catch(() => {});
                soundRef.current.unloadAsync().catch(() => {});
            }
            clearInterval(intervalRef.current);
            clearInterval(metronomeRef.current);
        };
    }, []);

    const loadSound = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                staysActiveInBackground: true,
            });

            const { sound } = await Audio.Sound.createAsync(
                require('../Sound/Desktop 2025.03.23 - 17.54.35.03.mp3'),
                {
                    shouldPlay: false,
                    volume: 1.0,
                    isLooping: false,
                }
            );
            soundRef.current = sound;
            setSound(sound);
            setSoundLoaded(true);
        } catch (error) {
            console.log("Error loading sound:", error);
            setSoundLoaded(false);
        }
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const startLogoAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(logoAnim, {
                    toValue: 1.2,
                    duration: interval / 2,
                    useNativeDriver: true,
                }),
                Animated.timing(logoAnim, {
                    toValue: 1,
                    duration: interval / 2,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const stopLogoAnimation = () => {
        logoAnim.setValue(1);
    };

    const playClick = async () => {
        try {
            const currentSound = soundRef.current || sound;
            if (currentSound) {
                await currentSound.setPositionAsync(0);
                await currentSound.playAsync();
            }
        } catch (error) {
            console.log("Error playing click:", error);
        }
    };

    const startMetronome = () => {
        if (!soundLoaded) {
            console.log("Sound not loaded yet, please wait...");
            return;
        }
        
        setIsActive(true);
        startLogoAnimation();
        
        // Start the ascending timer
        intervalRef.current = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);

        // Start the metronome clicks
        playClick(); // Play first click immediately
        metronomeRef.current = setInterval(playClick, interval);
    };

    const stopMetronome = () => {
        setIsActive(false);
        stopLogoAnimation();
        clearInterval(intervalRef.current);
        clearInterval(metronomeRef.current);
    };

    const resetMetronome = () => {
        stopMetronome();
        setTime(0);
        // Stop the sound immediately
        const currentSound = soundRef.current || sound;
        if (currentSound) {
            currentSound.pauseAsync().catch(() => {});
            currentSound.setPositionAsync(0).catch(() => {});
        }
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
                    source={require('../Images/metronomeloggo.png')} // Add a metronome icon
                    style={[
                        styles.logoImage,
                        { tintColor: '#4CAF50' }
                    ]}
                    resizeMode="contain"
                />
            </Animated.View>

            <View style={styles.bpmContainer}>
                <Text style={styles.bpmText}>{BPM} BPM</Text>
            </View>

            <Animated.View style={styles.timerCircle}>
                <Text style={styles.timerText}>{formatTime(time)}</Text>
            </Animated.View>

            <View style={styles.buttonContainer}>
                {!isActive ? (
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={startMetronome}
                    >
                        <Text style={styles.buttonText}>התחל</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        style={[styles.button, styles.pauseButton]}
                        onPress={stopMetronome}
                    >
                        <Text style={styles.buttonText}>עצור</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity 
                    style={[styles.button, styles.resetButton]}
                    onPress={resetMetronome}
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
        top: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: 150,
        height: 150,
        top: -20,
        right: -10,
    },
    bpmContainer: {
        position: 'absolute',
        top: 200,
        alignItems: 'center',
    },
    bpmText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    timerCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#4CAF50',
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
        backgroundColor: '#4CAF50',
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

export default MetronomeScreen;

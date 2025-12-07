import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Animated, Easing } from 'react-native';
//נמצא בספר פרויקט
const PlaceholderImage = require('../Images/mda-noar.png');
const PlaceholderImage2 = require('../Images/rulerlogo.png');
const PlaceholderImage3 = require('../Images/fire.png');
const PlaceholderImage4=require('../Images/breathlogo.png');
const PlaceholderImage5=require('../Images/heartbeatlogo2.png');
const PlaceholderImage6=require('../Images/metronomeloggo.png');
const StoreIcon = require('../Images/store-icon.png'); 
const MainScreen = ({navigation}) => {
    const [isHolding, setIsHolding] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const scaleValue = useRef(new Animated.Value(1)).current;
    const progressValue = useRef(new Animated.Value(0)).current;
    const expandAnim = useRef(new Animated.Value(0)).current;
    const holdTimer = useRef(null);

    const handlePressIn = () => {
        setIsHolding(true);
        
        Animated.timing(scaleValue, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
        }).start();

        Animated.timing(progressValue, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();

        holdTimer.current = setTimeout(() => {
            navigation.navigate("הרצף שלי");
            handlePressOut();
        }, 3000);
    };

    const handlePressOut = () => {
        setIsHolding(false);
        
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
        }

        Animated.parallel([
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(progressValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            })
        ]).start();
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        Animated.timing(expandAnim, {
            toValue: isExpanded ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // Calculate positions for circular arrangement
    const radius = 50; // Radius of the circular arrangement
    
    // Button 1 position (top)
    const button1Position = {
        x: expandAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -radius * Math.sin(Math.PI/6)]
        }),
        y: expandAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -radius * Math.cos(Math.PI/6)]
        })
    };

    // Button 2 position (top left)
    const button2Position = {
        x: expandAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -radius * Math.sin(Math.PI/2)]
        }),
        y: expandAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -radius * Math.cos(Math.PI/2)]
        })
    };

    // Button 3 position (left)
    const button3Position = {
        x: expandAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -radius * Math.sin(5*Math.PI/6)]
        }),
        y: expandAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -radius * Math.cos(5*Math.PI/6)]
        })
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (holdTimer.current) {
                clearTimeout(holdTimer.current);
            }
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>    
                <Image source={PlaceholderImage} style= {styles.image} resizeMode="contain"/>
            </View>
            <Text style={styles.text}></Text>
            <View style={styles.topRightMenu}>
                <TouchableOpacity 
                    style={styles.profileButton}
                    onPress={() => navigation.navigate("הפרופיל שלי")}
                >
                    <Image 
                        source={require('../Images/bestusericon.png')} 
                        style={styles.profileIcon} 
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.topLeftMenu}>
                <TouchableOpacity 
                    style={styles.storeButton}
                    onPress={() => navigation.navigate("חנות מדא")}
                >
                    <Image 
                        source={StoreIcon} 
                        style={styles.storeIcon} 
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.buttonsContainer}>
                <View style={styles.buttonColumn}>
                    <TouchableOpacity   
                        style={styles.buttonWrapper}
                        onPress={() => navigation.jumpTo("בדיקת אמבולנס")}
                    >
                        <Text style={styles.buttonText}>בדיקת אמבולנס</Text>
                    </TouchableOpacity>
                    <TouchableOpacity   
                        style={styles.buttonWrapper}
                        onPress={() => navigation.jumpTo("YouthMDA-AI")}
                    >
                        <Text style={styles.buttonText}>YouthMDA-AI</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonColumn}>
                    <TouchableOpacity 
                        style={styles.buttonWrapper}
                        onPress={() => navigation.jumpTo("מדדים של מטופל")}
                    >
                        <Text style={styles.buttonText}>מדדים של מטופל</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.buttonWrapper}
                        onPress={() => navigation.jumpTo("טבלת מדדים תקינים")}
                    >
                        <Text style={styles.buttonText}>טבלת מדדים תקינים</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
            <View style={styles.bottomRightMenu}>
                <TouchableOpacity 
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.7}
                >
                    <Animated.View style={[
                        styles.circleButton,
                        {
                            transform: [{ scale: scaleValue }],
                        }
                    ]}>
                        <View style={{ width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={PlaceholderImage3} style={{ width: 90, height: 90 }} />
                            <Text style={{ position: 'absolute', bottom:30, color: 'white' }}>הרצף</Text>
                            <Text style={{ position: 'absolute', bottom: 10, color: 'white' }}>שלי</Text>
                        </View>
                        {isHolding && (
                            <Animated.View
                                style={[
                                    styles.progressCircle,
                                    {
                                        transform: [{ 
                                            rotate: progressValue.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0deg', '360deg']
                                            })
                                        }]
                                    }
                                ]}
                            />
                        )}
                    </Animated.View>
                </TouchableOpacity>

                <View style={styles.expandableButtonsContainer}>
                    {/* Main + button */}
                    <TouchableOpacity 
                        style={[styles.smallCircleButton, styles.mainSmallButton]}
                        onPress={toggleExpand}
                    >
                        <Text style={styles.smallButtonText}>
                                <Image source={PlaceholderImage2} style={{ width: 40, height: 40 }} />
                        </Text>
                    </TouchableOpacity>

                    {/* Button 1 - Top */}
                    <Animated.View style={[
                        styles.smallCircleButton,
                        styles.topExpandedButton,
                        {
                            transform: [
                                { translateX: button1Position.x },
                                { translateY: button1Position.y },
                                { scale: expandAnim }
                            ],
                            opacity: expandAnim
                        }
                    ]}>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate("טיימר", { initialTime: 15 })}
                        >
                        <Text style={styles.smallButtonText}>
                                <Image source={PlaceholderImage5} style={{ width: 40, height: 40 }} />
                        </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Button 2 - Top Left */}
                    <Animated.View style={[
                        styles.smallCircleButton,
                        styles.topLeftExpandedButton,
                        {
                            transform: [
                                { translateX: button2Position.x },
                                { translateY: button2Position.y },
                                { scale: expandAnim }
                            ],
                            opacity: expandAnim
                        }
                    ]}>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate("טיימר", { initialTime: 60 })}
                        >
                        <Text style={styles.smallButtonText}>
                                <Image source={PlaceholderImage4} style={{ width: 40, height: 40 }} />
                        </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Button 3 - Left */}
                    <Animated.View style={[
                        styles.smallCircleButton,
                        styles.leftExpandedButton,
                        {
                            transform: [
                                { translateX: button3Position.x },
                                { translateY: button3Position.y },
                                { scale: expandAnim }
                            ],
                            opacity: expandAnim
                        }
                    ]}>
                        <TouchableOpacity onPress={() => navigation.navigate("Metronome")}>
                            <Text style={styles.smallButtonText}>
                                <Image source={PlaceholderImage6} style={{ width: 40, height: 40, tintColor: '#4CAF50' }} />
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </View> 
    );
};

export default MainScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: "center",
        justifyContent: "flex-start"
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
        gap: 10,
    },
    buttonColumn: {
        flex: 1,
        gap: 20,
    },
    buttonWrapper: {
        backgroundColor: '#ff1744', 
        borderRadius: 10,
        padding: 15,
        minHeight: 78,
        bottom: 80,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: -10, // Move the button up
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    imageContainer: {
        flex: 0.6,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 58,
    },
    image: {
        width: '70%',
        bottom: 50,
        right: 5,
        height: undefined,
        aspectRatio: 0.7,
        borderRadius: 18,
    },
    topRightMenu: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    profileButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
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
    profileIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    bottomRightMenu: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleButton: {
        position: 'absolute',
        bottom: -30,
        right: -45,
        width: 90,
        height: 90,
        borderRadius: 60,
        backgroundColor: '#ff1744',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    progressCircle: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderWidth: 6,
        borderRadius: 100,
        borderColor: 'transparent',
        borderTopColor: '#ffe400',
    },
    expandableButtonsContainer: {
        position: 'absolute',
        top: -30,
        right: 55,
        width: 50,
        height: 50,
    },
    smallCircleButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ff1744',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        position: 'absolute',
    },
    mainSmallButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 3,
    },
    topExpandedButton: {
        position: 'absolute',
        top: 60,
        right: 20,
    },
    topLeftExpandedButton: {
        position: 'absolute',
        top: 50,
        right: 15,
    },
    leftExpandedButton: {
        position: 'absolute',
        top: 50,
        right: 40,
    },
    smallButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    circleButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center',

        zIndex: 2,
    },
    topLeftMenu: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    storeButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
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
    storeIcon: {
        width: 60,
        height: 60,
    },
});

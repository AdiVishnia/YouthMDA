import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ImageBackground, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const StoreScreen = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const storeItems = [
        {
            id: 1,
            name: 'מכנס לנוער',
            points: 200,
            image: require('../Images/pants.png'),
        },
        {
            id: 2,
            name: 'חולצה לנוער',
            points: 200,
            image: require('../Images/shirt.png'),
        },
        {
            id: 3,
            name: 'מעיל לנוער',
            points: 50,
            image: require('../Images/coat.png'),
        },
        {
            id: 4,
            name:'קפוצון כחול לנוער' ,
            points: 50,
            image: require('../Images/hoodie2.png'),   
        },
    ];

    const handleItemPress = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
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
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>חנות מדא נוער</Text>
                    <Text style={styles.headerSubtitle}>צברת שעות התנדבות?</Text>
                    <Text style={styles.headerSubtitle}>הגיע הזמן לממש אותן!</Text>

                </View>

                <View style={styles.pointsContainer}>
                    <Text style={styles.pointsText}>שעות ההתנדבות שלך רשומות באפליקציה "מגן דווד אדום-צוותים"</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.itemsGrid}>
                        {storeItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.itemContainer}
                                onPress={() => handleItemPress(item)}
                            >
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={item.image}
                                        style={item.id === 3 || item.id === 4 ? { width: 110, height: 130, right: -25, top: 30 } : styles.itemImage}
                                        resizeMode="cover"
                                    />
                                </View>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <View style={styles.pointsBadge}>
                                    <Text style={styles.pointsValue}>{item.points}</Text>
                                    <Text style={styles.pointsLabel}>שעות</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity 
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContent}>
                            {selectedItem && (
                                <>
                                    <Text style={styles.modalItemName}>{selectedItem.name}</Text>
                                    <View style={styles.modalImageContainer}>
                                        <Image
                                            source={selectedItem.image}
                                            style={selectedItem.id === 3 || selectedItem.id === 4 
                                                ? { width: 220, height: 260, marginTop: 30 }
                                                : styles.modalImage}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <View style={styles.modalPointsBadge}>
                                        <Text style={styles.modalPointsValue}>
                                            {selectedItem.points}
                                        </Text>
                                        <Text style={styles.modalPointsLabel}>
                                            שעות
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </TouchableOpacity>
                </Modal>
            </LinearGradient>
        </ImageBackground>
    );
};

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 2;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
    },
    container: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    header: {
        padding: 20,
        paddingTop: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(227, 32, 23, 0.9)', // MDA red with opacity
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'white',
        opacity: 0.9,
    },
    pointsContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        margin: 15,
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pointsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E32017',
        textAlign: 'center',
    },
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 15,
        justifyContent: 'space-between',
    },
    itemContainer: {
        width: itemWidth,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        marginBottom: 20,
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
    imageContainer: {
        width: '100%',
        height: itemWidth,
        backgroundColor: 'rgba(248, 248, 248, 0.9)',
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        padding: 10,
        textAlign: 'center',
    },
    pointsBadge: {
        backgroundColor: '#E32017',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 8,
        alignItems: 'center',
    },
    pointsValue: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    pointsLabel: {
        color: 'white',
        fontSize: 12,
        opacity: 0.9,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        width: itemWidth * 2.2, // Made wider
        height: itemWidth * 2.5, // Made taller
        overflow: 'hidden',
    },
    modalImageContainer: {
        width: '100%',
        height: '80%', // Adjusted to leave room for name and points
        backgroundColor: 'rgba(248, 248, 248, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        top: -5,
    },
    modalImage: {
        width: '95%',
        height: '95%',
        resizeMode: 'contain',
    },
    modalItemName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    modalPointsBadge: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#E32017',
        padding: 8,
        alignItems: 'center',
    },
    modalPointsValue: {
        color: 'white',
        fontSize: 22, // Made larger
        fontWeight: 'bold',
    },
    modalPointsLabel: {
        color: 'white',
        fontSize: 16, // Made larger
        opacity: 0.9,
    },
});

export default StoreScreen;

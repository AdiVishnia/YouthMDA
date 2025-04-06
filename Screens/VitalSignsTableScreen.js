import {View, StyleSheet, Image,} from 'react-native';
const PlaceholderImage = require('../Images/VitalSignsTable.jpg');
//נמצא בספר פרוייקט
const VitalSignsTableScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={PlaceholderImage} style={styles.image} resizeMode="cover"/>
            </View>
        </View>
    );
};

export default VitalSignsTableScreen;
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: -4 
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    imageContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0
    }
});
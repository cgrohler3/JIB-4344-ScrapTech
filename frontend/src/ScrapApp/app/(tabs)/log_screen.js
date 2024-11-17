import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log Donation</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="Back"
                    onPress={() => navigation.navigate("home_screen")}
                    color='#376c3e'
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#376c3e',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
});

export default HomeScreen;
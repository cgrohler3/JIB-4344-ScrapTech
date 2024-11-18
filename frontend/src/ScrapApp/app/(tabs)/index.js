import { StyleSheet, Text, View } from 'react-native';

import React from 'react';

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Materials Collection Dashboard</Text>
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
});

export default HomeScreen;

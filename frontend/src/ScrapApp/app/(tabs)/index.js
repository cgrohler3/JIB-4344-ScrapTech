import {Image, StyleSheet, Text, View } from 'react-native';

import React from 'react';

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home</Text>


            <Image
                source={require('../../assets/images/Scrap logo.jpeg')}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingTop: 80,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#376c3e',
    },
    //Scraplanta logo
    image: {
        position: 'absolute',
        bottom: 20,
        right: 50,
        width: 200,

    },
});

export default HomeScreen;

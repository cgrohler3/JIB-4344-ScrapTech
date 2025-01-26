import {Image, Button, TouchableOpacity, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const navigation = useNavigation();

    const handleLogin = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Employee Login</Text>

            <Image
                source={require('../../assets/images/Scrap logo.jpeg')}  // Ensure this path is correct
                style={styles.image}
                resizeMode="contain"
            />


            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="gray"
                value={name}
                onChangeText={setName}
                returnKeyType="done"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="gray"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                returnKeyType="done"
            />

            <View style={styles.buttonContainer}>
                <Button title="Save" onPress={handleLogin} color={'transparent'} />
                <TouchableOpacity onPress={handleLogin} style={styles.button}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>
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
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#376c3e',
        marginBottom: 20,
    },
    input: {
        width: 400,
        height: 63,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
        color: 'gray',
    },
    buttonContainer: {
        marginTop: 20,
        width: 200,
    },
    button: {
        borderColor: '#ddd',
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 40,
    },
    buttonText: {
        color: '#376c3e',
        fontSize: 18,
        fontWeight: 'bold',
    },
    //Scraplanta logo
    image: {
        position: 'absolute',
        bottom: 20,
        right: 50,
        width: 200,
    },
});

export default LoginScreen;

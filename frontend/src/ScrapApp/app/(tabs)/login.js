import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
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
            <Text style={styles.title}>Log In</Text>

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
                <Button title="Save" onPress={handleLogin} color="white" />
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
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#376c3e',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
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
        width: '100%',
        backgroundColor: '#376c3e',
        color: 'white',
    },
});

export default LoginScreen;

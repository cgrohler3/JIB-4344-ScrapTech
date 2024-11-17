import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';

import DropDownPicker from 'react-native-dropdown-picker';

const HomeScreen = () => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Fiber', value: 'Fiber' },
        { label: 'Glass', value: 'Glass' },
        { label: 'Fabric', value: 'Fabric' },
        { label: 'Vinyl', value: 'Vinyl' },
        { label: 'Other', value: 'Other' },
    ]);

    const handleSave = () => {
        if (!name || !quantity || !selectedCategory) {
            Alert.alert('Error', 'All fields are required!');
            return;
        }

        Alert.alert(
            'Confirm Save',
            `You entered:\n\nName: ${name}\nQuantity: ${quantity}\nCategory: ${selectedCategory}\n\nDo you want to save?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Save', onPress: () => finalSave() },
            ]
        );
    };

    const finalSave = () => {
        Alert.alert('Success', 'Donation saved successfully!');
        // Optionally, clear the fields after saving
        setName('');
        setQuantity('');
        setSelectedCategory('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log Donation</Text>

            <TextInput
                style={styles.input}
                placeholder="Item Name"
                placeholderTextColor="gray"
                value={name}
                onChangeText={setName}
                returnKeyType="done"
            />

            <TextInput
                style={styles.input}
                placeholder="Item Quantity"
                placeholderTextColor="gray"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                returnKeyType="done"
            />

            <DropDownPicker
                open={open}
                value={selectedCategory}
                items={items}
                setOpen={setOpen}
                setValue={setSelectedCategory}
                setItems={setItems}
                placeholder="Choose Item Category"
                dropDownContainerStyle={styles.dropdownContainer}
            />

            <View style={styles.buttonContainer}>
                <Button title="Save" onPress={handleSave} color="white" />
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
        color: 'gray'
    },
    dropdownContainer: {
        backgroundColor: 'white',
        borderColor: 'blue',
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%',
        backgroundColor: '#376c3e',
        color: 'white'
    }
});

export default HomeScreen;
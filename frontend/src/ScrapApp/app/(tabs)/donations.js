import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
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
            <View style={styles.navButtons}>
                <Button
                    title="Log Donation"
                    onPress={() => navigation.navigate("log_screen")}
                    color='#376c3e'
                />
                <Button
                    title="Back"
                    onPress={() => navigation.navigate("home_screen")}
                    color='#376c3e'
                />
            </View>

            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="black"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Quantity"
                placeholderTextColor="black"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
            />

<DropDownPicker
                open={open}
                value={selectedCategory}
                items={items}
                setOpen={setOpen}
                setValue={setSelectedCategory}
                setItems={setItems}
                placeholder="Select a category"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
            />

            <View style={styles.buttonContainer}>
                <Button title="Save" onPress={handleSave} color="#376c3e" />
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
    },
    picker: {
        width: '100%',
        height: 40,
        marginBottom: 15,
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%',
    },
    navButtons: {
        width: '100%', 
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
});

export default HomeScreen;

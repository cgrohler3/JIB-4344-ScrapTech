import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { collection, setDoc } from 'firebase/firestore';

import { Dropdown } from 'react-native-element-dropdown';
import { db } from '../../config';
import { useState } from 'react';

// import DropDownPicker from 'react-native-dropdown-picker';

const DLogScreen = () => {
    const [email, setEmail] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [weight, setWeight] = useState('');
    const [category, setCategory] = useState('');
    const [open, setOpen] = useState(false);
    // const [items, setItems] = useState([
        // { label: 'Glass', value: 'Glass' },
        // { label: 'Fabric', value: 'Fabric' },
        // { label: 'Vinyl', value: 'Vinyl' },
        // { label: 'Plastic', value: 'Plastic' },
        // { label: 'Other', value: 'Other' },
    // ]);

    const data = [
        { label: 'Glass', value: 'Glass' },
        { label: 'Fabric', value: 'Fabric' },
        { label: 'Vinyl', value: 'Vinyl' },
        { label: 'Plastic', value: 'Plastic' },
        { label: 'Other', value: 'Other' },
    ];

    const handleSave = () => {
        if (!zipCode || !itemName || !quantity || !weight || !category) {
            Alert.alert('ERROR', 'All product information MUST be filled!');
            return;
        }

        Alert.alert(
            'CONFIRM SAVE',
            `You entered:\n\nEmail: ${email}\nZip Code: ${zipCode}\nItem Name: ${itemName}\nQuantity: ${quantity}\nWeight: ${weight}\nCategory: ${category}\n\nDo you want to save?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Save', onPress: () => finalSave() },
            ]
        );
    };

    const saveDoc = async () => {
        const curr = await setDoc(collection(db, "testing"), {
            email: email,
            zipCode: zipCode,
            itemName: itemName,
            quantity: quantity,
            weight: weight,
            category: category
        });

        console.log(curr);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log Donation</Text>

            <TextInput
                style={styles.input}
                placeholder="Email - OPTIONAL"
                placeholderTextColor="gray"
                value={email}
                onChangeText={setEmail}
                returnKeyType="done"
            />

            <TextInput
                style={styles.input}
                placeholder="Zip Code"
                placeholderTextColor="gray"
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="numeric"
                autoCapitalize="off"
                returnKeyType="done"
            />

            <TextInput
                style={styles.input}
                placeholder="Item Name"
                placeholderTextColor="gray"
                value={itemName}
                onChangeText={setItemName}
                returnKeyType="done"
            />

            <TextInput
                style={styles.input}
                placeholder="Item Weight"
                placeholderTextColor="gray"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                returnKeyType="done"
            />

            {/* <DropDownPicker
                open={open}
                value={category}
                items={items}
                setOpen={setOpen}
                setValue={setCategory}
                setItems={setItems}
                placeholder="Choose Item Category"
                dropDownContainerStyle={styles.dropdownContainer}
            /> */}

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
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 25,
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
        borderColor: "#ddd",
        borderWidth: 1
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%',
        backgroundColor: '#376c3e',
        color: 'white'
    }
});

export default DLogScreen;
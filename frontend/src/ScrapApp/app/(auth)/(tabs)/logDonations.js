import {
	Alert,
	Button,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { Timestamp, addDoc, collection } from 'firebase/firestore'

import { Dropdown } from 'react-native-element-dropdown'
import { db } from '../../../lib/firebaseConfig'
import { useState } from 'react'

const LogDonations = () => {
	const [email, setEmail] = useState('')
	const [zipCode, setZipCode] = useState('')
	const [itemName, setItemName] = useState('')
	const [quantity, setQuantity] = useState(0)
	const [weight, setWeight] = useState(0)
	const [category, setCategory] = useState('')
	const [items, setItems] = useState([
		{ label: 'Glass', value: 'Glass' },
		{ label: 'Fabric', value: 'Fabric' },
		{ label: 'Vinyl', value: 'Vinyl' },
		{ label: 'Plastic', value: 'Plastic' },
		{ label: 'Other', value: 'Other' },
	])

	const handleSave = () => {
		if (!zipCode || !itemName || !quantity || !weight || !category) {
			Alert.alert('ERROR', 'All product information MUST be filled!')
			return
		}

		Alert.alert(
			'CONFIRM SAVE',
			`You entered:\n\nEmail: ${email}\nZip Code: ${zipCode}\nItem Name: ${itemName}\nQuantity: ${quantity}\nWeight: ${weight}\nCategory: ${category}\n\nDo you want to save?`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Save',
					onPress: () => {
						saveDoc()
						setEmail('')
						setZipCode('')
						setItemName('')
						setQuantity('')
						setWeight('')
						setCategory('')
					},
				},
			]
		)
	}

	const saveDoc = async () => {
		const timestamp = Timestamp.now()
		const snapshot = await addDoc(collection(db, 'donations'), {
			email: email,
			zipCode: zipCode,
			itemName: itemName,
			quantity: Number(quantity),
			weight: Number(quantity),
			category: category,
			timestamp: timestamp,
		})

		snapshot
			.then(() => {
				Alert.alert('Success', 'Donation Saved Successfully!')
			})
			.catch((err) => {
				Alert.alert('Fail', 'Error when logging donation: ', err)
			})
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Log Donation</Text>

			<TextInput
				style={styles.input}
				placeholder='Email - OPTIONAL'
				placeholderTextColor='gray'
				value={email}
				onChangeText={setEmail}
				returnKeyType='done'
			/>

			<TextInput
				style={styles.input}
				placeholder='Zip Code'
				placeholderTextColor='gray'
				value={zipCode}
				onChangeText={setZipCode}
				keyboardType='numeric'
				autoComplete='off'
				returnKeyType='done'
			/>
			<TextInput
				style={styles.input}
				placeholder='Item Name'
				placeholderTextColor='gray'
				value={itemName}
				onChangeText={setItemName}
				returnKeyType='done'
			/>

			<TextInput
				style={styles.input}
				placeholder='Item Quantity'
				placeholderTextColor='gray'
				value={quantity}
				onChangeText={setQuantity}
				keyboardType='numeric'
				returnKeyType='done'
			/>

			<TextInput
				style={styles.input}
				placeholder='Item Weight'
				placeholderTextColor='gray'
				value={weight}
				onChangeText={setWeight}
				keyboardType='numeric'
				returnKeyType='done'
			/>

			<Dropdown
				style={styles.dropdown}
				selectedTextStyle={styles.selectedTextStyle}
				data={items}
				labelField='label'
				valueField='value'
				placeholder='Select Category'
				placeholderStyle={styles.placeholderStyle}
				searchPlaceholder='Search...'
				value={category}
				onChange={(item) => {
					setCategory(item.value)
				}}
				activeColor='lightgray'
			/>

			<View style={styles.buttonContainer}>
				<Button title='Save' onPress={handleSave} color='transparent' />
				<TouchableOpacity onPress={handleSave} style={styles.button}>
					<Text style={styles.buttonText}>Save Donation</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
		paddingTop: 80,
		paddingHorizontal: 20,
	},
	dropdown: {
		width: '100%',
		height: 40,
		borderColor: '#ddd',
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		backgroundColor: '#fff',
		color: 'gray',
		fontSize: 14,
	},
	selectedTextStyle: {
		color: 'black',
		fontSize: 14,
	},
	placeholderStyle: {
		color: 'gray',
		fontSize: 14,
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
		color: 'black',
	},
	dropdownContainer: {
		backgroundColor: 'white',
		borderColor: '#ddd',
		width: 400,
		borderWidth: 1,
	},
	buttonContainer: {
		marginTop: 20,
		width: 200,
		backgroundColor: '#376c3e',
		color: 'white',
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
})

export default LogDonations

import {
	Alert,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { Timestamp, addDoc, collection, doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore'

import { Dropdown } from 'react-native-element-dropdown'
import { db } from '../../../lib/firebaseConfig'
import { useState } from 'react'
import axios from "axios"

const LogDonations = () => {
	const [email, setEmail] = useState('')
	const [zipCode, setZipCode] = useState('')
	const [itemName, setItemName] = useState('')
	const [quantity, setQuantity] = useState(0)
	const [weight, setWeight] = useState(0)
	const [category, setCategory] = useState('')

	// Update This Dynamically From DB
	const [items, setItems] = useState([
		{ label: 'Glass', value: 'Glass' },
		{ label: 'Fabric', value: 'Fabric' },
		{ label: 'Vinyl', value: 'Vinyl' },
		{ label: 'Plastic', value: 'Plastic' },
		{ label: 'Other', value: 'Other' },
	])

	const handleSave = () => {
		if (!zipCode || !itemName || !quantity || !weight || !category) {
			Alert.alert('Missing Fields', 'All product information must be filled!')
			return
		}

		Alert.alert(
			'Confirm Save?',
			`You entered:\n\nEmail: ${email}\nZip Code: ${zipCode}\nItem Name: ${itemName}\nQuantity: ${quantity}\nWeight: ${weight}\nCategory: ${category}\n\nDo you want to save?`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Save',
					onPress: () => {
						saveDoc()
						updateZipcode()
						updateHeatmap()
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
			weight: Number(weight),
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

	// Change this to cloud-function
	const updateZipcode = async () => {
		const docRef = doc(db, "zip_codes", zipCode)
		const docSnap = await getDoc(docRef)

		if (docSnap.exists()) {
			await updateDoc(docRef, {
				[`categories.${category}`]: increment(Number(weight)),
				total_donations: increment(1),
				total_weight: increment(Number(weight))
			})
			
		} else {
			const snapshot = await setDoc(doc(db, "zip_codes", zipCode), {
				categories: {
					[category]: Number(weight),
				},
				total_donations: 1,
				total_weight: Number(weight),
			}, { merge: true })

			snapshot.then(() => console.log("Added new zip code"))
		}
	}

	const updateHeatmap = async () => {
		const docRef = doc(db, "zip_positions", zipCode)
		const docSnap = await getDoc(docRef)


		if (!docSnap.exists()) {

			try {
				const url = "https://nominatim.openstreetmap.org/search?postalcode=" + zipCode + "&country=US&format=json"
				const response = await axios.get(url)
	
				if (response.data.length > 0) {
					console.log(response.data[0])
					const {lat, lon} = response.data[0]

					const snapshot = await setDoc(doc(db, "zip_positions", zipCode), {
						total_weight: Number(weight),
						lat: parseFloat(lat),
						long: parseFloat(lon),
					}, { merge: true })

				} else {
					console.log("No coordinate data for request")
				}
			} catch (error) {
				console.error(error)
			}
		} else {
			await updateDoc(docRef, {
				total_weight: increment(Number(weight))
			})
		}
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
				value={category}
				onChange={(item) => {
					setCategory(item.value)
				}}
				activeColor='lightgray'
			/>

			<TouchableOpacity
				style={styles.buttonBox}
				onPress={handleSave}
			>
				<Text style={styles.buttonText}>Save Donation</Text>
			</TouchableOpacity>
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
		width: 400,
		borderWidth: 1,
	},
	buttonBox: {
		height: 40,
		width: '100%',
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#376c3e',
		marginTop: 25
	},
	buttonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
	},
})

export default LogDonations

import {
	Alert,
	Keyboard,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import { Timestamp, addDoc, collection, doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore'

import { Dropdown } from 'react-native-element-dropdown'
import axios from "axios"
import { db } from '../../../lib/firebaseConfig'
import { useState } from 'react'

const LogDonations = () => {
	const [dName, setdName] = useState('')
	const [email, setEmail] = useState('')
	const [zipCode, setZipCode] = useState('')
	const [itemName, setItemName] = useState('')
	const [quantity, setQuantity] = useState(0)
	const [weight, setWeight] = useState(0)
	const [category, setCategory] = useState('')

	// Update This Dynamically From DB
	const [items, setItems] = useState([
		{ label: 'Classroom/Office', value: 'Classroom & Office' },
		{ label: 'Containers', value: 'Containers' },
		{ label: 'Decor', value: 'Decor' },
		{ label: 'Fiber Arts', value: 'Fiber Arts' },
		{ label: 'Fine Arts/Frames', value: 'Fine Arts & Frames' },
		{ label: 'Floral/Garden', value: 'Floral & Garden' },
		{ label: 'Found Objects', value: 'Found Objects' },
		{ label: 'General Craft Supplies', value: 'General Craft Supplies' },
		{ label: 'Glass', value: 'Glass' },
		{ label: 'Holiday', value: 'Holiday' },
		{ label: 'Jewelry', value: 'Jewelry' },
		{ label: 'Paint', value: 'Paint' },
		{ label: 'Papercraft', value: 'Papercraft' },
		{ label: 'Party', value: 'Party' },
		{ label: 'Photography', value: 'Photography' },
		{ label: 'Screen & Block Painting', value: 'Screen & Block Painting' },
		{ label: 'Sculpture', value: 'Sculpture' },
		{ label: 'Soap/Candle Making', value: 'Soap & Candle Making' },
		{ label: 'Tools', value: 'Tools' },
		{ label: 'Toys', value: 'Toys' },
	])

	const clearInputs = () => {
		setdName('')
		setEmail('')
		setZipCode('')
		setItemName('')
		setQuantity('')
		setWeight('')
		setCategory('')
	}

	const handleSave = () => {
		if (!zipCode || !itemName || !quantity || !weight || !category) {
			Alert.alert('Missing Fields', 'All product information must be filled!')
			return
		}

		Alert.alert(
			'Confirm Save?',
			`You entered:\n
			Donor Name: ${dName}
			Donor Email: ${email}
			Zip Code: ${zipCode}
			Item Name: ${itemName}
			Quantity: ${quantity}
			Weight: ${weight}
			Category: ${category}\n\n`+
			`Do you want to save?`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Save',
					onPress: () => {
						saveDoc()
						updateZipcode()
						updateCategory()
						updateHeatmap()
						clearInputs()
					},
				},
			]
		)
	}

	const saveDoc = async () => {
		const timestamp = Timestamp.now()

		try {
			const snapshot = await addDoc(collection(db, 'donations'), {
				name: dName,
				email: email,
				zipCode: zipCode,
				itemName: itemName,
				quantity: Number(quantity),
				weight: Number(weight),
				category: category,
				timestamp: timestamp,
			})
			Alert.alert('Success', 'Donation Saved Successfully!')
		} catch (err) {
			Alert.alert('Fail', 'Error when logging donation: ', err)
		}
	}

	const updateCategory = async () => {
		const docRef = doc(db, "categories", category)
		const docSnap = await getDoc(docRef)

		if (docSnap.exists()) {
			await updateDoc(docRef, {
				[`zipMap.${zipCode}`]: increment(Number(weight)),
				total_donations: increment(1),
				total_weight: increment(Number(weight))
			})

		} else {
			const snapshot = await setDoc(doc(db, "categories", category), {
				zipMap: {
					[zipCode]: Number(weight),
				},
				total_donations: 1,
				total_weight: Number(weight),
			}, {merge: true})

			snapshot.then(() => console.log("Added new category"))
		}
	}


	const updateZipcode = async () => {
		const docRef = doc(db, "zipCodes", zipCode)
		const docSnap = await getDoc(docRef)

		if (docSnap.exists()) {
			await updateDoc(docRef, {
				[`categories.${category}`]: increment(Number(weight)),
				total_donations: increment(1),
				total_weight: increment(Number(weight))
			})

		} else {
			const snapshot = await setDoc(doc(db, "zipCodes", zipCode), {
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
		const docRef = doc(db, "zipPositions", zipCode)
		const docSnap = await getDoc(docRef)

		if (!docSnap.exists()) {
			try {
				const url = "https://nominatim.openstreetmap.org/search?postalcode=" + zipCode + "&country=US&format=json"
				const response = await axios.get(url)

				if (response.data.length > 0) {
					console.log(response.data[0])
					const {lat, lon} = response.data[0]

					const snapshot = await setDoc(doc(db, "zipPositions", zipCode), {
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
			<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 25, paddingVertical: 20 }}>
				<Text style={styles.title}>Log Donation</Text>
				<TouchableOpacity
					style={styles.buttonBoxAlt}
					onPress={clearInputs}
				>
					<Text style={styles.buttonTextAlt}>CLEAR</Text>
				</TouchableOpacity>
				<TextInput
					style={styles.donorInput}
					placeholder='Donor Name - OPTIONAL'
					placeholderTextColor='gray'
					value={dName}
					onChangeText={setdName}
					returnKeyType='done'
				/>
				<TextInput
					style={styles.donorInput}
					placeholder='Donor Email - OPTIONAL'
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
					onChangeText={(text) => {
						const numeric = text.replace(/[^0-9]/g, '').slice(0, 5);
						setZipCode(numeric);
					  }}
					keyboardType="numeric"
					autoComplete='off'
					returnKeyType='done'
					onBlur={() => Keyboard.dismiss()}
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
					onChangeText={(text) => {
						const cleaned = text.replace(/[^0-9.]/g, '');
						const parts = cleaned.split('.');
						if (parts.length > 2) return;
						setQuantity(cleaned);
					  }}
					keyboardType='numeric'
					returnKeyType='done'
				/>
				<TextInput
					style={styles.input}
					placeholder='Item Weight'
					placeholderTextColor='gray'
					value={weight}
					onChangeText={(text) => {
						const cleaned = text.replace(/[^0-9.]/g, '');
						const parts = cleaned.split('.');
						if (parts.length > 2) return;
						setWeight(cleaned);
					  }}
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
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	title: {
		fontSize: 25,
		fontWeight: 'bold',
		color: '#376c3e',
		marginBottom: 20,
		alignSelf: 'center'
	},
	donorInput: {
		width: '100%',
		height: 40,
		borderWidth: 1.5,
		borderRadius: 5,
		borderColor: '#376c3e',
		paddingHorizontal: 10,
		marginBottom: 15,
		backgroundColor: '#fff',
		color: 'black',
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
	buttonBoxAlt: {
		height: 30,
		width: 75,
		borderWidth: 2,
		borderColor: 'gray',
		borderRadius: 3,
		paddingHorizontal: 10,
		justifyContent: 'center',
		alignItems: 'center',
		position: "absolute",
		left: 370,
		top: 50,
	},
	buttonTextAlt: {
		fontWeight: 'bold',
		color: '#376c3e',
	},
})

export default LogDonations
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
import { Timestamp, addDoc, collection, doc, getDoc, getDocs, increment, setDoc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { Dropdown } from 'react-native-element-dropdown'
import axios from "axios"
import { db } from '../../../lib/firebaseConfig'

const LogDonations = () => {
	const [dName, setdName] = useState('')
	const [email, setEmail] = useState('')
	const [zipCode, setZipCode] = useState('')
	const [itemName, setItemName] = useState('')
	const [quantity, setQuantity] = useState(0)
	const [weight, setWeight] = useState(0)
	const [category, setCategory] = useState('')
	const [items, setItems] = useState([])

	useEffect(() => {
		getItems()
	}, [])

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

	const getItems = async () => {
		const snapshot = await getDocs(collection(db, "items"))
		const docs = []
		snapshot.forEach((doc) => {
			docs.push({ label: doc.data().label, value: doc.data().label })
		})
		docs.sort((a,b) => a.label.localeCompare(b.label))
		setItems(docs)
	}

	const saveDoc = async () => {
		const timestamp = Timestamp.now()

		try {
			await addDoc(collection(db, 'donations'), {
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

			snapshot.then(() => console.log("Added New Category"))
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

			snapshot.then(() => console.log("Added New Zip Code"))
		}
	}

	const updateHeatmap = async () => {
		const docRef = doc(db, "zipPositions", zipCode)
		const docSnap = await getDoc(docRef)

		if (!docSnap.exists()) {
			try {
				const url = `https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&country=US&format=json`
				const response = await axios.get(url)

				if (response.data.length > 0) {
					const {lat, lon} = response.data[0]

					await setDoc(doc(db, "zipPositions", zipCode), {
						total_weight: Number(weight),
						lat: parseFloat(lat),
						long: parseFloat(lon),
					}, { merge: true })

				} else {
					console.log("Couldn't Find Zipcode! Ensure Zipcode Is Valid!")
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
				<View style={styles.clearBtn}>
					<TouchableOpacity
						style={styles.buttonBoxAlt}
						onPress={clearInputs}
					>
						<Text style={styles.buttonTextAlt}>CLEAR</Text>
					</TouchableOpacity>
				</View>
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
					placeholder='Item Weight (lbs)'
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
					search={true}
					mode="modal"
					onFocus={getItems}
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
	clearBtn: {
		position: "relative"
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
		marginBottom: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: "#376c3e",
		position: "absolute",
		top: -47,
	},
	buttonTextAlt: {
		fontWeight: 'bold',
		color: '#376c3e',
	},
})

export default LogDonations
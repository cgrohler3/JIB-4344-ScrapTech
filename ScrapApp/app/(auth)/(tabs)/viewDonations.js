import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { collection, deleteDoc, deleteField, doc, getDoc, getDocs, increment, orderBy, query, startAt, updateDoc, where } from 'firebase/firestore'

import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { db } from '../../../lib/firebaseConfig'

const ViewDonations = () => {
	const [donations, setDonations] = useState([])
	const [isVisible, setVisible] = useState(false)
	const [isLoading, setLoading] = useState(true)

	const getRecentDocs = async () => {
		setLoading(true)
		if (!isVisible) setVisible(true)
			
		const twoDaysAgo = new Date()
		twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
		twoDaysAgo.setHours(0, 0, 0, 0)

		const qryRef = query(collection(db, 'donations'), orderBy('timestamp'), startAt(twoDaysAgo))
		const snapshot = await getDocs(qryRef)
		const docs = []
		snapshot.forEach((doc) => {
			docs.push({ id: doc.id, ...doc.data() })
		})
		
		setDonations(docs)
		setLoading(false)
	}

	// Heap Map Removal
	const hmRemove = async (zip, weight) => {
		try {
			const hmRef = doc(db, "zipPositions", zip)
			const hmSnap = await getDoc(hmRef)
	
			if (!hmSnap.exists()) return

			if (hmSnap.get("total_weight") == Number(weight)) {
				await deleteDoc(hmRef)
			} else {
				await updateDoc(hmRef, {
					total_weight: increment(-1 * Number(weight))
				})
			}

			console.log("Delete From Zip Positions Successfull!")
		} catch (e) {
			console.log("Heap Map Removal Error: ", e)
		}
	}

	// Categories Removal
	const catRemove = async (zip, weight, category) => {
		try {
			const qryRef = query(collection(db, "categories"), where("category", "==", category))
			const qrySnap = await getDocs(qryRef)
			
			if (qrySnap.empty) return

			const catRef = qrySnap.docs[0].ref
			const catSnap = await getDoc(catRef)

			if (catSnap.get("total_weight") == Number(weight)) {
				await deleteDoc(catRef)
			} else {
				const map = catSnap.get("zipMap")
				if (map[zip] == Number(weight)) {
					await updateDoc(catRef, {
						[`zipMap.${zip}`]: deleteField(),
						total_donations: increment(-1),
						total_weight: increment(-1 * Number(weight))
					})
				} else {
					await updateDoc(catRef, {
						[`zipMap.${zip}`]: increment(-1 * Number(weight)),
						total_donations: increment(-1),
						total_weight: increment(-1 * Number(weight))
					})
				}
			}

			console.log("Delete From Categories Successfull!")
		} catch (e) {
			console.log("Categories Removal Error: ", e)
		}
	}

	// Zip Codes Removal
	const zipRemove = async (zip, weight, category) => {
		try {
			const zipRef = doc(db, "zipCodes", zip)
			const zipSnap = await getDoc(zipRef)

			if (!zipSnap.data()) return

			if (zipSnap.get("total_weight") == Number(weight)) {
				await deleteDoc(zipRef)
			}
			else {
				const map = zipSnap.get("categories")
				if (map[category] == Number(weight)) {
					await updateDoc(zipRef, {
						[`categories.${category}`]: deleteField(),
						total_donations: increment(-1),
						total_weight: increment(-1 * Number(weight))
					})
				} else {
					await updateDoc(zipRef, {
						[`categories.${category}`]: increment(-1 * Number(weight)),
						total_donations: increment(-1),
						total_weight: increment(-1 * Number(weight))
					})
				}
			}

			console.log("Delete From Zip Codes Successfull!")
		} catch (e) {
			console.log("Zip Codes Removal Error: ", e)
		}
	}

	const confirmDelete = async (id) => {
		Alert.alert(
			'Confirm Delete?',
			'You\'re tring to delete a donation. This action cannot be UNDONE.',
			[
				{text: 'Cancel'},
				{
					text: 'DELETE',
					onPress: () => {
						handleDelete(id)
					}
				}
			]
		)
	}

	const handleDelete = async (id) => {
		const docRef = doc(db, 'donations', id)
		const docSnap = await getDoc(docRef)

		if (!docSnap.exists()){
			console.log("Donation Doesn't Exist!")
			return
		}

		const zip = docSnap.get("zipCode")
		const category = docSnap.get("category")
		const weight = docSnap.get("weight")

		await hmRemove(zip, weight)
		await catRemove(zip, weight, category)
		await zipRemove(zip, weight, category)

		// Donation Removal
		await deleteDoc(docRef)
		Alert.alert('Success', 'Donation Removed Successfully!')

		console.log(`Deleted document: ID=${id}, zip=${zip}, cat=${category}, weight=${weight}`)
		getRecentDocs()
	}

	return (
		<View style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 25, paddingVertical: 20 }}>
				<Text style={styles.title}>Recent Donations (Last 48-Hours)</Text>
				<View style={[isVisible ? styles.container : styles.hidden]}>
					<ScrollView persistentScrollbar={true} nestedScrollEnabled={true}>
						{isLoading ? (
							<ActivityIndicator size={'large'} style={{ margin: 28 }} />
						) : (donations.length > 0) ? (
							Object.keys(donations).map(key => (
								<View key={key} style={styles.childBox}>
									<View style={styles.modifyBox}>
										<TouchableOpacity onPress={() => confirmDelete(donations[key].id)}>
											<FontAwesome6 name={'trash-can'} size={20} color='#ed2d2d' />
										</TouchableOpacity>
									</View>
									<Text style={styles.dataText}><Text style={{fontWeight: "bold"}}>Donor Email: </Text>{"\t"}{donations[key].email ? donations[key].email : "N/A"}</Text>
									<Text style={styles.dataText}><Text style={{fontWeight: "bold"}}>Donor Name: </Text>{"\t"}{donations[key].name ? donations[key].name : "N/A"}</Text>
									<Text style={styles.dataText}><Text style={{fontWeight: "bold"}}>Zip Code: </Text>{"\t"}{donations[key].zipCode}</Text>
									<Text style={styles.dataText}><Text style={{fontWeight: "bold"}}>Item Name: </Text>{"\t"}{donations[key].itemName}</Text>
									<Text style={styles.dataText}><Text style={{fontWeight: "bold"}}>Quantity: </Text>{"\t"}{donations[key].quantity}</Text>
									<Text style={styles.dataText}><Text style={{fontWeight: "bold"}}>Weight (lbs): </Text>{"\t"}{donations[key].weight}</Text>
									<Text style={styles.dataText}><Text style={{fontWeight: "bold"}}>Category: </Text>{"\t"}{donations[key].category}</Text>
								</View>
							))
						) : (
							<View style={styles.childBox}>
								<Text style={styles.dataText}><Text style={{fontWeight: "bold"}}>❗No Donations Found!</Text></Text>
							</View>
						)}
					</ScrollView>
				</View>
				<View style={styles.btnContainer}>
					<TouchableOpacity
						style={styles.buttonBox}
						onPress={getRecentDocs}
					>
						<Text style={styles.buttonText}>Retrieve Donations</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.buttonBoxAlt}
						onPress={() => {
							setDonations([])
							setVisible(false)
						}}
					>
						<Text style={styles.buttonTextAlt}>CLEAR</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	title: {
		fontSize: 25,
		fontWeight: 'bold',
		color: '#376c3e',
		marginBottom: 20,
		alignSelf: 'center',
	},
	container: {
		height: 400,
        borderColor: 'darkgray',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
    },
	hidden: {
		height: 10,
        borderColor: 'darkgray',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
    },
	childBox: {
		margin: 10,
		padding: 10,
		elevation: 5,
		backgroundColor: "white",
		borderColor: '#376c3e',
		borderWidth: 2,
		borderRadius: 8,
	},
	dataText: {
		paddingVertical: 3,
		borderBottomWidth: 1,
		borderBottomColor: 'gray',
	},
	modifyBox: {
		position: "absolute",
		top: 8,
		right: 10,
		zIndex: 10
	},
	btnContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 25
	},
	buttonBox: {
		height: 40,
		width: "82%",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 3,
		backgroundColor: '#376c3e',
	},
	buttonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
	},
	buttonBoxAlt: {
		height: 40,
		width: "15%",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: '#376c3e',
		borderRadius: 3,
	},
	buttonTextAlt: {
		fontWeight: 'bold',
		color: '#376c3e',
	}
})

export default ViewDonations

import {Dimensions, ScrollView, StyleSheet, TouchableOpacity} from 'react-native'
import { Text, View } from 'react-native'
import { collection, getDocs } from 'firebase/firestore'

import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { db } from '../../../lib/firebaseConfig'
import React, { useState } from 'react'

const ViewDonations = () => {
	const [donations, setDonations] = useState([])

	const getAllDocs = async () => {
		const snapshot = await getDocs(collection(db, 'donations'))
		const docs = []
		snapshot.forEach((doc) => {
			docs.push({ id: doc.id, ...doc.data() })
		})
		setDonations(docs)
	}

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 25, paddingVertical: 20 }}>
				<Text style={styles.title}>View Donations</Text>
				<View style={styles.parentBox}>
					<ScrollView persistentScrollbar={true} nestedScrollEnabled={true}>
						{donations &&
							Object.keys(donations).map(key => (
								<View key={key} style={styles.childBox}>
									<View style={styles.editButtonBox}>
										{/* Edit Button */}
										<TouchableOpacity onPress={() => false} style={styles.editButton}>

											<FontAwesome6 name={'pencil'} size={20} color='black' />
										</TouchableOpacity>

										{/* Delete Button */}
										<TouchableOpacity onPress={() => false} style={styles.editButton}>
											<FontAwesome6 name={'trash-can'} size={20} color='black' />
										</TouchableOpacity>
									</View>
									<Text style = {styles.dataText}><Text style={{fontWeight: "bold"}}>Email: </Text>{"\t"}{donations[key].email ? donations[key].email : "N/A"}</Text>
									<Text style = {styles.dataText}><Text style={{fontWeight: "bold"}}>Zip Code: </Text>{"\t"}{donations[key].zipCode}</Text>
									<Text style = {styles.dataText}><Text style={{fontWeight: "bold"}}>Item Name: </Text>{"\t"}{donations[key].itemName}</Text>
									<Text style = {styles.dataText}><Text style={{fontWeight: "bold"}}>Quantity: </Text>{"\t"}{donations[key].quantity}</Text>
									<Text style = {styles.dataText}><Text style={{fontWeight: "bold"}}>Weight: </Text>{"\t"}{donations[key].weight}</Text>
									<Text style = {styles.dataText}><Text style={{fontWeight: "bold"}}>Category: </Text>{"\t"}{donations[key].category}</Text>
								</View>
							))
						}
					</ScrollView>
				</View>
				<TouchableOpacity
					style={styles.buttonBox}
					onPress={getAllDocs}
				>
					<Text style={styles.buttonText}>Retrieve Donations</Text>
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
	parentBox: {
		height: '315',
		width: '100%',
		borderColor: 'darkgreen',
		borderWidth: 2,
		borderRadius: 5
	},
	childBox: {
		backgroundColor: '#fff',
		elevation: 2,
		margin: 10,
		padding: 10,
		borderColor: 'black',
		borderWidth: 2,
		borderRadius: 8,
	},
	editButtonBox: {
		position: "absolute",
		top: 10,
		right: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	editButton: {
		marginRight: 10,
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
	dataText: {
		paddingVertical: 2,
		borderBottomWidth: 1,
		borderBottomColor: 'black',
	},
})

export default ViewDonations

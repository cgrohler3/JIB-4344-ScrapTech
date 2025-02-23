import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, View } from 'react-native'
import { collection, getDocs, orderBy, startAt, query } from 'firebase/firestore'

import { db } from '../../../lib/firebaseConfig'
import { useState } from 'react'

const ViewDonations = () => {
	const [donations, setDonations] = useState([])

	const getAllDocs = async () => {
		
		const now = new Date()
		const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)
		const docQuery = query(
			collection(db, 'donations'),
			orderBy('timestamp'),
			startAt(twoDaysAgo)
		)
		
		const snapshot = await getDocs(docQuery)
		const docs = []
		snapshot.forEach((doc) => {
			docs.push({ id: doc.id, ...doc.data() })
		})
		setDonations(docs)
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>View Donations</Text>
			<View style={styles.parentBox}>
				<ScrollView persistentScrollbar={true}>
					{donations &&
						Object.keys(donations).map(key => (
							<View key={key} style={styles.childBox}>
								<Text><Text style={{fontWeight: "bold"}}>Email: </Text>{"\t\t\t\t\t\t\t\t"}{donations[key].email ? donations[key].email : "N/A"}</Text>
								<Text><Text style={{fontWeight: "bold"}}>Zip Code: </Text>{"\t\t\t\t\t"}{donations[key].zipCode}</Text>
								<Text><Text style={{fontWeight: "bold"}}>Item Name: </Text>{"\t\t\t"}{donations[key].itemName}</Text>
								<Text><Text style={{fontWeight: "bold"}}>Quantity: </Text>{"\t\t\t\t\t"}{donations[key].quantity}</Text>
								<Text><Text style={{fontWeight: "bold"}}>Weight: </Text>{"\t\t\t\t\t\t"}{donations[key].weight}</Text>
								<Text><Text style={{fontWeight: "bold"}}>Category: </Text>{"\t\t\t\t"}{donations[key].category}</Text>
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
	title: {
		fontSize: 25,
		fontWeight: 'bold',
		color: '#376c3e',
		marginBottom: 20,
	},
	parentBox: {
		height: '315',
		width: '100%',
		borderColor: 'darkgray',
		borderWidth: 1,
		borderRadius: 5
	},
	childBox: {
		margin: 10,
		padding: 10,
		borderColor: 'darkgray',
		borderWidth: 1,
		borderRadius: 5,
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

export default ViewDonations

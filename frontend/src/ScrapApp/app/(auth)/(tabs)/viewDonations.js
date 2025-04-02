import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, View } from 'react-native'
import { collection, getDocs } from 'firebase/firestore'

import { db } from '../../../lib/firebaseConfig'
import { useState } from 'react'

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
		margin: 10,
		padding: 10,
		borderColor: 'black',
		borderWidth: 2,
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
	dataText: {
		paddingVertical: 2,  
		borderBottomWidth: 1,  
		borderBottomColor: 'black',  
	},
})

export default ViewDonations

import * as FileSystem from "expo-file-system"

import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { auth, db } from '../../../lib/firebaseConfig'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

import Feather from '@expo/vector-icons/Feather'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Linking } from 'react-native'
import Papa from "papaparse"
import { onAuthStateChanged } from 'firebase/auth'
import { shareAsync } from "expo-sharing"

const HomeScreen = () => {
	const [email, setEmail] = useState('')
	
	onAuthStateChanged(auth, (user) => {
		if (user) {
			setEmail(user.email)
		}
	})
	
	const openCalendly = () => {
		const calendlyUrl = 'https://calendly.com/scraplantadonations/scraplanta-donation-appointments'
		Linking.openURL(calendlyUrl)
	}

	const exportDonations = async () => {
		try {
			const qryRef = query(collection(db, "donations"), orderBy("timestamp", "asc"))
			const qrySnap = await getDocs(qryRef)

			if (qrySnap.empty) {
				Alert.alert("No Donations Found!")
				return
			}

			const donations = {
				fields: ["Date", "Donor Name", "Donor Email", "Category", "Zipcode", "Item Name", "Item Quantity", "Item Weight (lbs)"],
				data: []
			}
			qrySnap.docs.forEach((doc) => {
				donations.data.push([
					doc.data().timestamp.toDate().toLocaleDateString(),
					doc.data().name,
					doc.data().email,
					doc.data().category,
					doc.data().zipCode,
					doc.data().itemName,
					doc.data().quantity,
					doc.data().weight
				])
			})

			const csv = Papa.unparse(donations)
			const fileURI = FileSystem.documentDirectory + "donation-log.csv"

			await FileSystem.writeAsStringAsync(fileURI, csv, {
				encoding: FileSystem.EncodingType.UTF8
			})
			await shareAsync(fileURI)
		} catch (error) {
			console.log("Error Exporting Data: ", error)
		}
	}

	return (
		<View style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 25, paddingVertical: 20 }}>
				<TouchableOpacity
					style={styles.buttonBoxAlt}
					onPress={exportDonations}>
					<Text style={styles.buttonTextAlt}><Feather name="download" size={19} color="#376c3e" /> Download CSV</Text>
				</TouchableOpacity>
				<View>
					<View style={styles.imageBox}>
						<Image
							source={require('../../../assets/images/scraplanta-logo.png')}
							style={styles.image}
							resizeMode='contain'
						/>
						<Text style={styles.title}>Welcome, {email}!</Text>
					</View>
					<View style = {styles.btnContainer}>
						<Text style={styles.btnTitle}>Booking an Appointment?</Text>
						<TouchableOpacity
							style={styles.calButton}
							onPress={openCalendly}>
							<Text style={styles.calButtonText}><FontAwesome name="external-link" size={18} color="white"/> Open Calendly</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</View>

	)
}

const styles = StyleSheet.create({
	imageBox: {
		flex: 1,
		alignItems: 'center',
		marginBottom: 25
	},
	image: {
		width: 125,
		height: 100,
		padding: 0,
	},
	title: {
		fontSize: 25,
		fontWeight: 'bold',
		color: '#376c3e',
		marginTop: 5
	},
	btnContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	btnTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#376c3e',
		marginTop: 20
	},
	calButton: {
		height: 40,
		width: 200,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#376c3e',
		marginTop: 10
	},
	calButtonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
	},
	buttonBoxAlt: {
		height: 40,
		width: 130,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: '#376c3e',
		borderRadius: 3,
		position: "absolute",
		top: 15,
		right: 15
	},
	buttonTextAlt: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#376c3e',
	}
})

export default HomeScreen

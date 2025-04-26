import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Linking } from 'react-native';

import { db } from '../../../lib/firebaseConfig'
import { auth } from '../../../lib/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { collection, getDocs } from 'firebase/firestore'
import * as FileSystem from 'expo-file-system'
import { shareAsync } from 'expo-sharing'
import Papa from 'papaparse'
const HomeScreen = () => {
	const [email, setEmail] = useState('')
	const openCalendly = () => {
		const calendlyUrl = 'https://calendly.com/scraplantadonations/scraplanta-donation-appointments';
		Linking.openURL(calendlyUrl);
	};

	const exportDonos = async () => {
		try {
			const snapshot = await getDocs(collection(db, "donations"))
			const formattedData = snapshot.docs.map(doc => {
			  const data = doc.data();
	
			  //Timestamp formatted as a date
			  const timestamp = data.timestamp ? data.timestamp.toDate() : null;
			  const formattedDate = timestamp
				? `${(timestamp.getMonth() + 1).toString().padStart(2, '0')}/${timestamp.getDate().toString().padStart(2, '0')}/${timestamp.getFullYear()}`
				: "";
		
			  return {
				Date: formattedDate,
				"Full Name": data.name || "",
				Email: data.email || "",
				Zipcode: data.zipCode || "",
				Weight: data.weight || "",
				Category: data.category || "",
			  };
			});
		
			const csv = Papa.unparse(formattedData);
			const fileUri = FileSystem.documentDirectory + 'donation-log.csv';
			await FileSystem.writeAsStringAsync(fileUri, csv, {
			  encoding: FileSystem.EncodingType.UTF8,
			});

			await shareAsync(fileUri);
		
		  } catch (error) {
			console.error("Error exporting data:", error);
		  }
	}



	onAuthStateChanged(auth, (user) => {
		if (user) {
			setEmail(user.email)
		}
	})

	return (
		<View style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{justifyContent: 'center', paddingHorizontal: 25 }}>
				<View style={styles.imageBox}>
					<Image
						source={require('../../../assets/images/scraplanta-logo.png')}
						style={styles.image}
						resizeMode='contain'
					/>
					<Text style={styles.title}>Welcome, {email}!</Text>
				</View>
			</ScrollView>
			<View style = {styles.buttonContainer}>
				<Text style={styles.calendarText}>Booking an Appointment?</Text>
				<TouchableOpacity
					style={styles.calButton}
					onPress={openCalendly}>
					<Text style={styles.calButtonText}>Open Calendly</Text>
				</TouchableOpacity>
			</View>
			<View style = {styles.buttonContainer}>
				<Text style={styles.calendarText}>Ready to Export?</Text>
				<TouchableOpacity
					style={styles.calButton}
					onPress={exportDonos}>
					<Text style={styles.calButtonText}>Export ALL Donos</Text>
				</TouchableOpacity>
			</View>
		</View>

	)
}

const styles = StyleSheet.create({
	imageBox: {
		flex: 1,
		alignItems: 'center',
		marginBottom: 25,
		marginTop: 100,
	},
	image: {
		width: 200,
		height: 100,
		padding: 0,
	},
	title: {
		fontSize: 25,
		fontWeight: 'bold',
		color: '#376c3e',
		marginTop: 20
	},
	buttonContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 350,
	},
	calendarText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#376c3e',
	},
	calButton: {
		width: 200,
		height: 45,
		borderWidth: 2,
		backgroundColor: '#376c3e',
		borderRadius: 3,
		paddingHorizontal: 10,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
	},
	calButtonText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
	},
})

export default HomeScreen

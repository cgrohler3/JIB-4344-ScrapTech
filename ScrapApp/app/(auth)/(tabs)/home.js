import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Linking } from 'react-native';
import { auth } from '../../../lib/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'

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

	return (
		<View style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 25, paddingVertical: 20 }}>
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
})

export default HomeScreen

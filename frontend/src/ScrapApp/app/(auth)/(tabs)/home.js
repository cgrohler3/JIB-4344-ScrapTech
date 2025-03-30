import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

import { auth } from '../../../lib/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'

const HomeScreen = () => {
	const [email, setEmail] = useState('')

	onAuthStateChanged(auth, (user) => {
		if (user) {
			setEmail(user.email)
		}
	})

	return (
		<View style={styles.container}>
			<View>
				<Image
					source={require("../../../assets/images/scraplanta-logo.png")}
					style={styles.image}
					resizeMode="contain"
				/>
			</View>
			<View>
				<Text style={styles.title}>Welcome, {email}</Text>
			</View>
			<View style={styles.section}>
				<Text style = {styles.insTitle}>***Remember***</Text>
				<Text style = {styles.insBody}>+ Get BOTH <Text style={styles.grnTxt}>email address</Text> AND <Text style={styles.grnTxt}>name</Text> for donors who want <Text style={styles.grnTxt}>receipts</Text></Text>
				<Text style={styles.insBody}>+ Zip Code is <Text style={styles.redTxt}>REQUIRED</Text></Text>
			</View>
			<View style={styles.section}>
				<Text style={styles.insTitle}>First Time Logging Data?</Text>
				<Text style={styles.insBody}>+ Select <Text style={styles.grnTxt}>Log Donation</Text> from the options below</Text>
				<Text style={styles.insBody}>+ Enter data and Save Donation</Text>
				<Text style={styles.insBody}>+ Double check that information is accurate</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
		paddingTop: 50,
	},
	button: {
		position: 'absolute',
		top: 20,
		right: 20,
	},
	title: {
		fontSize: 25,
		fontWeight: 'bold',
		color: '#376c3e',
		paddingBottom: 96
	},
	image: {
        width: 200,
		height: 100,
		padding: 0,
		marginBottom: 15
    },
	navigation: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: 32,
		paddingTop: 64
	},
	insTitle: {
		textAlign: 'center',
		fontSize: 42,
		paddingBottom: 16
	},
	insBody: {
		textAlign: 'center',
		fontSize: 20,
		paddingBottom: 16
	},
	grnTxt: {
		color: '#376c3e',
		fontWeight: 'bold'
	},
	redTxt: {
		color: 'red'
	},
	section: {
		paddingBottom: 96
	}
})

export default HomeScreen

import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
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
		<View style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 25 }}>
				<View style={styles.imageBox}>
					<Image
						source={require('../../../assets/images/scraplanta-logo.png')}
						style={styles.image}
						resizeMode='contain'
					/>
					<Text style={styles.title}>Welcome, {email}!</Text>
				</View>
			</ScrollView>
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
	calendar: {
		flex: 1,
		height: 1000,
	},
})

export default HomeScreen

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
			<Text style={styles.title}>Welcome, {email}</Text>
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
})

export default HomeScreen

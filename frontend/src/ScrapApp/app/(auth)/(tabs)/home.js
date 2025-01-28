import { Button, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

import { auth } from '../../../lib/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'expo-router'

const HomeScreen = () => {
	const router = useRouter()
	const [email, setEmail] = useState('')

	onAuthStateChanged(auth, (user) => {
		if (user) {
			setEmail(user.email)
		}
	})

	const handleLogoff = () => {
		auth.signOut()
			.then(() => {
				router.replace('/')
			})
			.catch((err) => alert(err.message))
	}

	return (
		<View style={styles.container}>
			<Image
				source={require("../../../assets/images/scraplanta-logo.png")}
				style={styles.image}
				resizeMode="contain"
			/>
			<Text style={styles.title}>Welcome, {email}</Text>
			<Button title='Sign Out' onPress={handleLogoff} />
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
	},
	title: {
		fontSize: 25,
		fontWeight: 'bold',
		color: '#376c3e',
	},
	image: {
        position: 'absolute',
        bottom: 20,
        right: 50,
        width: 200,
    }
})

export default HomeScreen

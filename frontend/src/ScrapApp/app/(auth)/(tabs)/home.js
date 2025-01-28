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
				resizeMode="center"
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
		paddingTop: 50,
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
    }
})

export default HomeScreen

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
			<View style={styles.img}>
				<Image
					source={require("../../../assets/images/scraplanta-logo.png")}
					style={styles.image}
					resizeMode="contain"
				/>
			</View>
			<View style={styles.button}>
				<Button title='Sign Out' onPress={handleLogoff} />
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
    }
})

export default HomeScreen

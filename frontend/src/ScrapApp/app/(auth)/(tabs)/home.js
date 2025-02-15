import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { auth } from '../../../lib/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'expo-router'
import {verifyUser} from '../../../helpers/verifyUser'

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
	const isEmployee = verifyUser();

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
			<View style={styles.navigation}>
				<TouchableOpacity>
					<FontAwesome6 name='house' size={48} color='black' />
				</TouchableOpacity>

				<TouchableOpacity>
					<FontAwesome6 name='box-open' size={48} color='black' />
				</TouchableOpacity>

				{isEmployee && (
					<>
						<TouchableOpacity>
							<FontAwesome6 name='file-text' size={48} color='black' />
						</TouchableOpacity>

						<TouchableOpacity>
							<FontAwesome6 name='chart-pie' size={48} color='black' />
						</TouchableOpacity>
					</>
				)}
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

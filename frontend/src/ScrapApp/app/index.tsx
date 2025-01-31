import {
	ActivityIndicator,
	Button,
	Image,
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import React, { useState } from 'react'
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth'

import { auth } from '../lib/firebaseConfig'

export default function Index() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const signUp = async () => {
		setLoading(true)
		await createUserWithEmailAndPassword(auth, email, password)
			.then((userCredentials) => {
				const user = userCredentials.user
				console.log('Signed Up With: ', user.email)
			})
			.catch((err) => {
				switch (err.code) {
					case 'auth/invalid-email':
						alert('Your entered email is invalid.')
						break
					case 'auth/email-already-in-use':
						alert(
							'This email has an account already. Try logging in.'
						)
						break
					case 'auth/weak-password':
						alert('Your password must be 6 characters or longer.')
						break
					default:
						alert('Error signing up. Try later or contact Admin.')
						console.error(err)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}

	const signIn = async () => {
		setLoading(true)
		await signInWithEmailAndPassword(auth, email, password)
			.then((userCredentials) => {
				const user = userCredentials.user
				console.log('Signed In With: ', user.email)
			})
			.catch((err) => {
				switch (err.code) {
					case 'auth/user-not-found':
						alert(
							'No accounts exist with this email. Try signing up.'
						)
						break
					case 'auth/user-disabled':
						alert('User has been disabled.')
						break
					default:
						alert('Error logging in. Try later or contact Admin.')
						console.error(err)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}

	return (
		<View style={styles.container}>
			<View style={styles.imageBox}>
				<Image
					source={require("../assets/images/scraplanta-logo.png")}
					style={styles.image}
					resizeMode="center"
				/>
			</View>
			<KeyboardAvoidingView behavior='padding'>
				<TextInput
					style={styles.input}
					value={email}
					onChangeText={setEmail}
					autoCapitalize='none'
					keyboardType='email-address'
					placeholder='Email'
				/>
				<TextInput
					style={styles.input}
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					placeholder='Password'
				/>
				{loading ? (
					<ActivityIndicator size={'large'} style={{ margin: 28 }} />
				) : (
					<View style={{ marginTop: 15, gap: 10 }}>
						<TouchableOpacity
							style={styles.buttonBox}
							onPress={signIn}
						>
							<Text style={styles.buttonText}>LOGIN</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.buttonBoxAlt}
							onPress={signUp}
						>
							<Text style={styles.buttonTextAlt}>REGISTER</Text>
						</TouchableOpacity>
					</View>
				)}
			</KeyboardAvoidingView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 20,
		flex: 1,
		justifyContent: 'center',
	},
	imageBox: {
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 25
	},
	image: {
		width: 200,
		height: 100,
		padding: 0,
	},
	input: {
		height: 45,
		width: '100%',
		paddingHorizontal: 10,
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderRadius: 4,
		borderColor: 'gray',
		marginBottom: 15,
		letterSpacing: 1.25,
	},
	buttonBox: {
		height: 35,
		width: '100%',
		borderRadius: 3,
		paddingHorizontal: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#376c3e',
	},
	buttonBoxAlt: {
		height: 35,
		width: '100%',
		borderWidth: 2,
		borderColor: '#376c3e',
		borderRadius: 3,
		paddingHorizontal: 10,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 90
	},
	buttonText: {
		fontWeight: 'bold',
		color: 'white',
	},
	buttonTextAlt: {
		fontWeight: 'bold',
		color: '#376c3e',
	},
})

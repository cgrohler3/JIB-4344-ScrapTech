import {
	ActivityIndicator,
	Alert,
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
						Alert.alert('Invalid Email', 'Please enter a valid email!')
						break
					case 'auth/missing-password':
						Alert.alert('Missing Password', 'Please enter a valid password!')
						break
					case 'auth/weak-password':
						Alert.alert('Weak Password', 'Password must be at least 6 characters.')
						break
					case 'auth/email-already-in-use':
						Alert.alert('Email Already In Use', 'Please try logging in instead!')
						break
					default:
						console.log(err)
						Alert.alert('Register Failed', 'Try Again Later or Contact Admin.')
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
					case 'auth/invalid-email':
						Alert.alert('Invalid Email', 'Please enter a valid email!')
						break
					case 'auth/missing-password':
						Alert.alert('Missing Password', 'Please enter a valid password!')
						break
					case 'auth/invalid-credential':
						Alert.alert('Invalid Credential', 'Please enter the correct email/password!')
						break
					default:
						console.log(err)
						Alert.alert('Login Failed', 'Try Again Later or Contact Admin.')
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
					source={require('../assets/images/scraplanta-logo.png')}
					style={styles.image}
					resizeMode='contain'
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
		marginBottom: 25,
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
		marginBottom: 90,
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

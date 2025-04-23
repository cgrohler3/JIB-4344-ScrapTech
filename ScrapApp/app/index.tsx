import {
	ActivityIndicator,
	Alert,
	Image,
	KeyboardAvoidingView,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import React, { useState } from 'react'
import { Timestamp, addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { auth, db } from '../lib/firebaseConfig'
import {
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword
} from 'firebase/auth'

import Checkbox from "expo-checkbox"
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

export default function Index() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [show, setShow] = useState(false)
	const [isChecked, setChecked] = useState(false)

	const addUser = async () => {
		const timestamp = Timestamp.now()
		await addDoc(collection(db, "users"), {
			email: email,
			timestamp: timestamp,
			type: (isChecked ? "employee" : "volunteer")
		})
	}

	const signUp = async () => {
		setLoading(true)
		await createUserWithEmailAndPassword(auth, email, password)
			.then((userCredentials) => {
				const user = userCredentials.user
				addUser()
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

	const forgotPassword = async() => {
		if (email.length == 0) {
			Alert.alert('Missing Email', 'Please enter your email first!')
		} else {
			const qryRef = query(collection(db, "users"), where("email", "==", email))
			const qrySnap = await getDocs(qryRef)

			var isValid = false
			qrySnap.forEach((doc) => {
				if (email == doc.data().email) {
					isValid = true
				}
			})

			if (isValid) {
				await sendPasswordResetEmail(auth, email)
				.then(() => {
					Alert.alert('Email Sent', 'An email to reset your password has been sent to your email!')
				})
				.catch((err) => {
					Alert.alert('Error', 'An error occured when sending email: ', err)
				})
			} else {
				Alert.alert('Invalid Email', 'Email not found! Please enter a valid email!')
			}
		}
	}

	return (
		<View style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 25 }}>
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
						secureTextEntry={show ? false : true}
						placeholder='Password'
					/>
					<Pressable onPress={() => { setShow(!show) }} style={{ position: 'absolute', right: 15, top: 72 }}>
						<FontAwesome6 name={show ? 'eye' : 'eye-slash'} size={20} color='#376c3e' />
					</Pressable>
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
							<View style={styles.checkbox}>
								<Checkbox color="#376c3e" value={isChecked} onValueChange={setChecked} />
								<Text>(Check If Registering As Employee)</Text>
							</View>
							<TouchableOpacity 
								style={styles.forgotButton}
								onPress={forgotPassword}
							>
								<Text style={{ color: '#2196F3', textDecorationLine: 'underline' }}>Forgot Password?</Text>
							</TouchableOpacity>
						</View>
					)}
				</KeyboardAvoidingView>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
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
	checkbox: {
		flexDirection: "row",
		gap: 10,
		justifyContent: "center",
		textAlign: "center",
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
		borderColor: 'gray',
		borderRadius: 3,
		paddingHorizontal: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontWeight: 'bold',
		color: 'white',
	},
	buttonTextAlt: {
		fontWeight: 'bold',
		color: '#376c3e',
	},
	forgotButton: {
		alignSelf: 'center',
		marginTop: 15,
	}
})

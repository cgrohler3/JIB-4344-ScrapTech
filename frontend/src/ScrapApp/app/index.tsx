import {
	ActivityIndicator,
	Button,
	KeyboardAvoidingView,
	StyleSheet,
	TextInput,
	View
} from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

import { auth } from '../lib/firebaseConfig'

export default function Index() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	/*
	Function to sign Up a user on ScrapApp. Email acts as username.
	*/
	const signUp = async () => {
		setLoading(true);
		await createUserWithEmailAndPassword(auth, email, password)
		.then(userCredentials => {
			const user = userCredentials.user;
			console.log('Signed Up With: ', user.email)
		})
		.catch(err => {
			switch(err.code) {
				case 'auth/invalid-email':
					alert('Your entered email is invalid.')
					break
				case 'auth/email-already-in-use':
					alert('This email has an account already. Try logging in.')
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
			setLoading(false);
		})
	}

	/*
	Function to sign In a user on ScrapApp.
	*/
	const signIn = async () => {
		setLoading(true);
		await signInWithEmailAndPassword(auth, email, password)
		.then(userCredentials => {
			const user = userCredentials.user;
			console.log('Signed In With: ', user.email)
		})
		.catch(err => alert(err.message))
		setLoading(false);
	}

	return (
		<View style={styles.container}>
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
					<ActivityIndicator size={'small'} style={{ margin: 28 }} />
				) : (
					<>
						<Button onPress={signIn} title="Login" />
						<Button onPress={signUp} title="Create account" />
					</>
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
	input: {
		marginVertical: 4,
		height: 50,
		borderWidth: 1,
		borderRadius: 4,
		padding: 10,
		backgroundColor: '#fff',
	},
})
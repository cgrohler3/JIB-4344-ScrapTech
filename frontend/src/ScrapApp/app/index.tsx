import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'

export default function Index() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleLogin = () => {}
	const handleRegister = () => {}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Log In</Text>
			<TextInput
				style={styles.input}
				placeholder='Email'
				value={email}
				onChangeText={setEmail}
			/>
			<TextInput
				style={styles.input}
				placeholder='Password'
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			<View style={styles.buttonContainer}>
				<Button title='Login' onPress={handleLogin} />
				<Button title='Register' onPress={handleRegister} />
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
		paddingTop: 60,
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#376c3e',
		marginBottom: 20,
	},
	input: {
		width: '100%',
		height: 40,
		borderColor: '#ddd',
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 15,
		backgroundColor: '#fff',
		color: 'gray',
	},
	buttonContainer: {
		marginTop: 20,
		width: '100%',
		backgroundColor: '#376c3e',
		color: 'white',
	},
})

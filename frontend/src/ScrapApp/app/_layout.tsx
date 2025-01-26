import React, { useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { useRouter, useSegments } from 'expo-router'

import { Stack } from 'expo-router'
import { StyleSheet } from 'react-native'
import { auth } from '../lib/firebaseConfig'

export default function RootLayout() {
	const [user, setUser] = useState<User | null>()
	const router = useRouter()
	const segments = useSegments()

	// Get the currently logged in User
	useEffect(() => {
		const subscriber = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user)
			}
		})
		return subscriber
	}, [])

	// General Routing: If logged in, redirect to (auth), else to login
	useEffect(() => {
		const inAuthGroup = segments[0] === '(auth)'
		if (user && !inAuthGroup) {
			router.replace('/(auth)/(tabs)/home')
		} else if (!user && inAuthGroup) {
			router.replace('/')
		}
	}, [user])

	return (
		<Stack>
			<Stack.Screen name='index' options={{ title: 'Login' }} />
			<Stack.Screen name='(auth)' options={{ headerShown: false }} />
		</Stack>
	)
}

const styles = StyleSheet.create({})

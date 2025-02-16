import { Button, Image, StyleSheet, View } from 'react-native';
import { Tabs, router } from 'expo-router'

import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import React from 'react'
import { auth } from '@/lib/firebaseConfig';
import {verifyUser} from '../../../helpers/verifyUser'

export default function TabLayout() {
	const isEmployee = verifyUser();

	const handleLogout = () => {
		auth.signOut()
			.then(() => {
				router.replace('/')
			})
			.catch((err) => alert(err.message))
	}

	return (
		<Tabs 
			screenOptions={{ 
				tabBarActiveTintColor: '#2196F3',
				tabBarStyle: { height: 60, paddingTop: 5 },
				headerRight: () => (
					<View style={styles.button}>
						<Button title='Logout' onPress={handleLogout} />
					</View>
				)
			}}>
			<Tabs.Screen
				name='home'
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => (
						<FontAwesome6 name='house' size={24} color={color} />
					)
				}}
			/>
			<Tabs.Screen
				name='logDonations'
				options={{
					title: 'Log Donation',
					tabBarIcon: ({ color }) => (
						<FontAwesome6 name='box-open' size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='viewDonations'
				options={{
					title: 'View Donations',
					tabBarIcon: ({ color }) => (
						<FontAwesome6
							name='file-text'
							size={24}
							color={color}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name='zipCodes'
				options={{
					title: 'Zip Codes',
					tabBarIcon: ({ color }) => (
						<FontAwesome6 name='chart-pie' size={24} color={color} />
					),
					...(isEmployee ? {} : {href: null})
				}}
			/>
		</Tabs>
	)
}

const styles = StyleSheet.create({
	button: {
		marginRight: 16
	},
})

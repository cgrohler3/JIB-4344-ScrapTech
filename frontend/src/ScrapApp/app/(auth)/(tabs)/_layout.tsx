import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Tabs, router } from 'expo-router'

import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import React from 'react'
import { auth } from '@/lib/firebaseConfig';
import {verifyUser} from '../../../helpers/verifyUser'

export default function TabLayout() {
	const isEmployee = verifyUser();

	const handleLogout = () => {
		Alert.alert(
			'Confirm Logout?',
			`You are about to logout! Please save any progress to avoid losing it!`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Logout',
					onPress: () => {
						auth.signOut()
						.then(() => {
							router.replace('/')
						})
						.catch((err) => alert(err.message))
					},
				},
			]
		)
	}

	return (
		<Tabs 
			screenOptions={{ 
				tabBarActiveTintColor: '#2196F3',
				tabBarStyle: { height: 60, paddingTop: 5 },
				headerRight: () => (
					<TouchableOpacity
						style={styles.buttonBoxAlt}
						onPress={handleLogout}
					>
						<Text style={styles.buttonTextAlt}>LOGOUT</Text>
					</TouchableOpacity>
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
			<Tabs.Screen
				name='heatMap'
				options={{
					title: 'Heat Map',
					tabBarIcon: ({ color }) => (
						<FontAwesome6 name='map-location-dot' size={24} color={color} />
					),
					...(isEmployee ? {} : {href: null})
				}}
			/>
		</Tabs>
	)
}

const styles = StyleSheet.create({
	buttonBoxAlt: {
		borderWidth: 2,
		height: '50%',
		width: 'auto',
		paddingHorizontal: 10,
		borderColor: '#2196F3',
		borderRadius: 3,
		marginRight: 16,
		marginTop: 5,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonTextAlt: {
		fontSize: 15,
		fontWeight: 'bold',
		color: '#2196F3',
	},
})

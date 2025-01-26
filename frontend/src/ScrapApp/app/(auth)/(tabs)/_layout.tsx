import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import React from 'react'
import { Tabs } from 'expo-router'

export default function TabLayout() {
	return (
		<Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
			<Tabs.Screen
				name='home'
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => (
						<FontAwesome6 name='house' size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='logDonations'
				options={{
					title: 'Log Donations',
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
					),
				}}
			/>
		</Tabs>
	)
}

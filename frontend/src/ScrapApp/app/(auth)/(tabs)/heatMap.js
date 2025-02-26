import { StyleSheet, Text, View } from 'react-native'

import React from 'react'

const HeatMap = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Heat Map</Text>
    </View>
  )
}

export default HeatMap

const styles = StyleSheet.create({
    container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
		paddingTop: 80,
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 25,
		fontWeight: 'bold',
		color: '#376c3e',
	}
})

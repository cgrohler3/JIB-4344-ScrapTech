import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Heatmap, Marker } from 'react-native-maps'
import React, { useEffect, useRef, useState } from 'react'
import { collection, count, getDocs } from 'firebase/firestore'

import FontAwesome from '@expo/vector-icons/FontAwesome'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { db } from "../../../lib/firebaseConfig"

const HeatMap = () => {
	const city = { latitude: 33.75, longitude: -84.39, latitudeDelta: 0.1, longitudeDelta: 0.1 }
	const state = { latitude: 33, longitude: -83.3, latitudeDelta: 6, longitudeDelta: 6 }
	const country = { latitude: 37.09, longitude: -95, latitudeDelta: 70, longitudeDelta: 70 }

	const [isVisible, setIsVisible] = useState(true)
	const [region, setRegion] = useState(city)
	const [zoomLevel, setZoomLevel] = useState(0)
	const [data, setData] = useState([])
	const [markers, setMarkers] = useState([])

	const mapRef = useRef(null)
	const toggleZoom = () => {
		setZoomLevel((zoomLevel + 1) % 3)
		const newRegion = (zoomLevel == 0 ? city : zoomLevel == 1 ? state : country)
		if (newRegion != city)
			setIsVisible(false)
		else
			setIsVisible(true)
		mapRef.current.animateToRegion(newRegion, 1000)
	}

	const getZoomIcon = () => {
		if (zoomLevel === 0) {
			return 'down-left-and-up-right-to-center';
		} else {
			return 'up-right-and-down-left-from-center';
		}
	};
	
	const getData = async () => {
		const snapshot = await getDocs(collection(db, 'zipPositions'))
		const data = snapshot.docs.map((doc) => {
			const docData = doc.data()
			return {
				latitude: docData.lat,
				longitude: docData.long,
				weight: docData.total_weight
			}
		})
		setData(data)
		// console.log(data)

		const marks = snapshot.docs.map((doc) => {
			const docData = doc.data()
			return {
				coordinate: { latitude: docData.lat, longitude: docData.long }, title: doc.id, description: docData.total_weight.toString()
			}
		})
		setMarkers(marks)
		console.log(marks)
	}
	
	useEffect(() => {
		getData()
	}, [])

	return (
		<View style={styles.container}>
			{data.length == 0 ? (
				<ActivityIndicator size={'large'} style={{ margin: 28 }} />
			) : (
				<MapView
					ref={mapRef}
					style={styles.map}
					initialRegion={region}
				>
					<Heatmap
						points={data}
						opacity={0.75}
						radius={50}
					/>
					{isVisible && markers.map((marker, index) => (
						<Marker
							key={index}
							coordinate={marker.coordinate}
							title={marker.title}
							description={marker.description}
						/>
					))}
				</MapView>
			)}
			<TouchableOpacity
				style={styles.zoomButton}
				onPress={toggleZoom}
			>
				<FontAwesome6 name={getZoomIcon()} size={20} color='white' />
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.refreshButton}
				onPress={getData}
			>
				<FontAwesome name='refresh' size={22} color='white' />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	map: {
		height: '100%',
	},
	zoomButton: {
		position: 'absolute',
		bottom: '15',
		right: '15',
		padding: 9,
		backgroundColor: '#376c3e',
		borderRadius: 100,
	},
	refreshButton: {
		position: 'absolute',
		bottom: '65',
		right: '15',
		padding: 9,
		backgroundColor: '#376c3e',
		borderRadius: 100,
	}
})

export default HeatMap

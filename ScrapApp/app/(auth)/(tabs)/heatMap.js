import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native'
import MapView, { Heatmap, Marker } from 'react-native-maps'
import React, { useEffect, useRef, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'

import FontAwesome from '@expo/vector-icons/FontAwesome'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { db } from "../../../lib/firebaseConfig"

const HeatMap = () => {
	const levels = [
		{ latitude: 33.75, longitude: -84.39, latitudeDelta: 0.1, longitudeDelta: 0.1 },
		{ latitude: 33, longitude: -83.3, latitudeDelta: 6, longitudeDelta: 6 },
		{ latitude: 37.09, longitude: -95, latitudeDelta: 70, longitudeDelta: 70 }
	]

	const mapRef = useRef(null)
	const [data, setData] = useState([])
	const [markers, setMarkers] = useState([])
	const [isVisible, setIsVisible] = useState(true)
	const [region, setRegion] = useState({ idx: 0, level: levels[0] })

	useEffect(() => {
		getData()
	}, [])
	
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
		const marks = snapshot.docs.map((doc) => {
			const docData = doc.data()
			return {
				coordinate: { latitude: docData.lat, longitude: docData.long }, title: doc.id, description: `${docData.total_weight} lbs`
			}
		})
		setMarkers(marks)
		setIsVisible(true)
		setRegion({ idx: 0, label: levels[0] })
		mapRef.current.animateToRegion(levels[0], 1000)
	}

	const handleZoom = (val) => {
		setRegion(prev => {
			let newIdx
			if ((prev.idx + val) < 0) {
				newIdx = 0
			} else if ((prev.idx + val) > 2) {
				newIdx = 2
			} else {
				newIdx = (region.idx + val)
			}
			
			mapRef.current.animateToRegion(levels[newIdx], 1000)
			return {
				idx: newIdx,
				level: levels[newIdx]
			}
		})
	}

	return (
		<View style={styles.container}>
			{data.length == 0 ? (
				<ActivityIndicator size={'large'} style={{ margin: 28 }} />
			) : (
				<MapView
					ref={mapRef}
					style={styles.map}
					initialRegion={levels[0]}
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
			<View style={styles.mapBtnContainer}>
				<TouchableOpacity
					style={styles.mapBtn}
					onPress={() => setIsVisible(!isVisible)}
				>
					<MaterialCommunityIcons name={(isVisible ? "map-marker" : "map-marker-off")} size={22} color="white" />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.mapBtn}
					onPress={getData}
				>
					<FontAwesome name='refresh' size={22} color='white' />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.mapBtn}
					onPress={() => handleZoom(-1)}
				>
					<FontAwesome name='plus' size={22} color='white' />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.mapBtn}
					onPress={() => handleZoom(1)}
				>
					<FontAwesome name='minus' size={22} color='white' />
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	map: {
		height: '100%',
	},
	mapBtnContainer: {
		position: 'absolute',
		flexDirection: "column",
		gap: 5,
		bottom: 70,
		right: 10,
	},
	mapBtn: {
		borderRadius: 40,
		width: 40,
		height: 40,
		backgroundColor: '#376c3e',
		justifyContent: "center",
		alignItems: "center"
	},
})

export default HeatMap

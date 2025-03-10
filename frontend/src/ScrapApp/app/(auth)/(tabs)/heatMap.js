import MapView, {
	Callout,
	Heatmap,
	Marker,
	PROVIDER_GOOGLE,
	Polygon,
} from 'react-native-maps'
import { React, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { collection, getDocs } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'

import { db } from '../../../lib/firebaseConfig'

const HeatMap = () => {
	const [region, setRegion] = useState({
		latitude: 33.75,
		longitude: -84.3885,
		latitudeDelta: 0.1,
		longitudeDelta: 0.1, //this is the region and zoom, coords are set for ATL, GA
	})

	const [heatmapData, setHeatmapData] = useState([])
	const [isZoomedOut, setIsZoomedOut] = useState(false)

	const getmapData = useCallback(async () => {
		console.log('Get Map Data')
		const data = await getZipPos()
		setHeatmapData(data)
	}, [])

	useEffect(() => {
		getmapData()
	}, [getmapData])

	const getZipPos = async () => {
		const zipPos = collection(db, 'zip_positions')
		const snapshot = await getDocs(zipPos)
		const data = snapshot.docs.map((doc) => {
			const docData = doc.data()
			return {
				latitude: docData.lat,
				longitude: docData.long,
				weight: docData.total_weight,
			}
		})
		return data
	}

	const changePos = () => {
		setRegion({
			latitude: isZoomedOut ? 37.998 : 33.75,
			longitude: isZoomedOut ? -96.998 : -84.3885,
			latitudeDelta: isZoomedOut ? 55 : 0.1,
			longitudeDelta: isZoomedOut ? 55 : 0.1,
		})
	}

	const toggleZoom = useCallback(() => {
		setIsZoomedOut((prev) => {
			const newZoom = !prev
			changePos()
			return newZoom
		})
	}, [isZoomedOut])

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Heat Map</Text>
			<View style={styles.mapContainer}>
				{heatmapData.length > 0 ? (
					<MapView
						style={styles.map}
						region={region}
						onRegionChangeComplete={setRegion}
						provider={PROVIDER_GOOGLE} //sets where map comes from, google right now
					>
						<Marker
							coordinate={{
								latitude: 33.749,
								longitude: -84.388,
							}}
						>
							<Callout>
								<View>
									<Text>Atlanta</Text>
								</View>
							</Callout>{' '}
							{/*We could use markers for store locations/cities in future*/}
						</Marker>
						<Heatmap
							points={heatmapData}
							opacity={0.75}
							radius={50}
							gradient={{
								colors: ['green', 'blue', 'red'],
								startPoints: [0.05, 0.25, 0.5],
								colorMapSize: 50,
							}}
						/>
						<Polygon
							coordinates={[
								//Changing lat goes up/down, changing long goes left/right
								{ latitude: 33.65, longitude: -84.5 }, // Bottom-left
								{ latitude: 33.65, longitude: -84.25 }, // Bottom-right
								{ latitude: 33.825, longitude: -84.25 }, // Top-right
								{ latitude: 33.825, longitude: -84.5 }, // Top-left
							]}
							strokeColor='#376c3e' //Polygon lets us potentially highlight specific zip codes in future.
							fillColor='rgba(144, 238, 144, 0.4)' //For now I just have it highlighting ATL.
							strokeWidth={1}
						/>
					</MapView>
				) : (
					<Text>Loading Map...</Text>
				)}
			</View>
			<View style={styles.buttonBox}>
				<TouchableOpacity
					style={styles.button}
					onPress={getmapData}
				>
					<Text style={styles.buttonText}>Reload</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={toggleZoom}
				>
					<Text style={styles.buttonText}>Toggle Zoom</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 10,
	},
	title: {
		paddingBottom: 10,
		fontSize: 25,
		fontWeight: 'bold',
		color: '#376c3e',
	},
	mapContainer: {
		height: '70%',
		width: '100%',
		borderWidth: 2,
		borderRadius: 2,
		borderColor: '#376c3e',
		marginBottom: 10
	},
	map: {
		height: '100%',
	},
	buttonBox: {
		width: '100%',
		height: '50',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 50,
	},
	button: {
		height: '100%',
		width: '120',
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#376c3e',
	},
	buttonText: {
		fontWeight: 'bold',
		color: 'white',
		fontSize: 16,
	},
})

export default HeatMap

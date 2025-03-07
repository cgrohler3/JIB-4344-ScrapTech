import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, {Heatmap, PROVIDER_GOOGLE, Polygon, Marker, Callout} from 'react-native-maps'
import {collection, getDocs} from "firebase/firestore";
import React, {useState, useEffect, useCallback} from 'react'
import { db } from '../../../lib/firebaseConfig'

const getZipPos = async () => {
	const zipPos = collection(db, "zip_positions")
	const snapshot = await getDocs(zipPos)
	const data = snapshot.docs.map(doc => {
		const docData = doc.data()
		return {
			latitude: docData.lat,
			longitude: docData.long,
			weight: docData.total_weight
		}
	})
	return data
}

const dataMap = () => {
	const [region, setRegion] = useState({
		latitude: 33.750,
		longitude: -84.3885,
		latitudeDelta: 0.1,
		longitudeDelta: 0.1,  //this is the region and zoom, coords are set for ATL, GA
	})

	const [heatmapData, setHeatmapData] = useState([])
	const [isZoomedOut, setIsZoomedOut] = useState(false)

	const getmapData = useCallback(async () => {
		console.log("Get Map Data")
		const data = await getZipPos()
		setHeatmapData(data)
	}, [])

	useEffect(() => {
		getmapData()
	}, [getmapData])

	const changePos = () => {
		setRegion({
			latitude: isZoomedOut ? 37.998 : 33.750,
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
				<Marker coordinate={{ latitude: 33.7490, longitude: -84.3880 }}>
					<Callout>
						<View>
							<Text>Atlanta</Text>
						</View>
					</Callout>  {/*We could use markers for store locations/cities in future*/}
				</Marker>
				<Heatmap
				  points={heatmapData}
				  opacity={0.75}
				  radius={50}
				  gradient={{
					colors: ["green", "blue", "red"],
					startPoints: [0.05, 0.25, 0.50],
					colorMapSize: 50,
				  }}
				/>
				  <Polygon
					  coordinates={[  //Changing lat goes up/down, changing long goes left/right
						  { latitude: 33.6500, longitude: -84.5000 }, // Bottom-left
						  { latitude: 33.6500, longitude: -84.2500 }, // Bottom-right
						  { latitude: 33.8250, longitude: -84.2500 }, // Top-right
						  { latitude: 33.8250, longitude: -84.5000 }, // Top-left
					  ]}
					  strokeColor="#376c3e" //Polygon lets us potentially highlight specific zip codes in future.
					  fillColor="rgba(144, 238, 144, 0.4)" //For now I just have it highlighting ATL.
					  strokeWidth={1}
				  />
			  </MapView>
			) : (
			  <Text>Loading Map...</Text>
			)}
		  </View>
		  <View style={styles.lowerView}>
		  <TouchableOpacity
		  	style={styles.reloadButton}
			onPress={getmapData}
		  >
			<View><Text style={styles.reloadText}>Reload</Text></View>
		  </TouchableOpacity>
		  <TouchableOpacity
		  	style={styles.toggleButton}
			onPress={toggleZoom}
		  >
			<View><Text style={styles.toggleText}>Toggle Zoom</Text></View>
		  </TouchableOpacity>
		  </View>
		</View>
	  );
	};
	
	export default dataMap;
	
	const styles = StyleSheet.create({
	  container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
		paddingTop: 80,
		paddingHorizontal: 20,
	  },
	  mapContainer: {
		flex: 1,
		width: '100%',
		borderColor: '#376c3e',
		borderWidth: 4,
	  },
	  map: {
		flex: 1,
		width: '100%',
	  },
	  title: {
		paddingBottom: 10,
		fontSize: 25,
		fontWeight: 'bold',
		color: '#376c3e',
	  },
	  reloadButton: {
		borderRadius: 3,
		paddingTop: 20,
		paddingBottom: 20,
		marginTop: 5,
		backgroundColor: '#376c3e',
		width: 100,
		height: 55
	  },
	  reloadText: {
		  fontSize: 18,
		  fontWeight: 'bold',
		  textAlign: 'center',
		  color: 'white',
		  textAlignVertical: 'center',
		  lineHeight: 18
	  },
	  toggleButton: {
		borderRadius: 3,
		paddingTop: 20,
		marginTop: 5,
		backgroundColor: '#376c3e',
		width: 120,
		height: 55
	  },
	  toggleText: {
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'white',
		textAlignVertical: 'center',
		lineHeight: 18
	  },
	  lowerView: {
		flexDirection: 'row',
		gap: 10,
	  }
	});
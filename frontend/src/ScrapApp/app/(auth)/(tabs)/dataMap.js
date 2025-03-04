import { StyleSheet, Text, View } from 'react-native'
import MapView, {Heatmap, PROVIDER_GOOGLE} from 'react-native-maps'
import {collection, getDocs} from "firebase/firestore";
import React, {useState, useEffect} from 'react'
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
		latitudeDelta: 0.05,
		longitudeDelta: 0.05,  //this is the region and zoom, coords are set for ATL, GA
	})

	const [heatmapData, setHeatmapData] = useState([])

	useEffect(() => {
		const getmapData = async() => {
			const data = await getZipPos()
			setHeatmapData(data)
		}
		getmapData()
	}, [])

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
				<Heatmap
				  points={heatmapData}
				  opacity={0.65}
				  radius={50}
				  gradient={{
					colors: ["green", "yellow", "red"],
					startPoints: [0.05, 0.25, 0.5],
					colorMapSize: 50,
				  }}
				/>
			  </MapView>
			) : (
			  <Text>Loading Map...</Text>
			)}
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
		fontSize: 25,
		fontWeight: 'bold',
		color: '#376c3e',
	  },
	});
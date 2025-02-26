import { StyleSheet, Text, View } from 'react-native'
import MapView, {Heatmap} from 'react-native-maps';

import React, {useState} from 'react'

const dataMap = () => {
	const [region, setRegion] = useState({
		latitude: 33.750,
		longitude: -84.3885,
		latitudeDelta: 0.05,
		longitudeDelta: 0.05,  //this is the region and zoom, coords are set for ATL, GA
	});


  return (
    <View style={styles.container}>
        <Text style={styles.title}>Heat Map</Text>
		<View style={styles.mapContainer}>
			<MapView
				style={styles.map}
				region={region}
				onRegionChangeComplete={setRegion}
				provider='google'   //sets where map comes from, google right now
			>
				<Heatmap points={heatmapData} />
			</MapView>
		</View>
    </View>

  )
}

const heatmapData = [
	{ latitude: 33.7501, longitude: -84.3885, weight: 1 },  //this is how points are set, weight is point size
	{ latitude: 37.78855, longitude: -84.3855, weight: 10 }, //and lat/long is the location of the point. Will need to
	{ latitude: 37.79025, longitude: -84.3865, weight: 14 }, //match these to zip codes I guess
];


export default dataMap

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
	}
})

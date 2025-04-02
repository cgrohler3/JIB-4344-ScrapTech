import { BarChart, PieChart } from 'react-native-chart-kit'
import {
	Button,
	Dimensions,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Timestamp, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'

import { Dropdown } from 'react-native-element-dropdown'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { db } from '../../../lib/firebaseConfig'

const ZipCodes = () => {
	const [activeView, setActiveView] = useState('view1')
    
	const [zipCode, setZipCode] = useState("")
    const [zipCodes, setZipCodes] = useState([])
	const [chartData, setChartData] = useState([])
	const [donations, setDonations] = useState(0)
	const [weight, setWeight] = useState(0)
    
	const [category, setCategory] = useState("")
	const [categories, setCategories] = useState([])
    const [timerange, setTimerange] = useState("week")
    
	// const [topZipSummaries, setTopZipSummaries] = useState([])
	// const [data, setData] = useState({
	//     labels: [],
	//     datasets: [{ data: [] }],
	// })
	
    useEffect(() => {
        getZipCodes()
        getCategories()
        // getTopZipCodeSummaries()
    }, [])
    
    useEffect(() => {
        if (zipCode) getDataByZipCode()
        if (category) getDataByCategory()
    }, [zipCode, category])

    const getZipCodes = async () => {
	    const snapshot = await getDocs(collection(db, "zipCodes"))
	    const docs = []
	    snapshot.forEach((doc) => {
	        docs.push({ label: doc.id, value: doc.id })
	    })
	    setZipCodes(docs)
    }
    
    const getDataByZipCode = async () => {
        const docSnap = await getDoc(doc(db, "zipCodes", zipCode))
        const data = docSnap.data()
        const formattedData = Object.entries(data.categories).map(([category, weight], index) => {
            const percentage = parseInt(Math.round(parseFloat(weight / data.total_weight).toFixed(2) * 100))
            return {
                name: category,
                amount: percentage,
                color: getColor(index),
                legendFontColor: "#3D3E44",
                legendFontSize: 15,
            }
        })
        setChartData(formattedData)
        setDonations(data.total_donations)
        setWeight(data.total_weight)
    }
    
    const getColor = (index) => {
        const colors = ["#6C63FF", "#5551A2", "#F1A7B1", "#FFBB33", "#4CAF50", "#FF5722", "#8BC34A", "#FFC107", "#E91E63", "#03A9F4", "#9C27B0", "#FFEB3B", "#009688", "#795548", "#673AB7", "#FF9800", "#CDDC39", "#607D8B", "#00BCD4", "#F44336"]
        return colors[index % colors.length]
    }
    
	const getCategories = async () => {
	    const snapshot = await getDocs(collection(db, "categories"))
	    const docs = []
	    snapshot.forEach((doc) => {
	        docs.push({ label: doc.id, value: doc.id })
	    })
	    setCategories(docs)
	}

    const getDataByCategory = async () => {
        const now = new Date()
        now = now.setDate(now.getDate() - 7)
        const lastWeek = Timestamp.fromDate(now)

        const docSnap = await getDocs(query(collection(db, "donations"), where("tiemstamp", ">=", lastWeek)))
        const data = docSnap.data()
        
        console.log(lastWeek)
        console.log(data)

        // const formattedData = Object.entries(data.categories).map(([category, weight], index) => {
        //     const percentage = parseInt(Math.round(parseFloat(weight / data.total_weight).toFixed(2) * 100))
        //     return {
        //         name: category,
        //         amount: percentage,
        //         color: getColor(index),
        //         legendFontColor: "#3D3E44",
        //         legendFontSize: 15,
        //     }
        // })
        // setChartData(formattedData)
        // setDonations(data.total_donations)
        // setWeight(data.total_weight)
    }

	return (
        <View style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 25 }}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonBox}
                        onPress={() => setActiveView("view1")}
                    >
                        <Text style={styles.buttonText}>Zip Codes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonBox}
                        onPress={() => setActiveView("view2")}
                    >
                        <Text style={styles.buttonText}>Categories</Text>
                    </TouchableOpacity>
                </View>
                {activeView === 'view1' ? (
                    <View style={styles.container}>
                        <Text style={styles.title}>Zip Codes</Text>
                        <View style={styles.pieChart}>
                            <PieChart
                                data={chartData}
                                width={Dimensions.get("window").width}
                                height={200}
                                accessor={"amount"}
                                backgroundColor={"transparent"}
                                chartConfig={{
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                }}
                                hasLegend={false}
                                center={[120, 0]}
                            />
                            {chartData.map((item, index) => (
                                <Text key={index} style={{ fontSize: 17, textAlignVertical: 'center' }}>
                                    <FontAwesome name="circle" size={18} color={item.color}/>  {item.amount}%  {item.name}
                                </Text>
                            ))}
                            <Text style={styles.weightBox}>
                                Total Donations:
                                <Text style={{ fontWeight: 'bold' }}> {donations}</Text>
                                {'\t\t\t\t'}
                                Total Weight:
                                <Text style={{ fontWeight: 'bold' }}> {weight}</Text>
                            </Text>
                        </View>
                        <Dropdown
                            style={styles.dropdown}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={zipCodes}
                            labelField='label'
                            valueField='value'
                            placeholder='Select Zip Code'
                            placeholderStyle={styles.placeholderStyle}
                            value={zipCode}
                            onChange={(item) => setZipCode(item.value)}
                            activeColor='lightgray'
                        />
                    </View>
	            ) : (
                    <View style={styles.container}>
                        <Text style={styles.title}>Categories</Text>
                        <View style={styles.barChart}>
                            {/* <BarChart
	                            data={data}
	                            width={Dimensions.get('window').width - 54}
	                            height={200}
	                            chartConfig={{
	                                backgroundGradientFrom: '#f5f5f5',
	                                backgroundGradientTo: '#f5f5f5',
	                                fillShadowGradientOpacity: 1,
	                                decimalPlaces: 0,
	                                color: (opacity = 1) => `rgba(55, 108, 62, ${opacity})`,
	                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
	                                style: { borderRadius: 16 },
	                            }}
	                        /> */}
                        </View>
                        <Dropdown
                            style={styles.dropdown}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={categories}
                            labelField='label'
                            valueField='value'
                            placeholder='Select Category'
                            placeholderStyle={styles.placeholderStyle}
                            value={category}
                            onChange={(item) => setCategory(item.value)}
                            activeColor='lightgray'
                        />
                        {/* <Button title="Refresh" onPress={getTopZipCodeSummaries} />
	                    <View style={{ marginTop: 20 }}>
	                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>Top Zip Codes Summary</Text>
	                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
	                            {topZipSummaries.map((zip, idx) => (
	                                <View key={idx} style={{ width: Dimensions.get('window').width / 3.3, backgroundColor: '#fff', padding: 10, borderRadius: 8, elevation: 2 }}>
	                                    <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 4, textAlign: 'center', color: '#376c3e' }}>Zip {zip.zip}</Text>
	                                    <Text style={{ fontSize: 12, textAlign: 'center' }}>Weight: {zip.totalWeight} lbs</Text>
	                                    <Text style={{ fontSize: 12, textAlign: 'center' }}>Donations: {zip.totalDonations}</Text>
	                                    <View style={{ marginTop: 6 }}>
	                                        {Object.entries(zip.categories).map(([cat, w], i) => (
	                                            <Text key={i} style={{ fontSize: 11, textAlign: 'center', color: '#555' }}>{cat}: {w} lbs</Text>
	                                        ))}
	                                    </View>
	                                </View>
	                            ))}
	                        </View>
	                    </View> */}
                    </View>
	            )}
            </ScrollView>
        </View>
	)
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
        marginBottom: 15,
    },
    buttonBox: {
		height: 40,
        width: 125,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#376c3e',
	},
	buttonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
	},
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
	title: {
	    fontSize: 25,
	    fontWeight: 'bold',
	    color: '#376c3e',
        marginBottom: 15,
	},
	dropdown: {
	    width: '100%',
	    height: 40,
	    borderColor: '#ddd',
	    borderWidth: 1,
	    borderRadius: 5,
	    paddingHorizontal: 10,
	    backgroundColor: '#fff',
	    color: 'gray',
	    fontSize: 14,
	},
	selectedTextStyle: {
	    color: 'black',
	    fontSize: 14,
	},
    placeholderStyle: {
        color: 'gray',
        fontSize: 14,
    },
    pieChart: {
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        borderColor: 'darkgray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: 'white',
    },
	weightBox: {
	    fontSize: 18,
	    justifyContent: 'center',
	    alignSelf: 'center',
	    paddingHorizontal: 20,
	    paddingVertical: 15,
	},
    barChart: {
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        borderColor: 'darkgray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: 'white',
    },


	// barBox: {
	//     width: '100%',
	//     height: 250,
	//     backgroundColor: '#f5f5f5',
	//     borderWidth: 0,
	//     borderRadius: 5,
	//     marginBottom: 20,
	// },
	// catBox: {
	//     textAlign: 'right',
	//     paddingRight: 256,
	//     fontWeight: 'bold',
	//     fontSize: 15,
	// },
})

export default ZipCodes

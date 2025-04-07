import "randomcolor"

import {
	Button,
	Dimensions,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { PieChart, StackedBarChart } from 'react-native-chart-kit'
import React, { useEffect, useState } from 'react'
import { Timestamp, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'

import { Dropdown } from 'react-native-element-dropdown'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { db } from '../../../lib/firebaseConfig'
import randomColor from "randomcolor"
import { useIsFocused } from "@react-navigation/native"

const ZipCodes = () => {
    const isFocused = useIsFocused()
	const [activeView, setActiveView] = useState('view1')
    
	const [zipCode, setZipCode] = useState("")
    const [zipCodes, setZipCodes] = useState([])
	const [pieData, setPieData] = useState([])
	const [donations, setDonations] = useState(0)
	const [weight, setWeight] = useState(0)
    
    const [time, setTime] = useState("week")
	const [category, setCategory] = useState("")
	const [categories, setCategories] = useState([])
    const [rawData, setRawData] = useState([])
    const [barData, setBarData] = useState([])

	const [topZipSummaries, setTopZipSummaries] = useState([])
	  
    useEffect(() => {
        if (isFocused) {
            getZipCodes()
            getCategories()
            getTopZipCodeSummaries()
            console.log("REFRESH")

            if (zipCode != "") getDataByZipCode()
        }
    }, [isFocused])
    
    useEffect(() => {
        if (zipCode) getDataByZipCode()
        if (category) getDataByCategory()
    }, [zipCode, category])

    const clearPie = () => {
        setZipCode("")
        getZipCodes()
        setPieData([])
        setWeight(0)
        setDonations(0)
    }

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
        const colors = randomColor({ count: Object.keys(data.categories).length })
        const formattedData = Object.entries(data.categories).map(([category, weight], index) => {
            const percentage = parseInt(weight)
            return {
                name: category,
                amount: percentage,
                color: colors[index],
                legendFontColor: "#3D3E44",
                legendFontSize: 15,
            }
        })
        setPieData(formattedData)
        setDonations(data.total_donations)
        setWeight(data.total_weight)
    }

	const getCategories = async () => {
	    const snapshot = await getDocs(collection(db, "categories"))
	    const docs = []
	    snapshot.forEach((doc) => {
	        docs.push({ label: doc.id, value: doc.id })
	    })
	    setCategories(docs)
	}

    const getTS = () => {
        const date = new Date()
        if (time == "week") {
            date.setDate(date.getDate() - 7)
        }
        return Timestamp.fromDate(date)
    }

    const getDataByCategory = async () => {
        const ts = getTS()
        const snapshot = await getDocs(query(
            collection(db, "donations"), 
            where("timestamp", ">=", ts),
            where("category", "==", category)
        ))
        
        const docs = []
	    snapshot.forEach((doc) => {
            docs.push({ zipCode: doc.data().zipCode, weight: doc.data().weight, timestamp: doc.data().timestamp })
	    })
        setRawData(docs)

        const groupRawData = docs.reduce((acc, item) => {
            const day = item.timestamp.toDate().toLocaleDateString("en-US", { weekday: "short" })
            const zip = item.zipCode

            if (!acc[day]) acc[day] = {}
            if (!acc[day][zip]) acc[day][zip] = 0

            acc[day][zip] += item.weight

            return acc
        }, {})
        setBarData(groupRawData)
    }

    const prepareChartData = () => {
        const labels = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"]
        const zips = Array.from(new Set(rawData.map(item => item.zipCode)))
        const dataMatrix = labels.map(label => {
            const day = barData[label] || {}
            return zips.map(zip => day[zip] || 0)
        })
        const barColors = ["#FF6384", "#36A2EB", "#326A4E"]

        return {
            labels: labels,
            legend: zips,
            data: dataMatrix,
            barColors: barColors
        }
    }

    const getTopZipCodeSummaries = async () => {
        const snapshot = await getDocs(collection(db, "zipCodes"));
        const zipDataArray = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            zipDataArray.push({
                zip: doc.id,
                totalWeight: data.total_weight || 0,
                totalDonations: data.total_donations || 0,
                categories: data.categories || {},
            });
        });

        const sorted = zipDataArray.sort((a, b) => b.totalWeight - a.totalWeight);
        setTopZipSummaries(sorted.slice(0, 5));
    }

    const data = {
        labels: ["Test1", "Test2"],
        legend: [],
        data: [
          [60, 60, 60],
          [30, 30, 60]
        ],
        barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"]
    };
    
	return (
        <View style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 25, paddingVertical: 20 }}>
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
                                data={pieData}
                                width={200}
                                height={200}
                                accessor={"amount"}
                                backgroundColor={"transparent"}
                                chartConfig={{
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                }}
                                hasLegend={false}
                                center={[50, 0]}
                            />
                            {pieData.map((item, index) => (
                                <Text key={index} style={{ fontSize: 17, textAlignVertical: 'center' }}>
                                    <FontAwesome name="circle" size={18} color={item.color}/>  {(item.amount * 100 / weight).toFixed(2)}%  {item.name}
                                </Text>
                            ))}
                            <Text style={styles.weightBox}>
                                Total Donations:
                                <Text style={{ fontWeight: 'bold' }}> {donations}</Text>
                                {'\t\t\t\t'}
                                Total Weight:
                                <Text style={{ fontWeight: 'bold' }}> {weight}</Text>
                            </Text>
                            <TouchableOpacity
                                style={styles.buttonBoxAlt}
                                onPress={clearPie}
                            >
                                <Text style={styles.buttonTextAlt}>CLEAR</Text>
                            </TouchableOpacity>
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
                            {/* <StackedBarChart
                                data={prepareChartData()}
                                width={375}
                                height={300}
                                chartConfig={{
                                    backgroundGradientFrom: "#fff",
                                    backgroundGradientTo: "#fff",
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    // propsForBackgroundLines: {
                                    //     // strokeDasharray: "4",
                                    //     // strokeWidth: 2, // If you put 0 in the value no line is displayed
                                    //     // stroke: `rgba(0, 0, 0, 0)`,
                                    //     // paddingBottom: 10,
                                    // },
                                    // propsForLabels: {
                                    //     fontSize: 12,
                                    //     dy: 8
                                    // },
                                }}
                                barPercentage={0.7}
                                showLegend={false}
                            /> */}
                            <StackedBarChart
                                data={data}
                                width={375}
                                height={200}
                                chartConfig={{
                                    backgroundGradientFrom: "#fff",
                                    backgroundGradientTo: "#fff",
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    propsForHorizontalLabels: {
                                        dy: -5,
                                    },
                                }}
                            />
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
                            <View style={styles.topZipContainer}>
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
		borderRadius: 50,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#376c3e',
	},
	buttonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
	},
    buttonBoxAlt: {
		height: 30,
		width: 65,
		borderWidth: 2,
		borderColor: '#376c3e',
		borderRadius: 3,
		paddingHorizontal: 10,
		justifyContent: 'center',
		alignItems: 'center',
		position: "absolute",
		left: 8,
		top: 8,
	},
	buttonTextAlt: {
		fontWeight: 'bold',
		color: '#376c3e',
	},
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
	title: {
	    fontSize: 25,
	    fontWeight: 'bold',
	    color: '#376c3e',
        margin: 15,
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
        paddingTop: 20,
        paddingBottom: 10
    },
    topZipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 15,
    }
})

export default ZipCodes

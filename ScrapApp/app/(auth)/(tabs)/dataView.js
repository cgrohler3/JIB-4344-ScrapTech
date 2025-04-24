import {
	Dimensions,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { PieChart, StackedBarChart } from 'react-native-chart-kit'
import React, { useEffect, useRef, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'

import { Dropdown } from 'react-native-element-dropdown'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { barLabels } from "../../../helpers/barLabels"
import { db } from '../../../lib/firebaseConfig'
import randomColor from "randomcolor"
import { useIsFocused } from "@react-navigation/native"

const DataView = () => {
    const isFocused = useIsFocused()
    const scrollViewRef = useRef(null)
	const [activeView, setActiveView] = useState('view1')
    
	const [zipCode, setZipCode] = useState("")
    const [zipCodes, setZipCodes] = useState([])
	const [pieData, setPieData] = useState([])
	const [donations, setDonations] = useState(0)
	const [weight, setWeight] = useState(0)
    
    const [chartWidth, setWidth] = useState(1)
    const [time, setTime] = useState("")
    const [labels, setLabels] = useState([])
    const [data, setData] = useState({})
	const [category, setCategory] = useState("")
	const [categories, setCategories] = useState([])
    const [rawData, setRawData] = useState([])
    const [barData, setBarData] = useState([])

	const [topZips, setTopZips] = useState([])

    // Useful for auto-reloading charts
    useEffect(() => {
        if (isFocused) {
            getZipCodes()
            getCategories()

            if (zipCode != "") getDataByZipCode()
        }
    }, [isFocused])
    
    useEffect(() => {
        if (zipCode) getDataByZipCode()
        if (category) getTopZips()
        if (category && time) {
            processData()
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 0, animated: true })
            }
        }
    }, [zipCode, category, time])

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

    const clearBar = () => {
        setCategory("")
        setTime("")
        setLabels([])
        setData({})
        setTopZips([])
    }
    
    const getCategories = async () => {
	    const snapshot = await getDocs(collection(db, "categories"))
	    const docs = []
	    snapshot.forEach((doc) => {
	        docs.push({ label: doc.data().category, value: doc.data().category })
	    })
	    setCategories(docs)
	}

    const processData = async () => {
        const output = barLabels(time)
        setLabels(output.labels)
    
        const snapshot = await getDocs(
            query(
                collection(db, "donations"),
                where("timestamp", ">=", output.ts),
                where("category", "==", category)
            )
        )
    
        const docs = [];
        snapshot.forEach((doc) => {
            docs.push({
                zipCode: doc.data().zipCode,
                weight: doc.data().weight,
                timestamp: doc.data().timestamp,
            })
        })
    
        const groupedData = docs.reduce((acc, item) => {
            const date = item.timestamp.toDate()
            const zip = item.zipCode
            let key
    
            if (time === "Week") {
                key = date.toLocaleDateString("en-US", { weekday: "short" }) // "Mon", "Tue"
                setWidth(7 * 80)
            } else if (time === "Month") {
                key = date.getDate().toString() // "1", "2", ..., "31"
                setWidth(32 * 80)
            } else if (time === "Year") {
                key = date.toLocaleDateString("en-US", { month: "short" }) // "Jan", "Feb"
                setWidth(12 * 80)
            }
    
            if (!acc[key]) acc[key] = {}
            if (!acc[key][zip]) acc[key][zip] = 0
    
            acc[key][zip] += item.weight
            return acc
        }, {})
    
        setBarData(groupedData)
    
        const zips = Array.from(new Set(docs.map((item) => item.zipCode)))
        const dataMatrix = output.labels.map((label) => {
            const item = groupedData[label] || {}
            return zips.map((zip) => item[zip] || 0)
        })
        
        const colors = randomColor({ count: zips.length });
    
        setData({
            labels: output.labels,
            legend: zips,
            data: dataMatrix,
            barColors: colors,
        })
    }

    const getTopZips = async () => {
        const qryRef = query(collection(db, "categories"), where("category", "==", category))
		const qrySnap = await getDocs(qryRef)
		const docSnap = await getDoc(qrySnap.docs[0].ref)
        
        const zipMap = docSnap.data()["zipMap"]
        const items = Object.entries(zipMap).sort((a,b) => a[1] - b[1]).splice(-5, 5).reverse()
        setTopZips({
            t_donations: docSnap.data()["total_donations"],
            t_weight: docSnap.data()["total_weight"],
            zipMap: items
        })
    }

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
                                    <FontAwesome name="circle" size={18} color={item.color}/> {(item.amount * 100 / weight).toFixed(2)}%  {item.name}
                                </Text>
                            ))}
                            <Text style={styles.weightBox}>
                                Total Donations:
                                <Text style={{ fontWeight: 'bold' }}> {donations}</Text>
                                {'\t\t\t\t'}
                                Total Weight:
                                <Text style={{ fontWeight: 'bold' }}> {weight} lbs</Text>
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
                            onFocus={getZipCodes}
                        />
                    </View>
	            ) : (
                    <View style={styles.container}>
                        <Text style={styles.title}>Categories</Text>
                        <View style={styles.barChart}>
                            {Object.keys(data).length > 0 && (
                                <View style={{ alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.xTitle}>Weight (lbs)</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={true} ref={scrollViewRef}>
                                            <StackedBarChart
                                                data={{
                                                    labels: data.labels,
                                                    legend: [],
                                                    data: data.data.map(item => item.map(val => val === 0 ? null : val)),
                                                    barColors: data.barColors
                                                }}
                                                width={Math.max(chartWidth, Dimensions.get("window").width)}
                                                height={400}
                                                chartConfig={{
                                                    backgroundColor: '#ffffff',
                                                    backgroundGradientFrom: '#ffffff',
                                                    backgroundGradientTo: '#ffffff',
                                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                                    barPercentage: 1,
                                                    propsForHorizontalLabels: { dy: -5 },
                                                    propsForLabels: { dx: 0 },
                                                    propsForVerticalLabels: { dx: -7, dy: 1, rotation: 30 },
                                                }}
                                                segments={5}
                                            />
                                        </ScrollView>
                                    </View>
                                    <Text style={styles.yTitle}>
                                        {time === 'Week' && 'Past Week (in days)'}
                                        {time === 'Month' && 'Past Month (in days)'}
                                        {time === 'Year' && 'Past Year (in months)'}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.barLegend}>
                                {Object.keys(data).length > 0 && data["legend"].map((item, index) => (
                                    <Text key={index} style={{ fontSize: 17, textAlignVertical: 'center' }}>
                                        <FontAwesome name="circle" size={18} color={data["barColors"][index]} /> {item}
                                    </Text>
                                ))}
                            </View>
                            <TouchableOpacity
                                style={styles.buttonBoxAlt}
                                onPress={clearBar}
                            >
                                <Text style={styles.buttonTextAlt}>CLEAR</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.dropdownContainer}>
                            <Dropdown
                                style={styles.nestedDropdown}
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
                            <Dropdown
                                style={styles.nestedDropdown}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={[
                                    { label: "Past Week", value: "Week" },
                                    { label: "Past Month", value: "Month" },
                                    { label: "Past Year", value: "Year" },
                                ]}
                                labelField='label'
                                valueField='value'
                                placeholder='Select Time'
                                placeholderStyle={styles.placeholderStyle}
                                value={time}
                                onChange={(item) => setTime(item.value)}
                                activeColor='lightgray'
                            />
                        </View>
                        {topZips.length != 0 && (
                            <View style={styles.zipsContainer}>
                                <View style={styles.zipsBox}>
                                    <Text style={styles.subTitle}>Category Summary</Text>
                                    <Text>Total Donations: <Text style={{ fontWeight: "bold" }}>{topZips["t_donations"]}</Text></Text>
                                    <Text>Total Weight: <Text style={{ fontWeight: "bold" }}>{topZips["t_weight"]} lbs</Text></Text>
                                </View>
                                <View style={styles.zipsBox}>
                                    <Text style={styles.subTitle}>Top Zip Codes</Text>
                                    {topZips["zipMap"].map((item, idx) => (
                                        <Text key={idx}>{idx+1}. {item[0]} - <Text style={{ fontWeight: "bold" }}>{item[1]} lbs</Text></Text>
                                    ))}
                                </View>
                            </View>
                        )}
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
        width: 145,
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
		height: 40,
		width: 85,
		borderWidth: 2,
		borderColor: '#376c3e',
		borderRadius: 3,
		paddingHorizontal: 10,
		justifyContent: 'center',
		alignItems: 'center',
		position: "absolute",
		left: 0,
		top: -53,
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
	    height: 45,
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
        paddingBottom: 5
    },
    dropdownContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    nestedDropdown: {
        width: '49%',
	    height: 45,
	    borderColor: '#ddd',
	    borderWidth: 1,
	    borderRadius: 5,
	    paddingHorizontal: 10,
	    backgroundColor: '#fff',
	    color: 'gray',
	    fontSize: 14,
	},
    xTitle: {
        transform: [{ rotate: '-90deg' }],
        fontSize: 15,
        fontWeight: 'bold',
        color: '#376c3e',
        margin: -20,
    },
    yTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#376c3e',
        marginTop: -30,
        marginBottom: 0,
        paddingBottom: -10,
    },
    zipsContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 26,
        marginTop: 20,
        textAlign: "center",
    },
    zipsBox: { 
        width: 225,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        elevation: 2,
        alignItems: "center"
    },
    subTitle: {
        fontWeight: "bold",
        paddingBottom: 5,
        color: "#376c3e"
    },
    barLegend: {
        flexDirection: "row",
        gap: 15,
        width: "100%",
        justifyContent: "center",
        alignContent: "center",
        marginTop: 5,
        marginBottom: 10,
    }
})

export default DataView

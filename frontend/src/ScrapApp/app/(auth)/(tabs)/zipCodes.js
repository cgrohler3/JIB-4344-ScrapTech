import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

import { Dropdown } from "react-native-element-dropdown";
import { PieChart } from "react-native-chart-kit";
import { db } from '../../../lib/firebaseConfig'

const ZipCodes = () => {
    const [zipCodes, setZipCodes] = useState([])
    const [zipCode, setZipCode] = useState('')
    const [chartData, setChartData] = useState([])
    const [weight, setWeight] = useState(0)

    const getZipCodes = async () => {
        const snapshot = await getDocs(collection(db, "zip_codes"))
        const docs = []
        snapshot.forEach((doc) => {
            docs.push({
                label: doc.id,
                value: doc.id
            })
        })
        setZipCodes(docs)
    }

    useEffect(() => {
        getZipCodes()
    }, [])
    
    const getDataByZipCode = async () => {
        const docSnap = await getDoc(doc(db, "zip_codes", zipCode))
        const data = docSnap.data()
        
        const formattedData = Object.entries(data.categories).map(([category, weight], index) => {
            const percentage = parseInt(parseFloat(weight / data.total_weight).toFixed(2) * 100)
            return {
                name: category,
                amount: percentage,
                color: getColor(index),
                legendFontColor: "#3D3E44",
                legendFontSize: 15,
            }
        })
        setChartData(formattedData)
    }

    useEffect(() => {
        getDataByZipCode()
    }, [zipCode]);

    const getColor = (index) => {
        const colors = ["#6C63FF", "#5551A2", "#F1A7B1", "#FFBB33", "#4CAF50", "#FF5722", "#8BC34A", "#FFC107"];
        return colors[index % colors.length];
    };

    console.log(chartData)

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Donations (By Zip Code)</Text>
            <View style={styles.chartBox}>
                <PieChart
                    data={chartData}
                    width={Dimensions.get('window').width - 40}
                    height={200}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor={"amount"}
                    backgroundColor={"transparent"}
                    paddingLeft={20}
                />
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
                onChange={(item) => {
                    setZipCode(item.value)
                }}
                activeColor='lightgray'
            />
        </View>
    )
}

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
		marginBottom: 20,
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
		borderColor: 'darkgray'
	},
    selectedTextStyle: {
		color: 'black',
		fontSize: 14,
	},
    chartBox: {
        width: '100%',
        borderColor: 'darkgray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    }
})

export default ZipCodes;

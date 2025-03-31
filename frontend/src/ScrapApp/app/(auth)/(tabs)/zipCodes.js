import { Dimensions, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

import { Dropdown } from "react-native-element-dropdown";
import { PieChart, BarChart } from "react-native-chart-kit";
import { db } from '../../../lib/firebaseConfig'

const ZipCodes = () => {
    const [activeView, setActiveView] = useState('view1');
    const [zipCodes, setZipCodes] = useState([])
    const [zipCode, setZipCode] = useState('')
    const [chartData, setChartData] = useState([])

    const [donations, setDonations] = useState(0)
    const [weight, setWeight] = useState(0)

    const [topZipSummaries, setTopZipSummaries] = useState([])

    const switchView = (view) => {
        setActiveView(view);
    };

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

    const getTopZipCodeSummaries = async () => {
        const snapshot = await getDocs(collection(db, "zip_codes"));
        const zipDataArray = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            zipDataArray.push({
                zip: doc.id,
                totalWeight: data.total_weight,
                totalDonations: data.total_donations,
                categories: data.categories,
            });
        });

        const sorted = zipDataArray.sort((a, b) => b.totalWeight - a.totalWeight);
        const top5 = sorted.slice(0, 5);

        const summaries = top5.map((zipData) => {
            const categorySummary = Object.entries(zipData.categories)
                .map(([cat, weight]) => `${cat}: ${weight} lbs`)
                .join(", ");

            return `Zip ${zipData.zip} - Weight: ${zipData.totalWeight} lbs, Donations: ${zipData.totalDonations}, Categories: ${categorySummary}`;
        });

        setTopZipSummaries(summaries);
    }

    useEffect(() => {
        getZipCodes();
        getTopZipCodeSummaries();
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
        setDonations(data.total_donations)
        setWeight(data.total_weight)
    }

    useEffect(() => {
        if (zipCode) {
            getDataByZipCode()
        }
    }, [zipCode]);

    const getColor = (index) => {
        const colors = ["#6C63FF", "#5551A2", "#F1A7B1", "#FFBB33", "#4CAF50", "#FF5722", "#8BC34A", "#FFC107"];
        return colors[index % colors.length];
    };

    return (
        <View style={styles.buttoncontainer}>
            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={styles.buttonBox}
                    onPress={() => switchView('view1')}
                >
                    <Text style={styles.buttonText}>Zip Codes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonBox}
                    onPress={() => switchView('view2')}
                >
                    <Text style={styles.buttonText}>Materials</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {activeView === 'view1' ? (
                    <ScrollView contentContainerStyle={styles.container}>
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
                    </ScrollView>
                ) : (
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.title}>Donations (By Material)</Text>

                        <View style={styles.barBox}>
                            <BarChart
                                data={{
                                    labels: ['Material 1', 'Material 2', 'Material 3', 'Material 4'],
                                    datasets: [
                                        {
                                            data: [2, 45, 3, 60],
                                        },
                                    ],
                                }}
                                width={Dimensions.get('window').width - 40}
                                height={250}
                                chartConfig={{
                                    backgroundGradientFrom: '#f5f5f5',
                                    backgroundGradientTo: '#f5f5f5',
                                    fillShadowGradientOpacity: 1,
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(55, 108, 62, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                    },
                                }}
                            />
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Top Zip Codes Summary</Text>
                            {topZipSummaries.map((summary, idx) => (
                                <Text key={idx} style={{ marginBottom: 6 }}>{summary}</Text>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
        paddingBottom: 40, // extra space for scroll view bottom
    },
    buttoncontainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    buttonGroup: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'center',
    },
    buttonBox: {
        height: 40,
        width: '47%',
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#376c3e',
        marginTop: 25,
        marginLeft: 4,
        marginRight: 4,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
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
    },
    selectedTextStyle: {
        color: 'black',
        fontSize: 14,
    },
    placeholderStyle: {
        color: 'gray',
        fontSize: 14,
    },
    chartBox: {
        width: '100%',
        height: 250,
        borderColor: 'darkgray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
    weightBox: {
        fontSize: 15,
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    barBox: {
        width: '100%',
        height: 250,
        backgroundColor: '#f5f5f5',
        borderWidth: 0,
        borderRadius: 5,
        marginBottom: 20,
    }
});

export default ZipCodes;

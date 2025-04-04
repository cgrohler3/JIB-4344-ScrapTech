import { BarChart, PieChart } from "react-native-chart-kit";
import { Button, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

import { Dropdown } from "react-native-element-dropdown";
import { db } from '../../../lib/firebaseConfig';

const ZipCodes = () => {
    const [activeView, setActiveView] = useState('view1');
    const [zipCodes, setZipCodes] = useState([]);
    const [zipCode, setZipCode] = useState('');
    const [chartData, setChartData] = useState([]);

    const [donations, setDonations] = useState(0);
    const [weight, setWeight] = useState(0);

    const [category, setCategory] = useState();
    const [categories, setCategories] = useState([]);

    const [topZipSummaries, setTopZipSummaries] = useState([]);

    const [data, setData] = useState({
        labels: [],
        datasets: [{ data: [] }],
    });

    const switchView = (view) => setActiveView(view);

    const getZipCodes = async () => {
        const snapshot = await getDocs(collection(db, "zip_codes"));
        const docs = [];
        snapshot.forEach((doc) => {
            docs.push({ label: doc.id, value: doc.id });
        });
        setZipCodes(docs);
    };

    const getCategories = async () => {
        const snapshot = await getDocs(collection(db, "categories"));
        const docs = [];
        snapshot.forEach((doc) => {
            docs.push({ label: doc.id, value: doc.id });
        });
        setCategories(docs);
    };

    const setCategoryData = (value) => {
        setCategory(value);
        getData();
    };

    const getData = async () => {
        const docSnap = await getDoc(doc(db, "categories", category));
        const data = docSnap.data();
        setData({
            labels: Object.keys(data["zipMap"]),
            datasets: [{ data: Object.values(data["zipMap"]) }],
        });
    };

    const getTopZipCodeSummaries = async () => {
        const snapshot = await getDocs(collection(db, "zip_codes"));
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
        setTopZipSummaries(sorted.slice(0, 3));
    };

    useEffect(() => {
        getZipCodes();
        getCategories();
        getTopZipCodeSummaries();
    }, []);

    const getDataByZipCode = async () => {
        const docSnap = await getDoc(doc(db, "zip_codes", zipCode));
        const data = docSnap.data();

        const formattedData = Object.entries(data.categories).map(([category, weight], index) => {
            const percentage = parseInt(parseFloat(weight / data.total_weight).toFixed(2) * 100);
            return {
                name: category,
                amount: percentage,
                color: getColor(index),
                legendFontColor: "#3D3E44",
                legendFontSize: 15,
            };
        });

        setChartData(formattedData);
        setDonations(data.total_donations);
        setWeight(data.total_weight);
    };

    useEffect(() => {
        if (zipCode) getDataByZipCode();
    }, [zipCode]);

    const getColor = (index) => {
        const colors = ["#6C63FF", "#5551A2", "#F1A7B1", "#FFBB33", "#4CAF50", "#FF5722", "#8BC34A", "#FFC107", "#E91E63", "#03A9F4", "#9C27B0", "#FFEB3B", "#009688", "#795548", "#673AB7", "#FF9800", "#CDDC39", "#607D8B", "#00BCD4", "#F44336"];
        return colors[index % colors.length];
    };

    return (
        <View style={styles.buttoncontainer}>
            <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.buttonBox} onPress={() => switchView('view1')}>
                    <Text style={styles.buttonText}>Zip Codes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonBox} onPress={() => switchView('view2')}>
                    <Text style={styles.buttonText}>Materials</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {activeView === 'view1' ? (
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.title}>Zip Code ({zipCode}) - Category Distribution and Totals</Text>

                        <View style={styles.chartBox}>
                            <Text style={styles.catBox}>Categories:</Text>
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
                                data={data}
                                width={Dimensions.get('window').width - 40}
                                height={250}
                                chartConfig={{
                                    backgroundGradientFrom: '#f5f5f5',
                                    backgroundGradientTo: '#f5f5f5',
                                    fillShadowGradientOpacity: 1,
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(55, 108, 62, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: { borderRadius: 16 },
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
                            onChange={(item) => setCategoryData(item.value)}
                            activeColor='lightgray'
                        />

                        <Button title="Refresh" onPress={getTopZipCodeSummaries} />

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
                        </View>
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
        paddingBottom: 40,
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
        height: 50,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#376c3e',
        marginBottom: 20,
        marginTop: 32,
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
        height: 290,
        borderColor: 'darkgray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        marginTop: 20,
        paddingTop: 16,
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
    },
    catBox: {
        textAlign: 'right',
        paddingRight: 256,
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default ZipCodes;

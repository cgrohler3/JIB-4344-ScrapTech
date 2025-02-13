import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from "react";

import {Dropdown} from "react-native-element-dropdown";
import { PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs,getDoc,getColor, query, doc, where } from 'firebase/firestore';
import { db } from '../../../lib/firebaseConfig';
import { onSnapshot } from "firebase/firestore";



const ZipCodes = () => {
    const [category, setCategory] = useState('')
    const [items, setItems] = useState([
        //dummy zip codes, will need to populate this
        { label: '30313', value: '30313' },
        { label: '30033', value: '30033' },
        { label: '30328', value: '30328' },
        { label: '30327', value: '30327' },
        { label: '30340', value: 'Other' },
    ]) 

    const [chartData, setChartData] = useState([]);
    const [zipCode, setZipCode] = useState('');
    const [zipCodes, setZipCodes] = useState([]); 


// code for retrieving zip code data from firetstore. Optimized to be a real time listener
    const fetchZipCodes = () => {
        console.log("Listening for zip code updates...");
    
        
        const unsubscribe = onSnapshot(collection(db, "zip_codes"), (snapshot) => {
            const zipList = snapshot.docs.map(doc => ({
                label: doc.id,
                value: doc.id,
            }));
    
            console.log("Updated Zip Codes:", zipList);
            setZipCodes(zipList);
    
            
            if (zipList.length > 0 && !zipCode) {
                setZipCode(zipList[zipList.length - 1].value);
            }
        });
    
        return unsubscribe; 
    };

        useEffect(() => {
            fetchZipCodes();
        }, []);

    
        
    const fetchCategoriesByZip = async (selectedZip) => {
            console.log(`fetchCategoriesByZip triggered with zip: ${selectedZip}`); 
            try {
                console.log(`Fetching data for zip code: ${selectedZip}`); 
        
                const docRef = doc(db, 'zip_codes', selectedZip);
                const docSnap = await getDoc(docRef);
        
                if (!docSnap.exists()) {
                    console.warn(`No data found for zip code: ${selectedZip}`);
                    setChartData([]);
                    return;
                }
        
                const data = docSnap.data();
                console.log("Raw Firestore Data:", data); 
        
                const { categories, total_weight } = data;
                
        if (total_weight === undefined) {
            console.error(`🚨 Error: total_weight is undefined for zip code: ${selectedZip}`);
        } else if (total_weight === 0) {
            console.warn(`⚠️ Warning: total_weight is 0 for zip code: ${selectedZip}`);
        }
        
                
        
                console.log("Categories Found:", categories); 
                console.log("Total Weight Found:", total_weight); 

                if (!categories || !total_weight || isNaN(total_weight) === 0) {
                    console.warn(`Invalid category data for zip code: ${selectedZip}`);
                    setChartData([]);
                    return;
                }
        
                
                const formattedData = Object.keys(categories).map((category, index) => {
                    const weight = categories[category] || 0;
                    const percentage = total_weight > 0 ? ((weight / total_weight) * 100).toFixed(2) : 0;
                    console.log(`Category: ${category}, Weight: ${categories[category]}, Percentage: ${percentage}%`);
        
                    return {
                        name: `% ${category}`,
                        amount: parseFloat(percentage),
                        label: `${percentage}%`,
                        color: getColor(index),
                        legendFontColor: "#3D3E44",
                        legendFontSize: 15,
                    };
                });

                console.log("Final Pie Chart Data:", formattedData);
        
                setChartData(formattedData);
            } catch (error) {
                console.error("Error fetching categories by zip code:", error);
            }
        };

        useEffect(() => {
            console.log("Zip Code selected:", zipCode); 
            if (zipCode) {
                fetchCategoriesByZip(zipCode);
            }
        }, [zipCode]); 

        const getColor = (index) => {
            const colors = ["#6C63FF", "#5551A2", "#F1A7B1", "#FFBB33", "#4CAF50", "#FF5722", "#8BC34A", "#FFC107"];
            return colors[index % colors.length];
        };
        


        
    // Placeholder data for now, will need to hardcode labels and then pull from donation data
   /* const chartData1 = [
        {
            name: "Glass",
            amount: 400,
            color: "#6C63FF",
            legendFontColor: "#3D3E44",
            legendFontSize: 15,
        },
        {
            name: "Fabric",
            amount: 300,
            color: "#5551A2",
            legendFontColor: "#3D3E44",
            legendFontSize: 15,
        },
        {
            name: "Vinyl",
            amount: 200,
            color: "#F1A7B1",
            legendFontColor: "#3D3E44",
            legendFontSize: 15,
        },
        {
            name: "Plastic",
            amount: 100,
            color: "#FFBB33",
            legendFontColor: "#3D3E44",
            legendFontSize: 15,
        },
    ]; */

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.chartContainer}>
                <Text style={styles.sectionTitle}>Donation Data</Text>
                <PieChart
                    data={chartData}
                    width={400}
                    height={200}
                    chartConfig={{
                        backgroundColor: "#FCFCFC",
                        backgroundGradientFrom: "#FCFCFC",
                        backgroundGradientTo: "#FCFCFC",
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="amount"
                    backgroundColor="#D7D7D7"
                    paddingLeft="15"
                    absolute
                />
                <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={zipCodes}
                    labelField='label'
                    valueField='value'
                    placeholder='Select Zip Code'
                    placeholderStyle={styles.placeholderStyle}
                    value={category}
                    onChange={(item) => {
                        setZipCode(item.value)
                    }}
                    activeColor='lightgray'
                />
            </View>
        </SafeAreaView>
    );
};

export default ZipCodes;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 16,
    },
    chartContainer: {
        marginVertical: 16,
        alignItems: "center",
    },
    sectionTitle: {
        color: '#376c3e',
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 10,
    },
    dropdown: {
        width: '100%',
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 15,
        backgroundColor: '#fff',
        color: 'gray',
        fontSize: 14,
    },
    placeholderStyle: {
        color: 'gray',
        fontSize: 14,
    },
});

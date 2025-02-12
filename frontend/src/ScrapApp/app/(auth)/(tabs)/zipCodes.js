import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from "react";

import {Dropdown} from "react-native-element-dropdown";
import { PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

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
    // Placeholder data for now, will need to hardcode labels and then pull from donation data
    const chartData = [
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
    ];

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
                />
                <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={items}
                    labelField='label'
                    valueField='value'
                    placeholder='Select Zip Code'
                    placeholderStyle={styles.placeholderStyle}
                    value={category}
                    onChange={(item) => {
                        setCategory(item.value)
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

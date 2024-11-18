import { Alert, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { onValue, ref } from 'firebase/database';

import { db } from '../../config';

const HomeScreen = () => {
    const [donations, setDonations] = useState([])

    const handleGET = () => {
        const c_ref = ref(db, 'donations');
        onValue(c_ref, (snapshot) => {
            if (snapshot.exists()) {
                setDonations(snapshot.val());
            }
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>View Donation</Text>
            <Button title="Retrieve" onPress={handleGET}/>
            <View>{donations && Object.keys(donations).map((key) => (
                <Text key={key}>{JSON.stringify(donations[key])}</Text>
            ))}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#376c3e',
    },
});

export default HomeScreen;
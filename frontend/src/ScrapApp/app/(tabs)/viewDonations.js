import { Alert, Button, Dimensions, ScrollView } from 'react-native';
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
            <ScrollView style={styles.parentBox} persistentScrollbar={true}>
                {donations && Object.keys(donations).map((key) => (
                    <View style={styles.childBox} key={key}>
                        <Text style={styles.boxItem}>
                            <Text style={{fontWeight: "bold"}}>Name: </Text>{donations[key].name}{"\n"}
                            <Text style={{fontWeight: "bold"}}>Weight: </Text>{donations[key].weight},{"\n"}
                            <Text style={{fontWeight: "bold"}}>Category: </Text>{donations[key].category}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingTop: 80,
        flex: 1
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#376c3e',
    },
    parentBox: {
        paddingLeft: 25,
        paddingRight: 25,
        width: Dimensions.get('window').width,
        flex: 1,
        marginBottom: 100
    },
    childBox: {
        borderColor: '#ddd',
        borderRadius: 10,
        borderWidth: 1,
        padding: 5,
        marginBottom: 10
    },
    boxItem: {
        padding: 5
    }
});

export default HomeScreen;
// import { Button, Dimensions, ScrollView, StyleSheet } from 'react-native';
// import { Text, View } from 'react-native';
// import { collection, getDocs } from 'firebase/firestore';

// import { db } from '../../config';
// import { useState } from 'react';

// const DViewScreen = () => {
//     const [donations, setDonations] = useState([])
    
//     const getAllDocs = async () => {
//         const snapshot = await getDocs(collection(db, "donations"));
//         const docs = [];
//         snapshot.forEach((doc) => {
//             docs.push({ id: doc.id, ...doc.data() });
//         })
//         setDonations(docs);
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>View Donations</Text>
//             <View style={styles.buttonContainer}>
//                 <Button title="Retrieve" onPress={getAllDocs} color="white" />
//             </View>
//             <ScrollView style={styles.parentBox} persistentScrollbar={true}>
//                 {donations && Object.keys(donations).map((key) => (
//                     <View style={styles.childBox} key={key}>
//                         <Text style={styles.boxItem}>
//                             <Text style={{fontWeight: "bold"}}>Email: </Text>{donations[key].email}{"\n"}
//                             <Text style={{fontWeight: "bold"}}>Zip Code: </Text>{donations[key].zipCode}{"\n"}
//                             <Text style={{fontWeight: "bold"}}>Item Name: </Text>{donations[key].itemName}{"\n"}
//                             <Text style={{fontWeight: "bold"}}>Quantity: </Text>{donations[key].quantity}{"\n"}
//                             <Text style={{fontWeight: "bold"}}>Weight: </Text>{donations[key].weight}{"\n"}
//                             <Text style={{fontWeight: "bold"}}>Category: </Text>{donations[key].category}
//                         </Text>
//                     </View>
//                 ))}
//             </ScrollView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         backgroundColor: '#f5f5f5',
//         paddingTop: 80,
//         flex: 1
//     },
//     title: {
//         fontSize: 25,
//         fontWeight: 'bold',
//         color: '#376c3e',
//     },
//     buttonContainer: {
//         marginTop: 20,
//         backgroundColor: '#376c3e',
//         color: 'white',
//         borderRadius: 5,
//     },
//     parentBox: {
//         width: Dimensions.get('window').width,
//         flex: 1,
//         marginBottom: 100,
//         marginTop: 25,
//         borderWidth: 1,
//         width: '90%',
//         borderColor: 'gray',
//         borderRadius: 5,
//         padding: 10
//     },
//     childBox: {
//         borderColor: '#ddd',
//         borderRadius: 10,
//         borderWidth: 1,
//         padding: 5,
//         marginBottom: 10
//     },
//     boxItem: {
//         padding: 5
//     }
// });

// export default DViewScreen;
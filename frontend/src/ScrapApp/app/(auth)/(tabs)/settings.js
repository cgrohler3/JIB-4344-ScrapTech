// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';


// import LoginScreen from './login';

// const Stack = createStackNavigator();

// const App = () => {
//     return (
//         <NavigationContainer>
//             <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
//                 <Stack.Screen name="Login" component={LoginScreen} />
//                 <Stack.Screen name="Home" component={TabLayout} />
//             </Stack.Navigator>
//         </NavigationContainer>
//     );
// };

// export default App;

import { StyleSheet, Text, View } from 'react-native'

import React from 'react'

const settings = () => {
  return (
    <View>
      <Text>settings</Text>
    </View>
  )
}

export default settings

const styles = StyleSheet.create({})

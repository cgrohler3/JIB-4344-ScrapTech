// import { Colors } from '@/constants/Colors';
// import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// import Fontisto from '@expo/vector-icons/Fontisto';
// import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import { Platform } from 'react-native';
// import React from 'react';
// import TabBarBackground from '@/components/ui/TabBarBackground';
// import { Tabs } from 'expo-router';
// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//         tabBarBackground: TabBarBackground,
//         tabBarStyle: Platform.select({
//           ios: {
//             // Use a transparent background on iOS to show the blur effect
//             position: 'absolute',
//           },
//           default: {},
//         }),
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="logDonations"
//         options={{
//           title: 'Log Donations',
//           tabBarIcon: ({ color }) => <FontAwesome6 name="box-open" size={24} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="viewDonations"
//         options={{
//           title: 'View Donations',
//           tabBarIcon: ({ color }) => <Fontisto name="preview" size={24} color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }

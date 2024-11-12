import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import '../../global.css'
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Tổng quan',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="statistics" 
        options={{
          title: 'Thống kê',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bar-chart" size={24} color={color} />
          ),
        }}
      />
         <Tabs.Screen 
        name="setting" 
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="cog" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
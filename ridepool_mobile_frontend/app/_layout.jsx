import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Login from '@/app/login';
import OverviewScreen from '@/app/tabs/overview';
import MyRidepoolsScreen from '@/app/tabs/my_ridepools';
import ProfileScreen from '@/app/tabs/profile';
import Gemini from '@/app/tabs/gemini_help';

import CreateRidepoolScreen from '@/app/inner_pages/create_ridepool'
import FilterRidepoolScreen from '@/app/inner_pages/filter_ridepool'
import EditProfileScreen from '@/app/inner_pages/edit_profile'
import ActiveRidesScreen from '@/app/inner_pages/active_rides'
import HistoryRidesScreen from '@/app/inner_pages/history_rides'

import { fetchToken } from './components/token_funcs';
import { AuthProvider, useAuth } from './components/AuthContext';

import { sendAuthorizedGetRequest } from './components/sendRequest';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyRidepoolsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="My Ridepools" component={MyRidepoolsScreen} />
      <Stack.Screen name="Create Ridepool" component={CreateRidepoolScreen} />
      <Stack.Screen name="Active Rides" component={ActiveRidesScreen} />
      <Stack.Screen name="History Rides" component={HistoryRidesScreen} />
    </Stack.Navigator>

  )
}

function OverviewStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search for Ridepools" component={OverviewScreen} />
      <Stack.Screen name="Filter Ridepools" component={FilterRidepoolScreen} />
    </Stack.Navigator>
  )
}

function GeminiStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name ="Help by Gemini" component={Gemini} />
    </Stack.Navigator>
  )
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
    </Stack.Navigator>
  )
}

function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName;

          if (route.name === 'tabs/overview') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'tabs/my_ridepools') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'tabs/profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'tabs/gemini_help') {
            iconName = focused ? 'information-circle-outline' : 'information-circle-outline';
          }

          return <TabBarIcon name={iconName} color={color} />;
        },
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="tabs/overview"
        component={OverviewStack}
        options={{ title: 'All Ridepools' }}
      />
      <Tab.Screen
        name="tabs/my_ridepools"
        component={MyRidepoolsStack}
        options={{ title: 'My Ridepools' }}
      />
      <Tab.Screen
        name="tabs/profile"
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
      <Tab.Screen
        name="tabs/gemini_help"
        component={GeminiStack}
        options={{ title: 'Help by Gemini' }}
      />
    </Tab.Navigator>
  )
}

function HomePage() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  useEffect(() => {
    const fetchTokenAsync = async () => {
      const storedToken = await fetchToken();
      if (storedToken) {
        try {
          // test the token to make sure it's valid, if its not, you'll get 401 error
          await sendAuthorizedGetRequest('/profile')
          setIsLoggedIn(true)
        }
        catch (e) {
          setIsLoggedIn(false)
        }
      }
    };
    fetchTokenAsync();
  }, []);
  if (isLoggedIn) {
    return <TabLayout />
  }else{
    return <Login />
  }
}

export default function App() { 
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  )
}
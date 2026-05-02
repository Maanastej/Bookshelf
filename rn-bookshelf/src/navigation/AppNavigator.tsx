import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import SavedScreen from '../screens/SavedScreen';
import { HomeStackParamList, RootTabParamList } from './types';
import { useAppSelector } from '../store';

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#1a1a2e' },
      headerTintColor: '#e0e0e0',
      headerTitleStyle: { fontWeight: '700' },
    }}>
    <Stack.Screen
      name="BookList"
      component={HomeScreen}
      options={{ title: 'Bookshelf' }}
    />
    <Stack.Screen
      name="BookDetail"
      component={DetailScreen}
      options={{ title: 'Book Details' }}
    />
  </Stack.Navigator>
);

const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{label}</Text>
);

const SavedTabIcon = ({ focused }: { focused: boolean }) => {
  const count = useAppSelector(s => s.saved.books.length);
  return (
    <View>
      <TabIcon label="★" focused={focused} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </View>
  );
};

const AppNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#7c83fd',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ focused }) => <TabIcon label="🔍" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ focused }) => <SavedTabIcon focused={focused} />,
          headerShown: true,
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#e0e0e0',
          headerTitleStyle: { fontWeight: '700' },
          title: 'Saved Books',
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1a1a2e',
    borderTopColor: '#333',
    borderTopWidth: 1,
    height: 56,
    paddingBottom: 6,
  },
  tabLabel: {
    fontSize: 11,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.5,
  },
  tabIconFocused: {
    opacity: 1,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#7c83fd',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});

export default AppNavigator;

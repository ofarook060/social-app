import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '../../lib/auth';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/config';
import { api } from '../../lib/api';
import { useEffect, useState } from 'react';

function NotificationBadge() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await api.get('/api/notifications/count.php');
      if (res.success) setCount(res.count || 0);
    }, 30000);
    api.get('/api/notifications/count.php').then((res) => {
      if (res.success) setCount(res.count || 0);
    });
    return () => clearInterval(interval);
  }, []);

  if (!count) return null;
  return (
    <View style={{
      position: 'absolute', top: -4, right: -8,
      backgroundColor: COLORS.error, borderRadius: 10,
      minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center',
      paddingHorizontal: 4,
    }}>
    </View>
  );
}

export default function TabsLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerStyle: { backgroundColor: COLORS.white },
        headerTintColor: COLORS.primary,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'SYK Social',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

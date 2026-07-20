import { Redirect, Tabs, useRouter } from 'expo-router';
import { useAuth } from '../../src/lib/auth';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../../src/constants/config';
import { imageUrl } from '../../src/lib/utils';
import Logo from '../../components/Logo';

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.emerald }}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarStyle: {
          backgroundColor: COLORS.emerald,
          borderTopWidth: 1,
          borderTopColor: COLORS.emeraldLight,
          paddingBottom: 4,
          height: 56,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        headerStyle: {
          backgroundColor: COLORS.emerald,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.emeraldLight,
        },
        headerTintColor: COLORS.gold,
        headerTitleStyle: { fontWeight: 'bold', fontSize: 20, color: COLORS.gold },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: () => <Logo size="small" showTitle={true} />,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 12 }}>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/search')}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.emeraldLight, justifyContent: 'center', alignItems: 'center' }}
              >
                <Ionicons name="search" size={20} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/messages')}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.emeraldLight, justifyContent: 'center', alignItems: 'center' }}
              >
                <Ionicons name="chatbubbles" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ),
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'Profile',
          tabBarIcon: ({ color, size }) =>
            user.profile_image ? (
              <Image
                source={{ uri: imageUrl(user.profile_image) }}
                style={{ width: size, height: size, borderRadius: size / 2, borderWidth: color === COLORS.gold ? 2 : 0, borderColor: COLORS.gold }}
              />
            ) : (
              <Ionicons name="person" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          headerTitle: 'Create Post',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size + 4} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          headerTitle: 'Notifications',
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{ href: null, headerTitle: 'Search' }}
      />
      <Tabs.Screen
        name="messages"
        options={{ href: null, headerTitle: 'Messages' }}
      />
    </Tabs>
  );
}

import { Redirect, Tabs, useRouter } from 'expo-router';
import { useAuth } from '../../src/lib/auth';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../../src/constants/config';
import { imageUrl } from '../../src/lib/utils';

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

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
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingBottom: 4,
          height: 56,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        headerStyle: { backgroundColor: COLORS.white, elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: COLORS.border },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: 'bold', fontSize: 20, color: COLORS.primary },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'SYK Social',
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 12 }}>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/search')}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}
              >
                <Ionicons name="search" size={20} color={COLORS.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/messages')}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}
              >
                <Ionicons name="messenger" size={20} color={COLORS.text} />
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
                style={{ width: size, height: size, borderRadius: size / 2, borderWidth: color === COLORS.primary ? 2 : 0, borderColor: COLORS.primary }}
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

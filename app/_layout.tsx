import { Stack } from 'expo-router';
import { AuthProvider } from '../src/lib/auth';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../src/constants/config';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: COLORS.emerald },
          headerTintColor: COLORS.gold,
          headerTitleStyle: { color: COLORS.gold, fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile/[userid]" options={{ headerShown: true, title: 'Profile' }} />
        <Stack.Screen name="post/[postid]" options={{ headerShown: true, title: 'Post' }} />
        <Stack.Screen name="messages/[userid]" options={{ headerShown: true, title: 'Chat' }} />
        <Stack.Screen name="group/[groupid]" options={{ headerShown: true, title: 'Group' }} />
      </Stack>
    </AuthProvider>
  );
}

import { Stack } from 'expo-router';
import { AuthProvider } from '../lib/auth';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/config';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
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

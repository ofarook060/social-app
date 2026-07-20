import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/lib/auth';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../../src/constants/config';

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.emerald }}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

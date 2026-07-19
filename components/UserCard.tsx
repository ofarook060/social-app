import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { User } from '../src/lib/types';
import { imageUrl, fullName, isOnline } from '../src/lib/utils';
import { COLORS } from '../src/constants/config';

interface Props {
  user: User;
  subtitle?: string;
}

export default function UserCard({ user, subtitle }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/profile/${user.userid}`)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: imageUrl(user.profile_image) || 'https://via.placeholder.com/48' }}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{fullName(user.first_name, user.last_name)}</Text>
        {subtitle ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : user.about ? (
          <Text style={styles.subtitle} numberOfLines={1}>{user.about}</Text>
        ) : null}
      </View>
      {isOnline(user.online) && <View style={styles.onlineDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', padding: 12,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.background },
  info: { flex: 1, marginLeft: 12 },
  name: { fontWeight: '600', fontSize: 15, color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  onlineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.online },
});

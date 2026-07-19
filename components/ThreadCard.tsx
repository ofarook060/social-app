import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Thread } from '../lib/types';
import { imageUrl, fullName, timeAgo } from '../lib/utils';
import { COLORS } from '../constants/config';

interface Props {
  thread: Thread;
}

export default function ThreadCard({ thread }: Props) {
  const router = useRouter();
  const user = thread.other_user;

  if (!user) return null;

  return (
    <TouchableOpacity
      style={[styles.card, thread.unread_count > 0 && styles.unread]}
      onPress={() => router.push(`/messages/${user.userid}`)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: imageUrl(user.profile_image) || 'https://via.placeholder.com/48' }}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{fullName(user.first_name, user.last_name)}</Text>
        <Text style={styles.preview} numberOfLines={1}>{thread.message || 'Photo'}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.time}>{timeAgo(thread.date)}</Text>
        {thread.unread_count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{thread.unread_count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', padding: 12,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  unread: { backgroundColor: '#E3F2FD' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.background },
  info: { flex: 1, marginLeft: 12 },
  name: { fontWeight: '600', fontSize: 15, color: COLORS.text },
  preview: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  right: { alignItems: 'flex-end', gap: 6 },
  time: { fontSize: 12, color: COLORS.textSecondary },
  badge: {
    backgroundColor: COLORS.primary, borderRadius: 10, minWidth: 20, height: 20,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6,
  },
  badgeText: { color: COLORS.white, fontSize: 11, fontWeight: '600' },
});

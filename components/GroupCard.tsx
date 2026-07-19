import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/config';
import { imageUrl } from '../lib/utils';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  group: any;
}

export default function GroupCard({ group }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/group/${group.userid}`)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: imageUrl(group.profile_image) || 'https://via.placeholder.com/48' }}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{group.first_name}</Text>
        <Text style={styles.type}>{group.group_type || 'Public'} Group</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', padding: 12,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  avatar: { width: 48, height: 48, borderRadius: 8, backgroundColor: COLORS.background },
  info: { flex: 1, marginLeft: 12 },
  name: { fontWeight: '600', fontSize: 15, color: COLORS.text },
  type: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
});

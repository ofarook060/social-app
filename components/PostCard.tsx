import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Post } from '../lib/types';
import { imageUrl, fullName, timeAgo } from '../lib/utils';
import { COLORS } from '../constants/config';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/post/${post.postid}`)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push(`/profile/${post.userid}`)}>
          <Image
            source={{ uri: imageUrl(post.profile_image) || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <TouchableOpacity onPress={() => router.push(`/profile/${post.userid}`)}>
            <Text style={styles.name}>{fullName(post.first_name, post.last_name)}</Text>
          </TouchableOpacity>
          <Text style={styles.time}>{timeAgo(post.date)}</Text>
        </View>
      </View>

      {post.post ? <Text style={styles.body}>{post.post}</Text> : null}

      {post.has_image === '1' && post.image ? (
        <Image source={{ uri: imageUrl(post.image) }} style={styles.postImage} resizeMode="cover" />
      ) : null}

      <View style={styles.footer}>
        <View style={styles.stat}>
          <Ionicons name="heart-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.statText}>{post.likes || '0'}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.statText}>{post.comments || '0'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.white, marginBottom: 8, paddingBottom: 8 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.background },
  headerText: { marginLeft: 10, flex: 1 },
  name: { fontWeight: '600', fontSize: 15, color: COLORS.text },
  time: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  body: { fontSize: 15, color: COLORS.text, paddingHorizontal: 12, lineHeight: 22 },
  postImage: { width: '100%', height: 300, marginTop: 8 },
  footer: {
    flexDirection: 'row', paddingHorizontal: 12, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 10, gap: 20,
  },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 13, color: COLORS.textSecondary },
});

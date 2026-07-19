import { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../lib/api';
import { Group, Post } from '../../lib/types';
import { imageUrl, fullName } from '../../lib/utils';
import { COLORS } from '../../constants/config';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../lib/auth';
import PostCard from '../../components/PostCard';

export default function GroupScreen() {
  const { groupid } = useLocalSearchParams<{ groupid: string }>();
  const { user: me } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [myRole, setMyRole] = useState('');
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroup = useCallback(async () => {
    const [infoRes, postsRes] = await Promise.all([
      api.get(`/api/groups/info.php?groupid=${groupid}`),
      api.get(`/api/groups/posts.php?groupid=${groupid}`),
    ]);
    if (infoRes.success) {
      setGroup(infoRes.group);
      setIsMember(infoRes.is_member);
      setMyRole(infoRes.my_role);
      setMemberCount(infoRes.member_count);
    }
    if (postsRes.success) setPosts(postsRes.posts || []);
    setLoading(false);
    setRefreshing(false);
  }, [groupid]);

  useEffect(() => { fetchGroup(); }, [fetchGroup]);

  const onRefresh = () => { setRefreshing(true); fetchGroup(); };

  const handleJoin = async () => {
    const res = await api.post('/api/groups/join.php', { groupid: parseInt(groupid!) });
    if (res.success) Alert.alert('Sent', 'Join request sent!');
  };

  if (loading || !group) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.postid}
      renderItem={({ item }) => <PostCard post={item} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      ListHeaderComponent={
        <View>
          <Image
            source={{ uri: imageUrl(group.cover_image) || 'https://via.placeholder.com/400x150' }}
            style={styles.cover}
          />
          <View style={styles.info}>
            <Text style={styles.name}>{group.first_name}</Text>
            <Text style={styles.meta}>{group.group_type} Group · {memberCount} members</Text>
            {group.about ? <Text style={styles.about}>{group.about}</Text> : null}
            {!isMember && (
              <TouchableOpacity style={styles.joinBtn} onPress={handleJoin}>
                <Text style={styles.joinText}>Join Group</Text>
              </TouchableOpacity>
            )}
            {isMember && (
              <Text style={styles.role}>You are {myRole}</Text>
            )}
          </View>
        </View>
      }
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { backgroundColor: COLORS.background },
  cover: { width: '100%', height: 150, backgroundColor: COLORS.background },
  info: { padding: 16, backgroundColor: COLORS.white, marginBottom: 8 },
  name: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  meta: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  about: { fontSize: 14, color: COLORS.text, marginTop: 8 },
  joinBtn: {
    marginTop: 16, paddingVertical: 12, paddingHorizontal: 30,
    backgroundColor: COLORS.primary, borderRadius: 8, alignItems: 'center',
  },
  joinText: { color: COLORS.white, fontWeight: '600', fontSize: 16 },
  role: { fontSize: 13, color: COLORS.textSecondary, marginTop: 12, fontStyle: 'italic' },
});

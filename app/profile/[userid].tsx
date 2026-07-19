import { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../lib/api';
import { User, Post } from '../../lib/types';
import { imageUrl, fullName, isOnline } from '../../lib/utils';
import { COLORS } from '../../constants/config';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../lib/auth';
import PostCard from '../../components/PostCard';

export default function ProfileScreen() {
  const { userid } = useLocalSearchParams<{ userid: string }>();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isOwn = me?.userid === userid;

  const fetchProfile = useCallback(async () => {
    const [profileRes, postsRes] = await Promise.all([
      api.get(`/api/profile.php?user_id=${userid}`),
      api.get(`/api/posts.php?user_id=${userid}&type=profile`),
    ]);
    if (profileRes.success) setProfile(profileRes.user);
    if (postsRes.success) setPosts(postsRes.posts || []);

    if (!isOwn && me) {
      const followRes = await api.get('/api/user/following.php');
      if (followRes.success) {
        setFollowing(followRes.following?.some((f: any) => f.userid === userid));
      }
    }
    setLoading(false);
    setRefreshing(false);
  }, [userid, isOwn, me]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const onRefresh = () => { setRefreshing(true); fetchProfile(); };

  const handleFollow = async () => {
    await api.post('/api/user.php', { action: 'follow', user_id: parseInt(userid!) });
    setFollowing(!following);
  };

  if (loading || !profile) {
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
            source={{ uri: imageUrl(profile.cover_image) || 'https://via.placeholder.com/400x150' }}
            style={styles.cover}
          />
          <View style={styles.profileSection}>
            <Image
              source={{ uri: imageUrl(profile.profile_image) || 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{fullName(profile.first_name, profile.last_name)}</Text>
            <Text style={styles.tag}>@{profile.tag_name}</Text>
            {isOnline(profile.online) && <Text style={styles.online}>Online</Text>}
            {profile.about ? <Text style={styles.about}>{profile.about}</Text> : null}

            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statNum}>{profile.likes || '0'}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
            </View>

            {!isOwn && me && (
              <TouchableOpacity
                style={[styles.followBtn, following && styles.followingBtn]}
                onPress={handleFollow}
              >
                <Text style={[styles.followText, following && styles.followingText]}>
                  {following ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
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
  profileSection: { alignItems: 'center', paddingVertical: 16, backgroundColor: COLORS.white, marginBottom: 8 },
  profileImage: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.background, marginTop: -50, borderWidth: 3, borderColor: COLORS.white },
  name: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginTop: 10 },
  tag: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  online: { fontSize: 13, color: COLORS.online, marginTop: 4 },
  about: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8, paddingHorizontal: 40, textAlign: 'center' },
  stats: { flexDirection: 'row', marginTop: 16, gap: 30 },
  stat: { alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 13, color: COLORS.textSecondary },
  followBtn: {
    marginTop: 16, paddingHorizontal: 40, paddingVertical: 10,
    borderRadius: 8, backgroundColor: COLORS.primary,
  },
  followingBtn: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  followText: { color: COLORS.white, fontWeight: '600', fontSize: 15 },
  followingText: { color: COLORS.text },
});

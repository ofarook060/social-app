import { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { router } from 'expo-router';
import { api } from '../../src/lib/api';
import { User, Post } from '../../src/lib/types';
import { imageUrl, fullName, isOnline } from '../../src/lib/utils';
import { COLORS } from '../../src/constants/config';
import { useAuth } from '../../src/lib/auth';
import PostCard from '../../components/PostCard';
import { Ionicons } from '@expo/vector-icons';

const TAB_POSTS = 'posts';
const TAB_FRIENDS = 'friends';
const TAB_PHOTOS = 'photos';

export default function MyProfileTab() {
  const { user: me, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(TAB_POSTS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!me) return;
    const [profileRes, postsRes, friendsRes] = await Promise.all([
      api.get(`/api/profile.php?user_id=${me.userid}`),
      api.get(`/api/posts.php?user_id=${me.userid}&type=profile`),
      api.get('/api/user/following.php'),
    ]);
    if (profileRes.success) setProfile(profileRes.user);
    if (postsRes.success) setPosts(postsRes.posts || []);
    if (friendsRes.success) setFriends(friendsRes.following || []);
    if (postsRes.success) {
      const imgs = (postsRes.posts || [])
        .filter((p: Post) => p.has_image === '1' && p.image)
        .map((p: Post) => p.image);
      setPhotos(imgs);
    }
    setLoading(false);
    setRefreshing(false);
  }, [me]);

  useEffect(() => {
    (async () => {
      await fetchProfile();
    })();
  }, [fetchProfile]);

  const onRefresh = () => { setRefreshing(true); fetchProfile(); };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const renderHeader = () => (
    <View>
      <Image
        source={{ uri: imageUrl(profile?.cover_image) || 'https://via.placeholder.com/400x150' }}
        style={styles.cover}
      />
      <View style={styles.profileSection}>
        <Image
          source={{ uri: imageUrl(profile?.profile_image) || 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{profile ? fullName(profile.first_name, profile.last_name) : ''}</Text>
        <Text style={styles.tag}>@{profile?.tag_name}</Text>
        {profile && isOnline(profile.online) && <Text style={styles.online}>Online</Text>}
        {profile?.about ? <Text style={styles.about}>{profile.about}</Text> : null}

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{profile?.likes || '0'}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{friends.length}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{photos.length}</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createPostBtn}
          onPress={() => router.push('/(tabs)/create')}
        >
          <Ionicons name="create-outline" size={18} color={COLORS.emerald} />
          <Text style={styles.createPostText}>Create Post</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === TAB_POSTS && styles.activeTab]}
          onPress={() => setActiveTab(TAB_POSTS)}
        >
          <Text style={[styles.tabText, activeTab === TAB_POSTS && styles.activeTabText]}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === TAB_FRIENDS && styles.activeTab]}
          onPress={() => setActiveTab(TAB_FRIENDS)}
        >
          <Text style={[styles.tabText, activeTab === TAB_FRIENDS && styles.activeTabText]}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === TAB_PHOTOS && styles.activeTab]}
          onPress={() => setActiveTab(TAB_PHOTOS)}
        >
          <Text style={[styles.tabText, activeTab === TAB_PHOTOS && styles.activeTabText]}>Photos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading || !profile) {
    return <View style={styles.center}><Text style={{ color: COLORS.gold }}>Loading...</Text></View>;
  }

  if (activeTab === TAB_FRIENDS) {
    return (
      <FlatList
        key="friends-tab"
        ListHeaderComponent={renderHeader}
        data={friends}
        keyExtractor={(item) => item.userid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.friendItem}
            onPress={() => router.push(`/profile/${item.userid}`)}
          >
            <Image
              source={{ uri: imageUrl(item.profile_image) || 'https://via.placeholder.com/48' }}
              style={styles.friendAvatar}
            />
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{fullName(item.first_name, item.last_name)}</Text>
              {isOnline(item.online) && <Text style={styles.friendOnline}>Online</Text>}
            </View>
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No friends yet</Text>}
      />
    );
  }

  if (activeTab === TAB_PHOTOS) {
    return (
      <FlatList
        key="photos-tab"
        ListHeaderComponent={renderHeader}
        data={photos}
        numColumns={3}
        keyExtractor={(item, i) => `${item}-${i}`}
        renderItem={({ item }) => (
          <Image
            source={{ uri: imageUrl(item) }}
            style={styles.photoGridItem}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No photos yet</Text>}
      />
    );
  }

  return (
    <FlatList
      key="posts-tab"
      data={posts}
      keyExtractor={(item) => item.postid}
      renderItem={({ item }) => <PostCard post={item} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.emerald },
  list: { backgroundColor: COLORS.emerald },
  cover: { width: '100%', height: 150, backgroundColor: COLORS.emeraldLight },
  profileSection: { alignItems: 'center', paddingVertical: 16, backgroundColor: COLORS.white, marginBottom: 0 },
  profileImage: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.background, marginTop: -50, borderWidth: 3, borderColor: COLORS.gold },
  name: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginTop: 10 },
  tag: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  online: { fontSize: 13, color: COLORS.online, marginTop: 4 },
  about: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8, paddingHorizontal: 40, textAlign: 'center' },
  stats: { flexDirection: 'row', marginTop: 16, gap: 40 },
  stat: { alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 13, color: COLORS.textSecondary },
  createPostBtn: {
    marginTop: 16, paddingHorizontal: 24, paddingVertical: 10,
    borderRadius: 12, backgroundColor: COLORS.gold, flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  createPostText: { color: COLORS.emerald, fontWeight: '600', fontSize: 15 },
  logoutBtn: {
    marginTop: 8, paddingHorizontal: 40, paddingVertical: 8,
    borderRadius: 12, backgroundColor: COLORS.emerald, borderWidth: 1, borderColor: COLORS.emeraldLight,
  },
  logoutText: { color: COLORS.gold, fontWeight: '600', fontSize: 15 },
  tabBar: {
    flexDirection: 'row', backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: COLORS.gold },
  tabText: { fontSize: 14, fontWeight: '500', color: COLORS.textSecondary },
  activeTabText: { color: COLORS.gold, fontWeight: '600' },
  friendItem: {
    flexDirection: 'row', alignItems: 'center', padding: 12,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  friendAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.background },
  friendInfo: { marginLeft: 12, flex: 1 },
  friendName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  friendOnline: { fontSize: 12, color: COLORS.online, marginTop: 2 },
  photoGridItem: { width: '33.33%', aspectRatio: 1, borderWidth: 1, borderColor: COLORS.emerald },
  emptyText: { textAlign: 'center', color: COLORS.goldLight, marginTop: 30, fontSize: 16 },
});

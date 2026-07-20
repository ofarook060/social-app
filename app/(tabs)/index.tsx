import { useEffect, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import { api } from '../../src/lib/api';
import { Post } from '../../src/lib/types';
import { COLORS } from '../../src/constants/config';
import PostCard from '../../components/PostCard';

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    const res = await api.get('/api/posts/feed.php');
    if (res.success) setPosts(res.posts || []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await api.get('/api/posts/feed.php');
      if (!cancelled) {
        if (res.success) setPosts(res.posts || []);
        setLoading(false);
        setRefreshing(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const onRefresh = () => { setRefreshing(true); fetchPosts(); };

  if (loading) {
    return <View style={styles.center}><Text style={{ color: COLORS.gold }}>Loading...</Text></View>;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.postid}
      renderItem={({ item }) => <PostCard post={item} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
      contentContainerStyle={posts.length === 0 ? styles.center : styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No posts yet. Follow someone to see their posts!</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.emerald },
  list: { paddingVertical: 8, backgroundColor: COLORS.emerald },
  empty: { textAlign: 'center', color: COLORS.goldLight, marginTop: 40, fontSize: 16 },
});

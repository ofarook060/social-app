import { useEffect, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, Text, StyleSheet } from 'react-native';
import { api } from '../../lib/api';
import { Thread } from '../../lib/types';
import { COLORS } from '../../constants/config';
import ThreadCard from '../../components/ThreadCard';

export default function MessagesScreen() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchThreads = useCallback(async () => {
    const res = await api.get('/api/messages/threads.php');
    if (res.success) setThreads(res.threads || []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchThreads(); }, [fetchThreads]);

  const onRefresh = () => { setRefreshing(true); fetchThreads(); };

  if (loading) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  return (
    <FlatList
      data={threads}
      keyExtractor={(item) => item.msgid}
      renderItem={({ item }) => <ThreadCard thread={item} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      contentContainerStyle={threads.length === 0 ? styles.center : styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No messages yet</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  list: { backgroundColor: COLORS.background },
  empty: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 40, fontSize: 16 },
});

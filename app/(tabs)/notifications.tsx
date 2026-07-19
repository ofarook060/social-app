import { useEffect, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { api } from '../../lib/api';
import { Notification } from '../../lib/types';
import { COLORS } from '../../constants/config';
import { Ionicons } from '@expo/vector-icons';
import { timeAgo, fullName } from '../../lib/utils';
import { router } from 'expo-router';

function getActivityIcon(activity: string) {
  switch (activity) {
    case 'like': return 'heart';
    case 'follow': return 'person-add';
    case 'comment': return 'chatbubble';
    case 'tag': return 'pricetag';
    case 'role': return 'shield-checkmark';
    case 'invite': return 'mail';
    default: return 'notifications';
  }
}

function getActivityText(activity: string) {
  switch (activity) {
    case 'like': return 'liked your post';
    case 'follow': return 'started following you';
    case 'comment': return 'commented on your post';
    case 'tag': return 'tagged you in a post';
    case 'role': return 'changed your group role';
    case 'invite': return 'invited you to a group';
    default: return 'interacted with you';
  }
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    const res = await api.get('/api/notifications/list.php');
    if (res.success) setNotifications(res.notifications || []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await api.get('/api/notifications/list.php');
      if (!cancelled) {
        if (res.success) setNotifications(res.notifications || []);
        setLoading(false);
        setRefreshing(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const onRefresh = () => { setRefreshing(true); fetchNotifications(); };

  const handlePress = async (notif: Notification) => {
    if (!notif.seen) {
      await api.post('/api/notifications/seen.php', { notification_id: notif.id });
    }
    if (notif.content_type === 'post' || notif.content_type === 'comment') {
      router.push(`/post/${notif.contentid}`);
    } else if (notif.content_type === 'profile') {
      router.push(`/profile/${notif.userid}`);
    } else if (notif.content_type === 'group') {
      router.push(`/group/${notif.contentid}`);
    }
    fetchNotifications();
  };

  if (loading) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.item, !item.seen && styles.unread]}
          onPress={() => handlePress(item)}
        >
          <View style={styles.avatar}>
            <Ionicons name={getActivityIcon(item.activity) as any} size={20} color={COLORS.primary} />
          </View>
          <View style={styles.content}>
            <Text style={styles.name}>{fullName(item.first_name, item.last_name)}</Text>
            <Text style={styles.text}>{getActivityText(item.activity)}</Text>
            <Text style={styles.time}>{timeAgo(item.date)}</Text>
          </View>
        </TouchableOpacity>
      )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      contentContainerStyle={notifications.length === 0 ? styles.center : styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No notifications yet</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  list: { backgroundColor: COLORS.background },
  item: {
    flexDirection: 'row', padding: 14, backgroundColor: COLORS.white,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  unread: { backgroundColor: '#E3F2FD' },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  content: { flex: 1 },
  name: { fontWeight: '600', fontSize: 15, color: COLORS.text },
  text: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  time: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  empty: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 40, fontSize: 16 },
});

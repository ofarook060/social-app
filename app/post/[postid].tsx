import { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../src/lib/api';
import { Post } from '../../src/lib/types';
import { imageUrl, fullName, timeAgo } from '../../src/lib/utils';
import { COLORS } from '../../src/constants/config';
import { Ionicons } from '@expo/vector-icons';

export default function PostScreen() {
  const { postid } = useLocalSearchParams<{ postid: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Post[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    const res = await api.get(`/api/posts/single.php?postid=${postid}`);
    if (res.success) {
      setPost(res.post);
      setComments(res.comments || []);
      setLiked(res.liked_by_me);
      setLikeCount(res.likes || 0);
    }
    setLoading(false);
  }, [postid]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await api.get(`/api/posts/single.php?postid=${postid}`);
      if (!cancelled) {
        if (res.success) {
          setPost(res.post);
          setComments(res.comments || []);
          setLiked(res.liked_by_me);
          setLikeCount(res.likes || 0);
        }
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [postid]);

  const handleLike = async () => {
    const res = await api.post('/api/like.php', { content_id: parseInt(postid!), type: 'post' });
    if (res.success) {
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    const res = await api.post('/api/posts/comments.php', { post: commentText, parent: parseInt(postid!) });
    if (res.success) {
      setCommentText('');
      fetchPost();
    }
  };

  if (loading || !post) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => item.postid}
        ListHeaderComponent={
          <View>
            <View style={styles.postHeader}>
              <Image
                source={{ uri: imageUrl(post.profile_image) || 'https://via.placeholder.com/40' }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.name}>{fullName(post.first_name, post.last_name)}</Text>
                <Text style={styles.time}>{timeAgo(post.date)}</Text>
              </View>
            </View>
            {post.post ? <Text style={styles.postBody}>{post.post}</Text> : null}
            {post.has_image === '1' && post.image ? (
              <Image source={{ uri: imageUrl(post.image) }} style={styles.postImage} resizeMode="cover" />
            ) : null}
            <View style={styles.stats}>
              <TouchableOpacity onPress={handleLike} style={styles.likeBtn}>
                <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? COLORS.error : COLORS.textSecondary} />
                <Text style={[styles.statText, liked && { color: COLORS.error }]}>{likeCount}</Text>
              </TouchableOpacity>
              <View style={styles.commentStat}>
                <Ionicons name="chatbubble-outline" size={18} color={COLORS.textSecondary} />
                <Text style={styles.statText}>{comments.length} comments</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.commentsTitle}>Comments</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Image
              source={{ uri: imageUrl(item.profile_image) || 'https://via.placeholder.com/32' }}
              style={styles.commentAvatar}
            />
            <View style={styles.commentContent}>
              <Text style={styles.commentName}>{fullName(item.first_name, item.last_name)}</Text>
              <Text style={styles.commentText}>{item.post}</Text>
              <Text style={styles.commentTime}>{timeAgo(item.date)}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity onPress={handleComment} style={styles.sendBtn}>
          <Ionicons name="send" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 20 },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: COLORS.white },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.background, marginRight: 10 },
  name: { fontWeight: '600', fontSize: 15, color: COLORS.text },
  time: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  postBody: { fontSize: 15, color: COLORS.text, paddingHorizontal: 12, paddingVertical: 8, lineHeight: 22, backgroundColor: COLORS.white },
  postImage: { width: '100%', height: 300, backgroundColor: COLORS.white },
  stats: {
    flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: COLORS.white, gap: 20,
  },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  commentStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 13, color: COLORS.textSecondary },
  divider: { height: 1, backgroundColor: COLORS.border },
  commentsTitle: { fontWeight: '600', fontSize: 14, color: COLORS.textSecondary, padding: 12 },
  comment: { flexDirection: 'row', padding: 12, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.background, marginRight: 10 },
  commentContent: { flex: 1 },
  commentName: { fontWeight: '600', fontSize: 13, color: COLORS.text },
  commentText: { fontSize: 14, color: COLORS.text, marginTop: 4 },
  commentTime: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4 },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', padding: 10,
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  input: { flex: 1, backgroundColor: COLORS.background, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, marginRight: 10 },
  sendBtn: { padding: 6 },
});

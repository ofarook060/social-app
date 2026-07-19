import { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../lib/api';
import { Message, User } from '../../lib/types';
import { imageUrl, timeAgo } from '../../lib/utils';
import { COLORS } from '../../constants/config';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../lib/auth';

export default function ChatScreen() {
  const { userid } = useLocalSearchParams<{ userid: string }>();
  const { user: me } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = useCallback(async () => {
    const res = await api.get(`/api/messages/read.php?userid=${userid}`);
    if (res.success) setMessages(res.messages || []);
    setLoading(false);
  }, [userid]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const msg = text;
    setText('');
    const res = await api.post('/api/messages/send.php', { receiver: parseInt(userid!), message: msg });
    if (res.success) {
      fetchMessages();
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === me?.userid;
    return (
      <View style={[styles.bubble, isMe ? styles.sent : styles.received]}>
        {item.message ? <Text style={[styles.msgText, isMe && styles.msgTextSent]}>{item.message}</Text> : null}
        {item.file ? <Image source={{ uri: imageUrl(item.file) }} style={styles.msgImage} /> : null}
        <Text style={[styles.msgTime, isMe && styles.msgTimeSent]}>{timeAgo(item.date)}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={styles.list}
      />
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendBtn} disabled={!text.trim()}>
          <Ionicons name="send" size={24} color={text.trim() ? COLORS.primary : COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 12, paddingBottom: 8 },
  bubble: {
    maxWidth: '75%', padding: 10, borderRadius: 16, marginBottom: 6,
  },
  sent: { alignSelf: 'flex-end', backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  received: { alignSelf: 'flex-start', backgroundColor: COLORS.white, borderBottomLeftRadius: 4 },
  msgText: { fontSize: 15, color: COLORS.text },
  msgTextSent: { color: COLORS.white },
  msgImage: { width: 200, height: 150, borderRadius: 8, marginTop: 4 },
  msgTime: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4, alignSelf: 'flex-end' },
  msgTimeSent: { color: 'rgba(255,255,255,0.7)' },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', padding: 10,
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  input: {
    flex: 1, backgroundColor: COLORS.background, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 15,
    maxHeight: 100, marginRight: 10,
  },
  sendBtn: { padding: 6, marginBottom: 4 },
});

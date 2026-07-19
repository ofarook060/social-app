import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../../lib/api';
import { COLORS } from '../../constants/config';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CreatePostScreen() {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!text.trim() && !image) {
      Alert.alert('Error', 'Write something or add an image');
      return;
    }
    setLoading(true);

    let imageUrl = '';
    if (image) {
      const formData = new FormData();
      formData.append('file', {
        uri: image,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);
      const uploadRes = await api.upload('/api/upload/image.php', formData);
      if (uploadRes.success) {
        imageUrl = uploadRes.url;
      }
    }

    const res = await api.post('/api/posts.php', { post: text, image: imageUrl });
    setLoading(false);

    if (res.success) {
      setText('');
      setImage(null);
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', res.error || 'Failed to post');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>What&apos;s on your mind?</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Write a post..."
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      {image && (
        <View style={styles.imagePreview}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          <TouchableOpacity style={styles.removeImage} onPress={() => setImage(null)}>
            <Ionicons name="close-circle" size={28} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Ionicons name="image" size={24} color={COLORS.primary} />
          <Text style={styles.imageButtonText}>Photo</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.postButton, loading && styles.postButtonDisabled]}
        onPress={handlePost}
        disabled={loading}
      >
        <Text style={styles.postButtonText}>{loading ? 'Posting...' : 'Post'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  label: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: COLORS.text },
  textInput: {
    backgroundColor: COLORS.white, borderRadius: 8, padding: 14, fontSize: 16,
    minHeight: 120, borderWidth: 1, borderColor: COLORS.border, marginBottom: 12,
  },
  imagePreview: { position: 'relative', marginBottom: 12, borderRadius: 8, overflow: 'hidden' },
  previewImage: { width: '100%', height: 200, borderRadius: 8 },
  removeImage: { position: 'absolute', top: 4, right: 4 },
  actions: { flexDirection: 'row', marginBottom: 16 },
  imageButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    padding: 10, borderRadius: 8, backgroundColor: COLORS.white,
    borderWidth: 1, borderColor: COLORS.border,
  },
  imageButtonText: { fontSize: 14, color: COLORS.primary, fontWeight: '500' },
  postButton: {
    backgroundColor: COLORS.primary, borderRadius: 8, padding: 14, alignItems: 'center',
  },
  postButtonDisabled: { opacity: 0.6 },
  postButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
});

import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../src/constants/config';

interface Props {
  size?: 'small' | 'medium' | 'large';
  showTitle?: boolean;
}

export default function Logo({ size = 'medium', showTitle = true }: Props) {
  const imgSize = size === 'large' ? 100 : size === 'medium' ? 64 : 32;
  const fontSize = size === 'large' ? 28 : size === 'medium' ? 22 : 16;

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={[styles.image, { width: imgSize, height: imgSize }]}
        resizeMode="contain"
      />
      {showTitle && (
        <Text style={[styles.title, { fontSize }]}>SYK Social</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  image: {
    borderRadius: 999,
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.gold,
    letterSpacing: 1,
  },
});

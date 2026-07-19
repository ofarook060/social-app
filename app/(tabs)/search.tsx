import { useState, useCallback } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import { api } from '../../lib/api';
import { User } from '../../lib/types';
import { COLORS } from '../../constants/config';
import UserCard from '../../components/UserCard';
import GroupCard from '../../components/GroupCard';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setSearched(true);
    const res = await api.get(`/api/user/search.php?find=${encodeURIComponent(query.trim())}`);
    if (res.success) {
      setUsers(res.users || []);
      setGroups(res.groups || []);
    }
  }, [query]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search users or groups..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        autoFocus
      />
      {searched && users.length === 0 && groups.length === 0 && (
        <Text style={styles.empty}>No results found</Text>
      )}
      <FlatList
        data={[...users.map(u => ({ ...u, _type: 'user' })), ...groups.map(g => ({ ...g, _type: 'group' }))]}
        keyExtractor={(item) => `${item._type}-${item.userid}`}
        renderItem={({ item }) =>
          item._type === 'user' ? <UserCard user={item} /> : <GroupCard group={item} />
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchInput: {
    backgroundColor: COLORS.white, margin: 12, padding: 12, borderRadius: 8,
    fontSize: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  list: { paddingHorizontal: 12 },
  empty: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 40, fontSize: 16 },
});

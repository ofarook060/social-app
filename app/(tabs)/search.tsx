import { useState, useCallback } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { api } from '../../src/lib/api';
import { User } from '../../src/lib/types';
import { COLORS } from '../../src/constants/config';
import { Ionicons } from '@expo/vector-icons';
import UserCard from '../../components/UserCard';
import GroupCard from '../../components/GroupCard';

const TAB_PEOPLE = 'people';
const TAB_GROUPS = 'groups';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState(TAB_PEOPLE);
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

  const filteredUsers = users.filter(u => u.type === 'profile');
  const filteredGroups = groups;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search friends and groups..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        autoFocus
      />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === TAB_PEOPLE && styles.activeTab]}
          onPress={() => setActiveTab(TAB_PEOPLE)}
        >
          <Ionicons name="people" size={18} color={activeTab === TAB_PEOPLE ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabText, activeTab === TAB_PEOPLE && styles.activeTabText]}>People</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === TAB_GROUPS && styles.activeTab]}
          onPress={() => setActiveTab(TAB_GROUPS)}
        >
          <Ionicons name="people" size={18} color={activeTab === TAB_GROUPS ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabText, activeTab === TAB_GROUPS && styles.activeTabText]}>Groups</Text>
        </TouchableOpacity>
      </View>

      {searched && activeTab === TAB_PEOPLE && filteredUsers.length === 0 && (
        <Text style={styles.empty}>No people found</Text>
      )}
      {searched && activeTab === TAB_GROUPS && filteredGroups.length === 0 && (
        <Text style={styles.empty}>No groups found</Text>
      )}

      {activeTab === TAB_PEOPLE && (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.userid}
          renderItem={({ item }) => <UserCard user={item} />}
          contentContainerStyle={styles.list}
        />
      )}

      {activeTab === TAB_GROUPS && (
        <FlatList
          data={filteredGroups}
          keyExtractor={(item) => item.userid}
          renderItem={({ item }) => <GroupCard group={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchInput: {
    backgroundColor: COLORS.white, margin: 12, padding: 12, borderRadius: 8,
    fontSize: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  tabBar: {
    flexDirection: 'row', backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12,
  },
  activeTab: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '500', color: COLORS.textSecondary },
  activeTabText: { color: COLORS.primary, fontWeight: '600' },
  list: { paddingHorizontal: 12, paddingTop: 4 },
  empty: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 40, fontSize: 16 },
});

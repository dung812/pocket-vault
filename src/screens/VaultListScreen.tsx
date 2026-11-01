import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon, IconButton, ItemAvatar } from '../components/ui';
import { filterItems, websiteLabel } from '../domain/vault';
import { useVault } from '../state/VaultProvider';
import { colors } from '../theme';

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  onOpen: (id: string) => void;
  onAdd: () => void;
}

export function VaultListScreen({ query, onQueryChange, onOpen, onAdd }: Props) {
  const { items, loading, error } = useVault();
  const filtered = filterItems(items, query);
  return <View style={styles.page}>
    <FlatList data={filtered} keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
      contentContainerStyle={styles.content}
      ListHeaderComponent={<>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><Icon name="shield-checkmark-outline" size={23} color="#FFFFFF" /></View>
          <Text style={styles.brandName}>Pocket Vault</Text>
          <View style={styles.phaseBadge}><Text style={styles.phaseText}>PHASE 01</Text></View>
        </View>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text accessibilityRole="header" style={styles.title}>Kho của tôi</Text>
            <Text style={styles.subtitle}>Tài khoản ở một nơi, tìm lại dễ dàng.</Text>
          </View>
        </View>
        <View style={styles.demoBanner}>
          <Icon name="flask-outline" color={colors.mintText} size={19} />
          <Text style={styles.demoText}>Dữ liệu mẫu · Chưa lưu trên thiết bị</Text>
        </View>
        <View style={styles.searchBox}>
          <Icon name="search-outline" color={colors.muted} size={21} />
          <TextInput accessibilityLabel="Tìm kiếm tài khoản" placeholder="Tìm website, tên đăng nhập…"
            placeholderTextColor={colors.placeholder} value={query} onChangeText={onQueryChange}
            style={styles.searchInput} autoCapitalize="none" autoCorrect={false} returnKeyType="search" />
          {!!query && <IconButton name="close-circle-outline" label="Xóa tìm kiếm" onPress={() => onQueryChange('')} />}
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>{query.trim() ? 'KẾT QUẢ TÌM KIẾM' : 'TẤT CẢ TÀI KHOẢN'}</Text>
          <Text style={styles.count}>{filtered.length}</Text>
        </View>
      </>}
      renderItem={({ item }) => <Pressable accessibilityRole="button"
        accessibilityLabel={`Mở ${item.title}, ${item.username}`} onPress={() => onOpen(item.id)}
        style={({ pressed }) => [styles.item, pressed && { opacity: 0.65 }]}>
        <ItemAvatar title={item.title} small />
        <View style={styles.itemBody}>
          <Text numberOfLines={1} style={styles.itemTitle}>{item.title}</Text>
          <Text numberOfLines={1} style={styles.itemUsername}>{item.username}</Text>
          <Text numberOfLines={1} style={styles.itemWebsite}>{websiteLabel(item.website)}</Text>
        </View>
        <Icon name="chevron-forward" size={18} color={colors.placeholder} />
      </Pressable>}
      ListEmptyComponent={loading ? <ActivityIndicator accessibilityLabel="Đang tải tài khoản" color={colors.primary} style={{ margin: 36 }} /> :
        <View style={styles.empty}>
          <Icon name={error ? 'alert-circle-outline' : query.trim() ? 'search-outline' : 'folder-open-outline'} color={colors.muted} size={35} />
          <Text style={styles.emptyTitle}>{error ? 'Không tải được kho' : query.trim() ? 'Chưa tìm thấy tài khoản' : 'Kho đang trống'}</Text>
          <Text style={styles.emptyText}>{error ?? (query.trim() ? 'Thử từ khóa khác hoặc xóa tìm kiếm.' : 'Nhấn “Thêm tài khoản” để tạo mục đầu tiên.')}</Text>
        </View>}
      ListFooterComponent={<Text style={styles.footerNote}>Chỉ dùng tài khoản giả trong bản thử nghiệm.{ '\n' }Dữ liệu được đặt lại khi tải lại ứng dụng.</Text>}
    />
    <View style={styles.bottomBar}>
      <Pressable accessibilityRole="button" accessibilityLabel="Thêm tài khoản" onPress={onAdd}
        style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.7 }]}>
        <Icon name="add" color="#FFFFFF" size={25} />
        <Text style={styles.addText}>Thêm tài khoản</Text>
      </Pressable>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  page: { flex: 1 }, content: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 18 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 31, flexWrap: 'wrap' },
  brandMark: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 18, color: colors.text, fontWeight: '700', flex: 1 },
  phaseBadge: { paddingVertical: 6, paddingHorizontal: 9, backgroundColor: '#E8EEEE', borderRadius: 8 },
  phaseText: { fontSize: 10, letterSpacing: 1.2, fontWeight: '700', color: colors.muted },
  titleRow: { flexDirection: 'row', marginBottom: 21 },
  title: { fontSize: 33, lineHeight: 43, letterSpacing: -0.8, color: colors.text, fontWeight: '700' },
  subtitle: { fontSize: 14, lineHeight: 22, color: colors.muted, marginTop: 4 },
  demoBanner: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.mint, borderRadius: 12, padding: 13, marginBottom: 20 },
  demoText: { flex: 1, fontSize: 12, lineHeight: 18, color: colors.mintText, fontWeight: '500' },
  searchBox: { minHeight: 54, paddingLeft: 15, paddingRight: 4, flexDirection: 'row', gap: 9, alignItems: 'center',
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16 },
  searchInput: { flex: 1, minWidth: 0, minHeight: 52, fontSize: 14, color: colors.text, paddingVertical: 12 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, marginBottom: 14 },
  sectionTitle: { fontSize: 11, letterSpacing: 1.25, fontWeight: '700', color: colors.muted, flex: 1 },
  count: { color: colors.muted, fontSize: 12, fontWeight: '600', backgroundColor: '#E8EEEE', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15, marginBottom: 10,
    backgroundColor: colors.surface, borderRadius: 19, borderWidth: 1, borderColor: '#E6ECEC' },
  itemBody: { flex: 1, gap: 3, minWidth: 0 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  itemUsername: { fontSize: 13, color: colors.muted },
  itemWebsite: { fontSize: 11, color: colors.placeholder },
  empty: { alignItems: 'center', paddingVertical: 38, paddingHorizontal: 18, gap: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: colors.text, textAlign: 'center' },
  emptyText: { fontSize: 14, color: colors.muted, lineHeight: 22, textAlign: 'center' },
  footerNote: { textAlign: 'center', color: colors.muted, fontSize: 11, lineHeight: 18, paddingTop: 14, paddingBottom: 3 },
  bottomBar: { paddingHorizontal: 22, paddingVertical: 14, borderTopWidth: 1, borderColor: colors.border, backgroundColor: colors.background },
  addButton: { backgroundColor: colors.primary, borderRadius: 18, minHeight: 56, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 14 },
  addText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16, flexShrink: 1 },
});

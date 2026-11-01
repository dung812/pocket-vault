import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';
import { AppState, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, ConfirmDialog, IconButton, ItemAvatar, PageHeader } from '../components/ui';
import { formatDate, getWebsiteUrl, websiteLabel } from '../domain/vault';
import { useVault } from '../state/VaultProvider';
import { colors } from '../theme';

export function VaultDetailsScreen({ id, onBack, onEdit, onDeleted, notify }: {
  id: string; onBack: () => void; onEdit: () => void; onDeleted: () => void; notify: (message: string) => void;
}) {
  const { items, remove } = useVault();
  const item = items.find((candidate) => candidate.id === id);
  const [visible, setVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => { if (state !== 'active') setVisible(false); });
    return () => sub.remove();
  }, []);
  const copy = async (value: string, label: string) => {
    try { await Clipboard.setStringAsync(value); notify(`Đã sao chép ${label}.`); }
    catch { notify('Không sao chép được. Hãy thử lại.'); }
  };
  const deleteItem = async () => {
    if (busy) return;
    setBusy(true);
    try { await remove(id); onDeleted(); }
    catch { notify('Không xóa được tài khoản. Hãy thử lại.'); setBusy(false); setConfirmDelete(false); }
  };
  if (!item) return <View style={{ flex: 1 }}>
    <PageHeader title="Chi tiết tài khoản" onBack={onBack} />
    <Text style={styles.missing}>Không tìm thấy tài khoản.</Text>
  </View>;
  const websiteUrl = getWebsiteUrl(item.website);
  return <View style={{ flex: 1 }}>
    <PageHeader title="Chi tiết tài khoản" onBack={onBack}
      action={<IconButton name="create-outline" label="Sửa tài khoản" onPress={onEdit} />} />
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <ItemAvatar title={item.title} />
        <Text accessibilityRole="header" style={styles.title}>{item.title}</Text>
        <Text style={styles.domain}>{websiteLabel(item.website)}</Text>
      </View>
      <Text style={styles.section}>THÔNG TIN ĐĂNG NHẬP</Text>
      <View style={styles.card}>
        <View style={styles.field}>
          <View style={styles.fieldBody}>
            <Text style={styles.label}>Tên đăng nhập / Email</Text>
            <Text selectable style={styles.value}>{item.username}</Text>
          </View>
          <IconButton name="copy-outline" label="Sao chép tên đăng nhập" onPress={() => void copy(item.username, 'tên đăng nhập')} />
        </View>
        <View style={styles.divider} />
        <View style={[styles.field, { flexWrap: 'wrap' }]}>
          <View style={[styles.fieldBody, { minWidth: 140 }]}>
            <Text style={styles.label}>Mật khẩu</Text>
            <Text accessibilityLabel={visible ? 'Nội dung mật khẩu' : 'Mật khẩu đang ẩn'} selectable={visible}
              style={[styles.value, { fontFamily: 'monospace' }]}>{visible ? item.password : '••••••••••••'}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <IconButton name={visible ? 'eye-off-outline' : 'eye-outline'} label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} onPress={() => setVisible(!visible)} />
            <IconButton name="copy-outline" label="Sao chép mật khẩu" onPress={() => void copy(item.password, 'mật khẩu')} />
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.field}>
          <View style={styles.fieldBody}>
            <Text style={styles.label}>Website</Text>
            <Text selectable style={styles.value}>{item.website || 'Chưa thêm website'}</Text>
          </View>
          {websiteUrl && <IconButton name="open-outline" label="Mở website" onPress={() => {
            void Linking.openURL(websiteUrl).catch(() => notify('Không mở được website.'));
          }} />}
        </View>
      </View>
      <Text style={[styles.section, { marginTop: 26 }]}>GHI CHÚ</Text>
      <View style={[styles.card, { padding: 18 }]}>
        <Text selectable style={[styles.notes, !item.notes && { color: colors.placeholder }]}>{item.notes || 'Chưa có ghi chú.'}</Text>
      </View>
      <View style={styles.dates}>
        <Text style={styles.dateText}>Ngày tạo: {formatDate(item.createdAt)}</Text>
        <Text style={styles.dateText}>Cập nhật: {formatDate(item.updatedAt)}</Text>
      </View>
      <Button title="Xóa tài khoản" icon="trash-outline" danger onPress={() => setConfirmDelete(true)} />
      <Text style={styles.demoNote}>Bản thử nghiệm · Chỉ dùng dữ liệu giả.</Text>
    </ScrollView>
    <ConfirmDialog visible={confirmDelete} title="Xóa tài khoản?"
      message={`Bạn muốn xóa “${item.title}”? Thao tác này không thể hoàn tác trong phiên hiện tại.`}
      confirmLabel="Xác nhận xóa" busy={busy} onCancel={() => setConfirmDelete(false)} onConfirm={() => void deleteItem()} />
  </View>;
}

const styles = StyleSheet.create({
  content: { padding: 22, paddingBottom: 32 },
  hero: { alignItems: 'center', paddingTop: 10, paddingBottom: 32, gap: 9 },
  title: { color: colors.text, fontSize: 27, fontWeight: '700', marginTop: 7, textAlign: 'center' },
  domain: { color: colors.muted, fontSize: 14 },
  section: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 12 },
  card: { backgroundColor: colors.surface, borderRadius: 21, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  field: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingLeft: 18, paddingRight: 8, paddingVertical: 16 },
  fieldBody: { flex: 1, minWidth: 0, gap: 8 },
  label: { color: colors.muted, fontSize: 12 },
  value: { color: colors.text, fontSize: 15, lineHeight: 23 },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 18 },
  notes: { color: colors.text, fontSize: 14, lineHeight: 23 },
  dates: { marginTop: 23, marginBottom: 25, gap: 6, alignItems: 'center' },
  dateText: { color: colors.muted, fontSize: 11 },
  demoNote: { color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: 20 },
  missing: { color: colors.muted, padding: 24 },
});

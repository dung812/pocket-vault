import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, ConfirmDialog, IconButton, PageHeader } from '../components/ui';
import { emptyDraft, validateDraft } from '../domain/vault';
import { useVault } from '../state/VaultProvider';
import { colors } from '../theme';
import type { FormErrors, VaultDraft, VaultItem } from '../types/vault';

export function VaultFormScreen({ item, onBack, onSaved, notify }: {
  item?: VaultItem; onBack: () => void; onSaved: (id: string) => void; notify: (message: string) => void;
}) {
  const { save } = useVault();
  const [initial] = useState<VaultDraft>(() => item ? {
    title: item.title, website: item.website, username: item.username, password: item.password, notes: item.notes,
  } : emptyDraft());
  const [draft, setDraft] = useState<VaultDraft>(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [discard, setDiscard] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const saving = useRef(false);
  const dirty = (Object.keys(initial) as (keyof VaultDraft)[]).some((key) => draft[key] !== initial[key]);
  const leave = useCallback(() => {
    if (saving.current) return;
    if (dirty) setDiscard(true); else onBack();
  }, [dirty, onBack]);
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { leave(); return true; });
    return () => sub.remove();
  }, [leave]);

  const change = (key: keyof VaultDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };
  const submit = async () => {
    if (saving.current) return;
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      scroll.current?.scrollTo({ y: 0, animated: true });
      notify('Kiểm tra lại các trường được đánh dấu.'); return;
    }
    saving.current = true;
    setBusy(true);
    try { const saved = await save(draft, item?.id); onSaved(saved.id); }
    catch { notify('Không lưu được tài khoản. Hãy thử lại.'); }
    finally { saving.current = false; setBusy(false); }
  };

  const field = (key: keyof VaultDraft, label: string, placeholder: string, required = false) => <View style={styles.field}>
    <Text style={styles.label}>{label}{required && <Text style={{ color: colors.primary }}> *</Text>}</Text>
    <View style={[styles.inputBox, errors[key] && styles.inputError, key === 'notes' && { alignItems: 'flex-start' }]}>
      <TextInput accessibilityLabel={label} value={draft[key]} onChangeText={(value) => change(key, value)}
        placeholder={placeholder} placeholderTextColor={colors.placeholder} editable={!busy}
        autoCapitalize={key === 'title' || key === 'notes' ? 'sentences' : 'none'}
        autoCorrect={false} autoComplete="off" importantForAutofill="no"
        keyboardType={key === 'website' ? 'url' : 'default'}
        secureTextEntry={key === 'password' && !visible} multiline={key === 'notes'}
        textAlignVertical={key === 'notes' ? 'top' : 'center'}
        style={[styles.input, key === 'notes' && styles.notesInput]}
        returnKeyType={key === 'notes' ? 'default' : 'done'} />
      {key === 'password' && <IconButton name={visible ? 'eye-off-outline' : 'eye-outline'}
        label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} onPress={() => setVisible(!visible)} />}
    </View>
    {!!errors[key] && <Text accessibilityRole="alert" style={styles.errorText}>{errors[key]}</Text>}
  </View>;

  return <View style={{ flex: 1 }}>
    <PageHeader title={item ? 'Sửa tài khoản' : 'Thêm tài khoản'} onBack={leave} />
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <Text style={styles.intro}>Lưu thông tin để lần sau tìm lại nhanh hơn.</Text>
        <View style={styles.demoBox}><Text style={styles.demoText}>Chỉ nhập dữ liệu giả. Bản này chưa có PIN, mã hóa hoặc lưu dữ liệu sau khi tải lại.</Text></View>
        {field('title', 'Tên tài khoản', 'Ví dụ: Email cá nhân', true)}
        {field('website', 'Website', 'https://example.com')}
        {field('username', 'Tên đăng nhập / Email', 'username@example.com', true)}
        {field('password', 'Mật khẩu', 'Nhập mật khẩu mẫu', true)}
        {field('notes', 'Ghi chú', 'Thông tin bổ sung (không bắt buộc)')}
        <Text style={styles.requiredNote}>* Thông tin bắt buộc</Text>
        <View style={styles.actions}>
          <Button title={busy ? 'Đang lưu…' : 'Lưu tài khoản'} icon="checkmark-outline" disabled={busy} onPress={() => void submit()} />
          <Button title="Hủy thay đổi" secondary disabled={busy} onPress={leave} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    <ConfirmDialog visible={discard} title="Bỏ thay đổi?" message="Thông tin bạn vừa nhập chưa được lưu."
      confirmLabel="Bỏ thay đổi" onCancel={() => setDiscard(false)} onConfirm={onBack} />
  </View>;
}

const styles = StyleSheet.create({
  content: { padding: 22, paddingBottom: 35 },
  intro: { color: colors.muted, fontSize: 14, lineHeight: 22, marginBottom: 17 },
  demoBox: { backgroundColor: colors.mint, padding: 14, borderRadius: 13, marginBottom: 25 },
  demoText: { color: colors.mintText, fontSize: 12, lineHeight: 19 },
  field: { marginBottom: 21 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 9 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, minHeight: 55 },
  input: { flex: 1, minWidth: 0, color: colors.text, fontSize: 15, minHeight: 53, paddingVertical: 14 },
  inputError: { borderColor: colors.danger },
  notesInput: { minHeight: 118, lineHeight: 23 },
  errorText: { color: colors.danger, fontSize: 12, lineHeight: 18, marginTop: 6 },
  requiredNote: { color: colors.muted, fontSize: 12, marginBottom: 24 },
  actions: { gap: 12 },
});

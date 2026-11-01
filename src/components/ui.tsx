import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type IconName = ComponentProps<typeof Ionicons>['name'];
export function Icon({ name, size = 22, color = colors.text }: { name: IconName; size?: number; color?: string }) {
  return <Ionicons name={name} size={size} color={color} accessible={false} />;
}

export function IconButton({ name, label, onPress, danger = false }: {
  name: IconName; label: string; onPress: () => void; danger?: boolean;
}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
    style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
    <Icon name={name} color={danger ? colors.danger : colors.text} />
  </Pressable>;
}

export function Button({ title, onPress, icon, secondary = false, danger = false, disabled = false }: {
  title: string; onPress: () => void; icon?: IconName; secondary?: boolean; danger?: boolean; disabled?: boolean;
}) {
  const foreground = danger ? colors.danger : secondary ? colors.text : '#FFFFFF';
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled }} disabled={disabled}
    onPress={onPress} style={({ pressed }) => [styles.button,
      secondary && styles.secondary, danger && styles.danger, pressed && styles.pressed,
      disabled && { opacity: 0.55 }]}>
    {icon && <Icon name={icon} color={foreground} size={20} />}
    <Text style={[styles.buttonText, { color: foreground }]}>{title}</Text>
  </Pressable>;
}

export function PageHeader({ title, onBack, action }: { title: string; onBack: () => void; action?: ReactNode }) {
  return <View style={styles.pageHeader}>
    <IconButton name="arrow-back" label="Quay lại" onPress={onBack} />
    <Text accessibilityRole="header" style={styles.pageTitle}>{title}</Text>
    <View style={styles.headerAction}>{action}</View>
  </View>;
}

export function ItemAvatar({ title, small = false }: { title: string; small?: boolean }) {
  return <View style={[styles.avatar, small && styles.avatarSmall]}>
    <Text style={[styles.initial, small && { fontSize: 19 }]}>{Array.from(title.trim())[0]?.toUpperCase() ?? '?'}</Text>
  </View>;
}

export function ConfirmDialog({ visible, title, message, confirmLabel, onCancel, onConfirm, busy = false }: {
  visible: boolean; title: string; message: string; confirmLabel: string;
  onCancel: () => void; onConfirm: () => void; busy?: boolean;
}) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={() => { if (!busy) onCancel(); }}>
    <View style={styles.overlay}>
      <View accessibilityViewIsModal style={styles.dialog}>
        <View style={styles.dialogIcon}><Icon name="alert-circle-outline" color={colors.danger} size={26} /></View>
        <Text accessibilityRole="header" style={styles.dialogTitle}>{title}</Text>
        <Text style={styles.dialogMessage}>{message}</Text>
        <View style={styles.dialogActions}>
          <Button title={busy ? 'Đang xử lý…' : confirmLabel} danger onPress={onConfirm} disabled={busy} />
          <Button title="Hủy" secondary onPress={onCancel} disabled={busy} />
        </View>
      </View>
    </View>
  </Modal>;
}

const styles = StyleSheet.create({
  iconButton: { minHeight: 48, minWidth: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.65 },
  button: { minHeight: 54, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 17,
    backgroundColor: colors.primary, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: colors.dangerLight, borderWidth: 1, borderColor: '#F1D3D3' },
  buttonText: { fontSize: 16, fontWeight: '600', flexShrink: 1, textAlign: 'center' },
  pageHeader: { minHeight: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8,
    borderBottomWidth: 1, borderColor: colors.border, backgroundColor: colors.background },
  pageTitle: { flex: 1, fontSize: 19, fontWeight: '700', color: colors.text, marginHorizontal: 5 },
  headerAction: { minWidth: 48 },
  avatar: { width: 72, height: 72, borderRadius: 24, backgroundColor: colors.mint,
    alignItems: 'center', justifyContent: 'center' },
  avatarSmall: { width: 48, height: 48, borderRadius: 16 },
  initial: { fontSize: 29, fontWeight: '700', color: colors.primary },
  overlay: { flex: 1, backgroundColor: '#102E3299', alignItems: 'center', justifyContent: 'center', padding: 24 },
  dialog: { width: '100%', maxWidth: 420, padding: 24, backgroundColor: colors.surface, borderRadius: 26 },
  dialogIcon: { marginBottom: 14 },
  dialogTitle: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 10 },
  dialogMessage: { color: colors.muted, fontSize: 15, lineHeight: 23 },
  dialogActions: { gap: 10, marginTop: 24 },
});

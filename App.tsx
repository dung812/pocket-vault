import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { VaultDetailsScreen } from './src/screens/VaultDetailsScreen';
import { VaultFormScreen } from './src/screens/VaultFormScreen';
import { VaultListScreen } from './src/screens/VaultListScreen';
import { useVault, VaultProvider } from './src/state/VaultProvider';
import { colors } from './src/theme';
import type { Screen } from './src/types/vault';

function VaultApp() {
  const { items } = useVault();
  const [screen, setScreen] = useState<Screen>({ name: 'list' });
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notify = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);
  const back = useCallback(() => {
    setScreen((current) => current.name === 'form' && current.id
      ? { name: 'details', id: current.id } : { name: 'list' });
  }, []);
  useEffect(() => {
    if (screen.name === 'form') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen.name === 'list') return false;
      back(); return true;
    });
    return () => sub.remove();
  }, [screen.name, back]);
  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.app}>
      {screen.name === 'list' && <VaultListScreen query={query} onQueryChange={setQuery}
        onOpen={(id) => setScreen({ name: 'details', id })} onAdd={() => setScreen({ name: 'form' })} />}
      {screen.name === 'details' && <VaultDetailsScreen key={screen.id} id={screen.id} onBack={back}
        onEdit={() => setScreen({ name: 'form', id: screen.id })}
        onDeleted={() => { setScreen({ name: 'list' }); notify('Đã xóa tài khoản.'); }} notify={notify} />}
      {screen.name === 'form' && <VaultFormScreen key={screen.id ?? 'new'}
        item={items.find((item) => item.id === screen.id)} onBack={back} notify={notify}
        onSaved={(id) => { setScreen({ name: 'details', id }); notify('Đã lưu trong phiên thử nghiệm.'); }} />}
      {!!toast && <View pointerEvents="none" style={styles.toast}>
        <Text accessibilityLiveRegion="polite" style={styles.toastText}>{toast}</Text>
      </View>}
    </View>
  </SafeAreaView>;
}

export default function App() {
  return <SafeAreaProvider><StatusBar style="dark" /><VaultProvider><VaultApp /></VaultProvider></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  app: { flex: 1, width: '100%', maxWidth: 640, alignSelf: 'center', position: 'relative' },
  toast: { position: 'absolute', bottom: 88, left: 24, right: 24, backgroundColor: colors.primaryDark,
    borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18, elevation: 8 },
  toastText: { color: '#FFFFFF', fontSize: 13, lineHeight: 19, textAlign: 'center' },
});

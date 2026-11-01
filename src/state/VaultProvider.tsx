import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { createMemoryVaultRepository } from '../data/memoryVaultRepository';
import type { VaultDraft, VaultItem } from '../types/vault';

interface VaultContextValue {
  items: VaultItem[];
  loading: boolean;
  error: string | null;
  save: (draft: VaultDraft, id?: string) => Promise<VaultItem>;
  remove: (id: string) => Promise<void>;
}

const VaultContext = createContext<VaultContextValue | null>(null);

export function VaultProvider({ children }: PropsWithChildren) {
  const [repository] = useState(createMemoryVaultRepository);
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    void repository.list().then((next) => {
      if (mounted.current) setItems(next);
    }).catch(() => {
      if (mounted.current) setError('Không tải được danh sách. Hãy mở lại ứng dụng.');
    }).finally(() => { if (mounted.current) setLoading(false); });
    return () => { mounted.current = false; };
  }, [repository]);

  const refresh = async () => {
    const next = await repository.list();
    if (mounted.current) setItems(next);
  };
  const save = async (draft: VaultDraft, id?: string) => {
    const item = await repository.save(draft, id);
    await refresh();
    return item;
  };
  const remove = async (id: string) => { await repository.remove(id); await refresh(); };
  return <VaultContext.Provider value={{ items, loading, error, save, remove }}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const value = useContext(VaultContext);
  if (!value) throw new Error('useVault requires VaultProvider');
  return value;
}

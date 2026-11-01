import { cleanDraft } from '../domain/vault';
import type { VaultItem, VaultRepository } from '../types/vault';
import { sampleItems } from './seed';

export function createMemoryVaultRepository(seed: VaultItem[] = sampleItems): VaultRepository {
  let items = seed.map((item) => ({ ...item }));
  let nextId = 0;
  return {
    async list() {
      return items.map((item) => ({ ...item })).sort((a, b) =>
        b.updatedAt.localeCompare(a.updatedAt) || a.title.localeCompare(b.title, 'vi'));
    },
    async save(draft, id) {
      const now = new Date().toISOString();
      const previous = id ? items.find((item) => item.id === id) : undefined;
      if (id && !previous) throw new Error('Không tìm thấy tài khoản.');
      let generatedId: string;
      do { generatedId = `local-${++nextId}`; } while (items.some((item) => item.id === generatedId));
      const saved: VaultItem = { ...cleanDraft(draft), id: previous?.id ?? generatedId,
        createdAt: previous?.createdAt ?? now, updatedAt: now };
      items = previous ? items.map((item) => item.id === id ? saved : item) : [saved, ...items];
      return { ...saved };
    },
    async remove(id) {
      if (!items.some((item) => item.id === id)) throw new Error('Không tìm thấy tài khoản.');
      items = items.filter((item) => item.id !== id);
    },
  };
}

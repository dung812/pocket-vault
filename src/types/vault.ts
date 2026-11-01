export interface VaultDraft {
  title: string;
  website: string;
  username: string;
  password: string;
  notes: string;
}

export interface VaultItem extends VaultDraft {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type FormErrors = Partial<Record<keyof VaultDraft, string>>;

/** Implement this interface with encrypted device storage in Phase 3. */
export interface VaultRepository {
  list(): Promise<VaultItem[]>;
  save(draft: VaultDraft, id?: string): Promise<VaultItem>;
  remove(id: string): Promise<void>;
}

export type Screen =
  | { name: 'list' }
  | { name: 'details'; id: string }
  | { name: 'form'; id?: string };

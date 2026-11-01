import type { FormErrors, VaultDraft, VaultItem } from '../types/vault';

export const emptyDraft = (): VaultDraft => ({
  title: '', website: '', username: '', password: '', notes: '',
});

export function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
}

export function filterItems(items: VaultItem[], query: string): VaultItem[] {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    // Passwords and notes intentionally are not search indexes.
    const text = normalizeSearch(`${item.title} ${item.username} ${item.website}`);
    return terms.every((term) => text.includes(term));
  });
}

export function validateDraft(draft: VaultDraft): FormErrors {
  const errors: FormErrors = {};
  if (!draft.title.trim()) errors.title = 'Nhập tên tài khoản hoặc website.';
  if (!draft.username.trim()) errors.username = 'Nhập tên đăng nhập hoặc email.';
  if (!draft.password.length) errors.password = 'Nhập mật khẩu.';
  if (draft.website.trim() && !getWebsiteUrl(draft.website)) {
    errors.website = 'Nhập địa chỉ website hợp lệ, ví dụ https://example.com.';
  }
  return errors;
}

export function cleanDraft(draft: VaultDraft): VaultDraft {
  // Never trim or normalize a password: spaces may be intentional.
  return { ...draft, title: draft.title.trim(), website: draft.website.trim(),
    username: draft.username.trim(), notes: draft.notes.trim() };
}

export function getWebsiteUrl(value: string): string | null {
  const input = value.trim();
  if (!input || /\s/.test(input)) return null;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    if (!url.hostname.includes('.') || url.username || url.password) return null;
    return url.href;
  } catch { return null; }
}

export function websiteLabel(value: string): string {
  const url = getWebsiteUrl(value);
  return url ? new URL(url).hostname.replace(/^www\./, '') : 'Chưa có website';
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(value));
}

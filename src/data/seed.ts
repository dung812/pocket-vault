import type { VaultItem } from '../types/vault';

/** Fictional data only. Reserved .example domains never fetch external favicons. */
export const sampleItems: VaultItem[] = [
  { id: 'sample-1', title: 'Email cá nhân', website: 'https://mail.example.com',
    username: 'minh.demo@example.com', password: 'Demo-only!Mail#2026',
    notes: 'Tài khoản minh họa để thử giao diện. Không phải thông tin đăng nhập thật.',
    createdAt: '2026-10-20T09:00:00Z', updatedAt: '2026-10-30T09:00:00Z' },
  { id: 'sample-2', title: 'Công việc', website: 'https://workspace.example.com',
    username: 'minh.work@example.com', password: 'Demo-only!Work#2026', notes: '',
    createdAt: '2026-10-21T09:00:00Z', updatedAt: '2026-10-29T09:00:00Z' },
  { id: 'sample-3', title: 'Mua sắm', website: 'https://shop.example.com',
    username: 'minh.shopping', password: 'Demo-only!Shop#2026',
    notes: 'Có thể lưu nhiều tài khoản cho cùng một website.',
    createdAt: '2026-10-22T09:00:00Z', updatedAt: '2026-10-28T09:00:00Z' },
  { id: 'sample-4', title: 'Đọc sách', website: 'https://books.example.com',
    username: 'minh.reader', password: 'Demo-only!Books#2026', notes: '',
    createdAt: '2026-10-23T09:00:00Z', updatedAt: '2026-10-27T09:00:00Z' },
];

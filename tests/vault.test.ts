import assert from 'node:assert/strict';
import test from 'node:test';
import { createMemoryVaultRepository } from '../src/data/memoryVaultRepository';
import { cleanDraft, emptyDraft, filterItems, getWebsiteUrl, validateDraft } from '../src/domain/vault';
import type { VaultDraft } from '../src/types/vault';

const draft = (values: Partial<VaultDraft> = {}): VaultDraft => ({
  title: 'Đọc sách', website: 'books.example.com', username: 'reader@example.com',
  password: '  Demo#123  ', notes: 'private-note-only', ...values,
});

test('validation requires title, username, and password while allowing optional website', () => {
  assert.deepEqual(Object.keys(validateDraft(emptyDraft())).sort(), ['password', 'title', 'username']);
  assert.deepEqual(validateDraft(draft({ website: '' })), {});
});

test('cleaning never trims password whitespace or Unicode', () => {
  const input = draft({ title: '  Đọc sách  ', password: '  mật khẩu🔑  ' });
  const cleaned = cleanDraft(input);
  assert.equal(cleaned.title, 'Đọc sách');
  assert.equal(cleaned.password, input.password);
});

test('website accepts HTTP(S), defaults to HTTPS, and rejects executable schemes and embedded credentials', () => {
  assert.equal(getWebsiteUrl('example.com'), 'https://example.com/');
  assert.equal(getWebsiteUrl('https://example.com/a?b=1'), 'https://example.com/a?b=1');
  for (const url of ['javascript:alert(1)', 'file:///tmp/test', 'https://user:pass@example.com', 'hello world', 'not-a-domain']) {
    assert.equal(getWebsiteUrl(url), null, url);
    assert.ok(validateDraft(draft({ website: url })).website);
  }
});

test('search ignores Vietnamese accents, matches multiple terms, and excludes password and notes', async () => {
  const repo = createMemoryVaultRepository([]);
  const item = await repo.save(draft());
  const items = await repo.list();
  assert.equal(filterItems(items, 'DOC SACH reader')[0]?.id, item.id);
  assert.equal(filterItems(items, 'books.example.com').length, 1);
  assert.equal(filterItems(items, 'Demo#123').length, 0);
  assert.equal(filterItems(items, 'private-note-only').length, 0);
});

test('same website supports multiple accounts with different IDs', async () => {
  const repo = createMemoryVaultRepository([]);
  const one = await repo.save(draft());
  const two = await repo.save(draft({ username: 'another@example.com' }));
  assert.notEqual(one.id, two.id);
  assert.equal((await repo.list()).length, 2);
});

test('editing preserves identity, creation date, and exact password', async () => {
  const repo = createMemoryVaultRepository([]);
  const one = await repo.save(draft());
  const edited = await repo.save(draft({ title: 'Tên mới', password: ' new password ' }), one.id);
  assert.equal(edited.id, one.id);
  assert.equal(edited.createdAt, one.createdAt);
  assert.equal(edited.password, ' new password ');
  assert.equal((await repo.list()).length, 1);
});

test('removal deletes only the selected item; unknown IDs cannot silently overwrite', async () => {
  const repo = createMemoryVaultRepository([]);
  const one = await repo.save(draft());
  const two = await repo.save(draft());
  await repo.remove(one.id);
  assert.equal((await repo.list())[0].id, two.id);
  await assert.rejects(repo.save(draft(), 'missing'));
  await assert.rejects(repo.remove('missing'));
});

test('caller mutations cannot alter repository records', async () => {
  const repo = createMemoryVaultRepository([]);
  const saved = await repo.save(draft());
  saved.title = 'mutated';
  const items = await repo.list();
  items[0].title = 'also mutated';
  assert.equal((await repo.list())[0].title, 'Đọc sách');
});

test('a new session starts from independent sample data', async () => {
  const first = createMemoryVaultRepository();
  const original = await first.list();
  await first.remove(original[0].id);
  const next = createMemoryVaultRepository();
  assert.equal((await next.list()).length, original.length);
});

# Tiếp tục bằng Codex CLI

Mở terminal trong thư mục có `package.json`, chạy `codex`.

## Khi bạn đang kiểm tra phase 1

Copy prompt sau và bổ sung lỗi cụ thể:

```text
Read AGENTS.md and README.md. Stay within Phase 1.
I am reviewing Pocket Vault on my Android phone.

Observed issue: [describe the screen, steps, and actual behavior]
Expected behavior: [describe what should happen]

Fix this issue only. Keep the in-memory demo repository and Vietnamese UI.
Do not add PIN, persistent storage, cloud, or extra features yet.
Run appropriate checks and give me the steps to verify on Android.
```

## Khi phase 1 đã được bạn kiểm tra xong

```text
Read AGENTS.md, README.md, and docs/ROADMAP.md.
Phase 1 has been reviewed on Android. Implement Phase 2 only.

Add a 6-digit PIN setup/confirmation flow, unlock, PIN change,
manual lock, and lock when the app goes into the background.
No login account and no cloud.
Keep vault records as fictional in-memory data for this phase.

Design and explain secure PIN verification and persistent retry backoff.
Do not store plaintext PINs or log PINs or passwords.
Prevent navigating behind the lock screen with Android Back.
Do not imply the demo vault is ready for real passwords yet.
Future encrypted database key protection is a separate Phase 3 task.

Run relevant checks, document device-test limitations,
and stop with an Android UI checklist for my review.
```

Không chạy prompt phase 2 trước khi bạn hoàn thành kiểm tra phase 1.

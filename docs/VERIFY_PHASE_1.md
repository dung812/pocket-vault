# Checklist kiểm tra trên Android

Chỉ sử dụng tài khoản giả. Đánh dấu từng mục sau khi mở app trên điện thoại thật.

- [ ] Mở app thấy tiêu đề “Kho của tôi”, nhãn dữ liệu mẫu và 4 tài khoản.
- [ ] Tìm `doc sach` thấy “Đọc sách”; tìm username hoặc domain cũng thấy tài khoản.
- [ ] Nhập từ khóa không tồn tại thấy trạng thái không có kết quả; xóa tìm kiếm trở về danh sách.
- [ ] Mở chi tiết: mật khẩu mặc định bị ẩn; hiện/ẩn hoạt động.
- [ ] Sao chép username và mật khẩu, dán vào ứng dụng ghi chú tạm để đối chiếu. Xóa nội dung ghi chú sau khi thử.
- [ ] Nhấn Sửa: form có sẵn dữ liệu, mật khẩu vẫn ẩn.
- [ ] Đổi tên và ghi chú, nhấn Lưu: màn hình chi tiết và danh sách phản ánh thay đổi.
- [ ] Thêm một tài khoản mới, chỉ điền tên, username và password; bỏ trống website/ghi chú vẫn lưu được.
- [ ] Thêm tài khoản thứ hai cùng website nhưng username khác: cả hai cùng tồn tại.
- [ ] Nhấn Lưu khi thiếu trường bắt buộc: hiện thông báo dưới trường tương ứng.
- [ ] Website sai hoặc `javascript:alert(1)` bị từ chối; `example.com` được chấp nhận.
- [ ] Password có dấu cách đầu/cuối được giữ nguyên khi lưu, hiện và copy.
- [ ] Nhập ghi chú nhiều dòng và giá trị dài: cuộn được, không vỡ bố cục.
- [ ] Khi bàn phím mở, vẫn cuộn tới các trường và nút Lưu được.
- [ ] Đang sửa rồi nhấn Back của Android hoặc nút Quay lại: có xác nhận bỏ thay đổi; Hủy giữ nguyên nội dung đang nhập.
- [ ] Xóa tài khoản: Hủy không xóa; Xác nhận xóa chỉ xóa mục đã chọn.
- [ ] Xóa hết các mục: hiện kho trống và vẫn thêm mới được.
- [ ] Ở màn hình chi tiết, Back Android trở về danh sách.
- [ ] Tải lại hoàn toàn bằng Reload: quay về đúng 4 tài khoản mẫu. Đây là hành vi chủ ý của phase 1.
- [ ] Thử font hệ thống lớn và màn hình nhỏ: nội dung, nút và form vẫn dùng được.

**Chưa kiểm tra ở phase này:** PIN, mã hóa, lưu sau khi khởi động lại, backup, chống chụp màn hình, tự động xóa clipboard, APK độc lập.

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { InputTextarea } from "primereact/inputtextarea";
import { Rating } from "primereact/rating";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "./UserPage.css";
import { useLocation, useNavigate } from "react-router-dom";

// Mock data
const mockUser = {
  id: 1,
  name: "Nguyễn Văn A",
  status: "Thành viên VIP",
  avatar: "https://png.pngtree.com/png-clipart/20200701/original/pngtree-cat-default-avatar-png-image_5416936.jpg",
  role: "Tên thiết kế cơ bản",
  position: "Tiêu đề công việc của bạn",
  email: "user@example.com",
  password: "********",
  quyen: "user",
  so_dien_thoai: "0123456789",
  thoi_quan_het_han_han_hoi_vien: "2025-12-31",
};

const mockDownloadHistory = [
  {
    id: 1,
    type: "PowerPoint",
    title: "Mẫu PowerPoint Kinh doanh",
    image: "/img/ppt1.png",
    description: "Mô tả PowerPoint kinh doanh...",
    author: "Nguyen Van",
    size: "1200 * 1024",
    status: "download-link",
    date: "2024-06-20T10:00:00Z",
    powerPointId: 101,
    downloadLink: "/files/business-ppt.pptx",
  },
  {
    id: 2,
    type: "Hình ảnh",
    title: "Hình ảnh Sáng",
    image: "/img/ad3.jpg",
    description: "Mô tả hình ảnh sáng tạo...",
    author: "Le Thi",
    size: "1920 * 1080",
    status: "Free",
    date: "2024-06-15T14:30:00Z",
    hinhAnhId: 102,
    downloadLink: "/img/ad3.png",
  },
];

const mockReviews = [
  {
    id: 1,
    content: "Mẫu PowerPoint rất đẹp và dễ sử dụng!",
    rating: 5,
    date: "2024-10-01T12:00:00Z",
    powerPointId: 101,
  },
  {
    id: 2,
    content: "Hình ảnh chất lượng cao, phù hợp cho dự án của tôi.",
    rating: 4,
    date: "2024-09-15T15:00:00Z",
    powerPointId: null,
  },
];

const mockPurchasedItems = [
  {
    id: 1,
    type: "PowerPoint",
    title: "Mẫu PowerPoint Doanh nghiệp",
    image: "/img/ppt2.png",
    description: "Mô tả mẫu PowerPoint doanh nghiệp...",
    price: 75000,
    purchaseDate: "2024-06-10T09:00:00Z",
    powerPointId: 103,
    duong_dan_tap_tin: "/files/enterprise-ppt.pptx",
  },
  {
    id: 2,
    type: "Hình ảnh",
    title: "Hình ảnh Thiên nhiên",
    image: "/img/gallery1.jpg",
    description: "Mô tả hình ảnh thiên nhiên...",
    price: 50000,
    purchaseDate: "2024-06-05T11:00:00Z",
    hinhAnhId: 104,
    duong_dan_tap_tin: "/img/gallery1.png",
  },
];

const mockMembershipHistory = [
  {
    id: 1,
    packageName: "Gói Cơ Bản",
    description: "Gói hội viên cơ bản với quyền truy cập 30 ngày",
    price: 99000,
    registrationDate: "2024-06-01T08:00:00Z",
    expiryDate: "2024-06-30T23:59:59Z",
    status: "Đã kích hoạt",
  },
  {
    id: 2,
    packageName: "Gói Tiêu Chuẩn",
    description: "Gói hội viên tiêu chuẩn với quyền truy cập 90 ngày",
    price: 249000,
    registrationDate: "2024-03-01T08:00:00Z",
    expiryDate: "2024-05-30T23:59:59Z",
    status: "Hết hạn",
  },
];

const mockFavorites = [
  {
    id: 1,
    tieu_de: "Mẫu PowerPoint Sáng tạo",
    duong_dan_anh_nho: "/img/ppt3.png",
    la_pro: "Pro",
    mien_phi: false,
    duong_dan_tap_tin: "/files/creative-ppt.pptx",
  },
  {
    id: 2,
    tieu_de: "Hình ảnh Nghệ thuật",
    duong_dan_anh_nho: "/img/gallery2.jpg",
    la_pro: "Miễn phí",
    mien_phi: true,
    duong_dan_tap_tin: "/img/gallery2.png",
  },
];

// ErrorBoundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-center mt-10 text-red-500">Có lỗi xảy ra. Vui lòng thử lại.</div>;
    }
    return this.props.children;
  }
}

function UserPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [user, setUser] = useState(null);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [membershipHistory, setMembershipHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("PowerPoint");
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [selectedPowerPointId, setSelectedPowerPointId] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    so_dien_thoai: "",
  });
  const [favorites, setFavorites] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const toast = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load and deduplicate favorites
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("favorites");
      let favoritesFromStorage = [];
      if (storedFavorites) {
        favoritesFromStorage = JSON.parse(storedFavorites);
        if (!Array.isArray(favoritesFromStorage)) {
          throw new Error("Dữ liệu yêu thích không hợp lệ");
        }
      }

      const favoritesFromState = location.state?.favorites || [];
      const allFavorites = [...mockFavorites, ...favoritesFromStorage, ...favoritesFromState];
      const uniqueFavorites = Array.from(
        new Map(allFavorites.map((item) => [item.id, item])).values()
      );

      setFavorites(uniqueFavorites);
      localStorage.setItem("favorites", JSON.stringify(uniqueFavorites));
    } catch (err) {
      console.error("Error loading favorites:", err);
      setFavorites(mockFavorites);
      localStorage.setItem("favorites", JSON.stringify(mockFavorites));
      toast.current?.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể tải danh sách yêu thích. Sử dụng dữ liệu mặc định.",
      });
    }
  }, [location.state]);

  // Load mock data
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      setUser(mockUser);
      setEditForm({
        name: mockUser.name,
        email: mockUser.email,
        password: "",
        confirmPassword: "",
        so_dien_thoai: mockUser.so_dien_thoai,
      });
      setDownloadHistory(mockDownloadHistory);
      setReviews(mockReviews);
      setPurchasedItems(mockPurchasedItems);
      setMembershipHistory(mockMembershipHistory);
    } catch (err) {
      setError("Không thể tải dữ liệu người dùng.");
      console.error("Mock data error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const sidebarItems = [
    { label: "Trung tâm cá nhân của tôi", key: "profile", icon: "pi pi-user" },
    { label: "Lịch sử tải về", key: "downloads", icon: "pi pi-download" },
    { label: "Đánh giá của tôi", key: "reviews", icon: "pi pi-star" },
    { label: "Theo dõi", key: "follow", icon: "pi pi-heart" },
    { label: "Mẫu đã mua", key: "purchased", icon: "pi pi-shopping-cart" },
    { label: "Gói hội viên của tôi", key: "membership", icon: "pi pi-crown" },
  ];

  const handleEditProfile = useCallback(() => {
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Mật khẩu và xác nhận mật khẩu không khớp.",
      });
      return;
    }
    setUser({ ...user, name: editForm.name, email: editForm.email, so_dien_thoai: editForm.so_dien_thoai });
    setIsEditingProfile(false);
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: "Cập nhật thông tin thành công!",
    });
  }, [editForm, user]);

  const handleDeleteAccount = useCallback(() => {
    confirmDialog({
      message: "Bạn có chắc chắn muốn xóa tài khoản này?",
      header: "Xác nhận xóa",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("favorites");
        navigate("/login", { replace: true });
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Tài khoản đã được xóa!",
        });
      },
    });
  }, [navigate]);

  const handleFilterChange = useCallback((type) => setFilterType(type), []);

  const filteredDownloadHistory = downloadHistory.filter((item) => item.type === filterType);

  const openReviewDialog = useCallback((powerPointId) => {
    setSelectedPowerPointId(powerPointId);
    setReviewForm({ rating: 5, comment: "" });
    setShowReviewDialog(true);
  }, []);

  const openEditReviewDialog = useCallback((review) => {
    setEditingReview(review);
    setReviewForm({ rating: review.rating, comment: review.content });
    setIsEditingReview(true);
    setShowReviewDialog(true);
  }, []);

  const handleDeleteReview = useCallback((reviewId) => {
    setReviews(reviews.filter((review) => review.id !== reviewId));
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: "Đánh giá đã được xóa!",
    });
  }, [reviews]);

  const handleSelectAll = useCallback((e) => {
    setSelectedItems(e.target.checked ? favorites.map((ppt) => ppt.id) : []);
  }, [favorites]);

  const handleDeleteSelected = useCallback(() => {
    const updatedFavorites = favorites.filter((ppt) => !selectedItems.includes(ppt.id));
    setFavorites(updatedFavorites);
    setSelectedItems([]);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: "Đã xóa các mục chọn!",
    });
  }, [favorites, selectedItems]);

  const handleSelectItem = useCallback((id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const handleDownload = useCallback((item) => {
    const linkUrl = item.duong_dan_tap_tin || item.downloadLink;
    if (!linkUrl) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không tìm thấy liên kết tải xuống!",
      });
      return;
    }
    const link = document.createElement("a");
    link.href = linkUrl;
    link.download = item.title || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: "Tải xuống thành công!",
    });
  }, []);

  const handleRemoveFavorite = useCallback((id) => {
    const updatedFavorites = favorites.filter((ppt) => ppt.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: "Đã xóa khỏi danh sách yêu thích!",
    });
  }, [favorites]);

  const handlePowerPointClick = useCallback((item) => {
    console.log("PowerPoint clicked:", item);
    // Add navigation to detail page if needed
  }, []);

  const handleReviewSubmit = useCallback(() => {
    if (!reviewForm.comment.trim()) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Vui lòng nhập bình luận.",
      });
      return;
    }
    const newReview = {
      id: reviews.length + 1,
      content: reviewForm.comment,
      rating: reviewForm.rating,
      powerPointId: selectedPowerPointId,
      date: new Date().toISOString(),
    };
    setReviews([...reviews, newReview]);
    setShowReviewDialog(false);
    setReviewForm({ rating: 5, comment: "" });
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: "Đánh giá đã được gửi!",
    });
  }, [reviews, reviewForm, selectedPowerPointId]);

  const handleEditReviewSubmit = useCallback(() => {
    if (!reviewForm.comment.trim()) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Vui lòng nhập bình luận.",
      });
      return;
    }
    setReviews(
      reviews.map((review) =>
        review.id === editingReview.id ? { ...review, ...reviewForm } : review
      )
    );
    setShowReviewDialog(false);
    setIsEditingReview(false);
    setEditingReview(null);
    setReviewForm({ rating: 5, comment: "" });
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: "Đánh giá đã được cập nhật!",
    });
  }, [reviews, reviewForm, editingReview]);

  if (loading) return <div className="text-center mt-10 text-gray-700">Đang tải...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Lỗi: {error}</div>;
  if (!user) return <div className="text-center mt-10 text-red-500">Không tìm thấy thông tin người dùng</div>;

  return (
    <ErrorBoundary>
      <div className="user-page">
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className="sidebar">
          <ul>
            {sidebarItems.map((item) => (
              <li
                key={item.key}
                className={`sidebar-item ${activeSection === item.key ? "active" : ""}`}
                onClick={() => setActiveSection(item.key)}
              >
                <i className={item.icon} />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="main-content">
          {activeSection === "profile" && (
            <div className="profile">
              <div className="user-info">
                <Avatar
                  image={user.avatar}
                  size="xlarge"
                  shape="circle"
                  onError={(e) => (e.target.src = "/img/fallback-avatar.png")}
                />
                <div className="user-details">
                  <h3>
                    {user.name}
                    {user.thoi_quan_het_han_han_hoi_vien && (
                      <i
                        className="pi pi-crown"
                        style={{ color: "gold", marginLeft: "8px" }}
                        title="Thành viên VIP"
                      />
                    )}
                  </h3>
                  <p>ID: {user.id}</p>
                  <span className="user-status">{user.status}</span>
                </div>
                <Button label="Trở thành thành viên" className="upgrade-btn" onClick={() => navigate("/vip")} />
              </div>
              <div className="social-buttons">
                <h4>Tài khoản liên kết</h4>
                <Button label="Tiếp tục sử dụng Facebook" icon="pi pi-facebook" className="p-button-info" />
                <Button label="Tiếp tục sử dụng Google" icon="pi pi-google" className="p-button-danger" />
                <Button label="Tiếp tục sử dụng Twitter" icon="pi pi-twitter" className="p-button-secondary" />
              </div>
              <div className="user-data">
                <h4>Dữ liệu của bạn</h4>
                {isEditingProfile ? (
                  <div className="edit-form">
                    <div className="data-item">
                      <label>Tên người dùng *</label>
                      <InputText
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Nhập tên người dùng"
                      />
                    </div>
                    <div className="data-item">
                      <label>Email *</label>
                      <InputText
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="Nhập email"
                      />
                    </div>
                    <div className="data-item">
                      <label>Mật khẩu mới</label>
                      <InputText
                        type="password"
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
                      />
                    </div>
                    <div className="data-item">
                      <label>Xác nhận mật khẩu mới</label>
                      <InputText
                        type="password"
                        value={editForm.confirmPassword}
                        onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                    <div className="data-item">
                      <label>Số điện thoại</label>
                      <InputText
                        value={editForm.so_dien_thoai}
                        onChange={(e) => setEditForm({ ...editForm, so_dien_thoai: e.target.value })}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    <div className="data-item">
                      <Button
                        label="Lưu"
                        icon="pi pi-check"
                        className="p-button-success"
                        onClick={handleEditProfile}
                      />
                      <Button
                        label="Hủy"
                        icon="pi pi-times"
                        className="p-button-secondary"
                        onClick={() => setIsEditingProfile(false)}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="data-item">
                      <label>Tên thiết kế cơ bản</label>
                      <p>{user.role}</p>
                    </div>
                    <div className="data-item">
                      <label>Chức danh</label>
                      <p>{user.position}</p>
                    </div>
                    <Button
                      label="Chỉnh sửa thông tin"
                      icon="pi pi-pencil"
                      className="p-button-primary"
                      onClick={() => setIsEditingProfile(true)}
                    />
                  </>
                )}
              </div>
              <div className="account-info">
                <h4>Thông tin tài khoản</h4>
                <div className="data-item">
                  <label>Tên người dùng *</label>
                  <p>{user.name}</p>
                </div>
                <div className="data-item">
                  <label>Email *</label>
                  <p>{user.email}</p>
                </div>
                <div className="data-item">
                  <label>Mật khẩu *</label>
                  <p>{user.password}</p>
                </div>
                <div className="data-item">
                  <label>Quyền</label>
                  <p>{user.quyen || "Không xác định"}</p>
                </div>
                <div className="data-item">
                  <label>Số điện thoại</label>
                  <p>{user.so_dien_thoai || "Không có"}</p>
                </div>
                <div className="data-item">
                  <label>Thời gian hết hạn hội viên</label>
                  <p>{user.thoi_quan_het_han_han_hoi_vien || "Không có"}</p>
                </div>
                <Button
                  label="Xóa tài khoản"
                  icon="pi pi-trash"
                  className="p-button-danger"
                  onClick={handleDeleteAccount}
                />
              </div>
            </div>
          )}
          {activeSection === "downloads" && (
            <div className="downloads">
              <h2>Lịch sử tải về của tôi</h2>
              <div className="filter-bar">
                <Button
                  label="PowerPoint"
                  className={`filter-btn ${filterType === "PowerPoint" ? "active" : ""}`}
                  onClick={() => handleFilterChange("PowerPoint")}
                />
                <Button
                  label="Hình ảnh"
                  className={`filter-btn ${filterType === "Hình ảnh" ? "active" : ""}`}
                  onClick={() => handleFilterChange("Hình ảnh")}
                />
              </div>
              <div className="download-header">
                <span>Thông tin hình ảnh</span>
                <span></span>
                <span>Thông tin tùy chọn</span>
              </div>
              {filteredDownloadHistory.length > 0 ? (
                filteredDownloadHistory.map((item) => (
                  <div
                    key={`${item.powerPointId || item.hinhAnhId || item.id}`}
                    className="download-item"
                  >
                    <div className="download-image-info">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="download-img"
                        onError={(e) => (e.target.src = "/img/fallback-image.jpg")}
                      />
                      <div className="download-info">
                        <h4>{item.title}</h4>
                        <p>
                          Tác giả: {item.author} <br />
                          Kích thước: {item.size} <br />
                          Thời gian tải xuống: {new Date(item.date).toLocaleString("vi-VN")}
                        </p>
                        {item.type === "PowerPoint" && (
                          <Button
                            label="Viết đánh giá"
                            icon="pi pi-star"
                            className="p-button-sm p-button-secondary"
                            onClick={() => openReviewDialog(item.powerPointId)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="download-status">
                      {item.status === "Need Credit" && (
                        <span className="need-credit">Need Credit!</span>
                      )}
                    </div>
                    <div className="download-permission">
                      <p>
                        <i className="pi pi-money-bill permission-icon free" /> Ghi phép miễn phí
                      </p>
                      <p>
                        <i className="pi pi-ban permission-icon non-commercial" /> Không sử dụng thương mại
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Chưa có lịch sử tải về cho {filterType}.</p>
              )}
            </div>
          )}
          {activeSection === "reviews" && (
            <div className="reviews">
              <h2>Đánh giá của tôi</h2>
              {reviews.length > 0 ? (
                reviews.map((item) => (
                  <div key={item.id} className="review-item">
                    <div className="review-header">
                      <span className="review-user">{user.name}</span>
                      <Rating value={item.rating} readOnly cancel={false} className="review-rating" />
                    </div>
                    <p className="review-content">{item.content}</p>
                    <p className="review-date">
                      Ngày đánh giá: {new Date(item.date).toLocaleString("vi-VN")}
                    </p>
                    <div className="review-actions">
                      <Button
                        label="Sửa"
                        icon="pi pi-pencil"
                        className="p-button-sm p-button-primary"
                        onClick={() => openEditReviewDialog(item)}
                      />
                      <Button
                        label="Xóa"
                        icon="pi pi-trash"
                        className="p-button-sm p-button-danger"
                        onClick={() => handleDeleteReview(item.id)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>Chưa có đánh giá nào.</p>
              )}
            </div>
          )}
          {activeSection === "follow" && (
            <div className="follow">
              <h2>Danh sách yêu thích</h2>
              {favorites.length > 0 ? (
                <>
                  <div className="follow-header">
                    <div className="select-all-container">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === favorites.length && favorites.length > 0}
                        onChange={handleSelectAll}
                      />
                      <span>Chọn tất cả</span>
                    </div>
                    <button
                      className="delete-selected-btn"
                      onClick={handleDeleteSelected}
                      disabled={selectedItems.length === 0}
                    >
                      Xóa
                    </button>
                  </div>
                  <div className="follow-container">
                    {favorites.map((ppt) => (
                      <div className="follow-item" key={ppt.id}>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(ppt.id)}
                          onChange={() => handleSelectItem(ppt.id)}
                          className="follow-checkbox"
                        />
                        <div className="follow-image-info">
                          <img
                            src={ppt.duong_dan_anh_nho}
                            alt={ppt.tieu_de}
                            className="follow-img"
                            onError={(e) => (e.target.src = "/img/fallback-image.jpg")}
                          />
                          <div className="follow-info">
                            <h4>{ppt.tieu_de}</h4>
                            <p>{ppt.la_pro || "Miễn phí"}</p>
                          </div>
                        </div>
                        <div className="follow-actions">
                          {ppt.mien_phi && <span className="badge-free">Miễn phí</span>}
                          <button className="download-btn" onClick={() => handleDownload(ppt)}>
                            <i className="bx bx-download" />
                          </button>
                          <button
                            className="remove-favorite-btn"
                            onClick={() => handleRemoveFavorite(ppt.id)}
                          >
                            <i className="pi pi-trash" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>Chưa có PowerPoint nào trong danh sách yêu thích.</p>
              )}
            </div>
          )}
          {activeSection === "purchased" && (
            <div className="purchased">
              <h2>Mẫu đã mua</h2>
              {purchasedItems.length > 0 ? (
                purchasedItems.map((item) => (
                  <div key={item.id} className="purchased-item">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="purchased-img"
                      onClick={() => handlePowerPointClick(item)}
                      onError={(e) => (e.target.src = "/img/fallback-image.jpg")}
                    />
                    <div className="purchased-info">
                      <h4>{item.title}</h4>
                      <p>
                        Loại: {item.type} <br />
                        Giá: {item.price.toLocaleString("vi-VN")} VNĐ <br />
                        Ngày mua: {new Date(item.purchaseDate).toLocaleString("vi-VN")} <br />
                      </p>
                    </div>
                    <div className="purchased-actions">
                      <Button
                        label="Tải xuống"
                        icon="pi pi-download"
                        className="p-button-sm p-button-success"
                        onClick={() => handleDownload(item)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>Chưa có mẫu nào được mua.</p>
              )}
            </div>
          )}
          {activeSection === "membership" && (
            <div className="membership">
              <h2>Lịch sử hội viên</h2>
              {membershipHistory.length > 0 ? (
                membershipHistory.map((item) => (
                  <div key={item.id} className="membership-item">
                    <h4>{item.packageName}</h4>
                    <p>
                      Mô tả: {item.description} <br />
                      Giá: {item.price.toLocaleString("vi-VN")} VNĐ <br />
                      Ngày đăng ký: {new Date(item.registrationDate).toLocaleString("vi-VN")} <br />
                      Ngày hết hạn: {new Date(item.expiryDate).toLocaleString("vi-VN")} <br />
                      Trạng thái: {item.status}
                    </p>
                  </div>
                ))
              ) : (
                <p>Chưa có lịch sử hội viên.</p>
              )}
            </div>
          )}
        </div>
        <Dialog
          header={isEditingReview ? "Sửa đánh giá" : "Viết đánh giá"}
          visible={showReviewDialog}
          style={{ width: "50vw" }}
          onHide={() => {
            setShowReviewDialog(false);
            setIsEditingReview(false);
            setEditingReview(null);
            setReviewForm({ rating: 5, comment: "" });
          }}
        >
          <div className="p-fluid">
            <div className="p-field">
              <label>Điểm đánh giá</label>
              <Rating
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: e.value })}
                cancel={false}
              />
            </div>
            <div className="p-field">
              <label>Bình luận</label>
              <InputTextarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows={5}
                autoResize
              />
            </div>
            <Button
              label={isEditingReview ? "Cập nhật đánh giá" : "Gửi đánh giá"}
              icon="pi pi-check"
              onClick={isEditingReview ? handleEditReviewSubmit : handleReviewSubmit}
              disabled={!reviewForm.comment.trim()}
            />
          </div>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
}

export default UserPage;
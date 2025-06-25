import React, { useState, useEffect, useRef } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./ppt.css";
import "./App.css";
import { useLocation, useNavigate } from "react-router-dom";

// Mock data for detail images (PowerPoint or Image)
const mockDetailImages = [
  { src: "/img/detail1.png", alt: "Ảnh chi tiết 1" },
  { src: "/img/detail2.png", alt: "Ảnh chi tiết 2" },
  { src: "/img/detail3.png", alt: "Ảnh chi tiết 3" },
];

// Mock data for related PowerPoints
const mockRelatedPowerpoints = [
  { id: 1, tieu_de: "Mẫu PowerPoint Lịch sử", duong_dan_anh_nho: "/img/ppt1.png", la_pro: false, gia: 0 },
  { id: 2, tieu_de: "Mẫu PowerPoint Giáo dục", duong_dan_anh_nho: "/img/ppt2.png", la_pro: true, gia: 50000 },
  { id: 3, tieu_de: "Mẫu PowerPoint Kinh doanh", duong_dan_anh_nho: "/img/ppt3.png", la_pro: false, gia: 0 },
  { id: 4, tieu_de: "Mẫu PowerPoint Công nghệ", duong_dan_anh_nho: "/img/ppt4.png", la_pro: true, gia: 75000 },
  { id: 5, tieu_de: "Mẫu PowerPoint Sáng tạo", duong_dan_anh_nho: "/img/ppt5.png", la_pro: false, gia: 0 },
];

// Mock data for related Backgrounds
const mockRelatedBackgrounds = [
  { id: 1, tieu_de: "Hình nền Lễ Giáng sinh", duong_dan_anh_nho: "/img/noel-bg.png", la_pro: false, gia: 0 },
  { id: 2, tieu_de: "Hình nền Ẩm thực", duong_dan_anh_nho: "/img/ad3.jpg", la_pro: false, gia: 0 },
  { id: 3, tieu_de: "Hình nền Quang cảnh", duong_dan_anh_nho: "/img/landscape.jpg", la_pro: true, gia: 30000 },
  { id: 4, tieu_de: "Hình nền Động vật", duong_dan_anh_nho: "/img/animal.jpg", la_pro: false, gia: 0 },
  { id: 5, tieu_de: "Hình nền Vườn hoa", duong_dan_anh_nho: "/img/flower.jpg", la_pro: true, gia: 40000 },
  { id: 6, tieu_de: "Hình nền Bầu trời", duong_dan_anh_nho: "/img/sky.jpg", la_pro: false, gia: 0 },
  { id: 7, tieu_de: "Hình nền Công nghệ", duong_dan_anh_nho: "/img/tech.jpg", la_pro: true, gia: 50000 },
  { id: 8, tieu_de: "Hình nền Tối giản", duong_dan_anh_nho: "/img/minimal.jpg", la_pro: false, gia: 0 },
];

// Mock data for reviews
const mockReviews = [
  { user: "Nguyễn Văn A", rating: 4.5, comment: "Hình ảnh rất đẹp!", date: "2025-04-01" },
  { user: "Trần Thị B", rating: 5, comment: "Rất phù hợp cho thiết kế của tôi.", date: "2025-03-30" },
];

// Mock data for user
const mockUser = {
  thoi_gian_het_han_hoi_vien: "2025-12-31T23:59:59Z", // VIP valid until end of 2025
};

// Default item for /about page
const defaultItem = {
  id: 1,
  tieu_de: "Mẫu PowerPoint Lịch sử",
  duong_dan_anh_nho: "/img/ppt1.png",
  duong_dan_tap_tin: "/files/ppt1.pptx",
  la_pro: false,
  gia: 0,
  mo_ta: "Mẫu PowerPoint về lịch sử với thiết kế đơn giản và chuyên nghiệp.",
};

const PPTTemplate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { powerpoint, image } = location.state || {};
  const item = powerpoint || image || defaultItem; // Use defaultItem if no state
  const isPowerpoint = !!powerpoint || !image; // Default to PowerPoint if no state
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [detailImages, setDetailImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedPowerpoints, setRelatedPowerpoints] = useState([]);
  const [relatedBackgrounds, setRelatedBackgrounds] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isMembershipValid, setIsMembershipValid] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const thumbnailRef = useRef(null);

  // Mock user check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && mockUser.thoi_gian_het_han_hoi_vien) {
      const expiryDate = new Date(mockUser.thoi_gian_het_han_hoi_vien);
      const currentDate = new Date("2025-06-26T01:00:00+07:00"); // Current date
      setIsMembershipValid(expiryDate > currentDate);
    } else {
      setIsMembershipValid(false);
    }
    setLoadingUser(false);
  }, []);

  // Mock data loading
  useEffect(() => {
    // Set detail images
    if (isPowerpoint) {
      setDetailImages(mockDetailImages);
    } else {
      setDetailImages([{ src: item.duong_dan_anh_nho, alt: item.tieu_de }]);
    }
    setLoading(false);

    // Set related PowerPoints and Backgrounds
    setRelatedPowerpoints(mockRelatedPowerpoints);
    setRelatedBackgrounds(mockRelatedBackgrounds);

    // Set reviews
    setReviews(mockReviews);
  }, [item, isPowerpoint]);

  // Hàm cuộn thumbnail sang trái
  const scrollThumbnailsLeft = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };

  // Hàm cuộn thumbnail sang phải
  const scrollThumbnailsRight = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

  const prevSlide = () => {
    setSelectedIndex((prev) => (prev === 0 ? detailImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setSelectedIndex((prev) => (prev === detailImages.length - 1 ? 0 : prev + 1));
  };

  const handleDownload = () => {
    const fileUrl = isPowerpoint ? item.duong_dan_tap_tin : item.duong_dan_anh_nho;
    const filename = fileUrl ? fileUrl.split("/").pop() : item.tieu_de;

    if (!fileUrl) {
      alert("Không tìm thấy đường dẫn tệp tin để tải xuống.");
      return;
    }

    if (isMembershipValid) {
      downloadFile(fileUrl, filename);
      return;
    }

    if (item.la_pro) {
      const dialog = document.createElement("div");
      dialog.className = "dialog-overlay";
      dialog.innerHTML = `
        <div class="dialog-content">
          <button class="dialog-close">×</button>
          <h2>Mở khóa nội dung cao cấp</h2>
          <p>Chọn một trong các tùy chọn dưới đây để tiếp tục:</p>
          <div class="download-options">
            <div class="option">
              <button class="option-btn slow">
                <span class="option-icon">🐢</span>
                <button class="dialog-button buy-now-option">Mua ngay - ${item.gia || 0} VNĐ</button>
                <span class="option-speed">Tốc độ tải về 0.5MB/s</span>
              </button>
              <ul class="option-details">
                <li>Mua ngay để tải mẫu cao cấp</li>
                <li>Tiếp cận 1 tiếng tải sản</li>
                <li>Phí hàng loạt không</li>
                <li>Không sử dụng thương mại</li>
              </ul>
            </div>
            <div class="option">
              <button class="option-btn fast">
                <span class="option-icon">🏃‍♂️</span>
                <button class="dialog-button membership-option">Mua gói hội viên</button>
                <span class="option-speed">Tốc độ tải về 10MB/s</span>
              </button>
              <ul class="option-details">
                <li>Tài khoản giới hạn</li>
                <li>Tiếp cận 8 tiếng tải sản</li>
                <li>Không cần phí chỉ thích nguồn với tác phẩm</li>
                <li>Sử dụng thương mại cá nhân</li>
              </ul>
            </div>
          </div>
          <p class="dialog-cancel">Hủy bất cứ lúc nào</p>
        </div>
      `;
      document.body.appendChild(dialog);

      const closeButton = dialog.querySelector(".dialog-close");
      closeButton.addEventListener("click", () => {
        document.body.removeChild(dialog);
      });

      const membershipButton = dialog.querySelector(".membership-option");
      membershipButton.addEventListener("click", () => {
        document.body.removeChild(dialog);
        navigate("/vip");
      });

      const buyNowButton = dialog.querySelector(".buy-now-option");
      buyNowButton.addEventListener("click", () => {
        document.body.removeChild(dialog);
        navigate("/checkout/1", {
          state: {
            selectedPackage: {
              id: item.id,
              tieu_de: item.tieu_de,
              gia: item.gia || 0,
              type: isPowerpoint ? "powerpoint" : "image",
              duong_dan_tap_tin: fileUrl,
              duong_dan_anh_nho: fileUrl,
            },
          },
        });
      });
    } else {
      const dialog = document.createElement("div");
      dialog.className = "dialog-overlay";
      dialog.innerHTML = `
        <div class="dialog-content">
          <button class="dialog-close">×</button>
          <h2>Chọn phương thức tải về</h2>
          <div class="download-options">
            <div class="option">
              <button class="option-btn slow">
                <span class="option-icon">🐢</span>
                <span class="option-title">Thư giãn tải xuống</span>
                <span class="option-speed">Tốc độ tải về 0.5MB/s</span>
              </button>
              <ul class="option-details">
                <li>1 lượt tải xuống mỗi ngày</li>
                <li>Tiếp cận 1 tiếng tải sản</li>
                <li>Phí hàng loạt không</li>
                <li>Không sử dụng thương mại</li>
              </ul>
            </div>
            <div class="option">
              <button class="option-btn fast">
                <span class="option-icon">🏃‍♂️</span>
                <span class="option-title">Tải nhanh</span>
                <span class="option-speed">Tốc độ tải về 10MB/s</span>
              </button>
              <ul class="option-details">
                <li>Tài khoản giới hạn</li>
                <li>Tiếp cận 8 tiếng tải sản</li>
                <li>Không cần phí chỉ thích nguồn với tác phẩm</li>
                <li>Sử dụng thương mại cá nhân</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(dialog);

      const closeButton = dialog.querySelector(".dialog-close");
      const slowButton = dialog.querySelector(".slow");
      const fastButton = dialog.querySelector(".fast");

      closeButton.addEventListener("click", () => {
        document.body.removeChild(dialog);
      });

      slowButton.addEventListener("click", () => {
        document.body.removeChild(dialog);
        downloadFile(fileUrl, filename);
      });

      fastButton.addEventListener("click", () => {
        document.body.removeChild(dialog);
        navigate("/vip");
      });
    }
  };

  const downloadFile = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 0;

  if (loadingUser) {
    return <div>Đang kiểm tra trạng thái tài khoản...</div>;
  }

  return (
    <div className="ppt-container">
      <p className="ppt-description">
        Trang chủ <i className="bx bx-chevron-right"></i> {isPowerpoint ? "PowerPoint" : "Hình ảnh"}
      </p>
      <h1 className="ppt-title">{item.tieu_de}</h1>

      <div className="ppt-content">
        <div className="ppt-image-container">
          {loading ? (
            <p>Đang tải ảnh chi tiết...</p>
          ) : detailImages.length === 0 ? (
            <img src={item.duong_dan_anh_nho} alt={item.tieu_de} className="ppt-image" />
          ) : (
            <>
              <img
                src={detailImages[selectedIndex].src}
                alt={detailImages[selectedIndex].alt}
                className="ppt-image"
              />
              {detailImages.length > 1 && (
                <>
                  <div className="ppt-counter">
                    {selectedIndex + 1}/{detailImages.length}
                  </div>
                  <button className="ppt-nav ppt-prev" onClick={prevSlide}>
                    ❮
                  </button>
                  <button className="ppt-nav ppt-next" onClick={nextSlide}>
                    ❯
                  </button>
                  <div className="ppt-thumbnails-container">
                    <button className="thumbnail-nav left" onClick={scrollThumbnailsLeft}>
                      ❮
                    </button>
                    <div className="ppt-thumbnails" ref={thumbnailRef}>
                      {detailImages.map((img) => (
                        <img
                          key={img.src}
                          src={img.src}
                          alt={img.alt}
                          className={`ppt-thumbnail ${selectedIndex === detailImages.findIndex((i) => i.src === img.src) ? "active" : ""}`}
                          onClick={() => setSelectedIndex(detailImages.findIndex((i) => i.src === img.src))}
                        />
                      ))}
                    </div>
                    <button className="thumbnail-nav right" onClick={scrollThumbnailsRight}>
                      ❯
                    </button>
                  </div>
                </>
              )}
            </>
          )}
          <div className="ppt-detail">
            <h2>{item.tieu_de}</h2>
            <p>
              <h3>Mẫu PowerPoint và Hình ảnh tải miễn phí</h3>
            </p>
            <p>{item.mo_ta || "Không có mô tả."}</p>
            <p>
              Loại: <span className="text-highlight">{item.la_pro ? "Pro" : "Miễn phí"}</span>
            </p>
            {item.la_pro && item.gia && (
              <p>
                Giá: <span className="text-highlight">{item.gia} VNĐ</span>
              </p>
            )}
            <p>
              Chủ đề: <span className="text-highlight">Lịch sử, Giáo dục, Đơn giản, Kế hoạch</span>
            </p>
          </div>

          <div className="ppt-tags">
            <span className="tag">Lịch sử</span>
            <span className="tag">Giáo dục</span>
            <span className="tag">Mẫu tối giản</span>
            <span className="tag">Kế hoạch</span>
            <span className="tag">Năm</span>
            <span className="tag">Đánh giá hiệu suất</span>
            <span className="tag tag-more">+22</span>
          </div>
        </div>

        <div className="ppt-info">
          <p className="ppt-description">
            {isPowerpoint
              ? "Mẫu PowerPoint này có giấy phép bản quyền và có sẵn để sử dụng thương mại."
              : "Hình ảnh này có giấy phép bản quyền và có sẵn để sử dụng thương mại."}{" "}
            Nâng cấp lên gói Premium cá nhân{" "}
            <span className="text-orange">
              Hoặc Nâng cấp lên thành viên cao cấp của công ty nhiên chính hãng để giấy phép.
            </span>{" "}
            <a href="/vip" className="text-green">
              Bấm vào đây
            </a>
          </p>
          <button
            className="ppt-btn ppt-btn-orange"
            onClick={handleDownload}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "10px",
              fontSize: "16px",
            }}
          >
            <span style={{ marginRight: "5px" }}>
              <i className="bx bxs-download"></i>
            </span>{" "}
            {isPowerpoint ? "PowerPoint" : "Hình ảnh"}
          </button>

          <div
            className="ppt-btn-group"
            style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}
          >
            <button className="ppt-btn text-gray" style={{ flex: 1, marginRight: "5px" }}>
              <i className="bx bxs-info-circle"></i> Thông tin
            </button>
            <button className="ppt-btn text-gray" style={{ flex: 1, marginRight: "5px" }}>
              <i className="bx bxs-heart"></i> Giữ
            </button>
            <button className="ppt-btn text-gray" style={{ flex: 1 }}>
              <i className="bx bxs-share-alt"></i> Chia sẻ
            </button>
          </div>

          <h3 className="ppt-license" style={{ fontSize: "16px", margin: "10px 0" }}>
            Phạm vi ủy quyền: <span className="text-orange">Giấy phép thương mại</span>
          </h3>
          <h4 style={{ fontSize: "14px", margin: "5px 0" }}>
            Đối tượng được ủy quyền: <span className="text-green">Cá nhân</span>{" "}
            <span className="text-gray">Doanh nghiệp</span>
          </h4>

          <div className="ppt-license-details" style={{ margin: "10px 0" }}>
            <img
              src="/img/giayphep.jpg"
              alt="Giấy phép"
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <ul style={{ listStyle: "none", padding: "0" }}>
              <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ marginRight: "10px" }}>🔒</span> Đảm bảo bản quyền
              </li>
              <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ marginRight: "10px" }}>📜</span> Giấy phép PRF cho mục đích thương mại cá nhân
              </li>
              <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ marginRight: "10px" }}>🚫</span> Không cần phí chỉ thích nguồn tác phẩm
              </li>
              <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ marginRight: "10px" }}>📥</span> Tải xuống không giới hạn tài sản Premium
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "1px" }}>📄</span> Hóa đơn trực tuyến
              </li>
            </ul>
          </div>

          <div
            className="ppt-btn-group"
            style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}
          >
            <button className="ppt-btn ppt-btn-gray" style={{ flex: "1", marginRight: "5px" }}>
              <span style={{ marginRight: "5px" }}>📜</span> Giấy phép cá nhân
            </button>
            <button className="ppt-btn ppt-btn-green" style={{ flex: "1" }}>
              <span style={{ marginRight: "5px" }}>📈</span> Nâng cấp giá ngay hôm nay
            </button>
          </div>
        </div>
      </div>

      {/* Phần đánh giá */}
      <div className="ppt-reviews">
        <h2>Đánh giá</h2>
        <div className="rating-summary">
          <div className="average-rating">
            <span>{averageRating}</span>/5
          </div>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`bx ${i < Math.round(averageRating) ? "bxs-star" : "bx-star"}`}
              ></i>
            ))}
          </div>
          <span>({reviews.length} đánh giá)</span>
        </div>

        <div className="review-list">
          {reviews.length === 0 ? (
            <p>Chưa có đánh giá nào.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.user + review.date} className="review-item">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <div>
                    <span style={{ fontWeight: "bold" }}>{review.user}</span>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`bx ${i < Math.round(review.rating) ? "bxs-star" : "bx-star"}`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <span style={{ color: "#666", fontSize: "14px" }}>{review.date}</span>
                </div>
                <p style={{ margin: "5px 0 0 0" }}>{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mẫu PowerPoint thịnh hành */}
      <section className="top-categories top">
        <h1 className="heading-1">Mẫu PowerPoint thịnh hành</h1>
        <div className="container-categories">
          {relatedPowerpoints.slice(0, 5).map((category) => (
            <div className="card-category" key={category.id}>
              <img src={category.duong_dan_anh_nho} alt={category.tieu_de} className="template-img" />
              <div className="overlay">
                <span className={category.la_pro ? "badge-pro" : "badge-free"}>
                  {category.la_pro ? "Pro" : "Miễn phí"}
                </span>
                <button className="download-btn">
                  <i className="bx bx-download"></i> PowerPoint
                </button>
                <p className="template-title">{category.tieu_de}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hình nền sáng tạo */}
      <section className="top-categories top">
        <h1 className="heading-1">Hình nền sáng tạo</h1>
        <div className="container-categories">
          {relatedBackgrounds.slice(0, 4).map((item) => (
            <div className="card-category-1" key={item.id}>
              <img src={item.duong_dan_anh_nho} alt={item.tieu_de} width={350} height={200} />
              <div className="overlay">
                <span className={item.la_pro ? "badge-pro" : "badge-free"}>
                  {item.la_pro ? "Pro" : "Miễn phí"}
                </span>
                <button className="download-btn">Xem thêm về bộ sưu tập</button>
                <p className="template-title">{item.tieu_de}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="container-categories top">
          {relatedBackgrounds.slice(4, 8).map((item) => (
            <div className="card-category-1" key={item.id}>
              <img src={item.duong_dan_anh_nho} alt={item.tieu_de} width={350} height={200} />
              <div className="overlay">
                <span className={item.la_pro ? "badge-pro" : "badge-free"}>
                  {item.la_pro ? "Pro" : "Miễn phí"}
                </span>
                <button className="download-btn">Xem thêm về bộ sưu tập</button>
                <p className="template-title">{item.tieu_de}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PPTTemplate;
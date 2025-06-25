import React, { useEffect, useState, useRef, useCallback } from "react";
import { Route, Routes, useLocation, useNavigate, Link, Navigate } from "react-router-dom";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import PptPage from "./PptPage";
import PngPage from "./PngPage";
import LoginPage from "./LoginPage";
import UserPage from "./UserPage";
import VIPPage from "./VIPPage";
import VIPcheckPage from "./VIPcheckPage";
import AIPage from "./AIPage";
import Success from "./Success";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./ppt.css";
import "./App.css";

// Mock data for categories
const mockCategories = [
  { id: 1, ten: "Lịch sử" },
  { id: 2, ten: "Giáo dục" },
  { id: 3, ten: "Kinh doanh" },
  { id: 4, ten: "Công nghệ" },
  { id: 5, ten: "Sáng tạo" },
];

// Mock data for user
const mockUser = {
  id: "82815496",
  ten: "Nguyễn Văn A",
  thoi_gian_het_han_hoi_vien: "2025-12-31T23:59:59Z",
};

// PrivateRoute component with enhanced token validation
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        if (token) {
          // Mock API call for token validation (replace with actual API)
          // Example: const response = await fetch('/api/validate-token', { headers: { Authorization: `Bearer ${token}` } });
          const isValid = true; // Mock: assume token is valid
          setIsAuthenticated(isValid);
        } else {
          // Attempt silent authentication (e.g., via refresh token or cookie)
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            // Mock refresh token logic
            localStorage.setItem("token", "mock-token");
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };
    validateToken();
  }, [token]);

  if (isValidating) {
    return <div className="text-center mt-10 text-gray-700">Đang xác thực...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

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

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const op = useRef(null);
  const isLoginPage = location.pathname === "/login";

  // Load categories
  useEffect(() => {
    setCategories(mockCategories);
  }, []);

  // Initialize user state based on token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Mock user fetch (replace with API call)
      setUser(mockUser);
    }
  }, []);

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle login success
  const handleLoginSuccess = useCallback((userData) => {
    localStorage.setItem("token", "mock-token");
    localStorage.setItem("refreshToken", "mock-refresh-token"); // Mock refresh token
    setUser(userData || mockUser);
    navigate("/user", { replace: true });
  }, [navigate]);

  // Handle search
  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);

      const queryParams = new URLSearchParams(location.search);
      const categoryFromUrl = queryParams.get("category");
      let targetCategory = selectedCategory;

      if (categoryFromUrl && !targetCategory) {
        const matchedCategory = mockCategories.find(
          (cat) => cat.ten.toLowerCase() === categoryFromUrl.toLowerCase()
        );
        if (matchedCategory) {
          params.append("danh_muc_id", matchedCategory.id);
          targetCategory = { label: "PowerPoint", value: 1, to: "/ppt" };
        }
      }

      const mockSearchResults = [
        {
          id: 1,
          tieu_de: "Mẫu PowerPoint Lịch sử",
          duong_dan_anh_nho: "/img/ppt1.png",
          la_pro: false,
        },
        {
          id: 2,
          tieu_de: "Mẫu PowerPoint Giáo dục",
          duong_dan_anh_nho: "/img/ppt2.png",
          la_pro: true,
        },
      ];

      const targetPath = targetCategory?.to || location.pathname;
      navigate(targetPath, {
        state: { searchResults: mockSearchResults, searchQuery },
        replace: true,
      });
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      navigate("/ppt", {
        state: { searchResults: [], searchQuery },
        replace: true,
      });
    }
  }, [searchQuery, selectedCategory, location, navigate]);

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  // Navigate to login
  const goToLogin = useCallback(() => {
    op.current?.hide();
    navigate("/login");
  }, [navigate]);

  // Show/hide overlay
  const showOverlay = useCallback((e) => op.current?.show(e), []);
  const hideOverlay = useCallback(() => op.current?.hide(), []);

  // Handle user click
  const handleUserClick = useCallback(() => {
    hideOverlay();
    navigate(user ? "/user" : "/login");
  }, [navigate, user, hideOverlay]);

  // Handle category click
  const handleCategoryClick = useCallback((category) => {
    setShowDropdown(false);
    setSearchQuery("");
    navigate(`/ppt?category=${encodeURIComponent(category.ten)}`);
  }, [navigate]);

  // Check VIP status
  const isVIP = user?.thoi_gian_het_han_hoi_vien
    ? new Date(user.thoi_gian_het_han_hoi_vien) > new Date()
    : false;

  return (
    <ErrorBoundary>
      <div className="App">
        {!isLoginPage && (
          <header className="header">
            <div className={`container-hero container ${isScrolled ? "hidden" : ""}`}>
              <div className="hero">
                <div className="customer-support">
                  <i className="bx bx-headphone" />
                  <div className="content-customer-support">
                    <span className="text">Hỗ trợ khách hàng</span>
                    <span className="number">0378656586</span>
                  </div>
                </div>
                <div className="container-logo">
                  <img
                    src="/img/logo.png"
                    alt="Logo"
                    width={50}
                    height={50}
                    className="logo"
                    loading="lazy"
                    onError={(e) => (e.target.src = "/img/fallback-logo.png")}
                  />
                  <h1 className="logo">
                    <Link to="/">XPoint</Link>
                  </h1>
                </div>
                <div className="container-user">
                  <button
                    type="button"
                    className="p-link"
                    onMouseEnter={showOverlay}
                    onClick={handleUserClick}
                    aria-label="User profile"
                  >
                    <i className="bx bxs-user" />
                  </button>
                  <OverlayPanel
                    ref={op}
                    style={{ width: "300px", fontFamily: "Arial, sans-serif" }}
                    dismissable
                  >
                    {user ? (
                      <div className="p-3" style={{ textAlign: "center" }}>
                        <div style={{ textAlign: "right" }}>
                          <Button
                            label="Thoát đăng nhập"
                            className="p-button-text p-button-sm"
                            style={{ color: "#666", fontSize: "12px" }}
                            onClick={handleLogout}
                          />
                        </div>
                        <div style={{ margin: "10px 0" }}>
                          <img
                            src="https://png.pngtree.com/png-clipart/20200701/original/pngtree-cat-default-avatar-png-image_5416936.jpg"
                            alt="Avatar"
                            style={{ borderRadius: "50%", width: "50px", height: "50px", cursor: "pointer" }}
                            loading="lazy"
                            onClick={handleUserClick}
                            onError={(e) => (e.target.src = "https://png.pngtree.com/png-clipart/20200701/original/pngtree-cat-default-avatar-png-image_5416936.jpg")}
                          />
                          <h3 style={{ margin: "5px 0", fontSize: "16px" }}>{user.ten}</h3>
                          <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                            ID: {user.id}
                          </p>
                          {isVIP ? (
                            <>
                              <span
                                style={{
                                  display: "inline-block",
                                  backgroundColor: "#ffd700",
                                  padding: "2px 8px",
                                  borderRadius: "12px",
                                  fontSize: "12px",
                                  marginTop: "5px",
                                  color: "#000",
                                }}
                              >
                                Thành viên VIP
                              </span>
                              <i
                                className="pi pi-crown"
                                style={{ color: "gold", marginLeft: "5px", fontSize: "16px" }}
                                title="Thành viên VIP"
                              />
                            </>
                          ) : (
                            <span
                              style={{
                                display: "inline-block",
                                backgroundColor: "#e0e0e0",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "12px",
                                marginTop: "5px",
                              }}
                            >
                              Người sử dụng miễn phí
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            margin: "10px 0",
                            fontSize: "14px",
                          }}
                        >
                          <div>
                            <strong>2</strong>
                            <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                              Số lượt tải vé mỗi ngày
                            </p>
                          </div>
                          <div>
                            <strong>2</strong>
                            <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                              Lượng tải xuống còn lại
                            </p>
                          </div>
                        </div>
                        <div style={{ margin: "10px 0" }}>
                          <Button
                            label="Giảm tới 80%"
                            className="p-button p-button-sm"
                            style={{
                              backgroundColor: "#ff4d4f",
                              border: "none",
                              width: "100%",
                              marginBottom: "10px",
                            }}
                            onClick={() => navigate("/vip")}
                          />
                          <Button
                            label="Tham gia kế hoạch doanh nghiệp"
                            className="p-button p-button-sm"
                            style={{
                              backgroundColor: "#fa8c16",
                              border: "none",
                              width: "100%",
                            }}
                            onClick={() => navigate("/vip")}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            marginTop: "10px",
                            fontSize: "14px",
                            color: "#666",
                          }}
                        >
                          <div style={{ textAlign: "center" }}>
                            <i className="pi pi-user" style={{ fontSize: "20px", display: "block" }} />
                            <p style={{ margin: "5px 0 0" }}>Trung tâm cá nhân</p>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <i className="pi pi-briefcase" style={{ fontSize: "20px", display: "block" }} />
                            <p style={{ margin: "5px 0 0" }}>Doanh nghiệp</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3" style={{ textAlign: "center" }}>
                        <h3 style={{ fontSize: "16px" }}>Vui lòng đăng nhập</h3>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                          Đăng nhập để sử dụng các tính năng của trang web.
                        </p>
                        <Button
                          label="Đi đến đăng nhập"
                          className="p-button-primary p-button-sm"
                          onClick={goToLogin}
                          style={{ width: "100%" }}
                        />
                      </div>
                    )}
                  </OverlayPanel>
                  <i className="bx bxs-grid-alt" />
                  <div className="content-shopping-cart" />
                </div>
              </div>
            </div>
            <div className="container-navbar">
              <nav className="navbar container">
                <i className="fa-solid fa-bars" />
                <ul className="menu">
                  <li><Link to="/">XPOINT</Link></li>
                  <li
                    className="menu-item"
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    <Link to="/ppt">PowerPoint</Link>
                    {showDropdown && (
                      <div
                        className="dropdown-menu"
                        onMouseEnter={() => setShowDropdown(true)}
                        onMouseLeave={() => setShowDropdown(false)}
                      >
                        {categories.length > 0 ? (
                          <ul className="dropdown-content">
                            {categories.map((category) => (
                              <li key={category.id}>
                                <Link
                                  to={`/ppt?category=${encodeURIComponent(category.ten)}`}
                                  onClick={() => handleCategoryClick(category)}
                                >
                                  <span className="text">{category.ten}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>Đang tải danh mục...</p>
                        )}
                      </div>
                    )}
                  </li>
                  <li><Link to="/png">Hình ảnh</Link></li>
                  <li><Link to="/vip">Nâng cấp</Link></li>
                  <li><Link to="/ai">Công cụ AI</Link></li>
                </ul>
                <form className="search-form" onSubmit={handleSearch}>
                  <div className="search-box">
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm..."
                      className="search-input"
                    />
                    <button type="submit" className="btn-search">
                      <i className="bx bx-search-alt" />
                    </button>
                  </div>
                </form>
              </nav>
            </div>
          </header>
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/ppt" element={<PptPage />} />
          <Route path="/png" element={<PngPage />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/user" element={<PrivateRoute><UserPage /></PrivateRoute>} />
          <Route path="/vip" element={<PrivateRoute><VIPPage /></PrivateRoute>} />
          <Route path="/checkout/:packageId" element={<PrivateRoute><VIPcheckPage /></PrivateRoute>} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/success" element={<Success />} />
        </Routes>
        {!isLoginPage && (
          <footer className="footer">
            <div className="container container-footer">
              <div className="menu-footer">
                <div className="contact-info">
                  <p className="title-footer">Thông tin liên hệ</p>
                  <ul>
                    <li>Địa chỉ: 24, Nhân Hoà, Mỹ Hào, Hưng Yên</li>
                    <li>Điện thoại: 123-456-7890</li>
                    <li>Email: xpoint@support.com</li>
                  </ul>
                  <div className="social-icons">
                    <a href="https://facebook.com" className="facebook"><i className="bx bxl-facebook" /></a>
                    <a href="https://twitter.com" className="twitter"><i className="bx bxl-twitter" /></a>
                    <a href="https://youtube.com" className="youtube"><i className="bx bxl-youtube" /></a>
                    <a href="https://pinterest.com" className="pinterest"><i className="bx bxl-pinterest-alt" /></a>
                    <a href="https://instagram.com" className="instagram"><i className="bx bxl-instagram" /></a>
                  </div>
                </div>
                <div className="information">
                  <p className="title-footer">Thông tin</p>
                  <ul>
                    <li><Link to="/info">Cung cấp thông tin</Link></li>
                    <li><Link to="/privacy">Chính trị riêng tư</Link></li>
                    <li><Link to="/contact">Liên hệ</Link></li>
                  </ul>
                </div>
                <div className="my-account">
                  <p className="title-footer">Hiểu thêm</p>
                  <ul>
                    <li><Link to="/history">Lịch sử của Xpoint</Link></li>
                    <li><Link to="/wishlist">Danh sách mong muốn</Link></li>
                  </ul>
                </div>
                <div className="newsletter">
                  <p className="title-footer">Thông tin Xpoint</p>
                  <div className="content">
                    <p>Hãy đăng ký để theo dõi chúng tôi</p>
                    <input type="email" placeholder="Kết nối để biết thêm thông tin..." />
                    <button type="button">Đăng ký</button>
                  </div>
                </div>
              </div>
              <div className="copyright">
                <p>Bản quyền của Đỗ Thị Xuân © 2025</p>
                <img
                  src="/img/payment.png"
                  alt="Payment Methods"
                  loading="lazy"
                  onError={(e) => (e.target.src = "/img/fallback-payment.png")}
                />
              </div>
            </div>
          </footer>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
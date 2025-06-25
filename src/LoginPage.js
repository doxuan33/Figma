import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import styles from "./login.module.css";

// Mock data aligned with App.js and VIPcheckPage.js
const mockUser = {
  id: "82815496",
  ten: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  so_dien_thoai: "0123456789",
  mat_khau: "password123",
  thoi_gian_het_han_hoi_vien: "2025-12-31T23:59:59Z",
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

const LoginPage = ({ onLoginSuccess }) => {
  const toast = useRef(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    ten: "",
    emailOrUsername: "",
    mat_khau: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleSignUp = () => {
    setIsSignUp((prev) => !prev);
    setErrorMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.emailOrUsername.trim() || !formData.mat_khau.trim()) {
      return "Vui lòng điền đầy đủ email/tên người dùng và mật khẩu";
    }
    if (isSignUp && !formData.ten.trim()) {
      return "Vui lòng điền họ và tên";
    }
    if (isSignUp && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOrUsername)) {
      return "Email không hợp lệ";
    }
    if (formData.mat_khau.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: validationError,
      });
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Mock signup
        setErrorMessage("Đăng ký thành công! Vui lòng đăng nhập.");
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Đăng ký thành công! Vui lòng đăng nhập.",
        });
        toggleSignUp();
      } else {
        // Mock login
        if (
          (formData.emailOrUsername === mockUser.email ||
            formData.emailOrUsername === mockUser.ten) &&
          formData.mat_khau === mockUser.mat_khau
        ) {
          // Set tokens
          localStorage.setItem("token", "mock-jwt-token-12345");
          localStorage.setItem("refreshToken", "mock-refresh-token-67890");

          // User data for onLoginSuccess
          const user = {
            id: mockUser.id,
            ten: mockUser.ten,
            so_dien_thoai: mockUser.so_dien_thoai,
            thoi_gian_het_han_hoi_vien: mockUser.thoi_gian_het_han_hoi_vien,
          };

          onLoginSuccess(user);
          toast.current.show({
            severity: "success",
            summary: "Thành công",
            detail: "Đăng nhập thành công!",
          });
        } else {
          throw new Error("Email/tên người dùng hoặc mật khẩu không đúng");
        }
      }
    } catch (error) {
      const message = error.message || "Có lỗi xảy ra, vui lòng thử lại";
      setErrorMessage(message);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (platform) => {
    const message = `Đăng nhập bằng ${platform} hiện chưa được hỗ trợ.`;
    setErrorMessage(message);
    toast.current.show({
      severity: "warn",
      summary: "Thông báo",
      detail: message,
    });
  };

  return (
    <ErrorBoundary>
      <Helmet>
        <title>{isSignUp ? "Đăng ký - XPoint" : "Đăng nhập - XPoint"}</title>
      </Helmet>
      <div className="fullscreen-bg">
        <Toast ref={toast} />
        <div className={`${styles.container} ${isSignUp ? styles.active : ""}`}>
          {/* Form Đăng ký */}
          <div className={`${styles.formContainer} ${styles.signUp}`}>
            <form onSubmit={handleSubmit}>
              <h1>Tạo tài khoản</h1>
              <div className="social-icons">
                {[
                  { icon: faGooglePlusG, platform: "Google" },
                  { icon: faFacebookF, platform: "Facebook" },
                  { icon: faGithub, platform: "GitHub" },
                  { icon: faLinkedinIn, platform: "LinkedIn" },
                ].map(({ icon, platform }, index) => (
                  <a
                    key={index}
                    href="/"
                    className={styles.icon}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSocialLogin(platform);
                    }}
                  >
                    <FontAwesomeIcon icon={icon} />
                  </a>
                ))}
              </div>
              {errorMessage && <div className={styles.error}>{errorMessage}</div>}
              <span>hoặc sử dụng email của bạn để đăng ký</span>
              <input
                type="text"
                placeholder="Họ và tên"
                name="ten"
                value={formData.ten}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <input
                type="email"
                placeholder="Email"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                name="mat_khau"
                value={formData.mat_khau}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </form>
          </div>

          {/* Form Đăng nhập */}
          <div className={`${styles.formContainer} ${styles.signIn}`}>
            <form onSubmit={handleSubmit}>
              <h1>Đăng nhập</h1>
              <div className="social-icons">
                {[
                  { icon: faGooglePlusG, platform: "Google" },
                  { icon: faFacebookF, platform: "Facebook" },
                  { icon: faGithub, platform: "GitHub" },
                  { icon: faLinkedinIn, platform: "LinkedIn" },
                ].map(({ icon, platform }, index) => (
                  <a
                    key={index}
                    href="/"
                    className={styles.icon}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSocialLogin(platform);
                    }}
                  >
                    <FontAwesomeIcon icon={icon} />
                  </a>
                ))}
              </div>
              {errorMessage && <div className={styles.error}>{errorMessage}</div>}
              <span>hoặc sử dụng email và mật khẩu của bạn</span>
              <input
                type="text"
                placeholder="Email hoặc tên người dùng"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                name="mat_khau"
                value={formData.mat_khau}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <a href="/" onClick={(e) => e.preventDefault()}>
                Quên mật khẩu?
              </a>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>
          </div>

          {/* Hiệu ứng chuyển đổi */}
          <div className={styles.toggleContainer}>
            <div className={styles.toggle}>
              <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
                <h1>Chào mừng trở lại!</h1>
                <p>Nhập thông tin cá nhân của bạn để sử dụng tất cả các tính năng</p>
                <button className={styles.hidden} onClick={toggleSignUp} disabled={isLoading}>
                  Đăng nhập
                </button>
              </div>
              <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
                <h1>Xin chào, bạn!</h1>
                <p>Đăng ký với thông tin cá nhân của bạn để sử dụng tất cả các tính năng</p>
                <button className={styles.hidden} onClick={toggleSignUp} disabled={isLoading}>
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LoginPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import styles from "./login.module.css";

// Mock data
const mockUser = {
  id: "82815496",
  ten: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  mat_khau: "password123",
  thoi_gian_het_han_hoi_vien: "2025-12-31T23:59:59Z",
};

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    ten: "",
    emailOrUsername: "",
    mat_khau: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleSignUp = () => setIsSignUp((prev) => !prev);

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

    // Kiểm tra validation
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Mô phỏng đăng ký thành công
        setErrorMessage("Đăng ký thành công! Vui lòng đăng nhập.");
        toggleSignUp();
      } else {
        // Mô phỏng đăng nhập
        if (
          (formData.emailOrUsername === mockUser.email ||
            formData.emailOrUsername === mockUser.ten) &&
          formData.mat_khau === mockUser.mat_khau
        ) {
          // Mô phỏng token
          const token = "mock-jwt-token-12345";
          localStorage.setItem("token", token);

          // Mô phỏng thông tin người dùng từ API /auth/me
          const user = {
            id: mockUser.id,
            ten: mockUser.ten,
            thoi_gian_het_han_hoi_vien: mockUser.thoi_gian_het_han_hoi_vien,
          };

          // Gọi onLoginSuccess với dữ liệu người dùng
          onLoginSuccess(user);
          setErrorMessage("");
          navigate("/");
        } else {
          throw new Error("Email/tên người dùng hoặc mật khẩu không đúng");
        }
      }
    } catch (error) {
      setErrorMessage(error.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (platform) => {
    setErrorMessage(`Đăng nhập bằng ${platform} hiện chưa được hỗ trợ.`);
  };

  return (
    <>
      <Helmet>
        <title>{isSignUp ? "Đăng ký - MyApp" : "Đăng nhập - MyApp"}</title>
      </Helmet>
      <div className="fullscreen-bg">
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
                    href="#"
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
                    href="#"
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
              <a href="#" onClick={(e) => e.preventDefault()}>
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
    </>
  );
};

export default LoginPage;
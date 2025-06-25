import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./VIPPage.css";

const mockUser = {
  id: 1,
  email: "user@example.com",
  so_dien_thoai: "0123456789",
};

const mockPackages = {
  1: {
    id: 1,
    ten_goi: "Gói Cơ Bản",
    gia: 99000,
    thoi_han: 30,
    type: "membership",
  },
  2: {
    id: 2,
    ten_goi: "Gói Tiêu Chuẩn",
    gia: 249000,
    thoi_han: 90,
    type: "membership",
  },
  3: {
    id: 3,
    tieu_de: "Hình ảnh Pro",
    gia: 50000,
    duong_dan_tap_tin: "/images/pro-image.jpg",
    type: "image",
  },
  4: {
    id: 4,
    tieu_de: "PowerPoint Pro",
    gia: 75000,
    duong_dan_tap_tin: "/files/pro-ppt.pptx",
    type: "powerpoint",
  },
};

const VIPcheckPage = () => {
  const { packageId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPackage: initialSelectedPackage } = location.state || {};
  const [selectedPackage, setSelectedPackage] = useState(initialSelectedPackage);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPackage, setLoadingPackage] = useState(!initialSelectedPackage);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState("Vietnam");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("method-1");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeAutoRenew, setAgreeAutoRenew] = useState(true);

  const paymentMethodMap = {
    "method-1": "momo",
    "method-2": "visa",
    "method-3": "paypal",
    "method-4": "google_pay",
    "method-5": "bank_transfer",
  };

  useEffect(() => {
    localStorage.removeItem("lastOrderId");
    localStorage.removeItem("lastOrderDetails");
  }, []);

  useEffect(() => {
    try {
      setUser(mockUser);
      setPhoneNumber(mockUser.so_dien_thoai || "");
      setLoadingUser(false);
    } catch (err) {
      console.error("Error loading user:", err);
      setError("Không thể tải thông tin người dùng.");
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    if (!initialSelectedPackage && packageId) {
      try {
        const pkg = mockPackages[packageId];
        if (pkg) {
          setSelectedPackage(pkg);
          setLoadingPackage(false);
        } else {
          setError("Không tìm thấy gói/tài nguyên với ID này!");
          setLoadingPackage(false);
        }
      } catch (err) {
        console.error("Error loading package:", err);
        setError("Không thể tải thông tin gói/tài nguyên.");
        setLoadingPackage(false);
      }
    } else if (!initialSelectedPackage && !packageId) {
      setError("Không có thông tin gói/tài nguyên!");
      setLoadingPackage(false);
    } else {
      setLoadingPackage(false);
    }
  }, [initialSelectedPackage, packageId]);

  const basePriceVND = Number(selectedPackage?.gia) || 0;
  const discount = selectedPackage?.ten_goi ? basePriceVND * 0.2 : 0;
  const totalPriceVND = basePriceVND - discount;

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  };

  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true);
      if (!selectedPackage) {
        throw new Error("Không có thông tin gói/tài nguyên để thanh toán.");
      }
      if (!user) {
        throw new Error("Không có thông tin người dùng. Vui lòng đăng nhập lại.");
      }
      if (loadingPackage || loadingUser) {
        throw new Error("Đang tải thông tin, vui lòng chờ.");
      }
      if (!Number.isFinite(basePriceVND) || basePriceVND <= 0) {
        throw new Error("Giá mua gói/tài nguyên không hợp lệ.");
      }
      if (!validatePhoneNumber(phoneNumber)) {
        throw new Error("Số điện thoại không hợp lệ (10-11 số).");
      }
      if (!agreeTerms || !agreeAutoRenew) {
        throw new Error("Vui lòng đồng ý với các điều khoản dịch vụ và gia hạn tự động.");
      }

      const backendPaymentMethod = paymentMethodMap[paymentMethod] || paymentMethod;
      const transactionType = selectedPackage.ten_goi
        ? "membership"
        : selectedPackage.type === "powerpoint"
        ? "powerpoint"
        : "image";

      const orderId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      localStorage.setItem("lastOrderId", orderId);
      localStorage.setItem(
        "lastOrderDetails",
        JSON.stringify({
          selectedPackage,
          totalPriceVND,
          basePriceVND,
          discount,
          downloadLink: selectedPackage.duong_dan_tap_tin || null,
          transactionType,
        })
      );

      const simulatePayment = (delay) =>
        new Promise((resolve) => setTimeout(resolve, delay));

      if (backendPaymentMethod === "momo") {
        await simulatePayment(2000);
      } else if (backendPaymentMethod === "paypal") {
        await simulatePayment(5000);
      } else {
        await simulatePayment(2000);
      }

      setShowSuccess(true);
      await simulatePayment(3000);
      setShowSuccess(false);
      navigate("/success", {
        state: {
          selectedPackage,
          totalPriceVND,
          basePriceVND,
          discount,
          downloadLink: selectedPackage.duong_dan_tap_tin,
          transactionType,
        },
      });
    } catch (err) {
      console.error("Handle Payment Error:", err);
      setError(err.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loadingUser || loadingPackage) {
    return <div className="text-center mt-10 text-gray-700">Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Lỗi: {error}</div>;
  }

  if (!selectedPackage) {
    return <div className="text-center mt-10 text-red-500">Không tìm thấy thông tin gói/tài nguyên!</div>;
  }

  return (
    <section className="payment-section">
      <div className="container">
        <div className="payment-wrapper">
          <div className="payment-left">
            <div className="payment-header">
              <div className="payment-header-icon">
                <i className="ri-flashlight-fill"></i>
              </div>
              <div className="payment-header-title">Thông tin gói/tài nguyên</div>
              <p className="payment-header-description">
                Vui lòng xác nhận thông tin bạn đã chọn.
              </p>
            </div>
            <div className="payment-content">
              <div className="payment-body">
                <div className="payment-plan">
                  <div className="payment-plan-type">{selectedPackage.ten_goi ? "VIP" : "Pro"}</div>
                  <div className="payment-plan-info">
                    <div className="payment-plan-info-name">
                      {selectedPackage.ten_goi || selectedPackage.tieu_de}
                    </div>
                    <div className="payment-plan-info-price">
                      {basePriceVND.toLocaleString("vi-VN")} VNĐ
                    </div>
                  </div>
                  <Link to="/vip" className="payment-plan-change">
                    Thay đổi
                  </Link>
                </div>
                <div className="payment-summary">
                  <div className="payment-summary-item">
                    <div className="payment-summary-name">Giá gốc:</div>
                    <div className="payment-summary-price">{basePriceVND.toLocaleString("vi-VN")} VNĐ</div>
                  </div>
                  {selectedPackage.ten_goi && (
                    <div className="payment-summary-item">
                      <div className="payment-summary-name">Chiết khấu -20%</div>
                      <div className="payment-summary-price text-orange-500">
                        -{discount.toLocaleString("vi-VN")} VNĐ
                      </div>
                    </div>
                  )}
                  <div className="payment-summary-divider"></div>
                  <div className="payment-summary-item payment-summary-total">
                    <div className="payment-summary-name">Tổng cộng:</div>
                    <div className="payment-summary-price">{totalPriceVND.toLocaleString("vi-VN")} VNĐ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="payment-right">
            <div className="payment-form">
              <h1 className="payment-title">Phương thức thanh toán</h1>
              <div className="payment-method">
                {Object.keys(paymentMethodMap).map((method) => (
                  <React.Fragment key={method}>
                    <input
                      type="radio"
                      name="payment-method"
                      id={method}
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor={method} className="payment-method-item">
                      <img
                        src={
                          method === 'method-1' ? 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-350x350.png' :
                          method === 'method-2' ? 'https://js.pngtree.com/a5/static/li67rm.CR2j1tzS.png' :
                          method === 'method-3' ? '/img/paypal.png' :
                          method === 'method-4' ? 'https://static.vecteezy.com/system/resources/thumbnails/050/592/389/small_2x/google-pay-logo-transparent-background-free-png.png' :
                          'https://js.pngtree.com/web3/images/ps_logos/pm_banktransfervn.png'
                        }
                        alt={paymentMethodMap[method]}
                        className="payment-method-icon"
                        loading="lazy"
                        onError={(e) => (e.target.src = "/img/fallback-payment.png")}
                      />
                    </label>
                  </React.Fragment>
                ))}
              </div>

              {showSuccess && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50"
                      height="50"
                      fill="green"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 16.518L6.182 12.95a.75.75 0 111.068-1.05l3.818 3.818 6.682-6.682a.75.75 0 111.06 1.06l-7.432 7.432a.75.75 0 01-1.06 0z" />
                    </svg>
                    <h2>Thanh toán thành công!</h2>
                    {selectedPackage.duong_dan_tap_tin && (
                      <div>
                        <p>Tải về tệp tài nguyên:</p>
                        <Link to={selectedPackage.duong_dan_tap_tin} download className="download-link">
                          Tải xuống ngay
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isProcessingPayment && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <p className="text-gray-700">Đang xử lý thanh toán, vui lòng chờ...</p>
                    <div className="spinner" />
                  </div>
                </div>
              )}

              <p className="payment-note">Vui lòng cung cấp thông tin để hoàn tất giao dịch.</p>
              <div className="payment-form-group">
                <select
                  className="payment-form-control"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="Vietnam">Việt Nam</option>
                </select>
                <label htmlFor="country" className="payment-form-label payment-form-label-required">
                  Quốc gia
                </label>
              </div>
              <div className="payment-form-group">
                <input
                  type="email"
                  placeholder=" "
                  className="payment-form-control"
                  id="email"
                  value={user.email || ""}
                  readOnly
                />
                <label htmlFor="email" className="payment-form-label payment-form-label-required">
                  Địa chỉ email nhận hóa đơn
                </label>
              </div>
              <div className="payment-form-group">
                <input
                  type="text"
                  placeholder=" "
                  className="payment-form-control"
                  id="phone-number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <label
                  htmlFor="phone-number"
                  className="payment-form-label payment-form-label-required"
                >
                  Số điện thoại
                </label>
              </div>
              <div className="payment-checkbox-group">
                <label className="payment-checkbox">
                  <input
                    type="checkbox"
                    checked={agreeAutoRenew}
                    onChange={(e) => setAgreeAutoRenew(e.target.checked)}
                  />
                  <span>Xem và đồng ý với Thỏa thuận Gia hạn Thẻ Tín dụng/Tự động</span>
                </label>
                <label className="payment-checkbox">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span>Đồng ý với điều khoản dịch vụ</span>
                </label>
              </div>
              <button
                type="button"
                className="payment-form-submit-button"
                onClick={handlePayment}
                disabled={isProcessingPayment || !agreeTerms || !agreeAutoRenew}
              >
                {isProcessingPayment ? "Đang xử lý..." : "Xác nhận thanh toán"}
              </button>
              <div className="payment-footer">
                <p>Có thể hủy mà không mất phí</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VIPcheckPage;
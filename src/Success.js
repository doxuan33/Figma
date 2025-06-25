import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Success.css"; // Assume a CSS file for styling

// Mock data for order details
const mockOrderDetails = {
  membership: {
    id: 1,
    ten_goi: "Gói Cơ Bản",
    thoi_han: 30,
    ngay_dang_ky: "2025-06-25",
    ngay_het_han: "2025-07-25",
    ten_nguoi_dung: "Nguyễn Văn A",
    paymentMethod: "momo",
    order_id: "1629876543210-abcdef123",
    basePriceVND: 99000,
    discount: 19800,
    totalPriceVND: 79200,
    transactionType: "membership",
    downloadLink: null,
  },
  powerpoint: {
    id: 2,
    ten_powerpoint: "Mẫu PowerPoint Kinh doanh",
    thoi_gian_mua: "2025-06-25T17:31:00",
    ten_nguoi_dung: "Nguyễn Văn A",
    paymentMethod: "paypal",
    order_id: "1629876543211-ghijk456",
    basePriceVND: 75000,
    discount: 0,
    totalPriceVND: 75000,
    transactionType: "powerpoint",
    downloadLink: "/files/ppt-business.pptx",
  },
  image: {
    id: 3,
    ten_hinh_anh: "Hình ảnh Sáng tạo",
    thoi_gian_mua: "2025-06-25T17:31:00",
    ten_nguoi_dung: "Nguyễn Văn A",
    paymentMethod: "visa",
    order_id: "1629876543212-lmnop789",
    basePriceVND: 50000,
    discount: 0,
    totalPriceVND: 50000,
    transactionType: "image",
    downloadLink: "/img/creative-image.jpg",
  },
};

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrderDetails = () => {
      try {
        // Get transactionType from localStorage or state
        const storedDetails = JSON.parse(localStorage.getItem("lastOrderDetails")) || {};
        const transactionType =
          storedDetails.transactionType ||
          location.state?.transactionType ||
          "membership";

        // Use mock data based on transactionType
        const mockData = mockOrderDetails[transactionType];
        if (!mockData) {
          throw new Error("Không tìm thấy thông tin giao dịch cho loại giao dịch này");
        }

        setOrderDetails({
          ...mockData,
          // Override with state or localStorage if available
          basePriceVND: storedDetails.basePriceVND || location.state?.basePriceVND || mockData.basePriceVND,
          discount: storedDetails.discount || location.state?.discount || mockData.discount,
          totalPriceVND: storedDetails.totalPriceVND || location.state?.totalPriceVND || mockData.totalPriceVND,
          downloadLink: storedDetails.downloadLink || location.state?.downloadLink || mockData.downloadLink,
          order_id: orderId || mockData.order_id,
        });
      } catch (err) {
        console.error("Load Order Details Error:", err);
        // Fallback to localStorage or state
        const storedDetails = JSON.parse(localStorage.getItem("lastOrderDetails"));
        if (storedDetails) {
          setOrderDetails({
            ...storedDetails.selectedPackage,
            transactionType: storedDetails.transactionType,
            totalPriceVND: storedDetails.totalPriceVND,
            basePriceVND: storedDetails.basePriceVND,
            discount: storedDetails.discount,
            downloadLink: storedDetails.downloadLink,
            order_id: orderId || storedDetails.order_id,
            ten_nguoi_dung: "Nguyễn Văn A",
            paymentMethod: storedDetails.paymentMethod || "Không xác định",
          });
        } else if (location.state) {
          setOrderDetails({
            ...location.state.selectedPackage,
            transactionType: location.state.transactionType,
            totalPriceVND: location.state.totalPriceVND,
            basePriceVND: location.state.basePriceVND,
            discount: location.state.discount,
            downloadLink: location.state.downloadLink,
            order_id: orderId,
            ten_nguoi_dung: "Nguyễn Văn A",
            paymentMethod: location.state.paymentMethod || "Không xác định",
          });
        } else {
          setError(err.message || "Không thể tải thông tin giao dịch");
        }
      } finally {
        setLoading(false);
        // Clear localStorage to prevent stale data
        localStorage.removeItem("lastOrderId");
        localStorage.removeItem("lastOrderDetails");
      }
    };

    if (orderId || location.state) {
      loadOrderDetails();
    } else {
      setError("Không tìm thấy thông tin giao dịch");
      setLoading(false);
    }
  }, [orderId, location.state]);

  const handleDownload = (url, filename) => {
    // Simulate file download
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || `resource_${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-700">Đang tải thông tin giao dịch...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Lỗi: {error}</div>;
  }

  if (!orderDetails) {
    return <div className="text-center mt-10 text-red-500">Không tìm thấy thông tin giao dịch!</div>;
  }

  const isMembership = orderDetails.transactionType === "membership";

  return (
    <section className="success-section">
      <div className="container">
        <div className="success-wrapper">
          <div className="success-header">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill="green"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 16.518L6.182 12.95a.75.75 0 111.068-1.05l3.818 3.818 6.682-6.682a.75.75 0 111.06 1.06l-7.432 7.432a.75.75 0 01-1.06 0z" />
            </svg>
            <h1 className="success-title">Thanh toán thành công!</h1>
            <p className="success-description">
              Cảm ơn bạn đã {isMembership ? "nâng cấp gói hội viên" : "mua tài nguyên"}. Dưới đây là chi tiết giao dịch.
            </p>
          </div>
          <div className="success-content">
            <div className="success-details">
              <h2>Chi tiết {isMembership ? "gói hội viên" : "tài nguyên"}</h2>
              <div className="success-item">
                <span className="success-label">{isMembership ? "Tên gói" : "Tên tài nguyên"}:</span>
                <span className="success-value">
                  {orderDetails.ten_goi || orderDetails.ten_powerpoint || orderDetails.ten_hinh_anh}
                </span>
              </div>
              {isMembership && (
                <>
                  <div className="success-item">
                    <span className="success-label">Thời hạn:</span>
                    <span className="success-value">{orderDetails.thoi_han} ngày</span>
                  </div>
                  <div className="success-item">
                    <span className="success-label">Ngày đăng ký:</span>
                    <span className="success-value">
                      {new Date(orderDetails.ngay_dang_ky).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="success-item">
                    <span className="success-label">Ngày hết hạn:</span>
                    <span className="success-value">
                      {new Date(orderDetails.ngay_het_han).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </>
              )}
              {!isMembership && (
                <div className="success-item">
                  <span className="success-label">Thời gian mua:</span>
                  <span className="success-value">
                    {new Date(orderDetails.thoi_gian_mua).toLocaleString("vi-VN")}
                  </span>
                </div>
              )}
              <div className="success-item">
                <span className="success-label">Người dùng:</span>
                <span className="success-value">{orderDetails.ten_nguoi_dung}</span>
              </div>
              <div className="success-item">
                <span className="success-label">Phương thức thanh toán:</span>
                <span className="success-value">{orderDetails.paymentMethod || "Không xác định"}</span>
              </div>
              <div className="success-item">
                <span className="success-label">Mã giao dịch:</span>
                <span className="success-value">{orderDetails.order_id}</span>
              </div>
              <div className="success-item">
                <span className="success-label">Giá gốc:</span>
                <span className="success-value">{orderDetails.basePriceVND.toLocaleString("vi-VN")} VNĐ</span>
              </div>
              {orderDetails.discount > 0 && (
                <div className="success-item">
                  <span className="success-label">Chiết khấu:</span>
                  <span className="success-value text-orange-500">
                    -{orderDetails.discount.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              )}
              <div className="success-item">
                <span className="success-label">Tổng cộng:</span>
                <span className="success-value">{orderDetails.totalPriceVND.toLocaleString("vi-VN")} VNĐ</span>
              </div>
              {orderDetails.downloadLink && (
                <div className="success-item">
                  <span className="success-label">Tải xuống:</span>
                  <button
                    className="success-download-button"
                    onClick={() =>
                      handleDownload(
                        orderDetails.downloadLink,
                        orderDetails.ten_powerpoint || orderDetails.ten_hinh_anh || `resource_${Date.now()}`
                      )
                    }
                  >
                    Tải xuống ngay
                  </button>
                </div>
              )}
            </div>
            <button className="success-back-button" onClick={() => navigate("/")}>
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Success;
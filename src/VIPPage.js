import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./VIPPage.css";

const mockPackages = [
  {
    id: 1,
    ten_goi: "Gói Cơ Bản",
    gia: 99000,
    thoi_han: 30,
  },
  {
    id: 2,
    ten_goi: "Gói Tiêu Chuẩn",
    gia: 249000,
    thoi_han: 90,
  },
  {
    id: 3,
    ten_goi: "Gói Cao Cấp",
    gia: 499000,
    thoi_han: 180,
  },
];

const VIPPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (!mockPackages || !Array.isArray(mockPackages)) {
        throw new Error("Dữ liệu gói không hợp lệ");
      }
      setPackages(mockPackages);
      setLoading(false);
    } catch (err) {
      console.error("Error loading packages:", err);
      setError("Không thể tải danh sách gói. Vui lòng thử lại sau.");
      setLoading(false);
    }
  }, []);

  const handleBuyNow = (pkg) => {
    if (!pkg?.id) {
      console.error("Invalid package:", pkg);
      return;
    }
    navigate(`/checkout/${pkg.id}`, { state: { selectedPackage: pkg } });
  };

  if (error) {
    return <div className="text-center mt-10 text-red-500">Lỗi: {error}</div>;
  }

  if (loading) {
    return <div className="text-center mt-10 text-gray-700">Đang tải...</div>;
  }

  const blogs = [
    {
      img: "/img/blog1.png", // Use local assets
      alt: "Blog 1",
      description: "Đội ngũ thiết kế độc quyền đông đảo",
    },
    {
      img: "/img/blog2.png",
      alt: "Blog 2",
      description: "Hiệp định PRF cho giấy phép thương mại",
    },
    {
      img: "/img/blog3.png",
      alt: "Blog 3",
      description: "Tải xuống không giới hạn tài nguyên hình ảnh đa thể loại",
    },
  ];

  return (
    <section className="top-categories-1">
      <h1 className="heading-1 top">Các Gói Hội Viên</h1>
      <div className="container-vip">
        {packages.map((pkg) => (
          <div key={pkg.id} className="card-vip">
            <h3>{pkg.ten_goi}</h3>
            <div className="text-3xl font-bold text-orange-500 mb-2">
              {pkg.gia.toLocaleString("vi-VN")} VNĐ
              <span className="text-sm text-gray-500 ml-1">
                ({(pkg.gia / 25000).toFixed(2)} USD)
              </span>
            </div>
            <ul className="text-gray-600 mb-6 text-left pl-5">
              <li className="flex items-center mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {pkg.thoi_han} ngày truy cập
              </li>
              <li className="flex items-center mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                90 ngày dùng thử với tài khoản miễn phí
              </li>
              <li className="flex items-center mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Tải xuống không giới hạn
              </li>
              <li className="flex items-center mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Giấy phép sử dụng mãi mãi
              </li>
            </ul>
            <button
              className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-200"
              onClick={() => handleBuyNow(pkg)}
            >
              Mua ngay
            </button>
            <p className="text-gray-500 mt-2 text-sm">Hủy bất cứ lúc nào</p>
          </div>
        ))}
      </div>
      <section className="container blogs">
        <h1 className="heading-1">
          Hàng chục triệu người dùng đã tham gia Gói Premium Cá nhân của chúng tôi
        </h1>
        <div className="container-blogs">
          {blogs.map((blog) => (
            <div className="card-blog" key={blog.alt}>
              <div className="container-img">
                <img
                  src={blog.img}
                  alt={blog.alt}
                  width={250}
                  height={250}
                  loading="lazy"
                  onError={(e) => (e.target.src = "/img/fallback-blog.png")}
                />
                <div className="button-group-blog">
                  <span>
                    <i className="bx bx-search-alt"></i>
                  </span>
                  <span>
                    <i className="bx bx-link"></i>
                  </span>
                </div>
              </div>
              <div className="content-blog">
                <p>{blog.description}</p>
                <Link to="/about" className="btn-read-more">
                  Đọc thêm
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default VIPPage;
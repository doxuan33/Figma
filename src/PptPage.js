import React, { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./ppt.css";

// Mock data for categories
const mockCategories = [
  { id: 1, ten: "Lịch sử" },
  { id: 2, ten: "Giáo dục" },
  { id: 3, ten: "Kinh doanh" },
  { id: 4, ten: "Công nghệ" },
  { id: 5, ten: "Sáng tạo" },
];

// Mock data for PowerPoints
const mockPowerpoints = [
  { id: 1, tieu_de: "Mẫu PowerPoint Lịch sử 1", duong_dan_anh_nho: "/img/ppt1.png", duong_dan_tap_tin: "/files/ppt1.pptx", la_pro: false, danh_muc_id: 1 },
  { id: 2, tieu_de: "Mẫu PowerPoint Giáo dục 1", duong_dan_anh_nho: "/img/ppt2.png", duong_dan_tap_tin: "/files/ppt2.pptx", la_pro: true, danh_muc_id: 2 },
  { id: 3, tieu_de: "Mẫu PowerPoint Kinh doanh 1", duong_dan_anh_nho: "/img/ppt3.png", duong_dan_tap_tin: "/files/ppt3.pptx", la_pro: false, danh_muc_id: 3 },
  { id: 4, tieu_de: "Mẫu PowerPoint Công nghệ 1", duong_dan_anh_nho: "/img/ppt4.png", duong_dan_tap_tin: "/files/ppt4.pptx", la_pro: true, danh_muc_id: 4 },
  { id: 5, tieu_de: "Mẫu PowerPoint Sáng tạo 1", duong_dan_anh_nho: "/img/ppt5.png", duong_dan_tap_tin: "/files/ppt5.pptx", la_pro: false, danh_muc_id: 5 },
  { id: 6, tieu_de: "Mẫu PowerPoint Lịch sử 2", duong_dan_anh_nho: "/img/ppt1.png", duong_dan_tap_tin: "/files/ppt6.pptx", la_pro: false, danh_muc_id: 1 },
  { id: 7, tieu_de: "Mẫu PowerPoint Giáo dục 2", duong_dan_anh_nho: "/img/ppt4.png", duong_dan_tap_tin: "/files/ppt7.pptx", la_pro: true, danh_muc_id: 2 },
  { id: 8, tieu_de: "Mẫu PowerPoint Kinh doanh 2", duong_dan_anh_nho: "/img/ppt5.png", duong_dan_tap_tin: "/files/ppt8.pptx", la_pro: false, danh_muc_id: 3 },
  { id: 9, tieu_de: "Mẫu PowerPoint Công nghệ 2", duong_dan_anh_nho: "/img/ppt2.png", duong_dan_tap_tin: "/files/ppt9.pptx", la_pro: true, danh_muc_id: 4 },
  { id: 10, tieu_de: "Mẫu PowerPoint Sáng tạo 2", duong_dan_anh_nho: "/img/ppt3.png", duong_dan_tap_tin: "/files/ppt10.pptx", la_pro: false, danh_muc_id: 5 },
  { id: 11, tieu_de: "Mẫu PowerPoint Lịch sử 3", duong_dan_anh_nho: "/img/ppt1.png", duong_dan_tap_tin: "/files/ppt11.pptx", la_pro: false, danh_muc_id: 1 },
  { id: 12, tieu_de: "Mẫu PowerPoint Giáo dục 3", duong_dan_anh_nho: "/img/ppt2.png", duong_dan_tap_tin: "/files/ppt12.pptx", la_pro: true, danh_muc_id: 2 },
  { id: 13, tieu_de: "Mẫu PowerPoint Kinh doanh 3", duong_dan_anh_nho: "/img/ppt5.png", duong_dan_tap_tin: "/files/ppt13.pptx", la_pro: false, danh_muc_id: 3 },
  { id: 14, tieu_de: "Mẫu PowerPoint Công nghệ 3", duong_dan_anh_nho: "/img/ppt3.png", duong_dan_tap_tin: "/files/ppt14.pptx", la_pro: true, danh_muc_id: 4 },
  { id: 15, tieu_de: "Mẫu PowerPoint Sáng tạo 3", duong_dan_anh_nho: "/img/ppt4.png", duong_dan_tap_tin: "/files/ppt15.pptx", la_pro: false, danh_muc_id: 5 },
  { id: 16, tieu_de: "Mẫu PowerPoint Lịch sử 4", duong_dan_anh_nho: "/img/ppt1.png", duong_dan_tap_tin: "/files/ppt16.pptx", la_pro: false, danh_muc_id: 1 },
  { id: 17, tieu_de: "Mẫu PowerPoint Giáo dục 4", duong_dan_anh_nho: "/img/ppt4.png", duong_dan_tap_tin: "/files/ppt17.pptx", la_pro: true, danh_muc_id: 2 },
  { id: 18, tieu_de: "Mẫu PowerPoint Kinh doanh 4", duong_dan_anh_nho: "/img/ppt5.png", duong_dan_tap_tin: "/files/ppt18.pptx", la_pro: false, danh_muc_id: 3 },
  { id: 19, tieu_de: "Mẫu PowerPoint Công nghệ 4", duong_dan_anh_nho: "/img/ppt3.png", duong_dan_tap_tin: "/files/ppt19.pptx", la_pro: true, danh_muc_id: 4 },
  { id: 20, tieu_de: "Mẫu PowerPoint Sáng tạo 4", duong_dan_anh_nho: "/img/ppt2.png", duong_dan_tap_tin: "/files/ppt20.pptx", la_pro: false, danh_muc_id: 5 },
  { id: 21, tieu_de: "Mẫu PowerPoint Lịch sử 5", duong_dan_anh_nho: "/img/ppt5.png", duong_dan_tap_tin: "/files/ppt21.pptx", la_pro: false, danh_muc_id: 1 },
  { id: 22, tieu_de: "Mẫu PowerPoint Giáo dục 5", duong_dan_anh_nho: "/img/ppt1.png", duong_dan_tap_tin: "/files/ppt22.pptx", la_pro: true, danh_muc_id: 2 },
  { id: 23, tieu_de: "Mẫu PowerPoint Kinh doanh 5", duong_dan_anh_nho: "/img/ppt4.png", duong_dan_tap_tin: "/files/ppt23.pptx", la_pro: false, danh_muc_id: 3 },
  { id: 24, tieu_de: "Mẫu PowerPoint Công nghệ 5", duong_dan_anh_nho: "/img/ppt5.png", duong_dan_tap_tin: "/files/ppt24.pptx", la_pro: true, danh_muc_id: 4 },
  { id: 25, tieu_de: "Mẫu PowerPoint Sáng tạo 5", duong_dan_anh_nho: "/img/ppt3.png", duong_dan_tap_tin: "/files/ppt25.pptx", la_pro: false, danh_muc_id: 5 },
];

function PptPage() {
  const [powerpoints, setPowerpoints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Pagination
  const [first, setFirst] = useState(0);
  const itemsPerPage = 20;

  const navigate = useNavigate();
  const location = useLocation();

  // Parse query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");
  const searchQuery = location.state?.searchQuery || "";
  const searchResults = location.state?.searchResults || [];

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error);
        setFavorites([]);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Mock categories and set selected category from URL
  useEffect(() => {
    setCategories(mockCategories);
    setLoadingCategories(false);

    if (categoryFromUrl) {
      const matchedCategory = mockCategories.find(
        (cat) => cat.ten.toLowerCase() === categoryFromUrl.toLowerCase()
      );
      if (matchedCategory) {
        setSelectedCategory(matchedCategory);
      }
    }
  }, [categoryFromUrl]);

  // Mock PowerPoint loading
  useEffect(() => {
    let filteredPowerpoints = mockPowerpoints;
    if (searchResults.length > 0 && searchQuery) {
      filteredPowerpoints = searchResults;
    } else {
      if (selectedCategory) {
        filteredPowerpoints = mockPowerpoints.filter(
          (ppt) => ppt.danh_muc_id === selectedCategory.id
        );
      }
      if (searchQuery) {
        filteredPowerpoints = filteredPowerpoints.filter((ppt) =>
          ppt.tieu_de.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    }
    setPowerpoints(filteredPowerpoints);
    setLoading(false);
  }, [searchQuery, searchResults, selectedCategory]);

  const onPageChange = (event) => {
    setFirst(event.first);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setFirst(0);
    navigate(`/ppt${category ? `?category=${encodeURIComponent(category.ten)}` : ""}`);
  };

  const handleDownload = (ppt, e) => {
    e.stopPropagation();
    if (!ppt.duong_dan_tap_tin) {
      alert("Không tìm thấy đường dẫn tệp tin để tải xuống.");
      return;
    }

    const link = document.createElement("a");
    link.href = ppt.duong_dan_tap_tin;
    link.download = ppt.tieu_de || "powerpoint.pptx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePowerPointClick = (ppt) => {
    navigate("/about", { state: { powerpoint: ppt, favorites } });
  };

  const handleFavoriteClick = (ppt, e) => {
    e.stopPropagation();
    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some((fav) => fav.id === ppt.id);
      if (isFavorited) {
        return prevFavorites.filter((fav) => fav.id !== ppt.id);
      } else if (prevFavorites.length < 50) { // Limit favorites to 50
        return [...prevFavorites, ppt];
      }
      return prevFavorites;
    });
  };

  const navigateToUserPage = () => {
    navigate("/user", { state: { favorites } });
  };

  return (
    <>
      <section className="top-categories-1">
        <p className="left_content">
          <Link to="/">Trang chủ</Link> <i className="bx bx-chevron-right"></i>{" "}
          <Link to="/ppt">PowerPoint</Link>
          {selectedCategory && (
            <>
              <i className="bx bx-chevron-right"></i> {selectedCategory.ten}
            </>
          )}
        </p>
        <h1 className="heading-1">
          {searchQuery
            ? `Kết quả tìm kiếm cho "${searchQuery}"`
            : "Mẫu PowerPoint Miễn Phí và Google Trang Trình Bày"}
        </h1>

        <div className="content left_content">
          {loadingCategories ? (
            <p>Đang tải danh mục...</p>
          ) : (
            <div className="buttons">
              <button
                onClick={() => handleCategoryClick(null)}
                className={!selectedCategory ? "active" : ""}
              >
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={selectedCategory?.id === category.id ? "active" : ""}
                >
                  {category.ten}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="container-categories top">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : powerpoints.length === 0 ? (
            <p>Không tìm thấy mẫu PowerPoint nào.</p>
          ) : (
            powerpoints.slice(first, first + itemsPerPage).map((ppt) => (
              <div
                className="card-category"
                key={ppt.id}
                onClick={() => handlePowerPointClick(ppt)}
              >
                <img
                  src={ppt.duong_dan_anh_nho}
                  alt={ppt.tieu_de}
                  className="template-img"
                  loading="lazy"
                  onError={(e) => (e.target.src = "/img/fallback-ppt.png")}
                />
                <div className="overlay">
                  <i
                    className={`pi pi-heart${
                      favorites.some((fav) => fav.id === ppt.id) ? "-fill" : ""
                    } favorite-icon`}
                    onClick={(e) => handleFavoriteClick(ppt, e)}
                  ></i>
                  <span className={ppt.la_pro ? "badge-pro" : "badge-free"}>
                    {ppt.la_pro ? <i className="bx bxs-crown"></i> : "Miễn phí"}
                  </span>
                  <button
                    className="download-btn"
                    onClick={(e) => handleDownload(ppt, e)}
                  >
                    <i className="bx bx-download"></i> PowerPoint
                  </button>
                  <p className="template-title">{ppt.tieu_de}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <Paginator
          first={first}
          rows={itemsPerPage}
          totalRecords={powerpoints.length}
          onPageChange={onPageChange}
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        />
      </section>
    </>
  );
}

export default PptPage;
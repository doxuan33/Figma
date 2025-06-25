import React, { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";
import "./ppt.css";
import { useLocation, useNavigate } from "react-router-dom";

// Mock data for categories
const mockCategories = [
  { id: 1, ten: "Lịch sử" },
  { id: 2, ten: "Giáo dục" },
  { id: 3, ten: "Kinh doanh" },
  { id: 4, ten: "Công nghệ" },
  { id: 5, ten: "Sáng tạo" },
];

// Mock data for images
const mockImages = [
  { id: 1, tieu_de: "Hình ảnh Lịch sử", duong_dan_anh_nho: "/img/gallery1.jpg", la_pro: false, danh_muc_id: 1 },
  { id: 2, tieu_de: "Hình ảnh Giáo dục", duong_dan_anh_nho: "/img/gallery2.jpg", la_pro: true, danh_muc_id: 2 },
  { id: 3, tieu_de: "Hình ảnh Kinh doanh", duong_dan_anh_nho: "/img/gallery3.jpg", la_pro: false, danh_muc_id: 3 },
  { id: 4, tieu_de: "Hình ảnh Công nghệ", duong_dan_anh_nho: "/img/gallery4.jpg", la_pro: true, danh_muc_id: 4 },
  { id: 5, tieu_de: "Hình ảnh Sáng tạo", duong_dan_anh_nho: "/img/gallery5.jpg", la_pro: false, danh_muc_id: 5 },
  { id: 6, tieu_de: "Hình nền Giáng sinh", duong_dan_anh_nho: "/img/noel-bg.png", la_pro: false, danh_muc_id: 1 },
  { id: 7, tieu_de: "Hình ảnh Ẩm thực", duong_dan_anh_nho: "/img/hinh-nen-canh-dong-hoa-tulip_014125372.jpg", la_pro: false, danh_muc_id: 2 },
  { id: 8, tieu_de: "Hình ảnh Quang cảnh", duong_dan_anh_nho: "/img/hinh-nen-canh-dong-hoa-tulip_014125372.jpg", la_pro: true, danh_muc_id: 3 },
  { id: 9, tieu_de: "Hình ảnh Động vật", duong_dan_anh_nho: "/img/hinh-nen-canh-dong-hoa-tulip_014125372.jpg", la_pro: false, danh_muc_id: 4 },
  { id: 10, tieu_de: "Hình ảnh Vườn hoa", duong_dan_anh_nho: "/img/hinh-nen-may-tinh-thien-nhien-phong-canh-mua-xuan.jpg", la_pro: true, danh_muc_id: 5 },
  { id: 11, tieu_de: "Hình nền Bầu trời", duong_dan_anh_nho: "/img/hinh-nen-may-tinh-thien-nhien-phong-canh-mua-xuan.jpg", la_pro: false, danh_muc_id: 1 },
  { id: 12, tieu_de: "Hình nền Tối giản", duong_dan_anh_nho: "/img/hinh-nen-may-tinh-thien-nhien-phong-canh-mua-xuan.jpg", la_pro: true, danh_muc_id: 2 },
  { id: 13, tieu_de: "Hình ảnh Công nghệ 2", duong_dan_anh_nho: "/img/hinh-nen-may-tinh-thien-nhien-phong-canh-mua-xuan.jpg", la_pro: false, danh_muc_id: 3 },
  { id: 14, tieu_de: "Hình ảnh Sáng tạo 2", duong_dan_anh_nho: "/img/hinh-nen-may-tinh-thien-nhien-phong-canh-mua-xuan.jpg", la_pro: true, danh_muc_id: 4 },
  { id: 15, tieu_de: "Hình ảnh Lịch sử 2", duong_dan_anh_nho: "/img/hinh-nen-may-tinh-thien-nhien-phong-canh-mua-xuan.jpg", la_pro: false, danh_muc_id: 5 },
  { id: 16, tieu_de: "Hình ảnh Giáo dục 2", duong_dan_anh_nho: "/img/hinh-nen-may-tinh-thien-nhien-phong-canh-mua-xuan.jpg", la_pro: true, danh_muc_id: 1 },
  { id: 17, tieu_de: "Hình ảnh Kinh doanh 2", duong_dan_anh_nho: "/img/hinh-nen-may-tinh-thien-nhien-phong-canh-mua-xuan.jpg", la_pro: false, danh_muc_id: 2 },
  { id: 18, tieu_de: "Hình ảnh Công nghệ 3", duong_dan_anh_nho: "/img/hinh-nen-may-tinh-thien-nhien-phong-canh-mua-xuan.jpg", la_pro: true, danh_muc_id: 3 },
  { id: 19, tieu_de: "Hình ảnh Sáng tạo 3", duong_dan_anh_nho: "/img/ad3.jpg", la_pro: false, danh_muc_id: 4 },
  { id: 20, tieu_de: "Hình ảnh Lịch sử 3", duong_dan_anh_nho: "/img/ad3.jpg", la_pro: true, danh_muc_id: 5 },
];

function PngPage() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Pagination
  const [first, setFirst] = useState(0);
  const itemsPerPage = 16; // Display 16 items per page

  const navigate = useNavigate();
  const location = useLocation();

  // Parse query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");

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
    // Simulate fetching categories
    const shuffledCategories = mockCategories.sort(() => Math.random() - 0.5).slice(0, 5);
    setCategories(shuffledCategories);
    setLoadingCategories(false);

    // Set selected category from URL
    if (categoryFromUrl) {
      const matchedCategory = mockCategories.find(
        (cat) => cat.ten.toLowerCase() === categoryFromUrl.toLowerCase()
      );
      if (matchedCategory) {
        setSelectedCategory(matchedCategory);
      }
    }
  }, [categoryFromUrl]);

  // Mock image loading
  useEffect(() => {
    const searchResults = location.state?.searchResults;
    const searchQuery = location.state?.searchQuery;

    if (searchResults && searchQuery) {
      setImages(searchResults);
      setLoading(false);
    } else {
      let filteredImages = mockImages;
      if (selectedCategory) {
        filteredImages = mockImages.filter((img) => img.danh_muc_id === selectedCategory.id);
      }
      if (searchQuery) {
        filteredImages = filteredImages.filter((img) =>
          img.tieu_de.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setImages(filteredImages);
      setLoading(false);
    }
  }, [location.state, selectedCategory]);

  const onPageChange = (event) => {
    setFirst(event.first);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setFirst(0);
    navigate(`/png${category ? `?category=${encodeURIComponent(category.ten)}` : ""}`);
  };

  const handleDownload = (image) => {
    if (!image.duong_dan_anh_nho) {
      alert("Không tìm thấy đường dẫn hình ảnh để tải xuống.");
      return;
    }

    // Simulate saving download history and downloading file
    const link = document.createElement("a");
    link.href = image.duong_dan_anh_nho;
    link.download = image.tieu_de || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageClick = (image) => {
    navigate("/about", { state: { image: image, favorites } });
  };

  const handleFavoriteClick = (image, e) => {
    e.stopPropagation();
    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some((fav) => fav.id === image.id);
      if (isFavorited) {
        return prevFavorites.filter((fav) => fav.id !== image.id);
      } else {
        return [...prevFavorites, image];
      }
    });
  };

  return (
    <>
      <section className="top-categories-1">
        <p className="left_content">
          Trang chủ <i className="bx bx-chevron-right"></i> Hình ảnh
          {selectedCategory && (
            <>
              <i className="bx bx-chevron-right"></i> {selectedCategory.ten}
            </>
          )}
        </p>
        <h1 className="heading-1">
          {location.state?.searchQuery
            ? `Kết quả tìm kiếm cho "${location.state.searchQuery}"`
            : "Hình ảnh và bộ sưu tập"}
        </h1>

        <div className="content">
          {loadingCategories ? (
            <p>Đang tải danh mục...</p>
          ) : (
            <div className="buttons left_content">
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

        <div className="container-categories-1 top left_content">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : images.length === 0 ? (
            <p>Không có hình ảnh nào.</p>
          ) : (
            images.slice(first, first + itemsPerPage).map((image) => (
              <div
                className="card-category-1"
                key={image.id}
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image.duong_dan_anh_nho}
                  alt={image.tieu_de}
                  width={350}
                  height={200}
                />
                <div className="overlay">
                  <i
                    className={`pi pi-heart${
                      favorites.some((fav) => fav.id === image.id) ? "-fill" : ""
                    } favorite-icon`}
                    onClick={(e) => handleFavoriteClick(image, e)}
                  ></i>
                  <span className={image.la_pro ? "badge-pro" : "badge-free"}>
                    {image.la_pro ? "Pro" : "Miễn phí"}
                  </span>
                  <button
                    className="download-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(image);
                    }}
                  >
                    Tải Hình ảnh
                  </button>
                  <p className="template-title">{image.tieu_de}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <Paginator
          first={first}
          rows={itemsPerPage}
          totalRecords={images.length}
          onPageChange={onPageChange}
        />
      </section>
    </>
  );
}

export default PngPage;
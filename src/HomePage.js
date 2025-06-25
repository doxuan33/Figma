import React, { useEffect, useRef, useState, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";

// Mock data for PowerPoints
const mockPowerpoints = [
  {
    id: 1,
    tieu_de: "Mẫu PowerPoint Lịch sử",
    duong_dan_anh_nho: "/img/ppt1.png",
    mien_phi: true,
  },
  {
    id: 2,
    tieu_de: "Mẫu PowerPoint Giáo dục",
    duong_dan_anh_nho: "/img/ppt2.png",
    mien_phi: false,
  },
  {
    id: 3,
    tieu_de: "Mẫu PowerPoint Kinh doanh",
    duong_dan_anh_nho: "/img/ppt3.png",
    mien_phi: true,
  },
  {
    id: 4,
    tieu_de: "Mẫu PowerPoint Công nghệ",
    duong_dan_anh_nho: "/img/ppt4.png",
    mien_phi: false,
  },
  {
    id: 5,
    tieu_de: "Mẫu PowerPoint Sáng tạo",
    duong_dan_anh_nho: "/img/ppt5.png",
    mien_phi: true,
  },
];

// Mock data for Images and Backgrounds
const mockImages = [
  {
    id: 1,
    tieu_de: "Hình ảnh Lễ Giáng sinh",
    duong_dan_anh_nho: "/img/noel-bg.png",
    mien_phi: true,
  },
  {
    id: 2,
    tieu_de: "Hình ảnh Ẩm thực",
    duong_dan_anh_nho: "/img/ad3.jpg",
    mien_phi: true,
  },
  {
    id: 3,
    tieu_de: "Hình ảnh Quang cảnh",
    duong_dan_anh_nho: "https://thuthuatnhanh.com/wp-content/uploads/2021/01/hinh-anh-sapa-dep-thung-lung-hung-vi.jpg",
    mien_phi: false,
  },
  {
    id: 4,
    tieu_de: "Hình ảnh Động vật",
    duong_dan_anh_nho: "https://img3.thuthuatphanmem.vn/uploads/2019/06/17/hinh-anh-dep-ngo-nghinh-ve-dong-vat_102855690.jpg",
    mien_phi: true,
  },
  {
    id: 5,
    tieu_de: "Hình ảnh Vườn hoa",
    duong_dan_anh_nho: "https://antimatter.vn/wp-content/uploads/2022/06/anh-bau-troi-va-hoa.jpg",
    mien_phi: false,
  },
];

// Mock data for Backgrounds
const mockBackgrounds = mockImages;

function HomePage() {
  const carouselRef = useRef(null);
  const sliderRef = useRef(null);
  const thumbnailRef = useRef(null);
  const timeRunning = 3000;
  const timeAutoNext = 7000;

  const [powerpoints, setPowerpoints] = useState([]);
  const [backgrounds, setBackgrounds] = useState([]);
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [loadingPowerpoints, setLoadingPowerpoints] = useState(true);
  const [loadingBackgrounds, setLoadingBackgrounds] = useState(true);
  const [carouselDirection, setCarouselDirection] = useState("");
  const [isSliding, setIsSliding] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const searchQuery = location.state?.searchQuery || "";
  const searchResults = useMemo(() => location.state?.searchResults || [], [location.state?.searchResults]);

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

  // Mock data loading
  useEffect(() => {
    if (searchResults.length > 0 && searchQuery) {
      const isPowerpointSearch = location.state?.selectedCategory?.value === 1;
      const isImageSearch = location.state?.selectedCategory?.value === 2;

      if (isPowerpointSearch) {
        setPowerpoints(searchResults.slice(0, 5));
        setImages(mockImages);
        setBackgrounds(mockBackgrounds);
      } else if (isImageSearch) {
        setImages(searchResults.slice(0, 5));
        setBackgrounds(searchResults.slice(0, 8));
        setPowerpoints(mockPowerpoints);
      }
    } else {
      setPowerpoints(mockPowerpoints);
      setImages(mockImages);
      setBackgrounds(mockBackgrounds);
    }
    setLoadingPowerpoints(false);
    setLoadingImages(false);
    setLoadingBackgrounds(false);
  }, [searchQuery, searchResults, location]); // Thêm location vào phụ thuộc

  // Carousel functionality
  useEffect(() => {
    const nextButton = document.getElementById("next");
    const prevButton = document.getElementById("prev");

    const handleNext = () => {
      if (!isSliding) showSlider("next");
    };
    const handlePrev = () => {
      if (!isSliding) showSlider("prev");
    };

    if (nextButton && prevButton) {
      nextButton.addEventListener("click", handleNext);
      prevButton.addEventListener("click", handlePrev);

      const autoSlide = setInterval(() => {
        if (!isSliding) showSlider("next");
      }, timeAutoNext);

      return () => {
        nextButton.removeEventListener("click", handleNext);
        prevButton.removeEventListener("click", handlePrev);
        clearInterval(autoSlide);
      };
    }
  }, [isSliding]);

  const showSlider = (type) => {
    if (!carouselRef.current || !sliderRef.current || !thumbnailRef.current) {
      console.warn("One or more refs are not attached to DOM elements yet.");
      return;
    }

    const sliderItems = sliderRef.current.children;
    const thumbnailItems = thumbnailRef.current.children;

    if (sliderItems.length === 0 || thumbnailItems.length === 0) {
      console.warn("No slider or thumbnail items available.");
      return;
    }

    setIsSliding(true);
    if (type === "next") {
      sliderRef.current.appendChild(sliderItems[0]);
      thumbnailRef.current.appendChild(thumbnailItems[0]);
      setCarouselDirection("next");
    } else {
      sliderRef.current.prepend(sliderItems[sliderItems.length - 1]);
      thumbnailRef.current.prepend(thumbnailItems[thumbnailItems.length - 1]);
      setCarouselDirection("prev");
    }

    setTimeout(() => {
      setCarouselDirection("");
      setIsSliding(false);
    }, timeRunning);
  };

  const handleItemClick = (item, type) => {
    if (type === "powerpoint") {
      navigate("/about", { state: { powerpoint: item, favorites } });
    } else if (type === "image" || type === "background") {
      navigate("/about", { state: { image: item, favorites } });
    }
  };

  const handleFavoriteClick = (item, e) => {
    e.stopPropagation();
    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some((fav) => fav.id === item.id);
      if (isFavorited) {
        return prevFavorites.filter((fav) => fav.id !== item.id);
      } else if (prevFavorites.length < 50) {
        return [...prevFavorites, item];
      }
      return prevFavorites;
    });
  };

  const handleClearSearch = () => {
    navigate("/", { state: {} });
    setPowerpoints(mockPowerpoints);
    setImages(mockImages);
    setBackgrounds(mockBackgrounds);
    setLoadingPowerpoints(false);
    setLoadingImages(false);
    setLoadingBackgrounds(false);
  };

  const blogs = [
    {
      img: "/img/blog_1.png",
      alt: "Imagen Blog 1",
      title: "Bộ mẫu Microsoft",
      description:
        "20,000 mẫu Ứng dụng Microsoft 365 miễn phí và cao cấp bao gồm Word, Excel, Powerpoint.",
    },
    {
      img: "/img/blog_2.png",
      alt: "Imagen Blog 2",
      title: "Bộ mẫu của Google",
      description:
        "Hỗ trợ các mẫu Google Workspace miễn phí và cao cấp trong Google Tài liệu, Trang tính, Trang trình bày.",
    },
    {
      img: "/img/blog_3.png",
      alt: "Imagen Blog 3",
      title: "Bộ mẫu Adobe",
      description:
        "70,000+ mẫu đám mây sáng tạo adobe miễn phí và cao cấp trong photoshop, illustrator, indesign, pdf.",
    },
  ];

  return (
    <>
      {/* Slider */}
      <section className="banner">
        <div className={`carousel ${carouselDirection}`} ref={carouselRef}>
          <div className="list" ref={sliderRef}>
            {[1, 2, 3, 4].map((index) => (
              <div className="item" key={index}>
                <img
                  src={`/img/blog-${index}.png`}
                  alt={`Slide ${index}`}
                  width={800}
                  height={400}
                  loading="lazy"
                  onError={(e) => (e.target.src = "/img/fallback-slide.png")}
                />
                <div className="content">
                  <div className="author">XPOINT</div>
                  <div className="title">Mẫu PowerPoint,</div>
                  <div className="title">Hình ảnh</div>
                  <div className="topic">TẢI MIỄN PHÍ</div>
                  <div className="des">
                    Cập nhật hình ảnh, mẫu thuyết trình mới nhất
                  </div>
                  <div className="buttons">
                    <button onClick={() => navigate("/ppt")}>XEM THÊM</button>
                    <button onClick={() => navigate("/login")}>ĐĂNG KÝ</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="thumbnail" ref={thumbnailRef}>
            {[1, 2, 3, 4].map((index) => (
              <div className="item" key={index}>
                <img
                  src={`/img/new-${index}.png`}
                  alt={`Thumbnail ${index}`}
                  width={200}
                  height={100}
                  loading="lazy"
                  onError={(e) => (e.target.src = "/img/fallback-thumbnail.png")}
                />
              </div>
            ))}
          </div>

          <div className="arrows">
            <button id="prev" disabled={isSliding}>
              &lt;
            </button>
            <button id="next" disabled={isSliding}>
              &gt;
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container container-features">
        {[
          { icon: "/img/feat-1.png", title: "Mẫu Powerpoint", to: "/ppt" },
          { icon: "/img/feat-2.png", title: "Giáo dục", to: "/ppt?category=Giáo dục" },
          { icon: "/img/feat-3.png", title: "Việc Kinh Doanh", to: "/ppt?category=Kinh doanh" },
          { icon: "/img/feat-4.png", title: "Tiếp Thị", to: "/ppt?category=Tiếp thị" },
          { icon: "/img/feat-5.png", title: "Đa Mục đích", to: "/ppt?category=Đa mục đích" },
        ].map((feature, index) => (
          <Link to={feature.to} className="card-feature" key={index}>
            <img
              src={feature.icon}
              alt={feature.title}
              className="icon"
              loading="lazy"
              onError={(e) => (e.target.src = "/img/fallback-feature.png")}
            />
            <div className="feature-content">
              <span>{feature.title}</span>
            </div>
          </Link>
        ))}
      </section>

      {/* PowerPoint Section */}
      <section className="top-categories">
        <h1 className="heading-1">
          {searchQuery && location.state?.selectedCategory?.value === 1
            ? `Kết quả tìm kiếm cho "${searchQuery}"`
            : "Mẫu PowerPoint thịnh hành"}
        </h1>
        {searchQuery && (
          <div className="content">
            <button onClick={handleClearSearch} className="clear-search-btn">
              Xóa tìm kiếm
            </button>
          </div>
        )}
        <div className="container-categories">
          {loadingPowerpoints ? (
            <p>Đang tải dữ liệu...</p>
          ) : powerpoints.length === 0 ? (
            <p>Không tìm thấy mẫu PowerPoint nào.</p>
          ) : (
            powerpoints.map((ppt) => (
              <div
                className="card-category"
                key={ppt.id}
                onClick={() => handleItemClick(ppt, "powerpoint")}
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
                  {ppt.mien_phi && <span className="badge-free">Miễn phí</span>}
                  <button className="download-btn">
                    <i className="bx bx-download"></i> PowerPoint
                  </button>
                  <p className="template-title">{ppt.tieu_de}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Images Section */}
      <section className="top-categories top">
        <h1 className="heading-1">Hình ảnh và bộ sưu tập</h1>
        <div className="container-categories">
          {loadingImages ? (
            <p>Đang tải dữ liệu...</p>
          ) : images.length === 0 ? (
            <p>Không tìm thấy hình ảnh nào.</p>
          ) : (
            images.map((category) => (
              <div
                className="card-category"
                key={category.id}
                onClick={() => handleItemClick(category, "image")}
              >
                <img
                  src={category.duong_dan_anh_nho}
                  alt={category.tieu_de}
                  className="template-img"
                  loading="lazy"
                  onError={(e) => (e.target.src = "/img/fallback-image.png")}
                />
                <div className="overlay">
                  <i
                    className={`pi pi-heart${
                      favorites.some((fav) => fav.id === category.id) ? "-fill" : ""
                    } favorite-icon`}
                    onClick={(e) => handleFavoriteClick(category, e)}
                  ></i>
                  {category.mien_phi && <span className="badge-free">Miễn phí</span>}
                  <button className="download-btn">
                    <i className="bx bx-download"></i> Download
                  </button>
                  <p className="template-title">{category.tieu_de}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Backgrounds Section */}
      <section className="top-categories top">
        <h1 className="heading-1">
          {searchQuery && location.state?.selectedCategory?.value === 2
            ? `Kết quả tìm kiếm cho "${searchQuery}"`
            : "Hình nền sáng tạo"}
        </h1>
        {searchQuery && (
          <div className="content">
            <button onClick={handleClearSearch} className="clear-search-btn">
              Xóa tìm kiếm
            </button>
          </div>
        )}
        <div className="container-categories">
          {loadingBackgrounds ? (
            <p>Đang tải dữ liệu...</p>
          ) : backgrounds.length === 0 ? (
            <p>Không tìm thấy hình nền nào.</p>
          ) : (
            backgrounds.slice(0, 4).map((bg) => (
              <div
                className="card-category-1"
                key={bg.id}
                onClick={() => handleItemClick(bg, "background")}
              >
                <img
                  src={bg.duong_dan_anh_nho}
                  alt={bg.tieu_de}
                  width={350}
                  height={200}
                  loading="lazy"
                  onError={(e) => (e.target.src = "/img/fallback-background.png")}
                />
                <div className="overlay">
                  <i
                    className={`pi pi-heart${
                      favorites.some((fav) => fav.id === bg.id) ? "-fill" : ""
                    } favorite-icon`}
                    onClick={(e) => handleFavoriteClick(bg, e)}
                  ></i>
                  {bg.mien_phi && <span className="badge-free">Miễn phí</span>}
                  <button className="download-btn">
                    Xem thêm về bộ sưu tập
                  </button>
                  <p className="template-title">{bg.tieu_de}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="container-categories top">
          {loadingBackgrounds ? (
            <p>Đang tải dữ liệu...</p>
          ) : backgrounds.length <= 4 ? (
            <p>Không có thêm hình nền để hiển thị.</p>
          ) : (
            backgrounds.slice(4, 8).map((bg) => (
              <div
                className="card-category-1"
                key={bg.id}
                onClick={() => handleItemClick(bg, "background")}
              >
                <img
                  src={bg.duong_dan_anh_nho}
                  alt={bg.tieu_de}
                  width={350}
                  height={200}
                  loading="lazy"
                  onError={(e) => (e.target.src = "/img/fallback-background.png")}
                />
                <div className="overlay">
                  <i
                    className={`pi pi-heart${
                      favorites.some((fav) => fav.id === bg.id) ? "-fill" : ""
                    } favorite-icon`}
                    onClick={(e) => handleFavoriteClick(bg, e)}
                  ></i>
                  {bg.mien_phi && <span className="badge-free">Miễn phí</span>}
                  <button className="download-btn">
                    Xem thêm về bộ sưu tập
                  </button>
                  <p className="template-title">{bg.tieu_de}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery">
        {[
          "https://images2.thanhnien.vn/Uploaded/hoangnam/2022_09_06/anh-4-1709.jpeg",
          "https://images2.thanhnien.vn/Uploaded/hoangnam/2022_09_06/anh-3-825.jpeg",
          "https://ben.com.vn/tin-tuc/wp-content/uploads/2021/06/mau-power-point-dep-6.jpg",
          "https://img.thuthuattinhoc.vn/uploads/2019/02/01/slide-dep-cho-thuyet-trinh_101043422.jpg",
          "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/cach-lam-Powerpoint-dep.png",
        ].map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Gallery Img${index + 1}`}
            className={`gallery-img-${index + 1}`}
            loading="lazy"
            onError={(e) => (e.target.src = "/img/fallback-gallery.png")}
          />
        ))}
      </section>

      {/* Blogs Section */}
      <section className="container blogs">
        <h1 className="heading-1">Cung cấp hỗ trợ cho nhiều định dạng tập tin</h1>
        <div className="container-blogs">
          {blogs.map((blog, index) => (
            <div className="card-blog" key={index}>
              <div className="container-img">
                <img
                  src={blog.img}
                  alt={blog.alt}
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
                <h3>{blog.title}</h3>
                <p>{blog.description}</p>
                <Link to="/about" className="btn-read-more">
                  Đọc thêm
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default HomePage;
import React, { useState, useEffect } from "react";
import "./AIPage.css";

function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [style, setStyle] = useState("Không có");
  const [numImages, setNumImages] = useState(1);
  const [creativity, setCreativity] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previousPrompts, setPreviousPrompts] = useState([]);

  // API key từ Pexels (bạn nên thay bằng key của riêng mình)
  const PEXELS_API_KEY = "AyYg4VZrnLttcybgCGjvNGiaAGkZgPIvriEzPETYnllIyBMaXRr7DJ8v";

  useEffect(() => {
    console.log("Hình ảnh đã cập nhật:", generatedImages);
  }, [generatedImages]);

  const getAspectRatioStyle = (ratio) => {
    switch (ratio) {
      case "1:1":
        return "1 / 1";
      case "2:3":
        return "2 / 3";
      case "3:2":
        return "3 / 2";
      default:
        return "1 / 1";
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Vui lòng nhập mô tả hình ảnh trước khi tìm!");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      let query = prompt;
      if (style !== "Không có") {
        query += ` ${style.toLowerCase()}`;
      }
      if (creativity) {
        query += " creative";
      }

      setPreviousPrompts((prev) => [...new Set([prompt, ...prev.slice(0, 4)])]);

      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${numImages}`,
        {
          method: "GET",
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Không thể lấy hình ảnh: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      const images = data.photos;

      if (!images || images.length === 0) {
        throw new Error("Không tìm thấy hình ảnh phù hợp!");
      }

      const formattedImages = images.map((img, index) => ({
        id: index,
        url: img.src.large,
        aspectRatio: aspectRatio, // Lưu tỷ lệ khung hình để dùng trong CSS
        download_url: img.src.original,
      }));

      setGeneratedImages(formattedImages);
    } catch (err) {
      console.error("Lỗi khi tìm hình ảnh:", err);
      setError(err.message || "Có lỗi xảy ra khi tìm hình ảnh. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleRandomGenerate = () => {
    const randomPrompts = ["cây xanh", "bầu trời", "lễ hội"];
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(randomPrompt);
    handleGenerate();
  };

  const handleSimilarGenerate = () => {
    if (previousPrompts.length === 0) {
      setError("Chưa có gợi ý trước đó để tìm tương tự!");
      return;
    }
    const lastPrompt = previousPrompts[0];
    setPrompt(lastPrompt);
    handleGenerate();
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setError("Tính năng tải ảnh lên hiện chưa được hỗ trợ!");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && prompt.trim()) {
      handleGenerate();
    }
  };

  const handleDownload = async (downloadUrl, id) => {
    try {
      // Gửi yêu cầu để lấy dữ liệu ảnh dưới dạng blob
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải ảnh xuống!");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hinh-anh-${id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Lỗi khi tải xuống:", err);
      setError("Không thể tải xuống hình ảnh. Vui lòng thử lại!");
    }
  };

  return (
    <div className="ai-page-container p-4 max-w-6xl mx-auto shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-2 text-center">
        Trình tạo hình ảnh AI miễn phí: Chuyển văn bản sang JPG
      </h1>
      <p className="text-gray-500 mb-6 text-center">
        Hiển thị hình ảnh chất lượng cao miễn phí dựa trên mô tả của bạn.
      </p>
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mô tả hình ảnh hoặc ý tưởng của bạn"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            className="hidden"
            id="upload-image"
          />
          <label
            htmlFor="upload-image"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 upload-button cursor-pointer bg-gray-200 px-3 py-1 rounded-lg text-gray-700 hover:bg-gray-300"
          >
            Tải lên
          </label>
        </div>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}
      <div className="options-section mb-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Tỷ lệ khung hình:</label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="p-2 border rounded-lg text-gray-700"
          >
            <option value="1:1">1:1</option>
            <option value="2:3">2:3</option>
            <option value="3:2">3:2</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Phong cách:</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="p-2 border rounded-lg text-gray-700"
          >
            <option value="Không có">Không có</option>
            <option value="Anime">Anime</option>
            <option value="Hình Minh Họa">Hình Minh Họa</option>
            <option value="Nhiếp ảnh">Nhiếp ảnh</option>
            <option value="Kết cấu 3D">Kết cấu 3D</option>
            <option value="Sang trọng">Sang trọng</option>
            <option value="Môi trường">Môi trường</option>
            <option value="Tông quan">Tông quan</option>
            <option value="Cổ điển">Cổ điển</option>
            <option value="Thời trang">Thời trang</option>
            <option value="Tăng cường">Tăng cường</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Số lượng hình ảnh:</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => setNumImages(num)}
                className={`px-3 py-1 border rounded-full ${
                  numImages === num ? "bg-blue-500 text-white" : "bg-white text-gray-700"
                } hover:bg-blue-100`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Mức độ sáng tạo:</label>
          <input
            type="checkbox"
            checked={creativity}
            onChange={() => setCreativity(!creativity)}
            className="toggle-checkbox"
          />
        </div>
        <button
          onClick={handleGenerate}
          className="generate-button px-4 py-2 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Hình ảnh tìm thấy:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
          {loading && (
            <p className="col-span-full text-center text-gray-500">
              Đang tìm kiếm hình ảnh, vui lòng chờ...
            </p>
          )}
          {!loading && generatedImages.length > 0 ? (
            generatedImages.map((img) => (
              <div
                key={img.id}
                className="relative generated-image-container"
                style={{ aspectRatio: getAspectRatioStyle(img.aspectRatio) }}
              >
                <img
                  src={img.url}
                  alt={`Hình ảnh tìm thấy ${img.id}`}
                  className="generated-image object-cover rounded-lg w-full h-full"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/512?text=Không+Tải+Được+Hình+Ảnh";
                    console.error(`Không tải được hình ảnh: ${img.url}`);
                  }}
                />
                <button
                  className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600"
                  onClick={() => handleDownload(img.download_url, img.id)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            !loading && (
              <p className="col-span-full text-center text-gray-500">
                Chưa tìm thấy hình ảnh nào.
              </p>
            )
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-3">
        <button
          onClick={handleRandomGenerate}
          className="text-blue-500 border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50 disabled:text-gray-400 disabled:border-gray-400 disabled:hover:bg-transparent"
          disabled={loading}
        >
          Tìm ngẫu nhiên
        </button>
        <button
          onClick={handleSimilarGenerate}
          className="text-blue-500 border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50 disabled:text-gray-400 disabled:border-gray-400 disabled:hover:bg-transparent"
          disabled={loading}
        >
          Tìm tương tự gợi ý trước đó
        </button>
      </div>
    </div>
  );
}

export default AIPage;
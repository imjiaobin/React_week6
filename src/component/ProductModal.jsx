import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({ tempProduct, modalType, getProducts, closeModal }) {
  const [tempProductData, setTempProductData] = useState(tempProduct);

  const fileInputRef = useRef(null); // 用於讓 input 回到空的狀態

  // 這邊切換的是傳入的tempProduct, 要在 useEffect中觸發才可以正確 CRUD
  useEffect(() => {
    setTempProductData(tempProduct);
  }, [tempProduct]);

  // modal 資料改變
  const handleProductModalChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTempProductData((pre) => ({
      ...pre,
      // [name]: value
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // modal 內多張圖片資料改變
  const handleModalImagesChange = (index, value) => {
    // index : 用來讀到我們要改變的陣列元素
    // value : 將圖片網址新值傳入
    setTempProductData((pre) => {
      const newImages = [...pre.imagesUrl];
      newImages[index] = value;
      return {
        ...pre,
        imagesUrl: newImages,
      };
    });
  };
  // 新增圖片
  const handleAddImage = () => {
    setTempProductData((pre) => {
      const newImages = [...pre.imagesUrl];
      newImages.push("");
      return {
        ...pre,
        imagesUrl: newImages,
      };
    });
  };
  // 刪除圖片
  const handleRemoveImage = () => {
    setTempProductData((pre) => {
      const newImages = [...pre.imagesUrl];
      newImages.pop();
      return {
        ...pre,
        imagesUrl: newImages,
      };
    });
  };

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);
      const res = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/upload`,
        formData,
      );
      // console.log(res.data.message)
      setTempProductData((pre) => ({
        ...pre,
        imageUrl: res.data.imageUrl,
      }));
    } catch (error) {
      alert("圖片新增失敗!");
      console.log(error.response);
    }
     finally {
    // 清掉檔名，讓 input 回到空狀態
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
  };
  // 新增/修改商品
  const updateProduct = async (id) => {
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";

    if (modalType === "edit") {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = "put";
    }

    const productData = {
      data: {
        ...tempProductData,
        origin_price: Number(tempProductData.origin_price),
        price: Number(tempProductData.price),
        is_enabled: tempProductData.is_enabled ? 1 : 0,
        imagesUrl: [...tempProductData.imagesUrl.filter((p) => p !== "")],
      },
    };

    try {
      const res = await axios[method](url, productData);
      // console.log(res.data.message);
      getProducts();
      closeModal();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      alert("商品資料更動失敗：" + errorMsg);
      console.log(err);
    }
  };
  // 刪除產品
  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
      );
      // console.log("產品刪除成功：", response.data);
      alert("產品刪除成功！");

      // 關閉 Modal 並重新載入資料
      closeModal();
      getProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      console.error("刪除失敗：", errorMsg);
      alert("刪除失敗：" + errorMsg);
    }
  };

  return (
    <div
      id="productModal"
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div
            className={`modal-header bg-${modalType === "delete" ? "danger" : "dark"} text-white`}
          >
            <h5 id="productModalLabel" className="modal-title">
              <span>
                {modalType === "delete"
                  ? "刪除商品"
                  : modalType === "edit"
                    ? "編輯商品"
                    : "新增商品"}
              </span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {modalType === "delete" ? (
              <p className="fs-4">
                確定要刪除
                <span className="text-danger">{tempProductData.title}</span>嗎？
              </p>
            ) : (
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="fileUpload" className="form-label">
                        上傳圖片
                      </label>
                      <input
                        ref={fileInputRef} 
                        type="file"
                        className="form-control"
                        name="fileUpload"
                        id="fileUpload"
                        accept=".jpg, .jpeg, .png"
                        onChange={(e) => {
                          uploadImage(e);
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        value={tempProductData.imageUrl}
                        onChange={handleProductModalChange}
                      />
                    </div>
                    {tempProductData.imageUrl && (
                      <img
                        className="img-fluid"
                        src={tempProductData.imageUrl}
                        alt="主圖"
                      />
                    )}
                  </div>
                  {tempProductData.imagesUrl.map((url, index) => (
                    <div key={index} className="mb-3">
                      <label className="form-label">輸入圖片網址</label>
                      <input
                        type="text"
                        className="form-control"
                        value={url}
                        placeholder={`圖片網址${index + 1}`}
                        onChange={(e) =>
                          handleModalImagesChange(index, e.target.value)
                        }
                      />
                      {url && (
                        <img
                          className="img-fluid mt-2"
                          src={url}
                          alt={`副圖${index + 1}`}
                        />
                      )}
                    </div>
                  ))}
                  <div>
                    <button
                      className="btn btn-outline-primary btn-sm d-block w-100"
                      onClick={() => handleAddImage()}
                    >
                      新增圖片
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-danger btn-sm d-block w-100"
                      onClick={() => handleRemoveImage()}
                    >
                      刪除圖片
                    </button>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      name="title"
                      value={tempProductData.title}
                      disabled={modalType === "edit"}
                      onChange={handleProductModalChange}
                    />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        name="category"
                        value={tempProductData.category}
                        onChange={handleProductModalChange}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        name="unit"
                        value={tempProductData.unit}
                        onChange={handleProductModalChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        name="origin_price"
                        value={tempProductData.origin_price}
                        onChange={handleProductModalChange}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        name="price"
                        value={tempProductData.price}
                        onChange={handleProductModalChange}
                      />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      name="description"
                      value={tempProductData.description}
                      onChange={handleProductModalChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      id="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      name="content"
                      value={tempProductData.content}
                      onChange={handleProductModalChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                        name="is_enabled"
                        checked={!!tempProductData.is_enabled}
                        onChange={handleProductModalChange}
                      />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-check-label" htmlFor="size">
                      尺寸
                    </label>
                    <select
                      id="size"
                      name="size"
                      className="form-select"
                      aria-label="Default select example"
                      value={tempProductData.size}
                      onChange={handleProductModalChange}
                    >
                      <option value="">請選擇</option>
                      <option value="lg">大張</option>
                      <option value="md">一般</option>
                      <option value="sm">小張</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            {modalType === "delete" ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  deleteProduct(tempProductData.id);
                }}
              >
                刪除
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                  onClick={closeModal}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    updateProduct(tempProductData.id);
                  }}
                >
                  確認
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;

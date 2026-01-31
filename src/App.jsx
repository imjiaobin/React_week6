import axios from "axios";
import { useState, useEffect, useRef } from "react";
import "./assets/style.css";
import * as bootstrap from "bootstrap";
import ProductModal from './component/ProductModal'
import Pagination from "./component/Pagination";
import Login from "./views/Login";
import ProductList from "./views/ProductList";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
  size:""
};
// 1. 頁面載入
//    - 檢查 Cookie Token
//    - 驗證管理員權限
//    - 載入產品列表

// 2. 使用者操作
//    - 點擊「新增 / 編輯 / 刪除」
//    - 設定 modalType
//    - 開啟對應 Modal

// 3. Modal 操作
//    - 編輯表單狀態（templateData）
//    - 送出後呼叫對應 API
//    - 成功後關閉 Modal 並重新載入資料

function App() {
  
  // useState -----------------------------------------------------------------
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("create");
  const [pagination, setPagination] = useState({});

  // useRef -----------------------------------------------------------------
  const productModalRef = useRef(null);

  // 頁面API -----------------------------------------------------------------
  // 取得頁面商品資料
  const openModal = (product, type) => {
    console.log("觸發 openModal");
    console.log(product);
    console.log(type);
    setModalType(type);
    setTempProduct(() => ({
      ...INITIAL_TEMPLATE_DATA,
    ...product,
    }));
    productModalRef.current.show();
  };
  // 關閉 Modal
  const closeModal = () => {
    productModalRef.current.hide();
  };
  // 打開 Modal
  const getProducts = async ( page = 1) => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect -----------------------------------------------------------------
  // 綁定驗證登入function
  useEffect(() => {
    // 取得 token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    if (token) {
      // 如果有取到 token 才塞到header
      // 設定 axios 預設 header
      axios.defaults.headers.common.Authorization = `${token}`;
    }
    // 驗證登入
    const checkLogin = async () => {
      try {
        const res = await axios.post(`${API_BASE}/api/user/check`);
        console.log(res.data);
        setIsAuth(true);
        getProducts();
      } catch (err) {
        console.log(err.response?.data.message);
        console.log("驗證登入失敗");
      }
    };
    checkLogin();
  }, []);

  // Modal用 
  useEffect(() => {
    // 建立modal實體
    productModalRef.current = new bootstrap.Modal("#productModal");

    // Modal 關閉時移除焦點
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
    });

  }, []);

  return (
    <>
      {isAuth ? (
        <div className="container">
          <div className="row mt-5">
            <div className="">
              <h2>產品列表</h2>
              <div className="text-end mt-4">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    openModal(INITIAL_TEMPLATE_DATA, "create");
                  }}
                >
                  建立新的產品
                </button>
              </div>
              <ProductList products={products} openModal={openModal} getProducts={getProducts}/>
            </div>
          </div>
        </div>
      ) : (
        <Login setIsAuth={setIsAuth} getProducts={getProducts}/>
      )}
      <ProductModal 
        tempProduct={tempProduct}
        modalType = {modalType}
        getProducts={getProducts}
        closeModal={closeModal}
      />
      {isAuth && pagination?.total_pages > 1 && (
        <Pagination pagination={pagination} onChangePage={getProducts} />
      )}
    </>
  );
}

export default App;

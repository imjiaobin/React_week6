import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { convertMoney } from "../../utils/common";
import { RotatingLines } from "react-loader-spinner";
import { emailValidation, telValidation, userValidation } from "../../utils/validation";
import * as bootstrap from "bootstrap";
import SingleProductModal from "../../component/SingleProductModal";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState();
  const [loadingProductId, setloadingProductId] = useState(null);
  const [loadingCartId, setloadingCartId] = useState(null);
  // 建立 useRef
  const productModalRef = useRef(null);

  const EMPTY_CART = { carts: [], total: 0, final_total: 0 };

  // 商品列表區塊 =================================================
  // 取得產品列表
  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
      const { products } = response.data;
      // console.log(products);
      setProducts(products);
    } catch (error) {
      console.log("取得商品資料失敗:" + error.respons?.message);
      alert("取得商品資料失敗!請重新登入或請洽客服 : 00-1234-5678");
    }
  };
  // 查看詳情
  const getProduct = async (productId) => {
    setloadingProductId(productId);
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/product/${productId}`,
      );
      // console.log(response.data.product);
      setProduct(response.data.product);
    } catch (error) {
      console.log("取得商品詳細資料失敗:" + error.response?.data.message);
      alert("取得商品詳細資料失敗!請重新登入或請洽客服 : 00-1234-5678");
    } finally {
      setloadingProductId(null);
    }
    // openModal();
  };
  // 加入購物車
  const addProduct = async (productId, productQty = 1) => {
    setloadingProductId(productId);
    const data = {
      product_id: productId,
      qty: productQty,
    };

    // console.log(data)

    try {
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });
      // console.log(response.data.data);
      const { title } = response.data.data.product;
      alert(`${title} x ${productQty}加入購物車!`);
      getCart();
    } catch (error) {
      console.log("加入購物車失敗:" + error);
      alert("加入購物車失敗: " + error.response?.data.message);
      getCart();
    } finally {
      setloadingProductId(null);
    }
  };

  // useEffect => 取得商品資料
  useEffect(() => {
    getProducts();
  }, []);

  // 購物車區塊 =================================================
  // 取得購物車資料
  const getCart = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      // console.log(response.data.data);
      setCart(response.data.data);
    } catch (error) {
      alert("加入購物車失敗: " + error.response?.data.message);
    }
  };
  // 修改購物車數量
  const updateProduct = async (cartId, productId, productQty = 1) => {
    try {
      const data = {
        product_id: productId,
        qty: productQty,
      };
      const response = await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        { data },
      );
      setCart(response.data.data);
      // console.log("已更新購物車:" + response);
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
        // console.log(response.data.data);
        setCart(response.data.data);
        getCart();
      } catch (error) {
        alert("加入購物車失敗: " + error.response?.data.message);
      }
    } catch (error) {
      console.log(error.resposne?.data.message);
    }
  };
  // 刪除購物車一筆商品
  const deleteProduct = async (cartId) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
      );
      // console.log("已刪除項目:" + response);
      getCart();
    } catch (error) {
      console.log(error.response.data);
    }
  };
  // 清空購物車
  const deleteCart = async () => {
    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      getCart();
    } catch (error) {
      console.log(error.response.data);
    }
  };
  // useEffect => 取得購物車資料
  useEffect(() => {
    getCart();
  }, []);

  // 結帳表單區塊 =================================================
  // 表單驗證
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      tel: "",
      address: "",
      message: "",
    },
  });
  // 表單提交
  const onSubmit = async (formData) => {
    console.log(formData);
    try {
      const data = {
        user: formData,
        message: formData.message,
      };
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data,
      });
      console.log(res.data);
      reset(); // 表單清空
      getCart(); // 重新取得表單
    } catch (error) {
      console.log(error);
      alert("結帳表單提交失敗!");
    }
  };

  // Modal 區塊 =================================================

  useEffect(() => {
    const el = document.getElementById("productModal");
    if (!el) return;

    productModalRef.current = new bootstrap.Modal(el);

    const handler = () => {
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
    };

    el.addEventListener("hide.bs.modal", handler);

    return () => {
      el.removeEventListener("hide.bs.modal", handler);
      productModalRef.current?.dispose();
      productModalRef.current = null;
    };
  }, []);
  useEffect(() => {
    if (product) {
      openModal();
    }
  }, [product]);
  const openModal = () => {
    productModalRef.current.show();
  };
  const closeModal = () => {
    productModalRef.current.hide();
  };
  return (
    <>
      <div className="container">
        {/* 產品列表 */}
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ width: "200px" }}>
                  <div
                    style={{
                      height: "100px",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage: `url(${product.imageUrl})`,
                    }}
                  ></div>
                </td>
                <td>{product.title}</td>
                <td>
                  <del className="h6">原價：{product.origin_price}</del>
                  <div className="h5">特價：{product.price}</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => getProduct(product.id)}
                      disabled={loadingProductId === product.id}
                    >
                      {loadingProductId === product.id ? (
                        <RotatingLines color="grey" width={80} height={16} />
                      ) : (
                        "查看更多"
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => addProduct(product.id)}
                      disabled={loadingProductId === product.id}
                    >
                      {loadingProductId === product.id ? (
                        <RotatingLines color="grey" width={80} height={16} />
                      ) : (
                        "加入購物車"
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 購物車列表區塊 */}
        <h2>購物車列表</h2>
        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => {
              deleteCart();
            }}
          >
            清空購物車
          </button>
        </div>
        {/* 購物車列表 */}
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">品名</th>
              <th scope="col">數量/單位</th>
              <th scope="col">小計</th>
            </tr>
          </thead>
          <tbody>
            {cart?.carts?.map((cartItem) => {
              return (
                <tr key={cartItem.product_id}>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteProduct(cartItem.id)}
                    >
                      刪除
                    </button>
                  </td>
                  <th scope="row" className="text-start ps-5">
                    {cartItem.product.title}
                  </th>
                  <td>
                    <div className="input-group input-group-sm mb-3">
                      <input
                        type="number"
                        className="form-control"
                        defaultValue={cartItem.qty}
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        min="0"
                        onBlur={(e) => {
                          const num = e.target.value;

                          // 空值或非數字：回復原本 qty，避免一清空就被當 0 刪掉
                          if (num === "" || Number.isNaN(Number(num))) {
                            e.target.value = cartItem.qty;
                            return;
                          }

                          const qty = Number(num);

                          // 數量為0直接刪除該筆
                          if (qty <= 0) {
                            deleteProduct(cartItem.id);
                            return;
                          }

                          // 數量沒變就不打 API
                          if (qty === cartItem.qty) return;

                          updateProduct(cartItem.id, cartItem.product_id, qty);
                        }}
                      />
                      <span
                        className="input-group-text"
                        id="inputGroup-sizing-sm"
                      >
                        {cartItem.product.unit}
                      </span>
                    </div>
                  </td>
                  <td className="text-end">
                    $ {convertMoney(cartItem.final_total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td className="text-end" colSpan="3">
                總計
              </td>
              <td className="text-end">
                $ {convertMoney(cart?.final_total ?? 0)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* 結帳表單區塊 */}
        <div className="my-5 row justify-content-center">
          <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="請輸入 Email"
                {...register("email", emailValidation)}
              />
              {errors.email ? (
                <p className="text-danger"> {errors.email.message} </p>
              ) : (
                ""
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                使用者名稱
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                placeholder="請輸入使用者名稱"
                {...register("name", userValidation)}
              />
              {errors.name ? (
                <p className="text-danger"> {errors.name.message} </p>
              ) : (
                ""
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人電話
              </label>
              <input
                id="tel"
                name="tel"
                type="tel"
                className="form-control"
                placeholder="請輸入手機號碼"
                {...register("tel", telValidation)}
              />
              {errors.tel ? (
                <p className="text-danger"> {errors.tel.message} </p>
              ) : (
                ""
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                收件人地址
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="form-control"
                placeholder="請輸入地址"
                {...register("address", {
                  required: "請輸入地址",
                })}
              />
              {errors.address ? (
                <p className="text-danger">{errors.address.message}</p>
              ) : (
                ""
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea
                id="message"
                className="form-control"
                cols="30"
                rows="10"
                {...register("message")}
              ></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger">
                送出訂單
              </button>
            </div>
          </form>
        </div>

        {/* Modal區塊 */}
        <SingleProductModal
          product={product}
          addProduct={addProduct}
          closeModal={closeModal}
        />
      </div>
    </>
  );
}

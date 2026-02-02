import { useState, useEffect } from "react";
import axios from "axios";
import { convertMoney } from '../../utils/common';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function Cart() {
  const [cart, setCart] = useState([]);
  const EMPTY_CART = { carts: [], total: 0, final_total: 0 };

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
        // console.log(response.data.data);
        setCart(response.data.data);
      } catch (error) {
        alert("加入購物車失敗: " + error.response?.data.message);
      }
    };
    getCart();
  }, []);

  // 修改商品數量
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
      } catch (error) {
        alert("加入購物車失敗: " + error.response?.data.message);
      }
    } catch (error) {
      console.log(error.resposne?.data.message);
    }
  };

  // 刪除一筆商品
  const deleteProduct = async (cartId) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
      );
      // console.log("已刪除項目:" + response);
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
        // console.log(response.data.data);
        console.log(response)
        setCart(response.data.data);
      } catch (error) {
        alert("加入購物車失敗: " + error.response?.data.message);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  // 清空購物車
  const deleteCart = async () => {
    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
        console.log(response)
        setCart(response.data.data);
        // console.log(response.data.data);
      } catch (error) {
        alert("加入購物車失敗: " + error.response?.data.message);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="container">
      <h2>購物車列表</h2>
      <div className="text-end mt-4">
        <button 
            type="button" 
            className="btn btn-outline-danger"
            onClick = {() => {deleteCart()}}
        >
          清空購物車
        </button>
      </div>
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
                      onBlur={(e) =>
                        updateProduct(
                          cartItem.id,
                          cartItem.product_id,
                          Number(e.target.value),
                        )
                      }
                    />
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {cartItem.product.unit}
                    </span>
                  </div>
                </td>
                <td className="text-end">$ { convertMoney(cartItem.final_total) }</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end" colSpan="3">
              總計
            </td>
            <td className="text-end">$ { convertMoney(cart?.final_total ?? 0) }</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

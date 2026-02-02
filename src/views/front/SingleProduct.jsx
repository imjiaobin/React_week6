import { useState, useEffect } from "react";
import { useParams } from "react-router"
import axios from 'axios';

export default function SingleProduct(){

    const API_BASE = import.meta.env.VITE_API_BASE;
    const API_PATH = import.meta.env.VITE_API_PATH;

    // 這邊解構出來的參數，必須要和router中設定的一樣
    // 而不是 Products 元件的 productId
    const { id } = useParams();

    const [product, setProduct] = useState();

    // console.log(id);

    useEffect(()=>{

        const getProduct = async () => {
           try {
                const response = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
                // console.log(response.data.product);
                setProduct(response.data.product);
            } 
            catch (error) {
                console.log("取得商品詳細資料失敗:" + error.response?.data.message);
                alert("取得商品詳細資料失敗!請重新登入或請洽客服 : 00-1234-5678");
            }
        }

        getProduct(id)

    },[ id, API_BASE, API_PATH ]);

    const addProduct = async (productId, productQty=1) => {

        const data = {
            product_id: productId,
            qty: productQty,
        }

        // console.log(data)

        try {
            const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, { data });
            // console.log(response.data.data);
            const { title } = response.data.data.product;
            alert(`${title} x ${productQty}加入購物車!`);
        } catch (error) {
            console.log("加入購物車失敗:" + error);
            alert('加入購物車失敗: ' + error.response?.data.message)
        }
    }

    return !product ? (<h2>查無此產品</h2>) : (
        <div className="contanier">
            <div className="" key={product.id}>
                <div className="card">
                    <img src={product.imageUrl} className="card-img-top img primary-image" alt={product.title} />
                    <div className="card-body">
                        <h5 className="card-title mb-4">{product.title}</h5>
                        <p className="card-text mb-4">{product.description}</p>
                        <p className="card-text">
                            ${product.price} / <small className="text-body-secondary">{product.unit}</small>
                        </p>
                        <button type='button' className='btn btn-primary' onClick={()=>{addProduct(product.id)}}>加入購物車</button>
                    </div>
                </div>
            </div>
        </div>
      
    )
}
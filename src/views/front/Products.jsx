
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router';
import { convertMoney } from '../../utils/common';
import axios from 'axios';

export default function Products(){

    const API_BASE = import.meta.env.VITE_API_BASE;
    const API_PATH = import.meta.env.VITE_API_PATH;

    const [products, setProducts] = useState([]);

    
    useEffect( () => {

        const getProducts = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
                const { products } = response.data; 
                // console.log(products);
                setProducts(products);
            } 
            catch (error) {
                console.log("取得商品資料失敗:" + error.respons?.message);
                alert("取得商品資料失敗!請重新登入或請洽客服 : 00-1234-5678");
            }
        }
        
        getProducts();

    }, [API_BASE, API_PATH] );

    const navigate = useNavigate();
    const handleProductDetail = (productId) => {
        navigate(`/product/${productId}`);
    }

    return(
        <div className="container">
            <div className="row">
                {
                    products.map( product => {
                        return(
                            <div className="col-md-4 mb-3" key={product.id}>
                                <div className="card">
                                    <img src={product.imageUrl} className="card-img-top img primary-image" alt={product.title} />
                                    <div className="card-body">
                                        <h5 className="card-title mb-4">{product.title}</h5>
                                        <p className="card-text mb-4">{product.description}</p>
                                        <p className="card-text">
                                            ${ convertMoney(product.price) } / <small className="text-body-secondary">{product.unit}</small>
                                        </p>
                                        <button type='button' className='btn btn-primary' onClick={()=>{handleProductDetail(product.id)}}>查看更多</button>
                                    </div>
                                </div>
                            </div>
                        )
                    } )
                }
            </div>
        </div>
    )
}
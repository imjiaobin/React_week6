import {  useState } from "react";

export default function SingleProductModal({ product, closeModal, addProduct }) {
  const [cartQty, setCartQty] = useState(1);
  const handleAddProduct = () => {
    if (!product) return;
    addProduct(product.id, cartQty);
    closeModal();
  };

  return (
    <div className="modal fade" id="productModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          {!product ? (
            <div className="modal-body py-5 text-center">載入中...</div>
          ) : (
            <>
              <div className="modal-header">
                <h5 className="modal-title">產品名稱：{product.title}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>

              <div className="modal-body">
                <img className="w-100" src={product.imageUrl} alt={product.title} />
                <p className="mt-3">產品內容：{product.content}</p>
                <p>產品描述：{product.description}</p>
                <p>
                  價錢：<del>原價 ${product.origin_price}</del>，特價：${product.price}
                </p>

                <div className="d-flex align-items-center gap-2">
                  <label style={{ width: 150 }}>購買數量：{cartQty}</label>

                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => setCartQty(pre => pre === 1 ? 1 : pre-1 )}
                  >
                    -
                  </button>

                  <input
                    className="form-control"
                    style={{ width: 90 }}
                    type="number"
                    value={cartQty}
                    onChange={(e) => setCartQty(Math.max(1, Number(e.target.value) || 1))}
                    min="1"
                    max="10"
                  />

                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => setCartQty(pre => pre+1 )}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleAddProduct}>
                  加入購物車
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
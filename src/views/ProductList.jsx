import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductList({products, openModal, getProducts}){
    // 複製商品
  const copyProduct = async (product) =>{
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";

    const copiedItem = {
      data: {
        ...product,
      },
    };

    try {
      const res = await axios[method](url, copiedItem);
      getProducts();
    } catch (error) {
      console.log(error);
    }
  }

    return(
        <table className="table">
                <thead>
                  <tr>
                    <td>分類</td>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>編輯</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                    products.map((item) => (
                      <tr key={item.id}>
                        <td>{item.category}</td>
                        <td>{item.title}</td>
                        <td>{item.origin_price}</td>
                        <td>{item.price}</td>
                        <td className={`${item.is_enabled && "text-success"}`}>
                          {item.is_enabled ? "啟用" : "未啟用"}
                        </td>
                        <td>
                          <div
                            className="btn-group btn-group-sm"
                            role="group"
                            aria-label="Small button group"
                          >
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() => {
                                openModal(item, "edit");
                              }}
                            >
                              編輯
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => {
                                openModal(item, "delete");
                              }}
                            >
                              刪除
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-success"
                              onClick={() => {
                                copyProduct(item);
                              }}
                            >
                             複製
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">尚無產品資料</td>
                    </tr>
                  )}
                </tbody>
              </table>
    )
}
export default ProductList
import {useState} from 'react';
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login({setIsAuth, getProducts}){
    const [loginForm, setLoginForm] = useState({
        username: "",
        password: "",
    });

    const handleLoginFormChange = (e) => {
        const { name, value } = e.target;
        setLoginForm((pre) => ({
          ...pre,
          [name]: value,
        }));
      };
    
    // 登入 function
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(`${API_BASE}/admin/signin`, loginForm);

      const { token, expired } = res.data;
      // 儲存 Token 到 Cookie
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;

      // 設定 axios 預設 header
      axios.defaults.headers.common.Authorization = `${token}`;

      // 登入成功就將 isAuth 設定為 true
      setIsAuth(true);
      // 登入成功就載入 user 的 產品列表
      getProducts();
    } catch (err) {
      console.log(err.response);
      alert("登入失敗, 請確認帳號與密碼是否正確!");
      setIsAuth(false);
    }
  };

    return(
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleLogin}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    name="username"
                    value={loginForm.username}
                    onChange={handleLoginFormChange}
                    required
                    autoFocus
                    autoComplete="email"
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginFormChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
        </div>
    )
}
export default Login
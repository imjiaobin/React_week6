import { useState } from "react";
import { useForm } from "react-hook-form"
import { emailValidation, passwordValidation } from "../utils/validation";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login({ setIsAuth, getProducts }) {
  // const [loginForm, setLoginForm] = useState({
  //   username: "",
  //   password: "",
  // });

  const {
    register,
    handleSubmit,
    formState:{errors, isValid},
    reset
  } = useForm({
    mode:'onChange'
  });

  // const handleLoginFormChange = (e) => {
  //   const { name, value } = e.target;
  //   setLoginForm((pre) => ({
  //     ...pre,
  //     [name]: value,
  //   }));
  // };

  // 登入 function
  const handleLogin = async (formData) => {
    try {
      // e.preventDefault();
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      console.log(res.data)
      const { token, expired } = res.data;
      // 儲存 Token 到 Cookie
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;

      // 設定 axios 預設 header
      axios.defaults.headers.common.Authorization = `${token}`;

      // 登入成功就將 isAuth 設定為 true
      // setIsAuth(true);
      // 登入成功就載入 user 的 產品列表
      // getProducts();
    } catch (err) {
      console.log(err);
      alert("登入失敗, 請確認帳號與密碼是否正確!");
      reset();
      // setIsAuth(false);
    }
  };

  return (
    <div className="container login">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
        <div className="col-8">
          <form id="form" className="form-signin" onSubmit={handleSubmit(handleLogin)}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
                name="username"
                // value={loginForm.username}
                // onChange={handleLoginFormChange}
                {...register('username',emailValidation)}
                autoFocus
                autoComplete="email"
              />
              <label htmlFor="username">信箱</label>
              {
                errors.username? <p className="text-danger">{errors.username.message}</p> : ""
              }
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                name="password"
                // value={loginForm.password}
                // onChange={handleLoginFormChange}
                // required
                {...register('password', passwordValidation)}
              />
              <label htmlFor="password">Password</label>
              {
                errors.password? <p className="text-danger">{errors.password.message}</p> : ""
              }
            </div>
            <button className="btn btn-lg btn-primary w-100 mt-3" type="submit" disabled={!isValid}>
              登入
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;

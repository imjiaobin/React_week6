import { Link, Outlet } from "react-router"

export default function FrontEndLayout(){
    return (
        <>
            <header>
                <ul className="nav">
                    <li className="nav-item">
                        <Link className="nav-link" to='/'>首頁</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to='/products'>商品列表</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to='/cart'>購物車</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to='/checkout'>結帳</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to='/login'>登入</Link>
                    </li>
                </ul>
            </header>
            <main>
                <Outlet></Outlet>
            </main>
            <footer></footer>
        </>
    )
}

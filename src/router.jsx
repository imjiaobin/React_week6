import { createHashRouter } from "react-router";
import FrontEndLayout from "./layout/FrontendLayout";
import Home from "./views/front/Home";
import Cart from "./views/front/Cart";
import Products from "./views/front/Products";
import SingleProduct from "./views/front/SingleProduct";
import NotFound from "./views/front/NotFound";
import Checkout from "./views/front/Checkout";
import Login from "./views/Login";
 
 export  const router = createHashRouter([
    {
        path:'/',
        element:<FrontEndLayout />,
        children:[
            {
                index:true,
                element:<Home/>
            },
            {
                path:'cart',
                element:<Cart />
            },
            {
                path:'products',
                element:<Products />,
            },
            {
                path:'product/:id',
                element:<SingleProduct />
            },
            {
                path:'checkout',
                element:<Checkout />
            },
            {
                path:'login',
                element:<Login />
            },

        ]
    },
    {
        path:'*',
        element:<NotFound />
    }
 ]);
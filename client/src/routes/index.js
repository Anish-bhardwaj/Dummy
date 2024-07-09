import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import VerifyPassword from "../pages/VerifyPassword";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import AuthLayouts from "../layout";
import ForgotPassword from "../pages/ForgotPassword";
const router=createBrowserRouter([
{
    path:"/",
    element:<App/>,
    children:[
        {
            path:"register",
            element:<AuthLayouts><Register/></AuthLayouts>
        },
        {
            path:"email",
            element:<AuthLayouts><VerifyEmail/></AuthLayouts>
        },
        {
            path:"password",
            element:<AuthLayouts><VerifyPassword/></AuthLayouts>
        },
        {
            path:"forgot-password",
            element:<AuthLayouts><ForgotPassword/></AuthLayouts>
        }
        ,
        {
            path:"",
            element:<Home/>,
            children:[
                {
                    path:":userId",
                    element:<MessagePage/>
                }
            ]  

        },
    ]


}
])
export default router;
//Handle all routing between pages here
import { type RouteConfig, index, route } from "@react-router/dev/routes"; 

export default [
    index("Pages/homePage/home.tsx"),
    route("Login", "Pages/login/login.tsx"),
    route("SignUp", "Pages/signUp/signUp.tsx"),
    route("Dashboard", "Pages/dashboard/dashboard.tsx")
] satisfies RouteConfig;

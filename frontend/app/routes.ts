import { type RouteConfig, index, route } from "@react-router/dev/routes"; 

export default [
    index("Pages/homePage/home.tsx"),
    route("Login", "Pages/login/login.tsx"),
    route("SignUp", "Pages/signUp/signUp.tsx"),
    route("Timetable", "Pages/timetable/timetable.tsx"),
    route("Social", "Pages/social/social.tsx")
] satisfies RouteConfig;

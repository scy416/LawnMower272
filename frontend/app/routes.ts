import { type RouteConfig, index, route } from "@react-router/dev/routes"; 

export default [
    index("Pages/homePage/home.tsx"),
    route("Login", "Pages/auth/login.tsx"),
    route("SignUp", "Pages/auth/signUp.tsx"),
    route("Timetable", "Pages/timetable/timetable.tsx"),
    route("Social", "Pages/social/social.tsx"),
    route("Profile", "Pages/userProfile/mainProfile.tsx" ),
    route("Profile/edit", "Pages/userProfile/editProfile.tsx")
] satisfies RouteConfig;

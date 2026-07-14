import { type RouteConfig, index, route } from "@react-router/dev/routes"; 

export default [
    index("Pages/homePage/home.tsx"),
    route("Login", "Pages/auth/login.tsx"),
    route("SignUp", "Pages/auth/signUp.tsx"),
    route("Timetable", "Pages/timetable/timetable.tsx"),
    route("Social", "Pages/social/social.tsx"),
    route("Profile", "Pages/userProfile/mainProfile.tsx"),
    route("Profile/:userId", "Pages/userProfile/publicProfile.tsx"),
    route("Chat/:conversationId", "Pages/social/chat/chatRoom.tsx"),
    route("Inbox", "Pages/social/chat/inbox.tsx"),
    route("todo", "Pages/todo/todo.tsx"),
    route("forum", "Pages/forum/forum.tsx"),
    route("forum/:moduleCode", "Pages/forum/forumModule.tsx"),
] satisfies RouteConfig;

import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
    children: [
      {
        path: "/users",
        name: "Users",
        component: () => import("../views/Users.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
];

const router = new VueRouter({
  routes,
});

// 如果用户没有登陆，但是直接通过URL访问特定页面，需要重新导航到登录页面
// 所以这里添加了导航守卫

router.beforeEach((to, from, next) => {
  // 如果用户访问的是登录页，则直接放行
  if (to.path === "/login") return next();
  // 获取 token
  const token = window.sessionStorage.getItem("token");
  // 能获取到 token 就放行，获取不到 token 就强制跳转到登录页
  if (!token) return next("/login");
  // 放行
  next();
});

export default router;

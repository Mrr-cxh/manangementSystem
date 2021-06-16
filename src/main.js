import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/global.css";

import axios from "axios";
import "./plugins/element.js";

// 配置默认的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";

// axios 请求拦截器(预处理这次请求)
axios.interceptors.request.use((config) => {
  // config 是请求的配置
  // 为请求头对象，添加 token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem("token");
  // 最后必须 return config
  return config;
});

// 响应拦截器
axios.interceptors.response.use((res) => {
  return res.data;
});
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

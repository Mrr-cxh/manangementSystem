<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "app",
  components: {},
  data() {
    return {};
  },
  created() {
    // 关闭一上来就行的提示的
    // this.$notify.closeAll();
    // 如果能够获取到 userInfo 就跳转到首页，否则跳转到登录页
    /* if (sessionStorage.getItem("userInfo")) {
      this.$router.push("/");
    } else {
      // 当你在当前页使用 push 方法跳转到当前页会有警告，是不允许重复导航
      this.$route.path !== "/login" && this.$router.push("/login");
    }
    // console.log(JSON.parse(window.sessionStorage.getItem("userInfo")).token); */
  },
};
</script>

<style></style>

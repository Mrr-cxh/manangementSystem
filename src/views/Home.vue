<template>
  <!-- elementUI中的布局容器 container -->
  <el-container class="home">
    <!-- 头部 -->
    <el-header>
      <img src="../assets/logo.png" alt />
      <h1>电商后台管理系统</h1>
      <el-button type="danger" @click="quit">退出登录</el-button>
    </el-header>

    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠按钮 -->
        <div class="fold-button" @click="foldMenu">| | |</div>

        <!-- 导航菜单 -->
        <!-- unique-opened：elementUI中是否只保持一个子菜单展开的属性 -->
        <!-- collapse：elementUI中控制是否折叠的属性 -->
        <!-- collapse-transition：elementUI中控制折叠动画的属性 -->
        <!-- router：elementUI中是否支持使用 vue-router 模式的属性
        启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
        <!-- default-active	当前激活菜单的 index，值是String -->
        <!-- 比如在 /users 页面，但是对应的菜单并没有高亮显示，刷新页面也需要高亮显示 -->
        <!-- default-active	难点 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- index 如果相同的话，菜单会出现一起合上一起展开的效果 -->
          <!-- 且 index 的值要是字符串类型的 -->
          <el-submenu :index="`${item.id}`" v-for="item in menus" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图表 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文字 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="`/${childItem.path}`"
              v-for="childItem in item.children"
              :key="childItem.id"
              @click="keepPath(`/${childItem.path}`)"
            >
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu"></i>
                <!-- 文字 -->
                <span>{{ childItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 详细内容区域 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // 左侧菜单数据
      menus: [],
      // 解决 v-for 导致的一级菜单的 icon 都一样的问题
      iconsObj: {
        "125": "iconfont icon-wode1",
        "103": "iconfont icon-quanxian",
        "101": "iconfont icon-goods-copy",
        "102": "iconfont icon-dingdan",
        "145": "iconfont icon-tongji"
      },
      // elementUI 中菜单的折叠属性 collapse
      isCollapse: false,
      // 被激活的链接地址
      activePath: ""
    };
  },
  async created() {
    const res = await this.$axios.get("/menus");
    // 使用 async 和 await 可以拿到请求的数据
    if (res.meta.status === 200) {
      this.menus = res.data;
    } else {
      this.$message.error(res.meta.msg);
    }

    // 拿到activePath(菜单的高亮显示)
    this.activePath = window.sessionStorage.getItem("path");
  },
  methods: {
    // 退出登录
    quit() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    // 菜单的折叠与展开
    foldMenu() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存二级菜单的路径到 sessionStorage
    // 为了保证菜单高亮显示
    keepPath(path) {
      window.sessionStorage.setItem("path", path);
      this.activePath = path;
    }
  },
  computed: {}
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      letter-spacing: 10px;
    }
    img {
      width: 60px;
      height: 60px;
      margin-left: 50px;
    }
  }
  .el-aside {
    background-color: #545c64;
    .iconfont {
      margin-right: 10px;
    }
    .el-menu {
      border-right: none;
      // 解决导航右边1px的线
    }
    .fold-button {
      background-color: #3a4754;
      font-size: 10px;
      line-height: 24px;
      color: white;
      text-align: center;
      letter-spacing: 4px;
      cursor: pointer;
      user-select: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>

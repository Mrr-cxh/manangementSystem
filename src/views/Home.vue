<template>
  <!-- elementUI中的布局容器 container -->
  <el-container class="home">
    <!-- 头部 -->
    <el-header>
      <img src="../assets/logo.png" alt="" />
      <h1>电商后台管理系统</h1>
      <el-button type="danger" @click="quit">退出登录</el-button>
    </el-header>

    <!-- 页面主体 -->
    <el-container>
      <!-- 导航菜单 -->
      <el-aside width="200px">
        <!-- 菜单栏 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
        >
          <!-- 一级菜单 -->
          <!-- index 如果相同的话，菜单会出现一起合上一起展开的效果 -->
          <!-- 且 index 的值要是字符串类型的 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menus"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图表 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文字 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="childItem.id + ''"
              v-for="childItem in item.children"
              :key="childItem.id"
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

      <!-- 表格 -->
      <el-main>Main</el-main>
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
        "145": "iconfont icon-tongji",
      },
    };
  },
  async created() {
    const res = await this.$axios.get("/menus");
    if (res.meta.status === 200) {
      this.menus = res.data;
    } else {
      this.$message.error(res.meta.msg);
    }
  },
  methods: {
    quit() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less">
.home {
  height: 100%;
  .el-header {
    // background-color: #3e6485;
    display: flex;
    justify-content: space-between;
    align-items: center;
    display: flex;
    align-items: center;
    h1 {
      letter-spacing: 10px;
      // margin-left: -80px;
    }
    img {
      margin-left: 50px;
      width: 60px;
      height: 60px;
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
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>

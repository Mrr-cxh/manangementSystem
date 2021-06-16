<template>
  <div class="home">
    <el-row class="header" type="flex" justify="space-between">
      <el-col :span="24">
        <!-- <div class="grid-content bg-purple-dark"></div> -->
        <el-col :span="8"><img src="../assets/logo.png" alt=""/></el-col>
        <el-col :span="8"> <h1>商城后台管理系统</h1></el-col>
        <el-col :span="8">
          <el-button type="danger" @click="quit">退出登录</el-button>
        </el-col>
      </el-col>
    </el-row>
    <div class="layout">
      <div class="menu">
        <el-radio-group v-model="isCollapse">
          <el-radio-button :label="false" v-show="isCollapse"
            >展开</el-radio-button
          >
          <el-radio-button :label="true" v-show="!isCollapse"
            >收起</el-radio-button
          >
        </el-radio-group>
        <el-menu
          default-active="1-4-1"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
        >
          <el-submenu index="1">
            <template slot="title">
              &nbsp;<i class="iconfont icon-wode1"></i>&nbsp;&nbsp;
              <span slot="title">用户管理</span>
            </template>
            <!-- <el-menu-item-group> -->
            <el-menu-item index="1-1" class="iconfont icon-menu-s">
              用户列表
            </el-menu-item>
            <!-- </el-menu-item-group> -->
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              &nbsp;<i class="iconfont icon-quanxian"></i>&nbsp;&nbsp;
              <span slot="title">权限管理</span>
            </template>
            <!-- <el-menu-item-group> -->
            <el-menu-item index="1-1" class="iconfont icon-menu-s">
              角色列表
            </el-menu-item>
            <!-- </el-menu-item-group> -->
            <!-- <el-menu-item-group> -->
            <el-menu-item index="1-2" class="iconfont icon-menu-s">
              权限列表
            </el-menu-item>
            <!-- </el-menu-item-group> -->
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              &nbsp;<i class="iconfont icon-goods-copy"></i>&nbsp;&nbsp;
              <span slot="title">商品管理</span>
            </template>
            <el-menu-item-group>
              <!-- <el-menu-item-group> -->
              <el-menu-item index="1-1" class="iconfont icon-menu-s">
                商品列表
              </el-menu-item>
              <!-- </el-menu-item-group> -->
              <!-- <el-menu-item-group> -->
              <el-menu-item index="1-2" class="iconfont icon-menu-s">
                分类参数
              </el-menu-item>
              <!-- </el-menu-item-group> -->
              <!-- <el-menu-item-group> -->
              <el-menu-item index="1-2" class="iconfont icon-menu-s">
                商品分类
              </el-menu-item>
              <!-- </el-menu-item-group> -->
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              &nbsp;<i class="iconfont icon-dingdan"></i>&nbsp;&nbsp;
              <span slot="title">订单管理</span>
            </template>
            <!-- <el-menu-item-group> -->
            <el-menu-item index="1-1" class="iconfont icon-menu-s">
              订单列表
            </el-menu-item>
            <!-- </el-menu-item-group> -->
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              &nbsp;<i class="iconfont icon-tongji"></i>&nbsp;&nbsp;
              <span slot="title">数据统计</span>
            </template>
            <!-- <el-menu-item-group> -->
            <el-menu-item index="1-1" class="iconfont icon-menu-s">
              数据报表
            </el-menu-item>
            <!-- </el-menu-item-group> -->
          </el-submenu>
          <!-- <el-menu-item index="6">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item> -->
        </el-menu>
      </div>
      <!-- @open="handleOpen" @close="handleClose" -->
      <router-view class="right" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      isCollapse: false,
    };
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
  .el-col {
    height: 100px;
    :last-of-type {
      text-align: right;
    }
    h1 {
      text-align: center;
    }
  }
  .el-button {
    margin-top: 26px;
    margin-right: 50px;
  }
  .header {
    height: 100px;
    background-color: white;
    img {
      display: block;
      margin: 0 auto;
    }
  }
  .layout {
    display: flex;
    /* .right {
      // width: 86%;
    } */
  }
  .menu {
    // width: 14%;
    .el-menu--collapse {
      width: 69px;
    }
    .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 0px;
    }
    .el-radio-button {
      width: 100px;
    }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 199px;
    min-height: 582px;
    // min-height: 182%;
  }
}
/* .home .layout .el-radio-button,
.home .layout .el-radio-button .is-active {
  width: 200px;
} */
</style>

<template>
  <div class="login">
    <div class="login-box">
      <!-- 头像 -->
      <div class="user-img">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!-- 登录表单 -->
      <el-form
        class="login-form"
        :model="user"
        :rules="loginRules"
        ref="loginRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-wode"
            v-model="user.username"
          ></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-mima"
            v-model="user.password"
          ></el-input>
        </el-form-item>

        <!-- 登录重置按钮 -->
        <el-form-item class="btns">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // 登录表单的数据绑定对象
      // 在 form 表单上用 :model 绑定
      user: {
        username: "admin",
        password: "123456",
      },
      // form 表单上用 :rules 绑定校验规则
      // form-item 使用 prop 接收校验规则
      // loginRules 是表单的验证规则
      loginRules: {
        // 用户名验证
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        // 密码验证
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  components: {},
  methods: {
    /* login() {
      this.$axios
        .post("/login", {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          if (res.meta.status === 200) {
            // res.data.password = this.password;
            // let userInfo = JSON.stringify(res.data);
            let token = JSON.stringify(res.data.token);
            sessionStorage.setItem("token", token);
            this.$router.push("/users");
            console.log(token);
            this.$notify({
              title: "成功",
              message: res.meta.msg,
              duration: 1500,
              type: "success",
            });
          } else {
            this.$notify.error({
              title: "错误",
              message: res.meta.msg,
              duration: 1500,
            });
          }
        });
    },
    reset() {
      console.log(11);
      this.username = "";
      this.password = "";
    }, */

    login() {
      // validate() 是表单进行校验的方法
      // valid 如果为真则校验通过，否则不通过
      this.$refs.loginRef.validate((valid) => {
        if (!valid) return;
        this.$axios
          .post("/login", {
            username: this.user.username,
            password: this.user.password,
          })
          .then((res) => {
            if (res.meta.status === 200) {
              this.$message.success(res.meta.msg);
              window.sessionStorage.setItem("token", res.data.token);
              this.$router.push("/");
            } else {
              this.$message.error(res.meta.msg);
            }
          });
      });
      // 保存 token 是因为除登陆之外的其他 API 接口，必须在登录之后才能访问
    },
    reset() {
      this.$refs.loginRef.resetFields();
      // resetFields() 是 elementUI 中表单自带的重置方法
    },
  },
};
</script>
<style lang="less" scoped>
.login {
  background-color: #4b79a1;
  height: 100%;
  .login-box {
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // 是根据盒子的大小来移动的
    // 第一个参数是横轴的 第二个参数是竖轴的
    .user-img {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: white;
      }
    }
    .login-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0px 30px;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>

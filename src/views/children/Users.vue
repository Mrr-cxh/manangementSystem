<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- clearable 可清空 @clear elementUI清空时触发的事件 -->
          <el-input placeholder="请输入内容" v-model="requestUser.query" clearable @clear="getUserInfo">
            <el-button slot="append" icon="el-icon-search" @click="getUserInfo"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <!-- stripe斑马纹 border带有纵向边框 -->
      <!-- :data 绑定数据源 -->
      <el-table :data="userList" border stripe>
        <!-- 序号列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- scope.row 拿到的是这一行的数据 -->
          <!-- elementUI 中表格有案例 -->
          <!-- 作用域插槽会覆盖掉 prop -->
          <!-- 带有 slot-scope 的作用域插槽 -->
          <!-- vue 2.6.0 起已被废弃 -->
          <!-- 难点 -->
          <template slot-scope="scope">
            <!-- {{scope.row.mg_state}} -->
            <!-- change 事件是 switch 自带的 -->
            <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 更新按钮 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="setRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <!-- size-change：每页显示条目个数改变时会触发 -->
      <!-- current-change：当前页数改变时会触发 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="requestUser.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="requestUser.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addUserDialogVisible"
        width="50%"
        @close="closeAddDialog"
      >
        <!-- 主体区域 -->
        <el-form :model="addUser" :rules="addUserRules" ref="addUserRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUser.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUser.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUser.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addUser.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserEvent">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 更新用户对话框 -->
      <el-dialog
        title="更新用户"
        :visible.sync="editUserDialogVisible"
        width="50%"
        @close="closeUserEditDialog"
      >
        <!-- 主体区域 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserEvent">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
        @close="CloseSetRoleDialog"
      >
        <div>
          <p>当前的用户：{{roleInfo.username}}</p>
          <p>当前的角色：{{roleInfo.role_name}}</p>
          <p>
            分配新角色：
            <el-select v-model="selectRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRoleEvent">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义添加时的校验规则
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const email = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (email.test(value)) {
        // 合法的
        // 直接返回 callback 代表成功
        // 返回时带 new Error 代表不成功
        return callback();
      } else {
        callback(new Error("请输入正确邮箱地址"));
      }
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const mobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (mobile.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入正确手机号"));
      }
    };
    return {
      // 请求数据时用到的参数
      requestUser: {
        // 查询参数
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 5
      },
      // 用户数据列表
      userList: [],
      // 用户总人数
      total: 0,
      // 添加用户对话框的显示与隐藏
      addUserDialogVisible: false,
      // 添加用户的表单数据
      addUser: { username: "", password: "", email: "", mobile: "" },
      // 添加用户的表单验证
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          // 通过 validator 指定具体的自定义校验规则
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 更新用户对话框的显示与隐藏
      editUserDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 更新用户的表单验证
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          // 通过 validator 指定具体的自定义校验规则
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      roleInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 选择器中和option中:value进行双向绑定的值
      selectRoleId: ""
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    // 获取数据
    async getUserInfo() {
      // get 请求 传参可以直接写到 ? 部分
      // 也可直接写在对象的第二个参数对象内，但需要写在对象内的 params 属性下
      const res = await this.$axios.get("/users", {
        params: this.requestUser
      });
      if (res.meta.status === 200) {
        this.userList = res.data.users;
        this.total = res.data.total;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    // pageSize(每页显示条目个数，支持 .sync 修饰符) 改变时会触发
    handleSizeChange(newSize) {
      this.requestUser.pagesize = newSize;
      this.getUserInfo();
    },
    // currentPage(当前页数，支持 .sync 修饰符) 改变时会触发
    handleCurrentChange(newPage) {
      this.requestUser.pagenum = newPage;
      this.getUserInfo();
    },
    // 将开关修改的状态同步到服务器
    async changeState(userInfo) {
      const res = await this.$axios.put(
        `/users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg);
      } else {
        userInfo.mg_state = !userInfo.mg_state;
        this.$message.error("设置状态失败");
      }
    },
    // 添加对话框的关闭重置事件
    closeAddDialog() {
      // 当对话框关闭的时候 将添加用户表单重置
      this.$refs.addUserRef.resetFields();
    },
    // 添加新用户
    addUserEvent() {
      // validate() 是表单进行预防校验的方法
      // valid 如果为真则校验通过，否则不通过
      this.$refs.addUserRef.validate(async valid => {
        if (!valid) return;

        // 通过了，可以发送添加用户的请求了
        const res = await this.$axios.post("/users", this.addUser);
        if (res.meta.status === 201) {
          this.$message.success(res.meta.msg);
          // 隐藏对话框
          this.addUserDialogVisible = false;
          // 刷新列表
          this.getUserInfo();
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    // 根据id展示编辑用户的对话框
    async showEditDialog(id) {
      this.editUserDialogVisible = true;
      const res = await this.$axios.get(`/users/${id}`);
      if (res.meta.status === 200) {
        this.editForm = res.data;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    // 更新对话框的关闭重置事件
    closeUserEditDialog() {
      this.$refs.editFormRef.resetFields();
    },
    // 根据id更新用户
    editUserEvent() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;

        // 通过了，可以发送更新用户的请求了
        const res = await this.$axios.put(`/users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        });
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg);
          // 隐藏对话框
          this.editUserDialogVisible = false;
          // 刷新列表
          this.getUserInfo();
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    // 根据id删除用户
    deleteUserById(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.delete(`/users/${id}`);
          if (res.meta.status === 200) {
            this.getUserInfo();
            this.$message.success(res.meta.msg);
          } else {
            this.$message.error(res.meta.msg);
          }
        })
        .catch(() => {
          this.$message({
            message: "已取消删除"
          });
        });
    },
    // 根据id展示分配角色的对话框
    async setRoleDialog(roleInfo) {
      this.roleInfo = roleInfo;

      // 获取所有的角色列表
      const res = await this.$axios.get("/roles");
      console.log(res.data);

      if (res.meta.status === 200) {
        this.rolesList = res.data;
      } else {
        this.$message.error(res.meta.msg);
      }

      this.setRoleDialogVisible = true;
    },
    // 分配角色事件
    async setRoleEvent() {
      if (this.selectRoleId) {
        const res = await this.$axios.put(`/users/${this.roleInfo.id}/role`, {
          rid: this.selectRoleId
        });
        if (res.meta.status === 200) {
          this.getUserInfo();
          this.setRoleDialogVisible = false;
          this.$message.success(res.meta.msg);
        } else {
          this.$message.error(res.meta.msg);
        }
      } else {
        this.$message.error("请选择要分配的角色");
      }
    },
    // 分配角色对话框的关闭重置事件
    CloseSetRoleDialog() {
      this.selectRoleId = "";
      this.roleInfo = {};
    }
  }
};
</script>
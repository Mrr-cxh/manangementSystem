<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图   -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(first,index) in scope.row.children"
              :key="first.id"
              :class="['bdbottom',index===0?'bdtop':'','vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="delRightById(scope.row,first.id)">{{first.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环，嵌套渲染二级权限 -->
                <el-row
                  v-for="(second,index) in first.children"
                  :key="second.id"
                  :class="[index===0?'':'bdtop','vcenter']"
                >
                  <!-- 左边，二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delRightById(scope.row,second.id)"
                    >{{second.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 右边，三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="third in second.children"
                      :key="third.id"
                      type="warning"
                      closable
                      @close="delRightById(scope.row,third.id)"
                    >{{third.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- {{scope.row}} -->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showRoleEditDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="delRoleById(scope.row.id)"
            >删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="small">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="closeAddDialog"
    >
      <!-- 主题区域 -->
      <el-form :model="addRole" :rules="addRoleRules" ref="addRoleRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleEvent">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 更新角色对话框 -->
    <el-dialog
      title="更新用户"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="closeRoleEditDialog"
    >
      <!-- 主体区域 -->
      <el-form :model="editRoleForm" :rules="addRoleRules" ref="editRoleRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleEvent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Roles",
  data() {
    return {
      // 所有角色列表数据
      rolesList: [],
      // 添加角色对话框的显示与隐藏
      addRoleDialogVisible: false,
      // 添加角色对象的表单数据
      addRole: { roleName: "", roleDesc: "" },
      // 添加用户的表单验证
      addRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 4, max: 15, message: "长度在 4 到 15 个字符", trigger: "blur" }
        ]
      },
      // 更新角色对话框的显示与隐藏
      editRoleDialogVisible: false,
      // 查询到的用户信息对象
      editRoleForm: {}
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取所有角色列表的数据
    async getRolesList() {
      const res = await this.$axios.get("/roles");
      if (res.meta.status === 200) {
        this.rolesList = res.data;
        console.log(res.data);
      } else {
        this.$message.err(res.meta.msg);
      }
    },
    // 添加角色对话框的关闭重置事件
    closeAddDialog() {
      this.$refs.addRoleRef.resetFields();
    },
    // 添加角色事件
    addRoleEvent() {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return false;
        // 通过了，可以发送添加角色的请求了
        const res = await this.$axios.post("/roles", this.addRole);
        if (res.meta.status === 201) {
          this.$message.success(res.meta.msg);
          // 隐藏对话框
          this.addRoleDialogVisible = false;
          // 刷新列表
          this.getRolesList();
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    // 根据id展示更新角色的对话框
    async showRoleEditDialog(id) {
      this.editRoleDialogVisible = true;
      const res = await this.$axios.get(`/roles/${id}`);
      if (res.meta.status === 200) {
        this.editRoleForm = res.data;
        console.log(this.editRoleForm);
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    // 更新角色事件
    editRoleEvent() {
      this.editRoleDialogVisible = true;
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) return false;
        // 通过了，可以发送更新角色的请求了
        const res = await this.$axios.put(
          `/roles/${this.editRoleForm.roleId}`,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        );
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg);
          // 隐藏对话框
          this.editRoleDialogVisible = false;
          // 刷新列表
          this.getRolesList();
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    // 更新角色对话框的关闭重置事件
    closeRoleEditDialog() {
      this.$refs.editRoleRef.resetFields();
    },
    // 根据id删除角色
    delRoleById(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.delete(`/roles/${id}`);
          if (res.meta.status === 200) {
            this.getRolesList();
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
    // 根据id删除角色指定权限
    delRightById(role, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // roles/:roleId/rights/:rightId
          const res = await this.$axios.delete(
            `/roles/${role.id}/rights/${rightId}`
          );
          if (res.meta.status === 200) {
            // this.getRolesList();
            // 解决了删除权限之后自动合上的问题
            // 把服务器返回的最新的全新直接赋值给当前角色的children属性
            // 这样可以防止整个列表的刷新，从而提升用户体验
            role.children = res.data;
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
    }
  }
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
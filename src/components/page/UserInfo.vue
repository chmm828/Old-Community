<template>
  <!-- 用户信息显示表格 -->
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-house" @click="$router.push('index')">首页</i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>个人信息管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card class="box-card">
      <el-table :data="userData" stripe style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="编号" align="center" />
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <el-avatar
              :size="35"
              v-if="scope.row.user_pic"
              :src=" `http://localhost:3000/${scope.row.user_pic}` "
            ></el-avatar>
            <el-avatar
              :size="35"
              v-else
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" :formatter="formatGenderType" align="center"></el-table-column>
        <el-table-column prop="account" label="账号" width="180" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="180" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180" align="center"></el-table-column>
        <el-table-column
          prop="createTime"
          width="180"
          label="注册时间"
          :formatter="formatDate"
          align="center"
        ></el-table-column>
        <el-table-column align="center" prop="status" label="账号状态" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === 0 ? 'success' : 'danger'"
              disable-transitions
            >{{scope.row.status === 0 ? '正常' : '禁用'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          1
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑个人信息</el-button>
            <el-button type="danger" size="mini" @click="updatePwdForm = true">修改密码</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑用户信息 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="editUserDate" ref="editUserDate" :rules="rules">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="editUserDate.username"></el-input>
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth" prop="user_pic">
          <div class="up-box">
            <el-upload
              :on-remove="handleRemove"
              ref="upload"
              class="avatar-uploader"
              action="/api/upload/upload"
              method="post"
              :show-file-list="false"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :auto-upload="true"
            >
              <img :src="`http://localhost:3000/${imageUrl}`" v-if="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div v-if="imageUrl">
            <i class="el-icon-delete" @click="hanleDeletePhoto">删除</i>
          </div>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-select v-model="editUserDate.status" placeholder="请选择活动区域">
            <el-option :value="0" label="男" />
            <el-option :value="1" label="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号" :label-width="formLabelWidth" prop="account">
          <el-input v-model="editUserDate.account" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="editUserDate.password" type="password"></el-input>
        </el-form-item>-->
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="editUserDate.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editUserDate.email"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clickCancel">取 消</el-button>
        <el-popconfirm
          @confirm="clickOk"
          confirm-button-text="好的"
          cancel-button-text="不用了"
          icon="el-icon-info"
          icon-color="red"
          title="确定修改用户信息吗？"
        >
          <el-button slot="reference">确定</el-button>
        </el-popconfirm>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="updatePwdForm">
      <el-form ref="form" :model="form" :rules="updatePwdFormRules" label-width="80px">
        <el-form-item prop="password" label="原始密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="新的密码">
          <el-input v-model="form.newPassword" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="checkPassword" label="确认密码">
          <el-input
            v-model="form.checkPassword"
            type="password"
            show-password
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="不用了"
            @confirm="handleUpdatePwd"
            icon="el-icon-info"
            icon-color="red"
            title="确定修改吗？"
          >
            <el-button type="primary" slot="reference">确定</el-button>
          </el-popconfirm>
          <el-button @click="hanleCancle()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
    
    <script>
export default {
  data() {
    var handleFindAccount = (rule, value, callback) => {
      if (value === undefined || value === "") {
        callback(new Error("请输入原始密码"));
      } else {
        const that = this;
        const a_id = sessionStorage.getItem("admin_id");
        if (a_id === null) {
          that.form.u_id = sessionStorage.getItem("user_id");
          that.$http
            .post("/api/updatePassword/findUserIsok", that.form)
            .then(res => {
              if (res.data.length === 0) {
                callback(new Error("原始密码不正确，重新输入"));
              } else {
                callback();
              }
            });
        } else {
          that.form.a_id = a_id;
          that.$http
            .post("/api/updatePassword/findAdminIsok", that.form)
            .then(res => {
              if (res.data.length === 0) {
                callback(new Error("原始密码不正确，重新输入"));
              } else {
                callback();
              }
            });
        }
      }
    };

    var validatePass = (rule, value, callback) => {
      if (value === undefined || value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.checkPassword !== "") {
          this.$refs.form.validateField("checkPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.newPassword) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };

    var checkphone = (rule, value, callback) => {
      // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!this.isCellPhone(value)) {
        // 引入methods中封装的检查手机格式的方法
        callback(new Error("请输入正确的手机号!"));
      } else {
        callback();
      }
    };
    //自定义的邮箱和手机验证规则
    var checkEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else if (!this.ischeckEmail(value)) {
        // 引入methods中封装的检查手机格式的方法
        callback(new Error("请输入正确的邮箱格式"));
      } else {
        callback();
      }
    };
    return {
      form: {
        pass: "",
        checkPass: ""
      },
      loading: false,
      imageUrl: null,
      editUserDate: {},
      userData: [], // 定义一个接收后要传过来的用户数据
      title: "",
      dialogFormVisible: false, // 编辑框弹窗
      updatePwdForm: false, // 修改密码弹窗
      formLabelWidth: "120px", // 弹窗宽度
      rules: {
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 2,
            max: 8,
            message: "长度2到8个字符",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输登录密码", trigger: "blur" },
          {
            min: 6,
            max: 32,
            message: "密码的长度在 6 到 32个字符",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            validator: checkphone,
            trigger: "blur",
            message: "请输入正确的手机号码"
          }
        ],
        email: [
          {
            // required: true,
            validator: checkEmail,
            trigger: "blur",
            message: "请输入正确邮箱，确保格式正确"
          }
        ],

        image: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (
                this.form.image === "" ||
                this.form.image === null ||
                this.form.image === undefined
              ) {
                callback(new Error("请上传用户头像"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      },
      updatePwdFormRules: {
        password: [
          { required: true, validator: handleFindAccount, trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ],
        newPassword: [
          { required: true, validator: validatePass, trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ],
        checkPassword: [
          { required: true, validator: validatePass2, trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // 首次加载时，获取后台用户的数据
    this.findUsetInfo();
  },
  methods: {
    findUsetInfo() {
      const userInfo = {
        u_id: sessionStorage.getItem("user_id")
      };
      this.loading = true;
      this.$http
        .post("/api/updatePassword/findUserInfo", userInfo)
        .then(res => {
          this.userData = res.data;
          this.loading = false;
        });
    },
    // 检查手机号
    isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    },
    // 检查邮箱
    ischeckEmail(val) {
      if (
        !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(val)
      ) {
        return false;
      } else {
        return true;
      }
    },
    //过滤时间格式
    formatDate(row, column) {
      // 获取单元格数据
      let data = row[column.property];
      if (data == null) {
        return null;
      }
      let dt = new Date(data);
      return (
        dt.getFullYear() +
        "-" +
        (dt.getMonth() + 1) +
        "-" +
        dt.getDate() +
        " " +
        dt.getHours() +
        ":" +
        dt.getMinutes() +
        ":" +
        dt.getSeconds()
      );
    },
    // 过滤性别，0 为男，1 为女
    formatGenderType(row, column) {
      if (row.sex === 0) {
        return "男";
      } else if (row.sex === 1) {
        return "女";
      } else {
        return "";
      }
    },
    // 属性即可开启该列的筛选，用来筛选 正常和禁止的用户
    filterTag(value, row) {
      return row.sex === value;
    },
    formatTag(row, column) {
      if (row.status === 0) {
        return "正常";
      } else if (row.status === 1) {
        return "禁用";
      } else {
        return "";
      }
    },
    // 分页
    // 每页显示的条数
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1;
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
    },
    // 编辑的
    handleEdit(row) {
      this.dialogFormVisible = true;
      this.editUserDate = row;
      this.title = "编辑用信息";
      this.imageUrl = row.user_pic;
    },
    // 确定按钮
    clickOk(e) {
      //this.$refs.upload.submit();
      //console.log(this.editUserDate);
      const values = this.editUserDate;
      this.$refs.editUserDate.validate(valid => {
        if (!valid) return this.$message.error("表单校验不通过，请检查后提交");
        this.$http.put("/api/user/updateUser", values).then(res => {
          console.log(res);
          if (res.data === "更新成功") {
            this.$message.success(res.data);
            this.dialogFormVisible = false;
            this.findUsetInfo();
          } else {
            this.imageUrl = null;
            this.$message.error(res.data);
          }
        });
      });
    },
    //点击取消
    clickCancel() {
      this.$refs.editUserDate.resetFields();
      this.dialogFormVisible = false;
      //  取消后再次查询
      this.imageUrl = null;
      this.editUserDate = {};
      this.findUsetInfo();
      console.log(this.$refs.form);
      //this.$refs.form.resetFields();
      this.form = {};
    },
    //  取消修改密码
    hanleCancle() {
      this.$refs.form.resetFields();
      this.updatePwdForm = false;
      this.form = {};
      this.findUsetInfo();
    },
    // 修改密码
    handleUpdatePwd() {
      this.$refs.form.validate(valid => {
        if (!valid) return this.$message.error("表单校验不通过，请检查后提交");
        this.form.u_id = sessionStorage.getItem("user_id");
        this.$http
          .put("/api/updatePassword/updateUserPassword", this.form)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg || "修改成功登录");
              this.$router.push("/login");
            } else {
              this.$message.error("修改失败");
            }
          });
      });
    },
    /**
     * 上传成功
     * res:返回的参数
     * file: 上传文件信息
     */
    handleSuccess(res, file) {
      //上传成功后,回显图片
      this.imageUrl = res.data.path;
      this.editUserDate.user_pic = res.data.path;
      console.log("上传成功", this.editUserDate);
    },
    /**
     * 上传之前 file可以判断文件类型 文件大小
     */
    beforeUpload(file) {
      let index = file.name.lastIndexOf(".");
      let suffix = file.name.substring(index + 1);
      console.log(file);
      // //判断图片格式
      if (suffix !== "jpg" && suffix !== "png" && suffix !== "jpeg") {
        this.$message.warning("请上jpg,jpeg,png格式的图片!");
        return false;
      }
      //判断文件大小,不能超过10M
      let size = file.size;
      if (size > 10 * 1024 * 1024) {
        this.$message.warning("上传的图片大小.不能超过10M!");
        return false;
      }
    },
    handleRemove(file, fileList) {
      console.log(this.userData);
    },
    hanleDeletePhoto() {
      //删除图片
      this.editUserDate.user_pic = null;
      this.imageUrl = null;
      console.log("=====>", this.userData);
    },
    handlePreview() {},
    hanleExceed() {
      this.$message.error("只能上传一张图片");
    }
  }
};
</script>
  <style scoped>
/* .el-upload--text {
     width: 178px !important;
     height: 178px !important;
   }
  ::v-deep  */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
  <style>
.el-upload--text {
  width: 178px !important;
  height: 178px !important;
}
</style>
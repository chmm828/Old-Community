<template>
  <!-- 用户信息显示表格 -->
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-house" @click="$router.push('index')">首页</i> 
        </el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card class="box-card">
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入姓名进行查找" v-model="queryInfo.queryString" @keyup.enter.native="findUserName" class="input-with-select" clearable>
            <el-button slot="append" icon="el-icon-search" @click="findUserName" />
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-refresh" style="margin-left:20px;" type="primary" @click="findUsetInfo">刷新</el-button>
        </el-col>
      </el-row>
      <el-table :data="userData" stripe style="width: 100%"  v-loading="loading">
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
        <el-table-column
          align="center"
          prop="status"
          label="账号状态"
          width="100"
          :filters="[{ text: '正常', value: 0 }, { text: '禁用', value: 1 }]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
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
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- //分页 -->
      <el-pagination
        v-if="total>0"
        @size-change="handlePageSize"
        @current-change="handlePageNumber"
        :current-page=" queryInfo.pageNumber"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
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
          <!-- <el-upload
            :on-exceed="hanleExceed"
            :limit="1"
            :on-change="handleChange"
            :on-remove="handleRemove"
            action="/api/upload/upload"
            method="post"
            class="upload-demo"
            :on-preview="handlePreview"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :auto-upload="false"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>-->
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-select v-model="editUserDate.sex " placeholder="请选择活动区域">
            <el-option :value="0" label="男" />
            <el-option :value="1" label="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号" :label-width="formLabelWidth" prop="account">
          <el-input v-model="editUserDate.account" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="editUserDate.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="editUserDate.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editUserDate.email"></el-input>
        </el-form-item>
        <el-form-item label="是否禁用" :label-width="formLabelWidth" prop="status">
          <el-select v-model="editUserDate.status" placeholder="请选择活动区域">
            <el-option :value="0" label="正常" />
            <el-option :value="1" label="禁用" />
          </el-select>
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
        <!-- <el-button type="primary" @click="clickOk">确 定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
  
  <script>

export default {
  data() {
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
      loading: false,
      //分页查询条件
      queryInfo: {
        //页码
        pageNumber: 1,
        //页数
        pageSize: 10,
        // 查询内容
        queryString: null
      },
      imageUrl: null,
      total: "",
      editUserDate: {},
      userData: [], // 定义一个接收后要传过来的用户数据
      title: "",
      dialogFormVisible: false, // 编辑框弹窗
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
      }
    };
  },
  created() {
    // 首次加载时，获取后台用户的数据
    this.findUsetInfo();
  },
  methods: {
    //页码改变事件
    handlePageNumber(newPageNumber) {
      //将分页的新数据赋值给分页参数
      this.queryInfo.pageNumber = newPageNumber;
      this.findUsetInfo();
    },
    //改变页数事件
    handlePageSize(newPageSize) {
      this.queryInfo.pageSize = newPageSize;
      this.findUsetInfo();
    },
    findUsetInfo() {
      this.loading = true
      this.findUseTotal();
      this.$http.post("/api/user/getUser", this.queryInfo).then(res => {
        this.userData = res.data;
        this.loading = false
      });
    },
    findUseTotal() {
      this.$http.post("/api/user/getUserTotal", this.queryInfo).then(res => {
        this.total = res.data.length || 0;
      });
    },
    findUserName() {
      this.loading = true;
      this.findUserNameTotal();
      this.$http
        .post("/api/user/findUserNamePage", this.queryInfo)
        .then(res => {
          this.userData = res.data || [];
          this.loading = false;
        });
    },
    findUserNameTotal() {
      this.$http.post("/api/user/findUserNameTotal" , this.queryInfo).then(res => {
        this.total = res.data.length || [];
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
      console.log(row);
      this.editUserDate = row;
      this.title = "编辑用户信息";
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
          // console.log(res);
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
    },
    /**
     * 上传成功
     * res:返回的参数
     * file: 上传文件信息
     */
    handleSuccess(res, file) {
      //上传成功后,回显图片
      this.imageUrl = res.data.path
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
    // handleChange(file, fileList) {
    //   console.log(file, fileList, URL.createObjectURL(file.raw));

    //   this.imageUrl = URL.createObjectURL(file.raw); //把图片做成一个路径显示
    // },
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
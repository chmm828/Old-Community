<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-house" @click="$router.push('index')">首页</i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>待办</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card class="box-card">
      <el-row>
        <el-col :span="6">
          <el-input
            placeholder="请输入编号进行查找"
            v-model="queryInfo.queryString"
            class="input-with-select"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="findAppIdPage" />
          </el-input>
        </el-col>
        <!-- <el-col :span="2">
              <el-button style="margin-left:20px;" @click="handleAddAdmin" type="primary">新建管理员</el-button>
        </el-col>-->
        <el-col :push="1" :span="2">
          <el-button
            icon="el-icon-refresh"
            style="margin-left:20px;"
            type="info"
            @click="findApplicationIsWaitPage"
          >刷新</el-button>
        </el-col>
      </el-row>
      <el-table :data="userData" stripe style="width: 100%" :loading="loading">
        <el-table-column prop="app_id" label="申请编号" align="center" />
        <el-table-column label="申请的社区" prop="h_name" width="100" align="center"></el-table-column>
        <el-table-column
          prop="address"
          show-overflow-tooltip
          label="社区住址"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" width="200"></el-table-column>
        <el-table-column prop="number" label="联系方式" width="180" align="center"></el-table-column>
        <el-table-column prop="opinion" label="备注" show-overflow-tooltip width="180" align="center"></el-table-column>
        <el-table-column
          prop="app_createTime"
          width="180"
          label="申请时间"
          :formatter="formatDate"
          align="center"
        ></el-table-column>
        <!-- <el-table-column
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
        </el-table-column>-->
        <!-- <el-table-column prop="a_name" label="审核人" width="180" align="center"></el-table-column> -->
        <!-- <el-table-column
            align="center"
            prop="role"
            label="角色"
            width="200"
            :filters="[{ text: '超级管理员', value: 'root' }, { text: '系统管理员', value: 'admin' }]"
            :filter-method="filterRole"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.role === 'root' ? 'success' : 'danger'"
                disable-transitions
              >{{scope.row.role === 'root' ? '超级管理员' : '系统管理员'}}</el-tag>
            </template>
        </el-table-column>-->
        <el-table-column label="操作" align="center" width="300">
          1
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              v-if="scope.row.app_status === 0"
              confirm-button-text="好的"
              cancel-button-text="不用了"
              @confirm="isCancel(scope.row)"
              icon="el-icon-info"
              icon-color="red"
              title="确定取消吗？"
            >
              <el-button type="warning" slot="reference" size="mini">帮取消申请</el-button>
            </el-popconfirm>
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
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="editUserDate" :model="editUserDate" label-width="80px" :rules="rules">
        <el-form-item label="所在社区" prop="h_id">
          <el-select v-model="editUserDate.h_id" placeholder="选择社区名字" style="width:100%;">
            <el-option
              v-for="(item,index) in homeList"
              :key="index"
              :label="item.h_name"
              :value="item.h_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="number">
          <el-input v-model="editUserDate.number" placeholder="请填写你的联系方式"></el-input>
        </el-form-item>
        <el-form-item label="住址" prop="address">
          <el-input type="textarea" v-model="editUserDate.address"></el-input>
        </el-form-item>
        <el-form-item label="补充说明">
          <el-input type="textarea" placeholder="填写补充说明" v-model="editUserDate.opinion"></el-input>
        </el-form-item>
        <el-form-item label="是否同意" :label-width="formLabelWidth" prop="status">
          <el-select v-model="editUserDate.app_status" placeholder="请选择">
            <el-option :value="0" disabled label="待审核" />
            <el-option :value="1" label="同意" />
            <el-option :value="2" label="不同意" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickCancel">取 消</el-button>
        <el-popconfirm
          @confirm="onSubmit"
          confirm-button-text="好的"
          cancel-button-text="不用了"
          icon="el-icon-info"
          icon-color="red"
          title="确定立即修改吗？"
        >
          <el-button type="primary" slot="reference">立即修改</el-button>
        </el-popconfirm>
      </span>
    </el-dialog>
    <!-- 新建管理员信息 -->
    <el-dialog :title="title" :visible.sync="newAdminFormVisible">
      <el-form :model="editUserDate" ref="editUserDate" :rules="rules">
        <el-form-item label="账号" :label-width="formLabelWidth" prop="a_account">
          <el-input v-model="editUserDate.a_account"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="a_name">
          <el-input v-model="editUserDate.a_name"></el-input>
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth" prop="admin_pic">
          <div class="up-box">
            <el-upload
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
        <el-form-item label="密码" show-password :label-width="formLabelWidth" prop="password">
          <el-input v-model="editUserDate.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="editUserDate.phone"></el-input>
        </el-form-item>
        <el-form-item label="是否禁用" :label-width="formLabelWidth" prop="status">
          <el-select v-model="editUserDate.status" placeholder="请选择">
            <el-option :value="0" label="正常" />
            <el-option :value="1" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
          <el-select v-model="editUserDate.role" placeholder="请选择">
            <el-option value="root" label="超级管理员" />
            <el-option value="admin" label="系统管理员" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clickCancel">取 消</el-button>
        <el-popconfirm
          @confirm="handleAddAdminOk"
          confirm-button-text="好的"
          cancel-button-text="不用了"
          icon="el-icon-info"
          icon-color="red"
          title="确定修改吗？"
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
    var handleFindAccount = (rule, value, callback) => {
      if (this.title === "编辑管理员信息") {
        callback();
      } else {
        const that = this;
        // that.$refs.form.validate((valid)=>{
        // 	if(valid){
        that.$http
          .post("/api/admin/findAdminAccountRepeat", that.editUserDate)
          .then(res => {
            console.log("=====", res);
            if (res.data != 0) {
              callback(new Error(res.data));
            } else {
              callback();
            }
          });
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
      //分页查询条件
      queryInfo: {
        //页码
        pageNumber: 1,
        //页数
        pageSize: 10,
        // 查询内容
        queryString: null
      },
      // 社区名称
      homeList: [],
      role: "管理员",
      isStatus: "正常",
      loading: false,
      imageUrl: null,
      total: "",
      editUserDate: {},
      userData: [], // 定义一个接收后要传过来的用户数据
      title: "",
      dialogFormVisible: false, // 编辑框弹窗
      newAdminFormVisible: false,
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
        a_account: [
          { required: true, validator: handleFindAccount, trigger: "blur" },
          { min: 3, max: 11, message: "长度在 3 到 11 个字符", trigger: "blur" }
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
        status: [
          {
            required: true,
            trigger: "blur",
            message: "请选择"
          }
        ],
        role: [
          {
            required: true,
            trigger: "blur",
            message: "请选择"
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
    this.findApplicationIsWaitPage();
  },
  methods: {
    //页码改变事件
    handlePageNumber(newPageNumber) {
      //将分页的新数据赋值给分页参数
      this.queryInfo.pageNumber = newPageNumber;
      this.findApplicationIsWaitPage();
    },
    //改变页数事件
    handlePageSize(newPageSize) {
      this.queryInfo.pageSize = newPageSize;
      this.findApplicationIsWaitPage();
    },
    findApplicationIsWaitPage() {
      const u_id = sessionStorage.getItem("user_id");
      this.queryInfo.u_id = u_id;
      this.loading = true;
      this.findApplicationIsWait();
      this.$http
        .post("/api/adminAppApi/findApplicationIsWaitPage", this.queryInfo)
        .then(res => {
          console.log("====>", res);
          this.userData = res.data;
          this.loading = false;
        });
    },
    // 未审核的
    findApplicationIsWait() {
      const u_id = sessionStorage.getItem("user_id");
      const userInfo = {
        u_id: u_id
      };
      this.$http
        .post("/api/adminAppApi/findApplicationIsWait", userInfo)
        .then(res => {
          this.total = res.data.length || 0;
        });
    },
    findAppIdPage() {
      this.queryInfo.u_id = sessionStorage.getItem("user_id");
      this.loading = true;
      this.finddAppIdTotal();
      this.$http
        .post("/api/adminAppApi/findAppIdPage", this.queryInfo)
        .then(res => {
          this.userData = res.data || [];
          this.loading = false;
        });
    },
    finddAppIdTotal() {
      this.queryInfo.u_id = sessionStorage.getItem("user_id");
      this.$http
        .post("/api/adminAppApi/findAppIdTotal", this.queryInfo)
        .then(res => {
          this.total = res.data.length || [];
        });
    },
    // 用户取消申请
    isCancel(row) {
      row.app_status = 3;
      row.a_id = sessionStorage.getItem('admin_id')
      row.agreeTime = new Date()
      this.$http
        .put("/api/adminAppApi/updateApplicationInfon", row)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success("取消成功");
            this.dialogFormVisible = false;
            this.findApplicationIsAlltPage();
          } else {
            this.$message.error("取消失败");
          }
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
    filterRole(value, row) {
      return row.role === value;
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
    // 新增加管理员
    handleAddAdmin() {
      this.newAdminFormVisible = true;
      this.editUserDate = {};
      this.title = "新增加管理员";
    },
    // 查找未禁用的社区
    findHome() {
      this.$http.post("/api/homeService/findHomeCatName").then(res => {
        this.homeList = res.data || [];
      });
    },
    handleAddAdminOk() {
      const values = this.editUserDate;
      this.$refs.editUserDate.validate(valid => {
        if (!valid) return this.$message.error("表单校验不通过，请检查后提交");
        this.$http.post("/api/admin/addAdminInfon", values).then(res => {
          console.log(res);
          if (res.data === "注册成功") {
            this.$message.success(res.data);
            this.newAdminFormVisible = false;
            this.findUsetInfo();
          } else {
            this.imageUrl = null;
            this.$message.error(res.data);
          }
        });
      });
    },
    // 编辑的
    handleEdit(row) {
      this.findHome();
      this.dialogFormVisible = true;
      this.editUserDate = row;
      this.title = "编辑申请单信息";
    },
    // 确定按钮
    onSubmit(e) {
      this.$refs.editUserDate.validate(valid => {
        if (!valid) return this.$message.error("表单校验不通过，请检查后提交");
        const a_id = sessionStorage.getItem('admin_id')
        this.editUserDate.a_id = a_id
        this.editUserDate.agreeTime = new Date()
        this.$http
          .put("/api/adminAppApi/updateApplicationInfon", this.editUserDate)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              this.dialogFormVisible = false;
              this.findApplicationIsWaitPage();
            } else {
              this.$message.error(res.data.msg);
            }
          });
      });
    },
    //点击取消
    clickCancel() {
      this.$refs.editUserDate.resetFields();
      this.dialogFormVisible = false;
      //  取消后再次查询
      this.editUserDate = {};
      this.findApplicationIsWaitPage();
      this.imageUrl = null;
    },
    /**
     * 上传成功
     * res:返回的参数
     * file: 上传文件信息
     */
    handleSuccess(res, file) {
      //上传成功后,回显图片
      this.imageUrl = res.data.path;
      this.editUserDate.admin_pic = res.data.path;
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
    hanleDeletePhoto() {
      //删除图片
      this.editUserDate.admin_pic = null;
      this.imageUrl = null;
      console.log("=====>", this.userData);
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
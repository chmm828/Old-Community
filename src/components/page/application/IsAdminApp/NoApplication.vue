<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-house" @click="$router.push('index')">首页</i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>拒绝的申请</el-breadcrumb-item>
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
            <el-button slot="append" icon="el-icon-search" @click="findApplicationIsNoOkPage" />
          </el-input>
        </el-col>
        <!-- <el-col :span="2">
          <el-button style="margin-left:20px;" @click="handleInsert" type="primary">新建申请</el-button>
        </el-col> -->
        <el-col :push="1" :span="2">
          <el-button
            icon="el-icon-refresh"
            style="margin-left:20px;"
            type="info"
            @click="findApplicationIsNoOkPage"
          >刷新</el-button>
        </el-col>
      </el-row>
      <el-table :data="userData" stripe style="width: 100%" :loading="loading">
        <el-table-column prop="app_id" label="申请编号" sortable align="center" fixed="left" />
        <el-table-column label="申请的社区" prop="h_name" width="100" align="center"></el-table-column>
        <el-table-column
          prop="address"
          show-overflow-tooltip
          label="社区住址"
          align="center"
          width="100"
        ></el-table-column>
        <!-- <el-table-column prop="phone" label="手机号" align="center" width="200"></el-table-column> -->
        <el-table-column prop="number" label="联系方式" width="180" align="center"></el-table-column>
        <el-table-column prop="opinion" label="备注" show-overflow-tooltip width="180" align="center"></el-table-column>
        <el-table-column
          sortable
          prop="app_createTime"
          width="180"
          label="申请时间"
          :formatter="formatDate"
          align="center"
        ></el-table-column>
        <el-table-column align="center" prop="app_status" label="申请状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.app_status === 0" type="primary" disable-transitions>待审核</el-tag>
            <el-tag v-else-if="scope.row.app_status === 1" type="success" disable-transitions>已通过</el-tag>
            <el-tag v-else-if="scope.row.app_status === 3" type="warning" disable-transitions>已取消</el-tag>
            <el-tag v-else type="danger" disable-transitions>已拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="a_name" label="审核人" width="180" align="center"></el-table-column>
        <el-table-column
          prop="agreeTime"
          width="180"
          label="审核时间"
          :formatter="formatDate"
          align="center"
        ></el-table-column>
        <!-- <el-table-column label="操作" align="center" width="300" fixed="right">
          <template slot-scope="scope">
            <el-popconfirm
              confirm-button-text="好的"
              cancel-button-text="不用了"
              @confirm="handleInsert(scope.row)"
              icon="el-icon-info"
              icon-color="red"
              title="确定重新申请吗？"
            >
              <el-button type="primary" slot="reference" size="mini">重新申请</el-button>
            </el-popconfirm>
          </template>
        </el-table-column> -->
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
          <el-input
            type="textarea"
            v-model="editUserDate.address"
            placeholder="请填写社区所在单元地址，包括门牌号"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="补充说明">
          <el-input
            type="textarea"
            maxlength="100"
            show-word-limit
            placeholder="填写补充说明"
            v-model="editUserDate.opinion"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
      </span>
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
      formLabelWidth: "120px", // 弹窗宽度
      rules: {
        h_id: [{ required: true, message: "所在社区不能空", trigger: "blur" }],
        address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
        number: [
          {
            required: true,
            validator: checkphone,
            trigger: "blur",
            message: "请输入正确的手机号码"
          }
        ]
      }
    };
  },
  created() {
    // 首次加载时，获取后台用户的数据
    this.findApplicationIsNoOkPage();
  },
  methods: {
    //页码改变事件
    handlePageNumber(newPageNumber) {
      //将分页的新数据赋值给分页参数
      this.queryInfo.pageNumber = newPageNumber;
      this.findApplicationIsNoOkPage();
    },
    //改变页数事件
    handlePageSize(newPageSize) {
      this.queryInfo.pageSize = newPageSize;
      this.findApplicationIsNoOkPage();
    },
    findApplicationIsNoOkPage() {
      const u_id = sessionStorage.getItem("user_id");
      this.queryInfo.u_id = u_id;
      this.loading = true;
      this.findApplicationIsNoOk();
      this.$http
        .post("/api/adminAppApi/findApplicationIsNoOkPage", this.queryInfo)
        .then(res => {
          // console.log("====>", res);
          this.userData = res.data;
          this.loading = false;
        });
    },
    // 全部记录的的总数
    findApplicationIsNoOk() {
      const u_id = sessionStorage.getItem("user_id");
      const userInfo = {
        u_id: u_id
      };
      this.$http
        .post("/api/adminAppApi/findApplicationIsNoOk", userInfo)
        .then(res => {
          this.total = res.data.length || 0;
        });
    },
    findAppIdIsOkPage() {
      this.queryInfo.u_id = sessionStorage.getItem("user_id");
      this.loading = true;
      this.findAppIdIsNoOkTotal();
      this.$http
        .post("/api/adminAppApi/findAppIdIsNoOkPage", this.queryInfo)
        .then(res => {
          this.userData = res.data || [];
          this.loading = false;
        });
    },
    findAppIdIsNoOkTotal() {
      this.queryInfo.u_id = sessionStorage.getItem("user_id");
      this.$http
        .post("/api/adminAppApi/findAppIdIsNoOkTotal", this.queryInfo)
        .then(res => {
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
    // 属性即可开启该列的筛选，用来筛选
    filterTag(value, row) {
      return row.app_status === value;
    },
    // 新增申请
    handleInsert() {
      this.findHome();
      const u_id = sessionStorage.getItem("user_id");
      const userInfo = {
        u_id: u_id
      };
      this.$http
        .post("/api/adminAppApi/findUserIsApplication", userInfo)
        .then(res => {
          // console.log("res", res);
          if (res.data === "") {
            this.dialogFormVisible = true;
          } else {
            this.$message.warning(
              "你已经提交过申请,还在等待审核，无需重复提交"
            );
          }
        });
      this.editUserDate = {};
      this.title = "社区表单申请填写";
    },
    // 查找未禁用的社区
    findHome() {
      this.$http.post("/api/homeService/findHomeCatName").then(res => {
        this.homeList = res.data || [];
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
        
        if (
          this.editUserDate.app_id === undefined ||
          this.editUserDate.app_id === null
        ) {
          const a_id = sessionStorage.getItem('admin_id')
          this.editUserDate.a_id = a_id
          this.$http
            .post("/api/adminAppApi/inserApplicationInfon", this.editUserDate)
            .then(res => {
              // console.log(res);
              if (res.data.code === 200) {
                this.dialogFormVisible = false;
                this.findApplicationIsAlltPage();
                this.$message.success(res.data.msg || "添加成功");
              } else {
                this.$message.error(res.data.msg || "添加失败");
              }
            });
        } else {
          this.$http
            .put("/api/adminAppApi/updateApplicationInfon", this.editUserDate)
            .then(res => {
              if (res.data.code === 200) {
                this.$message.success(res.data.msg);
                this.dialogFormVisible = false;
                this.findApplicationIsAlltPage();
              } else {
                this.$message.error(res.data.msg);
              }
            });
        }
      });
    },
    //点击取消
    clickCancel() {
      this.$refs.editUserDate.resetFields();
      this.dialogFormVisible = false;
      //  取消后再次查询
      this.editUserDate = {};
      this.findApplicationIsAlltPage();
      this.imageUrl = null;
    },
    // 用户取消申请
    isCancel(row) {
      row.app_status = 3;
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
    isDelete(row) {
      row.app_isDelete = 1;
      this.$http
        .put("/api/adminAppApi/updateApplicationInfon", row)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success("删除成功");
            this.dialogFormVisible = false;
            this.findApplicationIsAlltPage();
          } else {
            this.$message.error("删除失败");
          }
        });
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
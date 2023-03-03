<template>
  <!-- 用户信息显示表格 -->
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-house" @click="$router.push('index')">首页</i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>老旧社区管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card class="box-card">
      <el-row>
        <el-col :span="6">
          <el-input
            placeholder="请输入小区的名字进行查找"
            v-model="queryInfo.queryString"
            @keyup.enter.native="findHomeName"
            class="input-with-select"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="findHomeName" />
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button style="margin-left:20px;" @click="insert" type="primary">录入小区</el-button>
        </el-col>
        <el-col :push="1" :span="2">
          <el-button
            icon="el-icon-refresh"
            style="margin-left:20px;"
            type="info"
            @click="findHomeInfo"
          >刷新</el-button>
        </el-col>
      </el-row>
      <el-table :data="userData" stripe style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="编号" align="center" />
        <el-table-column prop="h_name" label="小区名字" align="center"></el-table-column>
        <el-table-column
          prop="createTime"
          width="180"
          label="添加时间"
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
              :type="scope.row.isDelete === 0 ? 'success' : 'danger'"
              disable-transitions
            >{{scope.row.isDelete === 0 ? '正常' : '停止'}}</el-tag>
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
        <el-form-item label="社区名字" :label-width="formLabelWidth" prop="h_name">
          <el-input v-model="editUserDate.h_name"></el-input>
        </el-form-item>
        <el-form-item label="社区状况" :label-width="formLabelWidth" prop="isDelete">
          <el-select v-model="editUserDate.isDelete" placeholder="请选择">
            <el-option :value="0" label="正常" />
            <el-option :value="1" label="停止" />
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
          :title="title === '录入小区信息' ? '确定新增加小区吗？' : '确定修改小区信息吗？'"
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
        h_name: [
          { required: true, message: "请输入社区名字", trigger: "blur" },
          {
            min: 2,
            max: 8,
            message: "长度2到8个字符",
            trigger: "blur"
          }
        ],
        isDelete: [
          { required: true, message: "请选择社区的状态", trigger: "blur" },

        ],
      }
    };
  },
  created() {
    // 首次加载时，获取后台用户的数据
    this.findHomeInfo();
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
      this.findHomeInfo();
    },
    // 查找房子信息
    findHomeInfo() {
      this.loading = true;
      this.findHomeTotal();
      this.$http.post("/api/homeService/findHomeInfo", this.queryInfo).then(res => {
        this.userData = res.data;
        this.loading = false;
      });
    },
    // 查找房子总数
    findHomeTotal() {
      this.$http.post("/api/homeService/getHomeTotal", this.queryInfo).then(res => {
        this.total = res.data.length || 0;
      });
    },
    // 按名字分页查找
    findHomeName() {
      this.loading = true;
      this.findHomeNameTotal();
      this.$http
        .post("/api/homeService/findHomeNamePage", this.queryInfo)
        .then(res => {
          this.userData = res.data || [];
          this.loading = false;
        });
    },
    // 按名字查找的总数
    findHomeNameTotal() {
      this.$http
        .post("/api/homeService/findHomeNameTotal", this.queryInfo)
        .then(res => {
          this.total = res.data.length || [];
        });
    },
    // 新建社区
      //添加商品信息
    insert(){
          this.title = '录入小区信息';
          this.dialogFormVisible = true;
              
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
      this.title = "编辑用信息";
    },
    // 确定按钮
    clickOk(e) {
      //this.$refs.upload.submit();
      //console.log(this.editUserDate);
      const values = this.editUserDate;
      this.$refs.editUserDate.validate(valid => {
        if (!valid) return this.$message.error("表单校验不通过，请检查后提交");
        if( values.h_id === undefined || values.h_id === null ) {
          this.$http.post("/api/homeService/inserHomeInfon", values).then(res => {
          console.log(res);
          if (res.data === "添加成功") {
            this.$message.success(res.data);
            this.newAdminFormVisible = false;
            this.findHomeInfo();
          } else {
            this.imageUrl = null;
            this.$message.error(res.data);
          }
        });
        } else {
          this.$http.put("/api/homeService/updateHome", values).then(res => {
          console.log(res);
          if (res.data === "更新成功") {
            this.$message.success(res.data);
            this.dialogFormVisible = false;
            this.findHomeInfo();
          } else {
            this.imageUrl = null;
            this.$message.error(res.data);
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
      this.imageUrl = null;
      this.editUserDate = {};
      this.findHomeInfo();
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
    handleChange(file, fileList) {
      console.log(file, fileList, URL.createObjectURL(file.raw));

      this.imageUrl = URL.createObjectURL(file.raw); //把图片做成一个路径显示
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
<template>
  <!-- 用户信息显示表格 -->
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-house" @click="$router.push('index')">首页</i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>新闻设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card class="box-card">
      <el-row>
        <el-col :span="2">
          <el-button style="margin-left:20px;" @click="handleAddNews" v-if="total===0" type="primary">新建新闻</el-button>
        </el-col>
        <el-col  :span="2">
          <el-button
            icon="el-icon-refresh"
            style="margin-left:20px;"
            type="info"
            @click="findNews"
          >刷新</el-button>
        </el-col>
      </el-row>
      <el-table :data="userData" stripe style="width: 100%" :loading="loading">
        <el-table-column prop="m_id" label="编号" align="center" />
        <el-table-column prop="m_msg" label="内容" show-overflow-tooltip align="center" width="200"></el-table-column>
        <el-table-column prop="a_name" label="发布人" align="center"></el-table-column>
        <el-table-column
          prop="mCreateTime"
          width="180"
          label="注册时间"
          :formatter="formatDate"
          align="center"
        ></el-table-column>
        <el-table-column label="是否展示">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.m_status === 1 ? 'success' : 'danger'"
              disable-transitions
            >{{scope.row.m_status === 1 ? '展示' : '不展示'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          1
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              @confirm="handleDelete(scope.row)"
              confirm-button-text="好的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
            >
              <el-button size="mini" type="danger" slot="reference">删除</el-button>
            </el-popconfirm>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑用户信息 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="editUserDate" ref="editUserDate" :rules="rules">
        <el-form-item label="新闻内容" :label-width="formLabelWidth" prop="m_msg">
          <el-input v-model="editUserDate.m_msg"></el-input>
        </el-form-item>
        <el-form-item label="是否展示" :label-width="formLabelWidth" prop="m_status">
          <el-select v-model="editUserDate.m_status" placeholder="请选择">
            <el-option :value="1" label="展示" />
            <el-option :value="0" label="不展示" />
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
          title="确定修改吗？"
        >
          <el-button slot="reference">确定</el-button>
        </el-popconfirm>
        <!-- <el-button type="primary" @click="clickOk">确 定</el-button> -->
      </div>
    </el-dialog>
    <!-- 新建新闻员信息 -->
    <el-dialog :title="title" :visible.sync="newFormVisible">
      <el-form :model="editUserDate" ref="editUserDate" :rules="rules">
        <el-form-item label="新闻内容" :label-width="formLabelWidth" prop="m_msg">
          <el-input v-model="editUserDate.m_msg"></el-input>
        </el-form-item>
        <el-form-item label="是否展示" :label-width="formLabelWidth" prop="m_status">
          <el-select v-model="editUserDate.m_status" placeholder="请选择">
            <el-option :value="1" label="展示" />
            <el-option :value="0" label="不展示" />
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
          title="确定添加吗？"
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
      total: 0,
      loading: false,
      editUserDate: {},
      userData: [], // 定义一个接收后要传过来的用户数据
      title: "",
      dialogFormVisible: false, // 编辑框弹窗
      newFormVisible: false,
      formLabelWidth: "120px", // 弹窗宽度
      rules: {
        m_msg: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 4,
            max: 30,
            message: "长度4到30个字符",
            trigger: "blur"
          }
        ],
        m_status: [
          { required: true, message: "请选择新闻状态", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // 首次加载时，获取后台用户的数据
    this.findNews();
  },
  methods: {
    findNews() {
      this.loading = true;
      this.$http.get("/api/newsApi/findNews").then(res => {
        this.userData = res.data
        this.total = res.data.length
        this.loading = false;
      });
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
    //过滤时间格式
    formatBooleam(row) {
      // 获取单元格数据
      if (row.m_status === 1) {
        return true;
      } else return false;
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
    handleAddNews() {
      this.newFormVisible = true;
      this.editUserDate = {};
      this.title = "添加新闻";
    },
    handleAddAdminOk() {
      this.$refs.editUserDate.validate(valid => {
        if (!valid) return this.$message.error("表单校验不通过，请检查后提交");
          this.editUserDate.a_id = sessionStorage.getItem("admin_id");
          this.$http
            .post("/api/newsApi/inserNews", this.editUserDate)
            .then(res => {
              console.log(1-1);
              if (res.data.code === 200) {
                this.$message.success(res.data.msg);
                this.newFormVisible = false
                this.findNews();
              } else {
                this.$message.error(res.data.msg);
              }
            });
      });
    },
    // 编辑的
    handleEdit(row) {
      this.dialogFormVisible = true;
      this.editUserDate = row;
      this.title = "编辑新闻";
    },
    // 确定按钮编辑
    clickOk(e) {
      this.$refs.editUserDate.validate(valid => {
        if (!valid) return this.$message.error("表单校验不通过，请检查后提交");
          this.editUserDate.a_id = sessionStorage.getItem("admin_id");
          this.$http
            .put("/api/newsApi/updateNews", this.editUserDate)
            .then(res => {
              console.log(res);
              if (res.data.code === 200) {
                this.$message.success(res.data.msg);
                this.dialogFormVisible = false;
                this.findNews();
              } else {
                this.$message.error(res.data.msg);
              }
            });
      });
    },
    //删除 
    handleDelete(row) {
        console.log(row);
        this.$http.post('/api/newsApi/deleteNews',row).then(res=>{
            if(res.data.code === 200) {
                this.$message.success(res.data.msg || '删除成功')
                this.findNews()
            }else this.$message.error(res.data.msg || '删除成败')
            
        })
    },
    //点击取消
    clickCancel() {
      this.$refs.editUserDate.resetFields();
      this.dialogFormVisible = false;
      this.newFormVisible = false;
      //  取消后再次查询
      this.editUserDate = {};
      this.findNews();
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
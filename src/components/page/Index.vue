<template>
  <div>
    <el-card v-show="onMessage" style="margin-bottom: 50px;" v-if="onShow">
      <el-row :gutter="24">
        <el-col :span="4">
          <div>
            <el-avatar
              v-if="ava === 'null'"
              :size="80"
              class="user-logo"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            ></el-avatar>
            <el-avatar v-else :size="80" class="user-logo" :src="`http://localhost:3000/${ava}`"></el-avatar>
          </div>
        </el-col>
        <el-col :span="14" :pull="2">
          <div class="home-text">
            <h1>您好, {{username}} , 开始您一天的工作吧！</h1>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="info">
            <div class="info-span">待审核</div>
            <div class="info-sum">{{wait}}</div>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="info">
            <div class="info-span">已通过</div>
            <div class="info-sum">{{isOk}}</div>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="info">
            <div class="info-span">全部</div>
            <div class="info-sum">{{isAll}}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-show="onMessage" style="margin-bottom: 50px;" v-else>
      <el-row :gutter="24">
        <el-col :span="4">
          <div>
            <el-avatar
              v-if="ava === 'null'"
              :size="80"
              class="user-logo"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            ></el-avatar>
            <el-avatar v-else :size="80" class="user-logo" :src="`http://localhost:3000/${ava}`"></el-avatar>
          </div>
        </el-col>
        <el-col :span="14" :pull="2">
          <div class="home-text">
            <h1>您好, {{username}} , 开始您一天的工作吧！</h1>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="info">
            <div class="info-span">待办</div>
            <div class="info-sum">{{wait}}</div>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="info">
            <div class="info-span">完成</div>
            <div class="info-sum">{{isOk}}</div>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="info">
            <div class="info-span">全部</div>
            <div class="info-sum">{{isAll}}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 用户 -->
    <div v-if="onShow">
      <el-row :gutter="20">
        <el-col :span="16">
          <div>
            <el-card>
              <div slot="header" class="clearfix">
                <h1>事项</h1>
              </div>
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-card
                    shadow="hover"
                    class="box-card"
                    @click.native="hanleToUrl('awaitingApplication')"
                  >
                    <div style="text-align: center;">
                      <div>
                        <span class="el-icon-edit icon-wait"></span>
                      </div>
                      <el-button
                        class="app_btn"
                        type="primary"
                        @click="hanleToUrl('awaitingApplication')"
                      >待审核</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card
                    shadow="hover"
                    class="box-card"
                    @click.native="hanleToUrl('successfulApplication')"
                  >
                    <div style="text-align: center;">
                      <div>
                        <span class="el-icon-document-checked icon-isOk"></span>
                      </div>
                      <el-button
                        type="success"
                        class="app_btn"
                        @click="hanleToUrl('successfulApplication')"
                      >已通过</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card
                    shadow="hover"
                    class="box-card"
                    @click.native="hanleToUrl('noApplication')"
                  >
                    <div style="text-align: center;">
                      <div>
                        <span class="el-icon-circle-close icon-isNoOk"></span>
                      </div>
                      <el-button
                        type="danger"
                        class="app_btn"
                        @click="hanleToUrl('noApplication')"
                      >已拒绝</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card
                    shadow="hover"
                    class="box-card"
                    @click.native="hanleToUrl('allApplication')"
                  >
                    <div style="text-align: center;">
                      <div>
                        <span class="el-icon-menu icon-isAll"></span>
                      </div>
                      <el-button
                        class="app_btn"
                        type="info"
                        @click="hanleToUrl('allApplication')"
                      >全部事项</el-button>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <el-card>
              <div slot="header" class="clearfix">
                <h1>快捷导航</h1>
              </div>
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-card shadow="hover" class="nav-card" @click.native="hanleToUrl('userInfo')">
                    <div style="text-align: center;">
                      <div>
                        <span class="el-icon-set-up icon-infoManage"></span>
                      </div>
                      <el-button class="nav_btn" type="primary">个人信息管理</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card shadow="hover" class="nav-card" @click.native="inserApplication">
                    <div style="text-align: center;">
                      <div>
                        <span class="el-icon-position icon-appManage"></span>
                      </div>
                      <el-button class="nav_btn" type="primary">申请社区改造</el-button>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-row :gutter="20">
        <el-col :span="16">
          <div>
            <el-card>
              <div slot="header" class="clearfix">
                <h1>事项</h1>
              </div>
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-card
                    shadow="hover"
                    class="box-card"
                    @click.native="hanleToUrl('awaitingApplicationForAdmin')"
                  >
                    <div style="text-align: center;">
                      <div>
                        <span class="el-icon-edit icon-wait"></span>
                      </div>
                      <el-button class="app_btn" type="primary">待办</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card
                    shadow="hover"
                    class="box-card"
                    @click.native="hanleToUrl('successfulApplicationForAdmin')"
                  >
                    <div style="text-align: center;">
                      <div>
                        <span class="el-icon-document-checked icon-isOk"></span>
                      </div>
                      <el-button type="success" class="app_btn">已通过</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card
                    shadow="hover"
                    class="box-card"
                    @click.native="hanleToUrl('noApplicationForAdmin')"
                  >
                    <div style="text-align: center;">
                      <div>
                        <span class="el-icon-circle-close icon-isNoOk"></span>
                      </div>
                      <el-button type="danger" class="app_btn">已拒绝</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card
                    shadow="hover"
                    class="box-card"
                    @click.native="hanleToUrl('allApplicationForAdmin')"
                  >
                    <div style="text-align: center;">
                      <div>
                        <span class="el-icon-menu icon-isAll"></span>
                      </div>
                      <el-button class="app_btn" type="info">全部事项</el-button>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <el-card>
              <div slot="header" class="clearfix">
                <h1>快捷导航</h1>
              </div>
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-card shadow="hover" class="nav-card" @click.native="hanleToUrl('userManage')">
                    <div style="text-align: center;">
                      <div>
                        <span class="el-icon-s-custom icon-userMaage"></span>
                      </div>
                      <el-button class="nav_btn" type="primary">用户管理</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card
                    shadow="hover"
                    class="nav-card"
                    @click.native="hanleToUrl('adminManage')"
                  >
                    <div style="text-align: center;">
                      <div>
                        <span class="el-icon-user icon-adminManage"></span>
                      </div>
                      <el-button class="nav_btn" type="primary">管理员设置</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card shadow="hover" class="nav-card" @click.native="hanleToUrl('adminInfo')">
                    <div style="text-align: center;">
                      <div>
                        <span class="el-icon-set-up icon-infoManage"></span>
                      </div>
                      <el-button class="nav_btn" type="primary">个人信息管理</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card shadow="hover" class="nav-card" @click.native="hanleToUrl('home')">
                    <div style="text-align: center;">
                      <div>
                        <span class="el-icon-set-up icon-homeManage"></span>
                      </div>
                      <el-button class="nav_btn" type="primary">社区信息管理</el-button>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-dialog title="小区改造申请" :visible.sync="dialogVisible" width="40%">
          <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-form-item label="所在小区" prop="h_id">
              <el-select v-model="form.h_id" placeholder="选择你所在小区名字" style="width:100%;">
                <el-option
                  v-for="(item,index) in homeList"
                  :key="index"
                  :label="item.h_name"
                  :value="item.h_id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="联系方式" prop="number">
              <el-input v-model="form.number" placeholder="请填写你的联系方式"></el-input>
            </el-form-item>
            <el-form-item label="小区住址" prop="address">
              <el-input type="textarea" v-model="form.address" maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="补充说明">
              <el-input
                type="textarea"
                placeholder="填写补充说明"
                maxlength="30"
                show-word-limit
                v-model="form.opinion"
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="clickCancel">取 消</el-button>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
          </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
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
      isRole: null,
      onShow: true,
      newsInfo: {
        m_msg: "",
        m_status: 0
      },
      // 通知栏
      onMessage: true,
      // 社区名称
      homeList: [],
      wait: 0, // 等待
      isOk: 0, // 审核通过
      isNoOk: 0, // 拒绝的
      isAll: 0, // 全部
      dialogVisible: false,
      title: "",
      form: {},
      findUserIsApp: [],
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
    this.findToHomeNews();
    this.isRole = sessionStorage.getItem("admin_role");
    if (this.isRole === "undefined") {
      this.findApplicationIsWait();
      this.findApplicationIsOk();
      this.findApplicationIsNoOk();
      this.findApplicationIsAll();
      this.onShow = true;
    } else {
      this.findApplicationIsWaitForAdmin();
      this.findApplicationIsOkForAdmin();
      this.findApplicationIsNoOkForAdmin();
      this.findApplicationIsAllForAdmin();
      this.onShow = false;
    }
  },
  computed: {
    onRole() {
      let role = sessionStorage.getItem("admin_role");
      return role;
    },
    username() {
      let username = sessionStorage.getItem("ms_username");
      return username ? username : this.name;
    },
    ava() {
      let ava = sessionStorage.getItem("ava");
      //   console.log('头像',ava);
      return ava ? ava : undefined;
    }
  },
  methods: {
    // 检查手机号
    isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    },
    hanleToUrl(url) {
      console.log(url);
      this.$router.push(url);
    },
    findToHomeNews() {
      this.$http.get("/api/newsApi/findNewsToHome").then(res => {
        // console.log('news', res);
        if (res.data.length > 0) {
          this.newsInfo = res.data[0];
        }
      });
    },
    // 确定
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return this.$message.error("表单校验不通过，请检查后提交");
        this.form.u_id = sessionStorage.getItem("user_id");
        this.$http
          .post("/api/userAppApi/inserApplicationInfon", this.form)
          .then(res => {
            console.log(res);
            if (res.data.code === 200) {
              this.dialogVisible = false;
              this.$message.success(res.data.msg || "添加成功");
              this.created()
            } else {
              this.$message.error(res.data.msg || "添加失败");
            }
          });
      });
    },
    // 取消
    clickCancel() {
      this.$refs.form.resetFields();
      this.dialogVisible = false;
      this.form = {};
    },
    // 添加社区改造申请
    inserApplication() {
      this.form = {};
      this.findHome();
      this.findUserIsApplication();
    },
    // 查找未禁用的社区
    findHome() {
      this.$http.post("/api/homeService/findHomeCatName").then(res => {
        this.homeList = res.data || [];
      });
    },
    // 查找用户是否填写过 ，不包括同意的
    findUserIsApplication() {
      const u_id = sessionStorage.getItem("user_id");
      const userInfo = {
        u_id: u_id
      };
      if (u_id != null) {
        this.$http
          .post("/api/userAppApi/findUserIsApplication", userInfo)
          .then(res => {
            // console.log("res", res);
            if (res.data === "") {
              this.dialogVisible = true;
            } else {
              this.$message.warning("你已经提交过申请，无需重复提交");
            }
          });
      }
    },
    // 查找用户未审核的表单
    findApplicationIsWait() {
      const u_id = sessionStorage.getItem("user_id");
      const userInfo = { u_id: u_id };
      this.$http
        .post("/api/userAppApi/findApplicationIsWait", userInfo)
        .then(res => {
          // console.log("res", res);
          this.wait = res.data.length;
        });
    },

    // 查找审核通过的表单
    findApplicationIsNoOk() {
      const u_id = sessionStorage.getItem("user_id");
      const userInfo = { u_id: u_id };
      this.$http
        .post("/api/userAppApi/findApplicationIsNoOk", userInfo)
        .then(res => {
          // console.log("res", res);
          this.isNoOk = res.data.length;
        });
    },
    // 查找通过的审核的表单
    findApplicationIsOk() {
      const u_id = sessionStorage.getItem("user_id");
      const userInfo = { u_id: u_id };
      this.$http
        .post("/api/userAppApi/findApplicationIsOk", userInfo)
        .then(res => {
          // console.log("res", res);
          this.isOk = res.data.length;
        });
    },
    // 用户查找自己全部的
    findApplicationIsAll() {
      const u_id = sessionStorage.getItem("user_id");
      const userInfo = { u_id: u_id };
      this.$http
        .post("/api/userAppApi/findApplicationIsAll", userInfo)
        .then(res => {
          this.isAll = res.data.length;
        });
    },

    /**
     * 管理员
     */
    // 查找管理员未审核的表单
    findApplicationIsWaitForAdmin() {
      this.$http.post("/api/adminAppApi/findApplicationIsWait").then(res => {
        this.wait = res.data.length;
      });
    },

    // 查找光理由审核通过的表单
    findApplicationIsNoOkForAdmin() {
      this.$http.post("/api/adminAppApi/findApplicationIsNoOk").then(res => {
        this.isNoOk = res.data.length;
      });
    },
    // 查找通过的审核的表单
    findApplicationIsOkForAdmin() {
      this.$http.post("/api/adminAppApi/findApplicationIsOk").then(res => {
        this.isOk = res.data.length;
      });
    },
    // 查找全部的
    findApplicationIsAllForAdmin() {
      this.$http.post("/api/adminAppApi/findApplicationIsAll").then(res => {
        this.isAll = res.data.length;
      });
    }
  }
};
</script>

<style scoped>
.app_btn {
  width: 100%;
  color: #000;
  background: #fff;
  border: none;
  /* font-size: small; */
  font-size: 2em;
  padding: 20% 20%;
}
.home-text {
  padding-top: 5%;
  font-size: 0.7em;
  margin: auto 0;
  color: #000000d9;
}
.info {
  padding-top: 10%;
}
.info-span {
  text-align: center;
  color: #00000073;
}
.info-sum {
  text-align: center;
  color: #000000d9;
  font-family: 500;
  font-size: 2em;
}
.box-card {
  width: 280px;
  height: 200px;
  margin-top: 5%;
  margin-bottom: 5%;
}

.icon-wait {
  font-size: 50px;
  color: rgb(105, 192, 255);
}
.icon-isOk {
  font-size: 50px;
  color: #95de64;
}
.icon-isNoOk {
  font-size: 50px;
  color: #ff4d4f;
}
.icon-isAll {
  font-size: 50px;
  color: #fed766;
}
.nav-card {
  width: 200px;
  height: 200px;
  margin-top: 8%;
  margin-bottom: 8%;
}
.nav_btn {
  width: 100%;
  color: #000;
  background: #fff;
  border: none;
  /* font-size: small; */
  font-size: 1.2em;
  padding: 20% 20%;
}
.icon-userMaage {
  font-size: 40px;
  color: rgb(35 218 202);
}
.icon-homeManage {
  font-size: 40px;
  color: #d25966;
}
.icon-adminManage {
  font-size: 40px;
  color: #e08529;
}
.icon-infoManage {
  font-size: 40px;
  color: #40b27f;
}

.icon-appManage {
  font-size: 40px;
  color: #d25966;
}
</style>
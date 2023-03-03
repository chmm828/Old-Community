<template>
  <div class="login-wrap">
    <div class="ms-title">旧社区改造系统</div>
    <div class="ms-login" v-if="onShow">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0px"
        class="demo-ruleForm"
      >
        <div v-if="errorInfo">
          <span>{{errInfo}}</span>
        </div>
        <el-form-item prop="name">
          <el-input prefix-icon="el-icon-user-solid" v-model="ruleForm.name" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            show-password
            type="password"
            placeholder="密码"
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="validate">
          <el-input
            prefix-icon="el-icon-postcard"
            v-model="ruleForm.validate"
            class="validate-code"
            placeholder="验证码"
          ></el-input>
          <div class="code" @click="refreshCode">
            <s-identify :identifyCode="identifyCode"></s-identify>
          </div>
        </el-form-item>
        <div class="is-admin">
          <el-radio-group v-model="isAdmin"  @change="hanleIsAdmin">
            <el-radio-button label="1">用户</el-radio-button>
            <el-radio-button label="2">管理员</el-radio-button>
          </el-radio-group>
          <!-- <el-radio @change="hanleIsAdmin" v-model="isAdmin" label="1">用户登陆</el-radio>
          <el-radio @change="hanleIsAdmin" v-model="isAdmin" label="2">管理员登录</el-radio> -->
        </div>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm(ruleForm)">登录</el-button>
          <!-- <el-button type="primary" @click="hanleAdiminLogin('ruleForm')">管理员登录</el-button> -->
        </div>
        <p class="register" @click="handleCommand()">注册</p>
      </el-form>
    </div>
    <div class="ms-login" v-else>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0px"
        class="demo-ruleForm"
      >
        <div v-if="errorInfo">
          <span>{{errInfo}}</span>
        </div>
        <el-form-item prop="name">
          <el-input v-model="ruleForm.name" placeholder="管理员账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="validate">
          <el-input v-model="ruleForm.validate" class="validate-code" placeholder="验证码"></el-input>
          <div class="code" @click="refreshCode">
            <s-identify :identifyCode="identifyCode"></s-identify>
          </div>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">用户登录</el-button>
          <el-button type="primary" @click="hanleAdiminLogin('ruleForm')">管理员登录</el-button>
        </div>
        <p class="register" @click="handleCommand()">注册</p>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      isAdmin: "1",
      onShow: true,
      identifyCodes: "1234567890",
      identifyCode: "",
      errorInfo: false,
      ruleForm: {
        name: "",
        password: "",
        validate: ""
      },
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        validate: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  methods: {
    hanleAdiminLogin(formName) {
      this.onShow = false;
    },
    hanleIsAdmin() {
      this.refreshCode();
    },
    submitForm(formName) {
      const show = this.isAdmin;
      console.log('====>s',show);
      const self = this;
      self.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (show === "1") {
            if (self.identifyCode === formName.validate) {
              self.$http
                .post("/api/user/login", self.ruleForm)
                .then(response => {
                  if (response.data.length >= 0) {
                    console.log(
                      "response",
                      response,
                      response.data[0].user_pic
                    );
                    sessionStorage.setItem("ms_username",  response.data[0].username);
                    sessionStorage.setItem("ms_user", self.ruleForm);
                    sessionStorage.setItem("ava", response.data[0].user_pic);
                    sessionStorage.setItem("user_id", response.data[0].id);
                    sessionStorage.setItem(
                      "admin_status",
                      response.data[0].status
                    );
                    sessionStorage.setItem("admin_role", response.data[0].role);
                    self.$router.push("/index");
                    // console.log(JSON.stringify(self.ruleForm));
                  } else if (response.data === -1) {
                    this.$message.warning("账户或者密码错误，请重新输入");
                    this.refreshCode();
                  } else if (response.data === 0) {
                    this.$message.error("账户被禁用，请联系管理员！");
                    this.refreshCode();
                  }
                });
            } else {
              this.$message.error("验证码错误,请重新输入");
              this.refreshCode();
            }
          } else if (show === "2") {
            if (self.identifyCode === formName.validate) {
              self.$http
                .post("/api/admin/getAdminLogin", self.ruleForm)
                .then(response => {
                  if (response.data.length >= 0) {
                    sessionStorage.setItem("ms_username",  response.data[0].a_name);
                    sessionStorage.setItem("ms_user", self.ruleForm);
                    sessionStorage.setItem("ava", response.data[0].admin_pic);
                    sessionStorage.setItem("admin_id", response.data[0].id);
                    sessionStorage.setItem(
                      "admin_status",
                      response.data[0].status
                    );
                    sessionStorage.setItem("admin_role", response.data[0].role);
                    self.$router.push("/index");
                    // console.log(JSON.stringify(self.ruleForm));
                  } else if (response.data === -1) {
                    this.$message.warning("账户或者密码错误，请重新输入");
                    this.refreshCode();
                  } else if (response.data === 0) {
                    this.$message.error("密码错误！请重新输入");
                    this.refreshCode();
                  }
                });
            } else {
              this.$message.error("验证码错误,请重新输入");
              this.refreshCode();
            }
          }
        } else {
          return false;
        }
      });
      //   this.onShow = true;
      //   // debounceAjax(formName)
      //   const self = this;
      //   self.$refs[formName].validate(valid => {
      //     if (valid) {
      //       self.$http
      //         .post("/api/user/login", JSON.stringify(self.ruleForm))
      //         .then(response => {
      //           console.log("user=====>", response);
      //           if (response.status == 200) {
      //             // self.$router.push('/readme');
      //             // sessionStorage.setItem('ms_username',self.ruleForm.name);
      //             // sessionStorage.setItem('ms_user',JSON.stringify(self.ruleForm));
      //             // console.log(JSON.stringify(self.ruleForm));
      //           }
      //         })
      //         .then(error => {
      //           console.log(error);
      //         });
      //     } else {
      //       console.log("error submit!!");
      //       return false;
      //     }
      //   });
    },
    handleCommand() {
      this.$router.push("/register");
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
      console.log("现在的验证吗", this.identifyCode);
    },
    debounce(func, delay) {
      return function(args) {
        var _this = this;
        var _args = args;
        clearTimeout(func.id);
        func.id = setTimeout(function() {
          func.call(_this, _args);
        }, delay);
      };
    },
    submitDebounce(formName) {
      const self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          localStorage.setItem("ms_username", self.ruleForm.name);
          localStorage.setItem("ms_user", JSON.stringify(self.ruleForm));
          console.log(JSON.stringify(self.ruleForm));
          self.$http
            .post("/api/user/login", JSON.stringify(self.ruleForm))
            .then(response => {
              console.log(response);
              if (response.data == -1) {
                self.errorInfo = true;
                self.errInfo = "该用户不存在";
                console.log("该用户不存在");
              } else if (response.data == 0) {
                console.log("密码错误");
                self.errorInfo = true;
                self.errInfo = "密码错误";
              } else if (response.status == 200) {
                self.$router.push("/index");
              }
            })
            .then(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    debounceAjax() {
      debounce(submitDebounce, 1000);
    }
  }
};
</script>

<style scoped>
.login-wrap {
  background: url("../../assets/background.jpg") center center fixed no-repeat;
  background-size: cover;
  position: relative;
  width: 100%;
  height: 100%;
}
.ms-title {
  position: absolute;
  top: 50%;
  left: 20%;
  width: 100%;
  margin-top: -230px;
  text-align: center;
  font-size: 40px;
  font-weight: 700;
  color: #000;
  text-shadow: -1px 0 #ccc, 0 1px #ccc, 1px 0 #ccc, 0 -1px #ccc;
}
.ms-login {
  position: relative;
  position: absolute;
  left: 70%;
  top: 50%;
  width: 300px;
  height: 270px;
  margin: -150px 0 0 -190px;
  padding: 45px;
  border-radius: 5px;
  background: rgb(248, 248, 248);
}
.ms-login span {
  color: red;
}
.login-btn {
  margin-top: 20px;
  text-align: center;
}
.is-admin {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
}
.code {
  width: 112px;
  height: 35px;
  border: 1px solid #ccc;
  float: right;
  border-radius: 2px;
}
.validate-code {
  width: 136px;
  float: left;
}
.register {
  font-size: 14px;
  line-height: 30px;
  color: rgb(137, 135, 135);
  cursor: pointer;
  float: right;
}
</style>
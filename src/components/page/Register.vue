<template>
  <div>
    <div class="crumbs crumbs-register">
      <el-breadcrumb separator="/" class="register-title">
        <el-breadcrumb-item>
          <i class="el-icon-setting"></i>注册
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="userContent">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="username" label="用户名称">
          <el-input v-model="form.username" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item prop="account" label="账号名称">
          <el-input maxlength="11" show-word-limit v-model="form.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="checkPassword" label="确认密码">
          <el-input
            v-model="form.checkPassword"
            type="password"
            show-password
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="card" label="身份证">
					<el-input v-model="form.card" placeholder="请输入身份证号"></el-input>
        </el-form-item>-->
        <el-form-item prop="sex" label="性别">
          <el-select class="select-sex" v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" value="0"></el-option>
            <el-option label="女" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="btnShow" @click="onSubmit('form')">确定</el-button>
          <el-button @click="onCancle()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Util from "../../utils/utils";
export default {
  data() {
    var handleFindAccount = (rule, value, callback) => {
      const that = this;
      // that.$refs.form.validate((valid)=>{
      // 	if(valid){
      that.$http.post("/api/user/findAccountRepeat", that.form).then(res => {
        console.log("=====", res);
        if (res.data != 0) {
          callback(new Error(res.data));
        } else {
          callback();
        }
      });
    };

    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.checkPassword !== "") {
          this.$refs.form.validateField("checkPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else if (!Util.emailReg.test(this.form.email)) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!Util.phoneReg.test(this.form.phone)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    var validateCard = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入身份证号"));
      } else if (!Util.idCardReg.test(this.form.card)) {
        callback(new Error("请输入正确的身份证号"));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: "",
        account: "",
        password: "",
        checkPassword: "",
        email: "",
        phone: "",
        birth: "",
        sex: "0"
      },
      btnShow: false,
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
        account: [
          { required: true, validator: handleFindAccount, trigger: "blur" },
          { min: 5, max: 12, message: "长度在 5 到 12 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ],
        checkPassword: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        email: [{ validator: validateEmail, trigger: "blur" }],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        card: [{ validator: validateCard, trigger: "blur" }],
        birth: [
          {
            message: "请输入出生日期",
            type: "string",
            trigger: "blur"
          }
        ],
        sex: [{ required: true, message: "请输入性别", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleFindAccount(account) {
      console.log(account);
      const that = this;
      // that.$refs.form.validate((valid)=>{
      // 	if(valid){
      that.$http.post("/api/user/findAccountRepeat", that.form).then(res => {
        console.log(res);
        if (res.data === 0) {
          that.btnShow = false;
        } else {
          that.btnShow = true;
          that.$message.error(res.data || "该账号已存在！！！");
        }
      });
      // })
    },
    onSubmit(formName) {
      const self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.$http
            .post("/api/user/addUser", self.form)
            .then(function(response) {
              if (response.data === "注册成功")
                self.$router.push("/register-success");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onCancle() {
      this.$router.push("/login");
    },
    getDateTimes(str) {
      var str = new Date(str);
      return str;
    }
  }
};
</script>

<style>
.crumbs-register {
  background-color: #324157;
  height: 50px;
  line-height: 50px;
}
.register-title {
  line-height: 50px;
  margin: 0 auto;
  width: 50px;
  font-size: 16px;
}
.userContent {
  width: 400px;
  margin: 0 auto;
}
.select-sex {
  width: 320px;
}
</style>
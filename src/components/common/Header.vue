<template>
  <div class="header">
    <div class="logo">老旧社区改造系统</div>
    <div class="user-info">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
            <el-avatar  v-if="ava === 'null'" :size="50"  class="user-logo" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
            <el-avatar v-else :size="50"  class="user-logo" :src="`http://localhost:3000/${ava}`"></el-avatar>
          <!-- <img class="user-logo" src="../../../static/img/img.jpg"> -->
          &nbsp;&nbsp;{{username}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="userCenter">个人中心</el-dropdown-item>
          <el-dropdown-item command="loginout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "linxin"
    };
  },
  computed: {
    username() {
      let username = sessionStorage.getItem("ms_username");
      return username ? username : this.name;
    },
    ava() {
      let ava = sessionStorage.getItem("ava");
    //   console.log('头像',ava);
      return ava ? ava : undefined
    }
  },
  methods: {
    handleCommand(command) {
      if (command == "loginout") {
        // sessionStorage.removeItem('ms_username')
        // sessionStorage.removeItem('ms_userId')
        this.$router.push("/login");
      } else if (command == "userCenter") {
        const isRole = sessionStorage.getItem("admin_role");
        if(isRole === 'undefined') {
          this.$router.push("/userInfo");
        } else
        this.$router.push("/adminInfo");
      }
    }
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size:30px;
  font-weight: 700;
  line-height: 70px;
  color: #000;
}
.header .logo {
  padding-left: 50px;
  float: left;
  width: 250px;
  text-align: center;
}
.user-info {
  float: right;
  padding-right: 50px;
  font-size: 16px;
  color: #606266;
}
.user-info .el-dropdown-link {
  position: relative;
  display: inline-block;
  padding-left: 50px;
  color: #606266;
  cursor: pointer;
  vertical-align: middle;
}
.user-info .user-logo {
  position: absolute;
  left: 0;
  top: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
<style>
  .header {
    background-color: #fff;
    border: 1px solid #ccc;
  }
</style>
<template>
  <div class="sidebar">
    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group> -->
    <el-menu
      :default-active="onRoutes"
      class="el-menu-vertical-demo"
      unique-opened
      collapse-transition
      router
    >
      <template v-if="onRole === 'root'">
        <template v-for="item in root_items">
          <template v-if="item.subs">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i>
                {{ item.title }}
              </template>
              <el-menu-item
                v-for="(subItem,i) in item.subs"
                :key="i"
                :index="subItem.index"
              >{{ subItem.title }}</el-menu-item>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index" :key="item.index">
              <i :class="item.icon"></i>
              {{ item.title }}
            </el-menu-item>
          </template>
        </template>
      </template>
      <template v-else-if="onRole === 'admin'">
        <template v-for="item in admin_items">
          <template v-if="item.subs">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i>
                {{ item.title }}
              </template>
              <el-menu-item
                v-for="(subItem,i) in item.subs"
                :key="i"
                :index="subItem.index"
              >{{ subItem.title }}</el-menu-item>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index" :key="item.index">
              <i :class="item.icon"></i>
              {{ item.title }}
            </el-menu-item>
          </template>
        </template>
      </template>
      <template v-else>
        {{role}}
        <template v-for="item in user_items">
          <template v-if="item.subs">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i>
                {{ item.title }}
              </template>
              <el-menu-item
                v-for="(subItem,i) in item.subs"
                :key="i"
                :index="subItem.index"
              >{{ subItem.title }}</el-menu-item>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index" :key="item.index">
              <i :class="item.icon"></i>
              {{ item.title }}
            </el-menu-item>
          </template>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true,
      role: "",
      root_items: [
        {
          icon: "el-icon-s-home",
          index: "index",
          title: "首页"
        },
        {
          icon: "el-icon-user",
          index: "",
          title: "用户管理",
          subs: [
            {
              index: "userManage",
              title: "用户设置"
            },
            {
              index: "adminManage",
              title: "管理员设置"
            }
          ]
        },
        {
          icon: "el-icon-school",
          index: "home",
          title: "社区信息管理"
        },
        {
          icon: "el-icon-s-tools",
          index: "userCenter",
          title: "系统设置",
          subs: [
            {
              index: "adminInfo",
              title: "个人信息设置"
            }
          ]
        }
      ],
      admin_items: [
        {
          icon: "el-icon-discount",
          index: "index",
          title: "首页"
        },
        {
          icon: "el-icon-s-tools",
          index: "userCenter",
          title: "系统设置",
          subs: [
            {
              index: "adminInfo",
              title: "个人信息管理"
            }
          ]
        }
      ],
      user_items: [
        {
          icon: "el-icon-discount",
          index: "index",
          title: "首页"
        },
        {
          icon: "el-icon-s-tools",
          index: "userCenter",
          title: "系统设置",
          subs: [
            {
              index: "userInfo",
              title: "个人信息管理"
            }
          ]
        }
      ]
    };
  },
  created() {
    // this.role = sessionStorage.getItem("admin_role")
    // console.log("我加仔啦", sessionStorage.getItem("admin_permission"));
    // const pre = sessionStorage.getItem("admin_permission");
    // console.log(pre);
    // if (sessionStorage.getItem("admin_permission") === 0) {
    //   this.role = 'root';
    //   console.log(this.role);
    // } else if (sessionStorage.getItem("admin_permission") === 1) {
    //   this.role = 'admin';
    // } else {
    //   this.role === 'user';
    //console.log(this.role);
    // }
  },
  computed: {
    onRole() {
      let role = sessionStorage.getItem("admin_role");
      return role ? role : this.role;
    },
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  width: 250px;
  left: 0;
  top: 70px;
  bottom: 0;
  background: #2e363f;
}
.sidebar > ul {
  height: 100%;
}
</style>

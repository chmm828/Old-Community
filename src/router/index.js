import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// export default new Router({
//     routes: [
//         {
//             path: '/',
//             redirect: '/login'
//         },
//         {
//             path: '/readme',
//             component: resolve => require(['../components/common/Home.vue'], resolve),
//             children:[
//                 {
//                     path: '/',
//                     component: resolve => require(['../components/page/Readme.vue'], resolve)
//                 },
//                 {
//                     path: '/upload',
//                     component: resolve => require(['../components/page/Upload.vue'], resolve)       // Vue-Core-Image-Upload组件
//                 },         
//                 {
//                     path: '/userCenter',
//                     component: resolve => require(['../components/page/UserCenter.vue'], resolve)    // 拖拽列表组件 
//                 },
//                 {
//                     path: '/modifyUser',
//                     component: resolve => require(['../components/page/ModifyUser.vue'], resolve)
//                 },
//                 {
//                     path: '/modifyPassword',
//                     component: resolve => require(['../components/page/ModifyPassword.vue'], resolve)
//                 },
//                 {
//                     path: '/success',
//                     component: resolve => require(['../components/page/Success.vue'], resolve)
//                 }
//             ]
//         },
//         {
//             path: '/register',
//             component: resolve => require(['../components/page/Register.vue'], resolve)
//         },
//         {
//             path: '/register-success',
//             component: resolve => require(['../components/page/RegisterSuccess.vue'], resolve)
//         },
//         {
//             path: '/login',
//             component: resolve => require(['../components/page/Login.vue'], resolve)
//         },
//     ]
// })

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/index',
        component: resolve => require(['../components/common/Home.vue'], resolve),
        children: [
            {
                path: '/',
                component: resolve => require(['../components/page/Index.vue'], resolve)
            },
            {
                path: '/home',
                component: resolve => require(['../components/page/home.vue'], resolve)       // Vue-Core-Image-Upload组件
            },
            {
                path: '/userCenter',
                component: resolve => require(['../components/page/UserCenter.vue'], resolve)    // 拖拽列表组件 
            },
            {
                path: '/userManage',
                component: resolve => require(['../components/page/UserManage.vue'], resolve)    // 用户管理 
            },
            {
                path: '/adminManage',
                component: resolve => require(['../components/page/AdminManage.vue'], resolve)    // 管理员管理 
            },
            {
                path: '/newsManage',
                component: resolve => require(['../components/page/newsmanage/News.vue'], resolve) //新闻管理
            },
            {
                path: '/userInfo',
                component: resolve => require(['../components/page/UserInfo.vue'], resolve)
            },
            {
                path: '/adminInfo',
                component: resolve => require(['../components/page/AdminInfo.vue'], resolve)
            },
            {
                path: '/success',
                component: resolve => require(['../components/page/Success.vue'], resolve)
            },
            {
                path: '/allApplication',
                component: resolve => require(['../components/page/application/IsUserApp/AllApplication.vue'], resolve)
            },
            {
                path: '/noApplication',
                component: resolve => require(['../components/page/application/IsUserApp/NoApplication.vue'], resolve)
            },
            {
                path: '/awaitingApplication',
                component: resolve => require(['../components/page/application/IsUserApp/AwaitingApplication.vue'], resolve)
            },
            {
                path: '/successfulApplication',
                component: resolve => require(['../components/page/application/IsUserApp/SuccessfulApplication.vue'], resolve)
            },
            {
                path: '/allApplicationForAdmin',
                component: resolve => require(['../components/page/application/IsAdminApp/AllApplication.vue'], resolve)
            },
            {
                path: '/noApplicationForAdmin',
                component: resolve => require(['../components/page/application/IsAdminApp/NoApplication.vue'], resolve)
            },
            {
                path: '/awaitingApplicationForAdmin',
                component: resolve => require(['../components/page/application/IsAdminApp/AwaitingApplication.vue'], resolve)
            },
            {
                path: '/successfulApplicationForAdmin',
                component: resolve => require(['../components/page/application/IsAdminApp/SuccessfulApplication.vue'], resolve)
            },
        ]
    },
    {
        path: '/register',
        component: resolve => require(['../components/page/Register.vue'], resolve)
    },
    {
        path: '/register-success',
        component: resolve => require(['../components/page/RegisterSuccess.vue'], resolve)
    },
    {
        path: '/login',
        component: resolve => require(['../components/page/Login.vue'], resolve)
    },
]
const router = new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})
router.beforeEach((to, from, next) => {
    if (to.path.startsWith('/login')) {
        sessionStorage.removeItem('ms_username')
        sessionStorage.removeItem('ms_user')
        sessionStorage.removeItem('ava')
        sessionStorage.removeItem('user_id')
        sessionStorage.removeItem('admin_status')
        sessionStorage.removeItem('admin_id')
        sessionStorage.removeItem('admin_role')
        next()
    } else {
        setTimeout(function(){
            let user = sessionStorage.getItem('ms_username')
            if(to.path === '/register' || to.path === '/register-success') {
                next()
            }else if (!user) {
                next({
                    path: '/login'
                })
            } else {
                next()
            }
        },500); 
    }
});

export default router

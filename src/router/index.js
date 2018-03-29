import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/view/Login'
import Home from '@/components/view/Home'
import Overview from '@/components/view/Overview.vue'
import BusinessAccount from '@/components/view/BusinessAccount.vue'
Vue.use(Router)




export default new Router({
    routes: [
        {
            path: '/Login',
            name: 'Login',
            meta: {
                title: 'AnyChat远程双录系统'
            },
            component: Login
        },
        {
            path: '/Home',
            name: 'Home',
            component: Home,
            children: [
                {
                    path: '/Home/Overview',
                    component: Overview,
                    name: 'AnyChat远程双录系统',
                    meta: {
                        title: 'AnyChat远程双录系统'
                    },
                },
                {
                    path: '/Home/BusinessAccount',
                    component: BusinessAccount,
                    name: 'AnyChat远程双录系统',
                    meta: {
                        title: 'AnyChat远程双录系统'
                    },
                }
            ]
        },
        {
            path: '*',
            redirect: '/Login/'
        }
    ]
})


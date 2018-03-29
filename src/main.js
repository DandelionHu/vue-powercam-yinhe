// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import Vueresource from 'vue-resource'
import 'element-ui/lib/theme-default/index.css'

import './assets/css/base.scss'

import App from './App'
import router from './router'

export default new Vue;



window.AnyChat = window.AnyChat || {}
AnyChat.bus = new Vue();
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vueresource)

Vue.http.options.xhr = {withCredentials:true}

var scripts = [
    "./assets/anychat4html5.min.js",
    "./assets/anychatobject.js",
    "./assets/anychatsdk.js",
    "./assets/anychatwebsdk.js",
    "./assets/AnyChatMediaUtils.js",
    "./assets/config.js"
  ]
var body = document.querySelector("body")
var script = null
var div = document.createElement("div")
scripts.map(function(v,k){
    script = document.createElement("script")
    script.src = v
    if (k == scripts.length - 1) {
        script.onload = function(){
            setTimeout(()=>{
                new Vue({
                    el: '#app',
                    router,
                    template: '<App/>',
                    components: { App }
                })
            },0)

        }
    }
    div.appendChild(script);
});
body.appendChild(div);


//钩子函数
router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title;
    next()
})



import Vue from 'vue'
import App from './App'

let vm = new Vue({
    el: '#app',
    data() {
        return {
            aaa:111,
            bbb:222,
            ccc:{
                c:1,
            },
            ddd:[1],
        }
    },
    // watch:{
    //     aaa(){
    //         this.aaa = 'aaa'
    //     }
    // },
    methods:{
        add(){
            this.aaa++

            // 如果ccc是对象，那么会生成给ccc对象创建一个Observer实例和dep实例，并且为ccc下的c属性生成dep实例，当然这个实例是存在于闭包中的。以下两种方法都能使ui得到改变，但是第三种就不行，因为d属性不存在。这种情况下ccc对象上的dep属性就发挥作用了，通过配合Vue.set(target,'d',2)就能实现ui的改变。
            // this.ccc = {
            //     c:2
            // }
            // this.ccc.c = 2
            // this.ccc.d = 2
            // vm.$set(this.ccc,'d',2)
            // console.log(this.ccc)

            // this.bbb++  //如果bbb被改变，但是bbb没有被模板使用，那么bbb不会触发watcher的update方法，因为bbb根本就没有对应的dep实例。
            // console.log(this.bbb)

            // vm.$set(this.ddd,1,2)
        }
    },
    // watch:{
    //     aaa(val){
    //         console.log(222)
    //     }
    // },
    // template: '<App/>',
    template: '<div @click="add">{{aaa}}{{ccc}}{{ddd}}</div>'
    // components: {
    //     App
    // }
})
// .$mount('#app')

// 哈哈哈在vue里的src/core/instance/initMixin里，如果new 实例时有el属性，那么vue实例才会真正mount,如果手动调用.$mount('#app'),也会mount，如果两个地方都有，会mount两遍，如果都不写，那么只会生成实例，不会mount

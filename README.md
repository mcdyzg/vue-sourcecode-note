## 启动命令

    npm start

## 源码

vue包放到了lib文件夹下，注释直接添加到了代码中，如果想更新源码，在lib/vue下执行 

    npm run build

## 实现流程

1. core/instance/index.js: 本文件出现Vue的构造函数，function Vue(){},紧接着执行initMixin(Vue)方法。

2. core/instance/init.js: initMixin在本文件内，只要作用是定义Vue的_init原型方法，紧接着构造函数在初始化时就会
执行_init方法。_init方法干的是些initLifecycle，initRender(见步骤3)，initState(见步骤4)，$mount(步骤7)此类工作。

3. core/instance/render.js: initRender方法在本文件内，注意每个组件都会执行一次initRender方法，一般是在父组件执行_update方法时执行子组件的initRender方法。initRender方法会defineReactive化$attrs和$listeners属性

4. core/observer/index.js :defineReactive在本文件内定义。defineReactive的作用是为对象的每个属性都添加get和set方法，其中get方法里干的是： 先生成一个Dep实例（暂不管用处），当参数被调用时，如果变量Dep.target上有内容，就将内容添加到dep实例，如果没有，啥都不干。set方法干的是：如果新值与旧值不同，会把添加到dep实例上的内容拿出来循环执行。

5. core/instance/state.js: initState在本文件内，如果new Vue时指定了data,那么会走initData-->observe(data)。

6. core/observer/index.js: observe在本文件内，observe方法作用是用data对象作为参数生成Observer实例(new Observer(data))，如果observe接收到的是对象或数组，那么会创建Observer实例，如果接收到的不是对象或数组，直接return。下面来看Observer构造函数的定义：先创建一个Dep实例(这里是除了defineReactive方法外另一处创建Dep实例的地方),然后把dep实例赋给data对象的__ob__属性(defineProperty(data,'__ob__',(new Dep()))),然后在循环遍历data对象的属性，把每个属性都defineReactive化。结果就是每个对象或数组上都会有__ob__属性，而简单数据类型上将不会有__ob__；不论是对象还是简单数据类型的值，其get和set方法都会被处理。

7. platforms/web/runtime/index.js  $mount调用mountComponent。

8. core/instance/lifecycle.js mountComponent在本文件中。mountComponent先执行beforeMount回调，然后创建一个updateComponent方法(见下方)，然后执行mounted回调。核心就是这个updateComponent。

```
    updateComponent = () => {
        vm._update(vm._render(), hydrating)
    }
    new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */)
```

将以上分成3个部分逐一拆解：new Watcher()(见步骤9) ， vm._render()(见步骤10)， vm._update(见步骤11)。从上我们可以粗略看出，每个Vue实例将会只生成一个Watcher实例用于页面更新。

9. core/observer/watcher.js Watcher的构造函数在本文件中。Watcher构造函数接收了vm和updateComponent作为参数，首先进行一系列初始化(略过)，然后将this也就是watcher实例添加到了Dep.target上，然后就执行了回调函数updateComponent，而updateComponent方法会先执行vm._render，再执行vm._update方法。要提醒的一点是，Dep.target终于有值(Watcher实例)了。(粗略的说，Watcher实例的作用是让Dep.target = this ,然后执行_render方法，使参数得以调用,从而使得watcher实例被添加到参数对应的dep实例里，在执行完_render后，Dep.target = null,从而使Watcher不会被重复添加。)

10. core/instance/render.js _render方法在本文件中。Vue.prototype._render = function(){...}。_render方法的核心作用就一个，就是将我们写的template内容转化为vnode。vnode格式类似：{tag:'div',text:undefined,childrend:[vnode]}。重要的是，在这个过程中我们的参数被调用了 ，也就是说data参数上的get方法会被触发，因为步骤9的时候Dep.target有值(Watcher实例)了，所以 Watcher实例被添加到了dep实例上储存了起来。

11. core/instance/lifecycle.js _update方法在本文件内。_update方法的作用是：将vnode渲染成真正的html。

此时初始化过程就走完了

12. 我们在div上绑了click，当点击时this.aaa++。这是就触发了aaa属性的set方法。

13. core/observer/index.js defineReactive的set方法。发现set方法直接触发了dep实例的notify方法。

14. core/observer/dep.js 发现notify方法就是把储存的Watcher实例的update方法给执行了，而Watcher的update方法执行了queueWatcher(Watcher实例)，queueWatcher执行nextTick(flushSchedulerQueue)，因为是点击事件触发的data改变，所以此处nextTick = setTimeout。flushSchedulerQueue执行了Watcher实例的run方法。run方法执行了this.get(),
get方法就像是重新走了一遍Watcher的构造方法一样：Dep.target = this ,然后执行_render方法，使参数得以调用,从而使得watcher实例被添加到参数对应的dep实例里，在执行完_render后，执行vm._update方法更新dom

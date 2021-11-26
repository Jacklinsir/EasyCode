---
title: 手撸设计模式-委派模式
date: 2021-11-26
tags:
  - 委派模式
categories:
  - 设计模式
---

## 一 、委派模式介绍
### 1.1 定义
> 在23种设计模式中不包含**委派模式（delegate）**，但是在很多框架中都大量使用委派模式，比如Spring，Mybatis等框架。
> 委派模式基本作用就是负责任务的调用和分类任务，类似代理模式这种形式，可以看作是一个特殊的静态代理的全权代理，但是代理模式很注重过程，而委派模式注重结果。
> 委派模式在Spring中的体现：SpringMVC框架中DispathServlet的实现，充分体现了委派模式用法。
### 1.2 委派模式结构
>实现层面上, 定义一个抽象接口, 它有若干实现类, 他们真正执行业务方法, 这些子类是具体任务角色; 定义委派者角色也实现该接口, 但它负责在各个具体角色实例之间做出决策, 由它判断并调用具体实现的方法。

**委派模式主要有以下角色：**
> 抽象任务角色(AbstractTssk): 主要定义抽象任务接口
>  委派者角色(DelegateTask):  负责在各个具体角色之间做出决策，执行委派操作。
>  具体任务角色(ConcreteTask): 实现抽象任务角色的业务逻辑，即是具体执行操作。
### 1.3 委派模式UML结构图
![在这里插入图片描述](https://img-blog.csdnimg.cn/294c831b726f4356a5c3013a416401c2.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_15,color_FFFFFF,t_70,g_se,x_16)
### 1.4 委派模式代码实现
**抽象任务接口定义：**
```java
public interface Task {
    void doTask();
}
```
**委派任务对象定义：**
```java
public class Delegate implements Task {
    /**
     * 根据业务委派具体执行对象
     */
    @Override
    public void doTask() {
        System.out.println("全权代理模式开始执行...");
        Task task = null;
        //可以使用策略模式优化
        if (new Random().nextBoolean()) {
            task = new ConcreteTaskA();
            task.doTask();
        } else {
            task = new ConcreteTaskB();
            task.doTask();
        }
        System.out.println("全权代理模式执行完成...");
    }
}
```
**具体执行业务A定义：**
```java
public class ConcreteTaskA implements Task {
    @Override
    public void doTask() {
        System.out.println("执行任务 A操作");
    }
}
```
**具体执行业务B定义：**
```java
public class ConcreteTaskB implements Task {
    @Override
    public void doTask() {
        System.out.println("执行任务 B操作");
    }
}
```
**测试客户端类定义：**
```java
public class ClientDelegate {
    public static void main(String[] args) {
        new Delegate().doTask();
    }
}
```
**预期输出结果定义：**
```java
全权代理模式开始执行...
执行任务 B操作
全权代理模式执行完成...
```
## 二、委派模式场景
### 2.1 场景定义
> 委派模式就是一个负责任务的调用和分配的类，比如在SpringMVC中我们熟悉的DispatcherServlet。前端请求都统一走到DispatcherServlet 的doService()方法中，然后在doService()方法中调用doDispatch()方法，在doDispatch()方法中，会获取业务处理的handler，执行handle()方法处理请求。
### 2.2 场景描述图
> 描述SpringMVC中HandlerMapping处理器实现委派过程。
![在这里插入图片描述](https://img-blog.csdnimg.cn/23507fbdfb694e36bf4e991e721ed2cb.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
### 2.4 MVC委派模式核心源码截图
![在这里插入图片描述](https://img-blog.csdnimg.cn/c71bcbaeb69d4e7f8c95741b3f629b31.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)

### 2.3 委派模式场景UML结构图
![在这里插入图片描述](https://img-blog.csdnimg.cn/b3c9c7cdcb304774a542091d3d69ea76.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
### 2.3 委派模式场景代码实现
**抽象handlerMapping接口定义：**
```java
public interface HandlerMapping {
    HandlerMapping getHandler();
}
```
**url路径处理映射定义：**
```java
public class UrlHandlerMapping implements HandlerMapping {
    @Override
    public HandlerMapping getHandler() {
        System.out.println("UrlHandlerMapping.getHandler");
        return null;
    }
}
```
**请求方法处理映射定义：**
```java
public class MethodHandlerMapping implements HandlerMapping {
    @Override
    public HandlerMapping getHandler() {
        System.out.println("MethodHandlerMapping.getHandler");
        return null;
    }
}
```
**请求中央处理器定义：**
```java
public class DispatcherServlet {

    private Map<String, HandlerMapping> handlerMappings;

    public DispatcherServlet() {
        this.handlerMappings = new HashMap<>(2);
        this.initHandlerMappings();
    }

    /**
     * 初始化HandlerMapping
     */
    private void initHandlerMappings() {
        this.handlerMappings.put("method", new MethodHandlerMapping());
        this.handlerMappings.put("url", new UrlHandlerMapping());
    }

    /**
     * 模拟具体调度方法
     *
     * @param handlerMapping 处理映射器
     */
    public void doDispatch(String handlerMapping) {
        this.handlerMappings.get(handlerMapping).getHandler();
    }
}
```
**测试Controller定义：**
```java
public class TestController {

    public String test(String handler) {
        DispatcherServlet dispatcherServlet = new DispatcherServlet();
        dispatcherServlet.doDispatch(handler);
        return "模拟调用处理器映射器";
    }
}
```
测试用例定义：
```java
  @Test
    public void test() {
        TestController testController = new TestController();
        testController.test("url");
        System.out.println("===============");
        testController.test("method");
    }
```

预期输出结果：
```java
UrlHandlerMapping.getHandler
===============
MethodHandlerMapping.getHandler
```

### 2.4 委派模式优点
> + 对内隐藏实现, 易于扩展; 简化调用;
### 2.5 委派模式缺点
> 随着数据越来越多，数据也越来越复杂，维护的类也越来越多，实现类会越来越多，接口也会越来越多，导致程序变得复杂，代码膨胀。
## 三、总结
> 在一些框架源码中，比如Spring等，命名一Delegate结尾比如BeanDefinitionParserDelegate(根据不同的类型委派不同的逻辑解析BeanDefinition),或者是以Dispacher开头和结尾或开头的比如DispacherServlet一般都使用了委派模式。
> **大实话比如：功劳什么的是我的，干活是你的。**

[代码案例](https://gitee.com/unicornlai/smart-design-pattern/tree/master/smart-dp-delegate)
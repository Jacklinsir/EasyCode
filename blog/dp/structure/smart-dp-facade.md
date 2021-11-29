---
title: 手撸设计模式-外观模式
date: 2021-11-26
tags:
  - 外观模式
categories:
  - 设计模式
---

## 一 、外观模式介绍
### 1.1 定义
> **外观模式(Facade Pattern)：**
> 外部与一个子系统的通信必须通过一个统一的外观对象进行，为子系统中的一组接口提供一个一致的界面，外观模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。外观模式又称为门面模式，它是一种对象结构型模式。
> **系统应用表现：**
> 外观模式也叫门面模式，主要解决的是降低调用方的使用接口的复杂逻辑组合。这样调用方与实际的接口提供方提供方提供了一个中间层，用于包装逻辑提供API接口。有些时候外观模式也被用在中间件层，对服务中的通用性复杂逻辑进行中间件层包装，让使用方可以只关心业务开发。
>
### 1.2 原理图：
![外观模式原理图](https://img-blog.csdnimg.cn/3883d1d0f7b3466f8ecef7beddb7c248.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
### 1.3  模式的结构
> + 外观（Facade）模式包含以下主要角色。
> + 外观（Facade）角色：为多个子系统对外提供一个共同的接口。
> + 子系统（Sub System）角色：实现系统的部分功能，客户可以通过外观角色访问它。
> + 客户（Client）角色：通过一个外观角色访问各个子系统的功能。
### 1.4 代码演示
**外观角色对象：**
```java
/**
 * Description: 提供一个外观接口，对外，它提供一个易于客户端访问的接口，对内，它可以访问子系统中的所有功能。
 * <br/>
 * Facade
 *
 * @author laiql
 * @date 2021/10/26 17:05
 */
public class Facade {
	
	//委托依赖子系统对象
    private SubSystemOne subSystemOne;
    private SubSystemTwo subSystemTwo;

    public Facade() {
        subSystemOne = new SubSystemOne();
        subSystemTwo = new SubSystemTwo();
    }
    //统一调用子系统
    public void method() {
        System.out.println("对外提供接口执行");
        subSystemOne.method();
        subSystemTwo.method();
    }
}
```

**创建1子系统类：**
```java
/**
 * Description: 子系统角色1号
 * 子系统在整个系统中可以是一个或多个模块，每个模块都有若干类组成，这些类可能相互之间有着比较复杂的关系。
 * <br/>
 * SubSystemOne
 *
 * @author laiql
 * @date 2021/10/26 17:05
 */
public class SubSystemOne {
    public void method(){
        System.out.println("SubSystemOne.method");
    }
}
```

**创建2子系统类：**
```java
/**
 * Description: 子系统角色2号
 * 子系统在整个系统中可以是一个或多个模块，每个模块都有若干类组成，这些类可能相互之间有着比较复杂的关系。
 * <br/>
 * SubSystemTwo
 *
 * @author laiql
 * @date 2021/10/26 17:05
 */
public class SubSystemTwo {
    public void method(){
        System.out.println("SubSystemTwo.method");
    }
}
```
**创建客户端验证：**
```java
/**
 * Description: 客户端调用角色
 * <br/>
 * Client
 *
 * @author laiql
 * @date 2021/10/26 17:09
 */
public class Client {
    public static void main(String[] args) {
        Facade facade = new Facade();
        facade.method();
    }
}
```
**用例预期结果：**
```properties
Connected to the target VM, address: '127.0.0.1:61790', transport: 'socket'
对外提供接口执行
SubSystemOne.method
SubSystemTwo.method
Disconnected from the target VM, address: '127.0.0.1:61790', transport: 'socket'
```

## 二，适配模式模式应用场景
### 2.1 场景概述
> 日常，我们会遇到这样一种情况，比如组合支付，我们在构造组合支付的时候可以使用外观模式来实现，使用外观模式还有一个附带的好处，就是能够有选择性地暴露方法。一个模块中定义的方法可以分成两部分，一部分是给子系统外部使用的，一部分是子系统内部模块之间相互调用时使用的。有了PayFacade类，那么用于子系统内部模块之间相互调用的方法就不用暴露给子系统外部了。

### 2.2 实例概况
> 背景：支付的时候我们会遇到多种模式组合支付，比如，支付宝和微信支付。
> 冲突：当我们支付宝余额不够的时候，我们可以结合微信实现合并付款等这个时候我们对外提供结构的时候可以进行统一封装。
### 2.3 代码实战
**定义支付宝支付组件：**
```java
/**
 * Description: 支付宝支付组件
 * <br/>
 * ZFBPayComponent
 *
 * @author laiql
 * @date 2021/10/26 17:24
 */
@Data
@AllArgsConstructor
public class ZFBPayComponent {
    private String userId;
    private BigDecimal money;
    /**
     * 支付方法
     */
    public void pay() {
        System.out.println("用户ID: " + userId + " 支付宝付款:" + money + "元");
    }
}
```
**定义微信支付组件：**
```java
/**
 * Description: 微信支付组件
 * <br/>
 * WxPayComponent
 *
 * @author laiql
 * @date 2021/10/26 17:24
 */
@Data
@AllArgsConstructor
public class WxPayComponent {

    private String userId;
    private BigDecimal money;

    /**
     * 支付方法
     */
    public void pay() {
        System.out.println("用户ID: " + userId + " 微信付款:" + money + "元");
    }
}
```
**定义统一支付门面：**
```java
/**
 * Description: 组合付款门面
 * <br/>
 * PayFacade
 *
 * @author laiql
 * @date 2021/10/26 17:27
 */
public class PayFacade {

    private WxPayComponent wxPayComponent;
    private ZFBPayComponent zfbPayComponent;

    public PayFacade(WxPayComponent wxPayComponent, ZFBPayComponent zfbPayComponent) {
        this.wxPayComponent = wxPayComponent;
        this.zfbPayComponent = zfbPayComponent;
    }
    /**
     * 统一组合支付门面
     */
    public void unifiedPayment() {
        this.zfbPayComponent.pay();
        this.wxPayComponent.pay();
        System.out.println("合计：" + new BigDecimal("0").add(wxPayComponent.getMoney()).add(zfbPayComponent.getMoney()));
    }
}
```
**测试用例：**
```java
/**
 * Description: 外观模式测试用例
 * <br/>
 * FacadeTest
 *
 * @author laiql
 * @date 2021/10/22 9:59 下午
 */
public class FacadeTest {
    @Test
    public void facadeTest() {
        PayFacade payFacade = new PayFacade(new WxPayComponent("10001", new BigDecimal(10)),
                new ZFBPayComponent("10001", new BigDecimal(10)));
        payFacade.unifiedPayment();
    }
}
```
测试用例预期结果：
```properties
Connected to the target VM, address: '127.0.0.1:60612', transport: 'socket'
用户ID: 10001 支付宝付款:10元
用户ID: 10001 微信付款:10元
合计：20
Disconnected from the target VM, address: '127.0.0.1:60612', transport: 'socket'
Process finished with exit code 0
```
## 三、优缺点
### 3.1优点
●　　松散耦合

>外观模式松散了客户端与子系统的耦合关系，让子系统内部的模块能更容易扩展和维护。

●　　简单易用

>外观模式让子系统更加易用，客户端不再需要了解子系统内部的实现，也不需要跟众多子系统内部的模块进行交互，只需要跟外观类交互就可以了。

●　　更好的划分访问层次

>通过合理使用Facade，可以帮助我们更好地划分访问的层次。有些方法是对系统外的，有些方法是系统内部使用的。把需要暴露给外部的功能集中到外观中，这样既方便客户端使用，也很好地隐藏了内部的细节。

### 3.2 缺点
> + 在不引入抽象外观类的情况下，增加新的子系统可能需要修改外观类或客户端的源代码，违背了“开闭原则”
> + 不能很好地限制客户使用子系统类，如果对客户访问子系统类做太多的限制则减少了可变性和灵活性。

## 四、总结
> + 外观模式的实现核心主要是——由外观类去保存各个子系统的引用，实现由一个统一的外观类去包装多个子系统类，然而客户端只需要引用这个外观类，然后由外观类来调用各个子系统中的方法。
>+ 这样的实现方式非常类似适配器模式，然而外观模式与适配器模式不同的是：适配器模式是将一个对象包装起来以改变其接口，而外观是将一群对象 ”包装“起来以简化其接口。它们的意图是不一样的，适配器是将接口转换为不同接口，而外观模式是提供一个统一的接口来简化接口。
>+ 很多时候不是设计模式没有用，而是自己编程开发经验不足导致即使学了设计模式也很难驾驭。毕竟这些知识都是经过一些实际操作提炼出来的精华。

[代码地址](https://gitee.com/unicornlai/smart-design-pattern/tree/master/smart-dp-facade)
<HideArticle/>
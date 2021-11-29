---
title: 手撸设计模式-桥接模式
date: 2021-11-26
tags:
  - 桥接模式
categories:
  - 设计模式
---

## 一 、桥接模式介绍
> 桥接模式，又叫桥梁模式，顾名思义，就是一座 “桥”，那什么是桥呢？比如我们下面会举的例子，手机又手机品牌和手机游戏等等，每个手机品牌都有多款游戏，那是不是二者之间就是聚合关系了，这是合成/和聚合复用的原则体现，当我们发现类又多层继承时就可以靠用桥接模式，用聚合代替继承。
>
桥接模式（Bridge），将抽象部分与它的实现部分分离，使它们都可以独立地变化。UML结构图如下：
![桥接模式UML](https://img-blog.csdnimg.cn/bd23141a355147c0961223170a6ffd99.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_13,color_FFFFFF,t_70,g_se,x_16)
>+ 其中，Abstraction为抽象化角色，定义出该角色的行为，同时保存一个对实现化角色的引用；Implementor是实现化角色，它是接口或者抽象类，定义角色必需的行为和属性；RefinedAbstraction为修正抽象化角色，引用实现化角色对抽象化角色进行修正；ConcreteImplementor为具体实现化角色，实现接口或抽象类定义的方法或属性。
> + 是不是感觉上面这段话很难懂，其实说简单点就是在Abstraction和Implementor之间架了一座桥（聚合线），这里体现了一个原则就是合成/聚合复用原则，具体看目录篇对基本原则的讲解及举例。下面放上一张图 和 模板代码。

![桥接模式](https://img-blog.csdnimg.cn/9b27523997af4930bf0c773dad26483c.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_17,color_FFFFFF,t_70,g_se,x_16)
## 二、桥接模式的应用

### 2.1 何时使用
>系统可能有多个角度分类，每一种角度都可能变化时
### 2.2 方法
>把这种角度分类分离出来，让它们单独变化，减少它们之间的耦合（合成/聚合复用原则）
### 2.3 优点
>抽象和实现分离。桥梁模式完全是为了解决继承的缺点而提出的设计模式
优秀的扩展能力
实现细节对客户透明。客户不用关心细节的实现，它已经由抽象层通过聚合关系完成了封装
### 2.4 缺点
会增加系统的理解与设计难度。由于聚合关联关系建立在抽象层，要求开发者针对抽象进行设计与编程
### 2.5 使用场景
>不希望或不适用使用继承的场景
接口或抽象类不稳定的场景
重用性要求较高的场景
### 2.6 应用实例
>开关。我们可以看到的开关是抽象的，不用管里面具体怎么实现
手机品牌与手机软件。两者间有一条聚合线，一个手机品牌可以有多个手机软件
### 2.7 注意事项
>不要一涉及继承就考虑该模式，尽可能把变化的因素封装到最细、最小的逻辑单元中，避免风险扩散
当发现类的继承有n层时，可以考虑使用该模式
## 三、桥接模式的实现
>下面我们举一个例子，就拿上面说的手机品牌与手机软件为例，我们可以让手机既可以按照手机品牌来分类，也可以按手机软件来分类。由于实现的方式有多种，桥接模式的核心意图就是把这些实现独立出来，让它们各自地变化，这就使得没中实现的变化不会影响其他实现，从而达到应对变化的目的。

### 3.1 手机品牌抽象类
> 桥梁的一头.
```java
/**
 * Description: 手机品牌抽象类
 * <br/>
 * HandsetBrand
 * 桥梁的一头A
 *
 * @author laiql
 * @date 2021/10/22 11:51
 */
public abstract class HandsetBrand {
    protected HandsetSoft soft;
    /**
     * 设置手机运行软件
     *
     * @param soft 软件
     */
    public void setSoft(HandsetSoft soft) {
        this.soft = soft;
    }
    /**
     * 手机运行软件方法
     */
    public abstract void run();
}
```
### 3.2 软件抽象类
>桥梁的另一头。两者通过一条聚合线连接，表示一个手机品牌可以有多个软件。
```java
/**
 * Description: 手机软件抽象类
 * <br/>
 * HandsetSoft
 * 桥梁的另一头B,两者通过一条聚合线连接，表示一个手机品牌可以有多个软件。
 *
 * @author laiql
 * @date 2021/10/22 11:51
 */
public abstract class HandsetSoft {
    /**
     * 软件运行方法
     */
    public abstract void run();
}
```
### 3.3 各类手机品牌
> 多种品牌手机
```java
/**
 * Description: Apple 品牌手机服务
 * <br/>
 * AppleHandsetBrandService
 *
 * @author laiql
 * @date 2021/10/22 11:56
 */
public class AppleHandsetBrandService extends HandsetBrand {
    @Override
    public void run() {
    //调用运行软件
        soft.run();
    }
}
```
### 3.4. 各类手机软件
> 多种软件
```java
/**
 * Description: 各类手机软件
 * <br/>
 * HandsetGame
 * 游戏软件
 * @author laiql
 * @date 2021/10/22 13:45
 */
public class HandsetGame extends HandsetSoft {
    @Override
    public void run() {
        System.out.println("运行手机游戏");
    }
}
```

### 3.5 测试用例
```java
    @Test
    public void test() {
        //创建一个Apple品牌手机实例
        HandsetBrand appleHandsetBrandService = new AppleHandsetBrandService();
        System.out.println("Apple:");
        //手机运行游戏软件
        appleHandsetBrandService.setSoft(new HandsetGame());
        appleHandsetBrandService.run();

        HandsetBrand huaweiHandsetBrandService = new HuaweiHandsetBrandService();

        System.out.println("Huawei:");
        //手机运行通讯录
        huaweiHandsetBrandService.setSoft(new HandsetAddressList());
        huaweiHandsetBrandService.run();
    }
```
运行结果如下：
![桥接模式测试用例运行结果](https://img-blog.csdnimg.cn/0c3d55dc45b746859bb2c7767802301a.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
[代码地址](https://gitee.com/unicornlai/smart-design-pattern/tree/master/smart-dp-bridging)
## 四、总结：
> 这样我现在如果想要增加一个功能，比如音乐播放器，那么只有增加这个类就可以了，不会影响到其他任何类，类的个数增加也只是一个；如果是要增加S品牌，只需要增加一个品牌的子类就可以了，个数也是一个，不会影响到其他类。这显然符合开放-封闭原则。

> 而这里用到的合成/聚合复用原则是一个很有用处的原则，即优先使用对象的合成或聚合，而不是继承。究其原因是因为继承是一种强耦合的结构，父类变，子类就必须变。
<HideArticle/>
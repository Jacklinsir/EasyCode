---
title: 手撸设计模式-适配器模式
date: 2021-11-26
tags:
  - 适配器模式
categories:
  - 设计模式
---

## 一 、适配器模式介绍
### 1.1 定义
> 我喜欢的样子你都有 !
> 你喜欢的样子我有没有 !
> 没有的话，我送你个适配器，好吗 !

> 将一个类的接口转换成客户希望的另外一个接口。适配器模式使得原本由于接口不兼容而不能在一起工作的那些类可以一起工作。——《设计模式：可复用面向对象软件的基础》
### 1.2 生活场景
![适配器模式插图](https://img-blog.csdnimg.cn/de0ba721052343e68f672b64569c37b3.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_17,color_FFFFFF,t_70,g_se,x_16)
> 适配器模式主要的作用就是将原来不兼容的接口，通过适配修改做到统一，使得用户方便使用，就像多年前的日常经常使用到的**万能充，数据线，MAC笔记本转换头，出国买个插座**等等案例。

**除了我们生活中出现的各种适配的场景，那么在业务开发中呢？**
> 在业务开发中我们会经常的需要做不同接口的兼容，尤其是中台服务，中台需要把各个业务线的各种类型服务做统一包装，再对外提供接口进行使用。而这在我们平常的开发中也是非常常见的。
### 1.3 角色
> + 目标角色（target）：这是客户锁期待的接口。目标可以是具体的或抽象的类，也可以是接口
> + 适配者角色（adaptee）：已有接口，但是和客户器期待的接口不兼容。
> + 适配器角色（adapter）：将已有接口转换成目标接口。
### 1.4 适配器模式UML结构图

![适配器模式UML结构图](https://img-blog.csdnimg.cn/ad9067a99d284925a60b74cfa8bd0c4e.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_19,color_FFFFFF,t_70,g_se,x_16)
> 如上图，因为java没有类多继承，所以只能实现Target接口，而且Target只能是接口。Adapter实现了Target接口，继承了Adaptee类，Target.operation()实现为Adaptee.specificOperation()。
### 1.5 代码案例
**目标抽象接口定义：**
```java
/**
 * Description: 目标抽象接口
 * <br/>
 * Target
 * @author laiql
 * @date 2021/10/25 18:54
 */
public interface Target {
    /**
     * Adaptee没有的功能
     */
    void request();
}
```

**源类定义：**
```java
/**
 * Description: 源类
 * <br/>
 * Adaptee
 *
 * @author laiql
 * @date 2021/10/25 19:08
 */
public class Adaptee {
    public void specificRequest(){
        System.out.println("Adaptee.specificRequest");
    }
}
```
**适配类定义：**
```java
/**
 * Description: 创建适配类
 * <br/>
 * Adapter
 * 适配器Adapter继承自Adaptee，同时又实现了目标(Target)接口。
 *
 * @author laiql
 * @date 2021/10/25 19:08
 */
public class Adapter extends Adaptee implements Target {
    /**
     * 目标接口要求调用Request()这个方法名，但源类Adaptee没有方法Request()
     * 因此适配器补充上这个方法名
     * 但实际上Request()只是调用源类Adaptee的SpecificRequest()方法的内容
     * 所以适配器只是将SpecificRequest()方法作了一层封装，封装成Target可以调用的Request()而已
     */
    @Override
    public void request() {
        this.specificRequest();
        //实现自己的业务逻辑
    }
}
```
**测试用例定义：**
```java
public class AdapterPatternDemo {

    public static void main(String[] args) {
        Target target = new Adapter();
        target.request();
    }
}
```
预期结果输出：
```properties
Connected to the target VM, address: '127.0.0.1:51756', transport: 'socket'
Adaptee.specificRequest
Disconnected from the target VM, address: '127.0.0.1:51756', transport: 'socket'
```
## 二，适配模式模式应用场景
### 2.1 场景介绍
> 在日常生活中，我们需要讲标准的220V的电压转成110V电压来适配各种电器，比如笔记本电脑，手机等等，所以我们需要开发一套电压适配程序，我们采用适配器模式，适配器模式符合软件开闭原则！
> 系统需要复用现有类，而该类的接口不符合系统的需求，可以使用适配器模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作
多个组件功能类似，但接口不统一且可能会经常切换时，可使用适配器模式，使得客户端可以以统一的接口使用它们


2.2 对象的适配器模式与类的适配器模式对比
> 对象的适配器模式与类的适配器模式相同，对象的适配器模式也是把适配的类的API转换成为目标类的API。
> 与类的适配器模式不同的是，对象的适配器模式不是使用继承关系连接到Adaptee类，而是使用委派关系连接到Adaptee类。
### 2.3 代码实践
**目标电压接口定义：**
```java
/**
 * Description: 目标电压接口
 * <br/>
 * TargetVoltage
 *
 * @author laiql
 * @date 2021/10/25 19:13
 */
public interface TargetVoltage {
    /**
     * 将220v转换成110v（原有插头（Adaptee）没有的）
     */
    Integer convert();
}
```
**源标准电压类定义：**
```java
/**
 * Description: 原电压220V
 * <br/>
 * SourceVoltage
 *
 * @author laiql
 * @date 2021/10/25 19:17
 */
public class SourceVoltage {
    private static Integer voltage = 220;
    /**
     * 输出电压
     */
    public Integer outVoltage() {
        return voltage;
    }
}
```
**电压适配器类定义：**
```java
/**
 * Description: 适配电压
 * <br/>
 * AdapterVoltage
 *
 * @author laiql
 * @date 2021/10/25 19:19
 */
public class AdapterVoltage implements TargetVoltage {

    private static final Integer adapterVoltage = 110;
    /**
     * 关联适配的类
     */
    private SourceVoltage sourceVoltage;
    public AdapterVoltage(SourceVoltage sourceVoltage) {
        this.sourceVoltage = sourceVoltage;
    }
    @Override
    public Integer convert() {
        //源电压
        Integer source = this.sourceVoltage.outVoltage();
        //目标电压
        Integer target = source - adapterVoltage;
        return target;
    }
}
```
**测试用例定义：**
```java
  TargetVoltage targetVoltage = new AdapterVoltage(new SourceVoltage());
        System.out.println("输出电压：" + targetVoltage.convert() + "V");
```
**预期输出结果：**
```properties
输出电压：110V
Disconnected from the target VM, address: '127.0.0.1:53024', transport: 'socket'
```
## 三、优缺点
### 3.1 适配器模式
**优点：**
> 更好的复用性，系统需要使用现有的类，而此类的接口不符合系统的需要。那么通过适配器模式就可以让这些功能得到更好的复用。
> 透明、简单，客户端可以调用同一接口，因而对客户端来说是透明的。这样做更简单 、 更直接。
> 更好的扩展性、在实现适配器功能的时候，可以调用自己开发的功能，从而自然地扩展系统的功能。
> 解耦性，将目标类和适配者类解耦，通过引入一个适配器类重用现有的适配者类，而无需修改原有代码。
> 符合开放-关闭原则，同一个适配器可以把适配者类和它的子类都适配到目标接口；可以为不同的目标接口实现不同的适配器，而不需要修改待适配类。

**缺点：**
> 过多的使用适配器，会让系统非常零乱，不易整体进行把握

## 三、总结
> 上文可以看到不使用适配器模式这些功能同样可以实现，但是使用了适配器模式就可以让代码：干净整洁易于维护、减少大量重复的判断和使用、让代码更加易于维护和拓展。

[代码地址](https://gitee.com/unicornlai/smart-design-pattern/tree/master/smart-dp-adapter)

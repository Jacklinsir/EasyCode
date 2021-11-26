---
title: 手撸设计模式-装饰器模式
date: 2021-11-26
tags:
  - 装饰器模式
categories:
  - 设计模式
---

## 一 、装饰器模式介绍
> 装饰器模式主要是对现有的类和对象进行包装和封装，以期望不改变其类对象及其类定义的情况下，为对象添加额外的功能，是一种对象结构模式，需要注意的是，该过程是通过调用被包裹之后的对象完成功能添加的，而不是直接修改现有的对象的行为，相当于加了中间层，符合软件开发原则里面的**开闭原则**。

### 1.1 装饰器模式的目的
> + 可以动态的为同一类的不同对象加以修饰后以添加新的功能。
> + 实现灵活的对类对象的功能进行扩展。
### 1.2 优缺点
> + 优点
    > 相比较于类的继承来扩展功能，对对象进行包裹更加的灵活；
    > 装饰类和被装饰类相互独立，耦合度较低；
> + 缺点
    > 没有继承结构清晰
    > 包裹层数较多时，难以理解和管理。
### 1.3 应用场景
> 动态的增加对象的功能。
> 不能以派生子类的方式来扩展功能。
> 限制对象的执行条件。
> 参数控制和检查等。
### 1.4 原理设计
**典型的装饰器模式的UML类图：**

![典型的装饰器模式的UML类图](https://img-blog.csdnimg.cn/255f2d0575e24185a4badf486333f73b.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_17,color_FFFFFF,t_70,g_se,x_16)
>装饰器主要解决的是直接继承下因功能的不断横向扩展导致子类膨胀的问题，而是用装饰器模式后就会比直接继承显得更加灵活同时这样也就不再需要考虑子类的维护。

**在装饰器模式中有四个比较重要点抽象出来的点；**

> + 抽象构件角色(Component) - 定义抽象接口
    >  + 具体构件角色(ConcreteComponent) - 实现抽象接口，可以是一组
>  + 装饰角色(Decorator) - 定义抽象类并继承接口中的方法，保证一致性
>  + 具体装饰角色(ConcreteDecorator) - 扩展装饰具体的实现逻辑

### 1.5 UML Demo用例
**对象的接口类，定义装饰对象和被装饰对象的共同接口：**
```java
/**
 * Description: 对象的接口类，定义装饰对象和被装饰对象的共同接口；
 * <br/>
 * Component
 *
 * @author laiql
 * @date 2021/10/25 10:04
 */
public interface Component {
    void operate();
}
```
**被装饰对象的类定义:**
```java
/**
 * Description: 被装饰对象的类定义
 * <br/>
 * ConcreteComponent
 *
 * @author laiql
 * @date 2021/10/25 10:06
 */
public class ConcreteComponent implements Component {
    @Override
    public void operate() {
        System.out.println("操作A");
    }
}
```
**装饰对象的抽象类，持有一个具体的被修饰对象，并实现接口类继承的公共接口:**
```java
/**
 * Description: 装饰对象的抽象类，持有一个具体的被修饰对象，并实现接口类继承的公共接口
 * <br/>
 * Decorator
 *
 * @author laiql
 * @date 2021/10/25 10:07
 */
public abstract class Decorator implements Component {
    protected Component component;

    public Decorator(Component component) {
        this.component = component;
    }
    @Override
    public void operate() {
        component.operate();
    }
}
```
**具体的装饰器，负责往悲壮时对其添加额外的功能:**
```java
/**
 * Description: 具体的装饰器，负责对其添加额外的功能
 * <br/>
 * ConcreteDecorator
 *
 * @author laiql
 * @date 2021/10/25 10:12
 */
public class ConcreteDecorator extends Decorator {
    public ConcreteDecorator(Component component) {
        super(component);
    }
    @Override
    public void operate() {
        component.operate();
        System.out.println("扩展操作A功能");
    }
}
```
**测试客户端：**
```java
/**
 * Description: 操作客户端
 * <br/>
 * Client
 *
 * @author laiql
 * @date 2021/10/25 10:13
 */
public class Client {
    public static void main(String[] args) {
        Component component = new ConcreteComponent();
        component.operate();
        System.out.println("===================");
        //对原有对象包装
        Component concreteDecorator = new ConcreteDecorator(component);
        concreteDecorator.operate();
    }
}
```
### 二，装饰器模式应用场景
> 模拟装饰汽车场景，以一辆标准的汽车为基础，通过装饰器模式实现各种品牌车开发，符合软件开发原则中的开闭原则！

### 2.1装饰器模式模型结构
![装饰器模式模型结构](https://img-blog.csdnimg.cn/65df642f4d9745259c4553349940d30c.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
> + 以上是一个装饰器实现的类图结构，重点的类是AbstractDecorator，这个类是一个抽象类主要完成了对接口Car继承。
> + 当装饰角色继承接口后会提供构造函数，入参就是继承的接口实现类即可，这样就可以很方便的扩展出不同功能组件。

### 2.1 案例代码实现
**汽车抽象接口定义:**
```java
/**
 * Description: 汽车抽象接口定义
 * <br/>
 * Car
 *
 * @author laiql
 * @date 2021/10/25 10:37
 */
public interface Car {
    void build();
}
```
**汽车被装饰对象定义:**
```java
/**
 * Description: 汽车被装饰对象定义
 * <br/>
 * CarComponent
 * @author laiql
 * @date 2021/10/25 10:38
 */
public class CarComponent implements Car {
    @Override
    public void build() {
        System.out.println("轮子+外壳+发动机=标准Car");
    }
}
```
**装饰对象的抽象类:**
```java
/**
 * Description: 装饰对象的抽象类，持有一个具体的被修饰的对象，并实现接口类的公共类
 * <br/>
 * AbstractDecorator
 *
 * @author laiql
 * @date 2021/10/25 10:41
 */
public abstract class AbstractDecorator implements Car {
    protected Car car;
    public AbstractDecorator(Car car) {
        this.car = car;
    }
    @Override
    public void build() {
        car.build();
    }
}
```
**具体的装饰器，负责对其添加额外的功能对象定义：**
```java
/**
 * Description: 具体的装饰器，负责对其添加额外的功能对象
 * <br/>
 * BmwCarComponent
 *
 * @author laiql
 * @date 2021/10/25 10:45
 */
public class BmwCarComponent extends AbstractDecorator {
    public BmwCarComponent(Car car) {
        super(car);
    }
    @Override
    public void build() {
        super.build();
        //拓展额外功能
        System.out.println("增加宝马车牌，装饰成宝马！！！");
    }
}
```
**装饰者模式测试用例:**
```java
    @Test
    public void decorateTest() {
        //构造一辆Bwm品牌车
        Car car = new BmwCarComponent(new CarComponent());
        car.build();
    }
```
**测试验证结果：**
```properties
Connected to the target VM, address: '127.0.0.1:51292', transport: 'socket'
轮子+外壳+发动机=标准Car
增加宝马车牌，装饰成宝马！！！
Disconnected from the target VM, address: '127.0.0.1:51292', transport: 'socket'
```
+ 符合预期验证结果，实现了不通过继承方式，扩展类的功能！
## 三，总结
> + 使用装饰器模式满足单一职责原则，你可以在自己的装饰类中完成功能逻辑的扩展，而不影响主类，同时可以按需在运行时添加和删除这部分逻辑。另外装饰器模式与继承父类重写方法，在某些时候需要按需选择，并不一定某一个就是最好。
> + 装饰器实现的重点是对抽象类继承接口方式的使用，同时设定被继承的接口可以通过构造函数传递其实现类，由此增加扩展性并重写方法里可以实现此部分父类实现的功能。

[代码地址](https://gitee.com/unicornlai/smart-design-pattern/tree/master/smart-dp-decorate)
---
title: 手撸设计模式-享元模式
date: 2021-11-26
tags:
  - 享元模式
categories:
  - 设计模式
---

## 一 、享元模式介绍
### 1.1 定义
> + 享元（Flyweight）模式的定义：运用共享技术来有效地支持大量细粒度对象的复用。它通过共享已经存在的对象来大幅度减少需要创建的对象数量、避免大量相似类的开销，从而提高系统资源的利用率。
> + 享元模式的主要优点是：相同对象只要保存一份，这降低了系统中对象的数量，从而降低了系统中细粒度对象给内存带来的压力
### 1.2 享元模式的原理
>享元模式中会存在两个要求，细粒度和共享对象，因为要求细粒度，所以不可以避免地会使对象数量增多且性质也相近，此时我们就将这些对象的信息分为两个部分：**内部状态和外部状态**。
>+ 内部状态指对象共享出来的信息，存储在享元信息内部，并且不会随环境的变化而变化。
>+ 外部状态指的对象得以依赖的一个标记，随着环境的改变而改变，不可以共享。
>+ 享元模式的本质是缓存共享对象，降低内存消耗。

### 1.2 享元模式的结构
> **享元模式的主要角色有如下:**
> + 抽象享元角色（Flyweight）：是所有的具体享元类的基类，为具体享元规范需要实现的公共接口，非享元的外部状态以参数的形式通过方法传入。
> + 具体享元（Concrete Flyweight）角色：实现抽象享元角色中所规定的接口。
> + 非享元（Unsharable Flyweight)角色：是不可以共享的外部状态，它以参数的形式注入具体享元的相关方法中。
> + 享元工厂（Flyweight Factory）角色：负责创建和管理享元角色。当客户对象请求一个享元对象时，享元工厂检査系统中是否存在符合要求的享元对象，如果存在则提供给客户；如果不存在的话，则创建一个新的享元对象。

> **享元模式的结构图，其中：**
> + UnsharedConcreteFlyweight 是非享元角色，里面包含了非共享的外部状态信息 info；
> + Flyweight 是抽象享元角色，里面包含了享元方法 operation(UnsharedConcreteFlyweight state)，非享元的外部状态以参数的形式通过该方法传入；
> + ConcreteFlyweight 是具体享元角色，包含了关键字 key，它实现了抽象享元接口；
> + FlyweightFactory 是享元工厂角色，它是关键字 key 来管理具体享元；
    客户角色通过享元工厂获取具体享元，并访问具体享元的相关方法。
    ![享元模式结构图](https://img-blog.csdnimg.cn/8263cabc14be41f485e5b71f7084bf1f.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_17,color_FFFFFF,t_70,g_se,x_16)

### 1.3 代码实现
**享元角色抽象类定义：**
```java
/**
 * Description: 享元角色抽象类
 * <br/>
 * Flyweight
 *
 * @author laiql
 * @date 2021/10/27 16:15
 */
public abstract class Flyweight {

    /**
     * 内部状态
     */
    private String intrinsic;

    /**
     * 外部状态
     */
    protected final String extrinsic;

    protected Flyweight(String extrinsic) {
        this.extrinsic = extrinsic;
    }

    /**
     * 抽象定义业务操作
     *
     * @param extrinsic
     */
    public abstract void operate(int extrinsic);

    public String getIntrinsic() {
        return intrinsic;
    }

    public void setIntrinsic(String intrinsic) {
        this.intrinsic = intrinsic;
    }
}
```
**外部状态具体享元角色定义：**
```java
/**
 * Description: 继承Flyweight超类或实现Flyweight接口，并为其内部状态增加存储空间
 * <br/>
 * ConcreteFlyweight
 *
 * @author laiql
 * @date 2021/10/27 16:19
 */
public class ConcreteFlyweight extends Flyweight {

    /**
     * 接受外部状态
     *
     * @param extrinsic
     */
    protected ConcreteFlyweight(String extrinsic) {
        super(extrinsic);
    }

    /**
     * 根据外部状态进行逻辑处理
     *
     * @param extrinsic
     */
    @Override
    public void operate(int extrinsic) {
        System.out.println("具体Flyweight:" + extrinsic);
    }
}
```
**非享元角色定义：**
```java
/**
 * Description: 指那些不需要共享的Flyweight子类
 * <br/>
 * UnsharedConcreteFlyweight
 *
 * @author laiql
 * @date 2021/10/27 16:20
 */
public class UnsharedConcreteFlyweight extends Flyweight {

    protected UnsharedConcreteFlyweight(String extrinsic) {
        super(extrinsic);
    }

    @Override
    public void operate(int extrinsic) {
        System.out.println("不共享的具体Flyweight:" + extrinsic);
    }
}
```
**享元工厂角色定义：**
```java
/**
 * Description: 一个享元工厂，用来创建并管理Flyweight对象，主要是用来确保合理地共享Flyweight，当用户请求一个Flyweight时，FlyweightFactory对象提供一个已创建的实例或创建一个实例
 * <br/>
 * FlyweightFactory
 *
 * @author laiql
 * @date 2021/10/27 16:21
 */
public class FlyweightFactory {

    /**
     * 定义一个池容器
     */
    private static HashMap<String, Flyweight> pool = new HashMap<>();

    public static Flyweight getFlyweight(String extrinsic) {
        Flyweight flyweight = null;

        if (pool.containsKey(extrinsic)) {
            flyweight = pool.get(extrinsic);
            System.out.print("已有 " + extrinsic + " 直接从池中取---->");
        } else {
            //根据外部状态创建享元对象
            flyweight = new ConcreteFlyweight(extrinsic);
            //放入共享池
            pool.put(extrinsic, flyweight);
            System.out.print("创建 " + extrinsic + " 并从池中取出---->");
        }
        return flyweight;
    }
}
```

**测试用例定义：**
```java
/**
 * Description: 享元模式测试用例
 * <br/>
 * Client
 *
 * @author laiql
 * @date 2021/10/27 16:24
 */
public class Client {

    public static void main(String[] args) {
        int extrinsic = 22;

        Flyweight flyweightX = FlyweightFactory.getFlyweight("X");
        flyweightX.operate(++extrinsic);

        Flyweight flyweightY = FlyweightFactory.getFlyweight("Y");
        flyweightY.operate(++extrinsic);

        Flyweight flyweightZ = FlyweightFactory.getFlyweight("Z");
        flyweightZ.operate(++extrinsic);

        Flyweight flyweightReX = FlyweightFactory.getFlyweight("X");
        flyweightReX.operate(++extrinsic);

        Flyweight unsharedFlyweight = new UnsharedConcreteFlyweight("X");
        unsharedFlyweight.operate(++extrinsic);
    }
}
```

**用例预期结果：**
```properties
Connected to the target VM, address: '127.0.0.1:54195', transport: 'socket'
创建 X 并从池中取出---->具体Flyweight:23
创建 Y 并从池中取出---->具体Flyweight:24
创建 Z 并从池中取出---->具体Flyweight:25
已有 X 直接从池中取---->具体Flyweight:26
不共享的具体Flyweight:27
Disconnected from the target VM, address: '127.0.0.1:54195', transport: 'socket'
```
## 二、享元模式应用场景
### 2.1 场景介绍
> + 当系统中有大量对象时，且这些对象消耗大量内存时，或者这些对象的状态大部分可以外部化时，有这些场景都可以采用享元模式实现缓冲池的场景。
> + 享元模式一般情况下使用此结构在平时的开发中并不太多，除了一些线程池、数据库连接池外，再就是游戏场景下的场景渲染。另外这个设计的模式思想是减少内存的使用提升效率，与我们之前使用的原型模式通过克隆对象的方式生成复杂对象，减少rpc的调用，都是此类思想。
### 2.2 使用方法
> 用唯一标识码判断，如果在内存中有，则返回这个唯一标识码所标识的对象，用HashMap/HashTable存储。
### 2.3 代码实现
> 模拟一个数据源缓存池化场景

**创建数据源类定义：**
```java
/**
 * Description: 数据源对象定义
 * <br/>
 * DataSource
 *
 * @author laiql
 * @date 2021/10/27 17:10
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public  class DataSource {
    private String driveClassName;
    private String username;
    private String password;
}
```
**抽象享元角色数据源类定义：**
```java
/**
 * Description: 享元抽象数据源对象
 * <br/>
 * AbstractDataSource
 *
 * @author laiql
 * @date 2021/10/27 17:13
 */
public abstract class AbstractDataSource {

    protected DataSource dataSource;

    public AbstractDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }
    //委派工作的类
    public abstract DataSource getDatasource();
}
```
**具体数据源对象定义：**
```java
/**
 * Description: 具体数据源对象
 * <br/>
 * DruidDataSource
 *
 * @author laiql
 * @date 2021/10/27 17:16
 */
public class DruidDataSource extends AbstractDataSource {

    public DruidDataSource(DataSource dataSource) {
        super(dataSource);
    }
    @Override
    public DataSource getDatasource() {
        System.out.println(super.dataSource.toString());
        return super.dataSource;
    }
}
```
**享元工厂数据源类定义：**
```java
/**
 * Description: 数据源工厂类
 * <br/>
 * DataSourceFactory
 *
 * @author laiql
 * @date 2021/10/27 17:17
 */
public class DataSourceFactory {

    private static Map<String, DruidDataSource> POOL = new ConcurrentHashMap<>(265);

    public static AbstractDataSource getDatasource(String key) {
        if (!POOL.containsKey(key)) {
            DataSource dataSource = new DataSource();
            dataSource.setUsername("root");
            dataSource.setPassword("root");
            dataSource.setDriveClassName("com.mysql.jdbc.Drive");
            POOL.put(key, new DruidDataSource(dataSource));
            System.out.print("创建 " + key + " 并从池中取出---->");
            return POOL.get(key);
        }
        System.out.print("已有 " + key + " 直接从池中取---->");
        return POOL.get(key);
    }
}
```
**测试用例定义：**
```java
   @Test
    public void flyweightTest() {
        AbstractDataSource datasource = DataSourceFactory.getDatasource("K");
        datasource.getDatasource();
        DataSourceFactory.getDatasource("K").getDatasource();
        DataSourceFactory.getDatasource("Y").getDatasource();
    }
```
**预期输出结果：**
```properties
Connected to the target VM, address: '127.0.0.1:59586', transport: 'socket'
创建 K 并从池中取出---->DataSource(driveClassName=com.mysql.jdbc.Drive, username=root, password=root)
已有 K 直接从池中取---->DataSource(driveClassName=com.mysql.jdbc.Drive, username=root, password=root)
创建 Y 并从池中取出---->DataSource(driveClassName=com.mysql.jdbc.Drive, username=root, password=root)
Disconnected from the target VM, address: '127.0.0.1:59586', transport: 'socket'
```
### 2.4 享元模式优缺点
+ 优点：
> 大大减少了对象的创建，降低了程序内存的占用，提高效率
+ 缺点：
>  提高了系统的复杂度。需要分离出内部状态和外部状态，而外部状态具有固化特性，不应该随着内部状态的改变而改变

## 三、总结
> + 关于享元模式的设计可以着重学习享元工厂的设计，在一些有大量重复对象可复用的场景下，使用此场景在服务端减少接口的调用，在客户端减少内存的占用。是这个设计模式的主要应用方式。
> + 另外通过map结构的使用方式也可以看到，使用一个固定id来存放和获取对象，是非常关键的点。而且不只是在享元模式中使用，一些其他工厂模式、适配器模式、组合模式中都可以通过map结构存放服务供外部获取，减少ifelse的判断使用。
> + 当然除了这种设计的减少内存的使用优点外，也有它带来的缺点，在一些复杂的业务处理场景，很不容易区分出内部和外部状态，如果不能很好的拆分状态，就会把享元工厂设计的非常混乱，难以维护。

## 四、其他
[代码地址](https://gitee.com/unicornlai/smart-design-pattern/tree/master/smart-dp-flyweight)
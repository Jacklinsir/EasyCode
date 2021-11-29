---
title: 手撸设计模式-建造者模式
date: 2021-11-25
tags:
  - 建造者模式
categories:
  - 设计模式
---
## 一、建造者模式介绍
### 1.1 定义
> **建造者（Builder）模式**的定义：指将一个复杂对象的构造与它的表示分离，使同样的构建过程可以创建不同的表示，这样的设计模式被称为建造者模式。他是将一个复杂的对象分解为多个简单的对象，然后一步步构建成一个完整的对象，它将变与不变相分离，即产品的组成部分是不变的，但每一部分是可以灵活选择的。
### 1.2 建造者模式结构
**建造者（Builder）模式由产品、抽象建造者、具体建造者、指挥者等 4 个要素构成。**
> + 产品角色（Product）：它是包含多个组成部件的复杂对象，由具体建造者来创建其各个零部件。
> + 抽象建造者（Builder）：它是一个包含创建产品各个子部件的抽象方法的接口，通常还包含一个返回复杂产品的方法 getProduct()。
> + 具体建造者(Concrete Builder）：实现 Builder 接口，完成复杂产品的各个部件的具体创建方法。
> + 指挥者（Director）：它调用建造者对象中的部件构造与装配方法完成复杂对象的创建，在指挥者中不涉及具体产品的信息。

### 1.3 建造者模式UML
![在这里插入图片描述](https://img-blog.csdnimg.cn/800b1e8e942948689af2536d64438d23.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
### 1.4 代码实现
**产品对象定义：**
```java
public class Product {
    /**
     * 产品名
     */
    private String name;
    /**
     * 价格
     */
    private BigDecimal price;
    /**
     * 产地
     */
    private String origin;

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    /**
     * 显示产品特性
     */
    public void show() {
        System.out.println("商品：" + name + "价格：" + price + "产地：" + origin);
    }
}
```
**抽象构造者对象定义：**
```java
public abstract class Builder {
    //创建产品对象
    protected Product product = new Product();

    public abstract void buildName();

    public abstract void buildPrice();

    public abstract void buildOrigin();

    public Product getProduct() {
        return product;
    }
}
```
**具体商品建造者定义：**
```java
public class ConcreteAppleBuilder extends Builder {
    @Override
    public void buildName() {
        product.setName("Apple");
    }

    @Override
    public void buildPrice() {
        product.setPrice(new BigDecimal("5888"));
    }

    @Override
    public void buildOrigin() {
        product.setOrigin("美国");
    }
}
```
**指挥者对象定义：**
```java
public class Director {

    private Builder builder;

    public Director(Builder builder) {
        this.builder = builder;
    }

    //产品构建与组装方法
    public Product construct() {
        builder.buildName();
        builder.buildPrice();
        builder.buildOrigin();
        return builder.getProduct();
    }
}
```
**测试客户端定义：**
```java
public class ClientBuilderTest {

    public static void main(String[] args) {
        //苹果测试
        Director directorApple = new Director(new ConcreteAppleBuilder());
        directorApple.construct().show();
        //橘子测试
        Director directorOrange = new Director(new ConcreteOrangeBuilder());
        directorOrange.construct().show();
    }
}
```
**预期执行结果：**
```java
商品：Apple价格：5888产地：美国
```
## 二、建造者模式场景
### 2.1 场景介绍
**用建造者（Builder）模式模拟各种品牌自信车构建：**
> 分析：自行车要构建成能在大街上跑的车，首先需要，框架，坐垫，轮胎，他们来自各种品牌商家提供，然后由专业的技工把组件进行组合，最后完成整辆车的布局构建，这整个过程体现了建造者模式。
### 2.2 场景描述图
![在这里插入图片描述](https://img-blog.csdnimg.cn/44dc69c45ad34e6885cef7badbd6e658.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
### 2.4 代码实现
**自行车零件接口定义：**
```java
public interface Bike {

    /**
     * 框架名字
     *
     * @return
     */
    String frameName();

    /**
     * 配件总价
     *
     * @return
     */
    BigDecimal totalPrice();
}
```
**一套组件类定义：**
```java
public class FengHuangCushion implements Bike {
    @Override
    public String frameName() {
        return "FH-坐垫";
    }

    @Override
    public BigDecimal totalPrice() {
        return new BigDecimal(99.0);
    }
}
public class FengHuangFrame implements Bike {
    @Override
    public String frameName() {
        return "FH-框架";
    }

    @Override
    public BigDecimal totalPrice() {
        return new BigDecimal(666.0);
    }
}
public class FengHuangTires implements Bike {

    @Override
    public String frameName() {
        return "FH-轮胎";
    }

    @Override
    public BigDecimal totalPrice() {
        return new BigDecimal(50.0);
    }
}
//其他品牌自行下载代码
```
**自行车抽象包装接口定义：**
```java
public interface IBike {

    /**
     * 自行车框架
     *
     * @return
     */
    IBike appendFrame(Bike bike);


    /**
     * 自行车轮胎
     *
     * @return
     */
    IBike appendTires(Bike bike);

    /**
     * 自行车坐垫
     *
     * @return
     */
    IBike appendCushion(Bike bike);

    /**
     * 明细
     */
    String getDetail();
}
```
**自行车组合包装类定义：**
```java
@NoArgsConstructor
public class BikeConcreteBuilderMenu implements IBike {

    /**
     * 配件清单
     */
    private List<Bike> partsList = new ArrayList<>();

    /**
     * 自行车总价
     */
    private BigDecimal price = BigDecimal.ZERO;

    private String name;

    public BikeConcreteBuilderMenu(String name) {
        this.name = name;
    }

    @Override
    public IBike appendFrame(Bike bike) {
        partsList.add(bike);
        price = price.add(bike.totalPrice());
        return this;
    }

    @Override
    public IBike appendTires(Bike bike) {
        partsList.add(bike);
        price = price.add(bike.totalPrice());
        return this;
    }

    @Override
    public IBike appendCushion(Bike bike) {
        partsList.add(bike);
        price = price.add(bike.totalPrice());
        return this;
    }


    @Override
    public String getDetail() {

        StringBuilder detail = new StringBuilder("\r\n------------------------------------------------------\r\n" +
                "配件清单" + "\r\n" +
                "自行车品牌：" + name + "\r\n" +
                "总价：" + price.setScale(2, BigDecimal.ROUND_HALF_UP) + " 元\r\n");

        for (Bike bike : partsList) {
            detail.append(bike.frameName()).append("：").append(bike.totalPrice() + "\n");
        }

        return detail.toString();
    }
}
```
**预期输出结果：**
```java
------------------------------------------------------
配件清单
自行车品牌：凤凰牌-自行车
总价：815.00 元
FH-坐垫：99
FH-框架：666
FH-轮胎：50


------------------------------------------------------
配件清单
自行车品牌：哈啰-自行车
总价：939.00 元
HL-坐垫：89
HL-轮胎：51
MB-框架：799


------------------------------------------------------
配件清单
自行车品牌：摩拜-自行车
总价：927.00 元
MB-坐垫：79.5
MB-框架：799
MB-轮胎：48.5
```
### 2.5 建造者模式优点
> + 封装性好，构建和表示分离。
> + 扩展性好，各个具体的建造者相互独立，有利于系统的解耦。
> + 客户端不必知道产品内部组成的细节，建造者可以对创建过程逐步细化，而不对其它模块产生任何影响，便于控制细节风险。
### 2.6 建造者模式缺点
> + 产品的组成部分必须相同，这限制了其使用范围。
> + 如果产品的内部变化复杂，如果产品内部发生变化，则建造者也要同步修改，后期维护成本较大。
## 三、总结
> 此设计模式满足了单一职责原则以及可复用的技术、建造者独立、易扩展、便于控制细节风险。但同时当出现特别多的物料以及很多的组合后，类的不断扩展也会造成难以维护的问题。但这种设计结构模型可以把重复的内容抽象到数据库中，按照需要配置。这样就可以减少代码中大量的重复。

[代码案例地址](https://gitee.com/unicornlai/smart-design-pattern/tree/master/smart-dp-builder)
<HideArticle/>
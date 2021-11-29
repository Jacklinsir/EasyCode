---
title: 手撸设计模式-策略模式
date: 2021-11-26
tags:
  - 策略模式
categories:
  - 设计模式
---

## 一 、策略模式介绍
### 1.1 策略模式的定义
> + 定义一系列的算法,把每一个算法封装起来, 并且使它们可相互替换。本模式使得算法可独立于使用它的客户而变化。可以实现委派给不同的对象对这些算法进行管理。
> + 举个场景：在我们日常出行以前是只能使用现金购物，如今不一样，出现了手机线下支付，而线下支付又出现了不同方式支付，分为支付宝，微信，银行卡，等等。我们只需要根据需求选择性的方式使用一种付款方式即可，这种也是一种现实生活中的选择策略。

### 1.2 策略模式的结构
**策略模式的主要角色如下：**
> + 抽象策略（Strategy）类：定义了一个公共接口，各种不同的算法以不同的方式实现这个接口，环境角色使用这个接口调用不同的算法，一般使用接口或抽象类实现。
> + 具体策略（Concrete Strategy）类：实现了抽象策略定义的接口，提供具体的算法实现。
> + 环境（Context）类：持有一个策略类的引用，最终给客户端调用。
### 1.3 策略模式UML图
![策略模式UML图](https://img-blog.csdnimg.cn/fd936fd9a72548f8a90a25e1855704ad.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
### 1.3 策略模式代码实现
**策略抽象业务接口定义：**
```java
public interface Strategy {

    /**
     * 抽象业务方法
     */
    void execute();
}
```
**A业务策略实现类定义：**
```java
public class BizServiceAStrategy implements Strategy{
    @Override
    public void execute() {
        System.out.println("====执行Biz A业务=====");
    }
}
```
**B业务策略实现类定义：**
```java
public class BizServiceBStrategy implements Strategy{
    @Override
    public void execute() {
        System.out.println("====执行Biz B业务=====");
    }
}
```
**控制策略上下文类定义：**
```java
public class StrategyContext {

    private Strategy strategy;

    public StrategyContext(Strategy strategy) {
        this.strategy = strategy;
    }
    /**
     * 执行业务
     */
    public void strategyMethod() {
        strategy.execute();
    }
    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
    }
}
```
**客户端定义：**
```java
public class ClientTest {

    public static void main(String[] args) {
        StrategyContext context = new StrategyContext(new BizServiceAStrategy());
        context.strategyMethod();

        context.setStrategy(new BizServiceBStrategy());
        context.strategyMethod();
    }
}
```
**预期运行结果：**
```java
====执行Biz A业务=====
====执行Biz B业务=====
```

## 二、策略模式业务场景：
### 2.1 业务场景定义
> 我们使用策略模式模拟在购买商品时候使用的各种类型优惠券(满减、直减、折扣、n元购)！这个场景几乎也是大家的一个日常购物省钱渠道，购买商品的时候都希望找一些优惠券，让购买的商品更加实惠。而且到了大促的时候就会有更多的优惠券需要计算那些商品一起购买更加优惠。具体体现我们在下面业务描述图和代码上细究。
### 2.2 业务场景描述图
![业务场景描述图](https://img-blog.csdnimg.cn/29a81aadc04a4721bf17f00470771c74.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
### 2.3 策略模式场景代码实现
**抽象优惠卷接口定义：**
```java
public interface ICouponDiscount<T> {

    /**
     * 优惠券金额计算
     * @param couponInfo 券折扣信息；直减、满减、折扣、N元购
     * @param skuPrice   sku金额
     * @return           优惠后金额
     */
    BigDecimal discountAmount(T couponInfo, BigDecimal skuPrice);
}
```
**满减券业务实现定义：**
```java
public class MJCouponDiscount implements ICouponDiscount<Map<String,String>> {

    /**
     * 满减计算
     * 1. 判断满足x元后-n元，否则不减
     * 2. 最低支付金额1元
     */
    @Override
    public BigDecimal discountAmount(Map<String, String> couponInfo, BigDecimal skuPrice) {
        String x = couponInfo.get("x");
        String o = couponInfo.get("n");
        //小于商品金额条件的，直接返回商品原价
        if (skuPrice.compareTo(new BigDecimal(x)) < 0) {
            return skuPrice;
        }
        // 减去优惠金额判断
        BigDecimal discountAmount = skuPrice.subtract(new BigDecimal(o));
        if (discountAmount.compareTo(BigDecimal.ZERO) < 1) {
            return BigDecimal.ONE;
        }

        return discountAmount;
    }
}

```
**直减业务实现定义：**
```java
public class ZJCouponDiscount implements ICouponDiscount<Double>{
    /**
     * 直减计算
     * 1. 使用商品价格减去优惠价格
     * 2. 最低支付金额1元
     */
    @Override
    public BigDecimal discountAmount(Double couponInfo, BigDecimal skuPrice) {
        BigDecimal discountAmount = skuPrice.subtract(new BigDecimal(couponInfo));
        if (discountAmount.compareTo(BigDecimal.ZERO) < 1) {
            return BigDecimal.ONE;
        }
        return discountAmount;
    }
}

```
**折扣业务实现定义：**
```java
public class ZKCouponDiscount implements ICouponDiscount<Double> {

    /**
     * 折扣计算
     * 1. 使用商品价格乘以折扣比例，为最后支付金额
     * 2. 保留两位小数
     * 3. 最低支付金额1元
     */
    @Override
    public BigDecimal discountAmount(Double couponInfo, BigDecimal skuPrice) {
        BigDecimal discountAmount = skuPrice.multiply(new BigDecimal(couponInfo)).setScale(2, BigDecimal.ROUND_HALF_UP);
        if (discountAmount.compareTo(BigDecimal.ZERO) < 1) {
            return BigDecimal.ONE;
        }
        return discountAmount;
    }

}

```
**N元购业务实现定义：**
```java
public class NYGCouponDiscount implements ICouponDiscount<Double> {

    /**
     * n元购购买
     * 1. 无论原价多少钱都固定金额购买
     */
    @Override
    public BigDecimal discountAmount(Double couponInfo, BigDecimal skuPrice) {
        return new BigDecimal(couponInfo);
    }

}

```
**控制优惠卷策略上下文定义：**
```java
public class CouponContext<T> {

    private ICouponDiscount<T> couponDiscount;

    public CouponContext(ICouponDiscount<T> couponDiscount) {
        this.couponDiscount = couponDiscount;
    }

    /**
     * 调用具体折扣业务
     * @param couponInfo 折扣信息
     * @param skuPrice sku金额
     * @return 折扣后价格
     */
    public BigDecimal discountAmount(T couponInfo, BigDecimal skuPrice) {
        return couponDiscount.discountAmount(couponInfo, skuPrice);
    }

}

```
**测试用例定义：**
```java
@Slf4j
public class StrategyTest {

    @Test
    public void test(){
        CouponContext<Double> couponContext = new CouponContext<>(new ZJCouponDiscount());
        BigDecimal discountAmount = couponContext.discountAmount(10D, new BigDecimal(100));
        log.info("测试结果：直减优惠后金额 {}", discountAmount);
    }
}
```
**预期输出结果：**
```java
Connected to the target VM, address: '127.0.0.1:50867', transport: 'socket'
22:28:07.800 [main] INFO com.smartfrank.pattern.StrategyTest - 测试结果：直减优惠后金额 90
Disconnected from the target VM, address: '127.0.0.1:50867', transport: 'socket'
```

### 2.4 策略模式优点
>+ 多重条件语句不易维护，而使用策略模式可以避免使用多重条件语句，如 if...else 语句、switch...case 语句。
>+ 策略模式提供了一系列的可供重用的算法族，恰当使用继承可以把算法族的公共代码转移到父类里面，从而避免重复的代码。
>+ 策略模式可以提供相同行为的不同实现，客户可以根据不同时间或空间要求选择不同的。
>+ 策略模式提供了对开闭原则的完美支持，可以在不修改原代码的情况下，灵活增加新算法。
> + 策略模式把算法的使用放到环境类中，而算法的实现移到具体策略类中，实现了二者的分离。
### 2.5 策略模式缺点
> + 客户端必须理解所有策略算法的区别，以便适时选择恰当的算法类。
> + 策略模式造成很多的策略类，增加维护难度。
## 三、总结
>+ 以上的策略模式案例相对来说不并不复杂，主要的逻辑都是体现在关于不同种类优惠券的计算折扣策略上。结构相对来说也比较简单，在实际的开发中这样的设计模式也是非常常用的。另外这样的设计与命令模式、适配器模式结构相似，但是思路是有差异的。
>+ 通过策略设计模式的使用可以把我们方法中的if语句优化掉，大量的if语句使用会让代码难以扩展，也不好维护，同时在后期遇到各种问题也很难维护。在使用这样的设计模式后可以很好的满足隔离性与和扩展性，对于不断新增的需求也非常方便拓展。

[代码案例](https://gitee.com/unicornlai/smart-design-pattern/tree/master/smart-dp-strategy)
<HideArticle/>


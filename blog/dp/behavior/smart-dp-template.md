---
title: 手撸设计模式-模板模式
date: 2021-11-26
tags:
  - 模板模式
categories:
  - 设计模式
---

## 一 、模板方法模式介绍
### 1.1 模板方法模式定义
>+ 义一个操作中算法的骨架，而将一些步骤延迟到子类中，模板方法使得子类可以不改变算法的结构即可重定义该算法的某些特定步骤。
> + 通俗点的理解就是 ：完成一件事情，有固定的数个步骤，但是每个步骤根据对象的不同，而实现细节不同；就可以在父类中定义一个完成该事情的总方法，按照完成事件需要的步骤去调用其每个步骤的实现方法。每个步骤的具体实现，由子类完成。
### 1.2 模板方法模式结构
**模板方法模式包含以下角色：**
> **抽象类/抽象模板（Abstract Class）:**
> + 抽象模板类，负责给出一个算法的轮廓和骨架。它由一个模板方法和若干个基本方法构成。
> + 模板方法：定义了算法的骨架，按某种顺序调用其包含的基本方法。
> +  基本方法：是整个算法中的一个步骤，包含以下几种类型。
> + 抽象方法：在抽象类中声明，由具体子类实现。
> + 具体方法：在抽象类中已经实现，在具体子类中可以继承或重写它。
> + 钩子方法：在抽象类中已经实现，包括用于判断的逻辑方法和需要子类重写的空方法两种。
>
>**具体子类/具体实现（Concrete Class）:**
>+ 具体实现类，实现抽象类中所定义的抽象方法和钩子方法，它们是一个顶级逻辑的一个组成步骤。
### 1.3 模板方法模式UML图
![UML结构图](https://img-blog.csdnimg.cn/48cb5b5b12ea452ca0b2a59fb6fb8871.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)

### 1.4 模板方法模式代码实现
**抽象模板类定义：**
```java
public abstract class AbstractClass {

    /**
     * 模板流程编排执行
     */
    protected void execute() {
        this.processServiceA();
        this.processServiceB();
        this.processServiceC();
        this.processServiceD();
    }

    /**
     * 流程A
     */
    public abstract void processServiceA();

    /**
     * 流程B
     */
    public abstract void processServiceB();

    /**
     * 流程C
     */
    public abstract void processServiceC();

    /**
     * 流程D
     */
    public abstract void processServiceD();

}
```
**业务A定义：**
```java
public class ConcreteClassA extends AbstractClass {
    @Override
    public void processServiceA() {
        System.out.println("ConcreteClassA.processServiceA - [起锅]");
    }

    @Override
    public void processServiceB() {
        System.out.println("ConcreteClassA.processServiceB - [倒油]");
    }

    @Override
    public void processServiceC() {
        System.out.println("ConcreteClassA.processServiceC - [炒土豆丝]");
    }

    @Override
    public void processServiceD() {
        System.out.println("ConcreteClassA.processServiceD - [出锅-酸辣土豆丝]");
    }

}
```
**业务B定义：**
```java
public class ConcreteClassB extends AbstractClass {
    @Override
    public void processServiceA() {
        System.out.println("ConcreteClassB.processServiceA - [起锅]");
    }

    @Override
    public void processServiceB() {
        System.out.println("ConcreteClassB.processServiceB - [倒油]");
    }

    @Override
    public void processServiceC() {
        System.out.println("ConcreteClassB.processServiceC - [煮红烧肉]");
    }

    @Override
    public void processServiceD() {
        System.out.println("ConcreteClassB.processServiceD - [出锅-红烧肉]");
    }
}
```
**客户端调用定义：**
```java
public class Client {

    public static void main(String[] args) {
        AbstractClass concreteClassA = new ConcreteClassA();
        concreteClassA.execute();
        System.out.println("---------------------");
        AbstractClass concreteClassB = new ConcreteClassB();
        concreteClassB.execute();
    }
}
```
**预期结果输出：**
```java
ConcreteClassA.processServiceA - [起锅]
ConcreteClassA.processServiceB - [倒油]
ConcreteClassA.processServiceC - [炒土豆丝]
ConcreteClassA.processServiceD - [出锅-酸辣土豆丝]
---------------------
ConcreteClassB.processServiceA - [起锅]
ConcreteClassB.processServiceB - [倒油]
ConcreteClassB.processServiceC - [煮红烧肉]
ConcreteClassB.processServiceD - [出锅-红烧肉]
```
## 二、模板方法模式场景
### 2.1 场景定义
> 关于模版模式的核心点在于由抽象类定义抽象方法执行策略，也就是说父类规定了好一系列的执行标准，这些标准的串联成一整套业务流程。
> 而整个的爬取过程分为；模拟登录、爬取信息、生成海报，这三个步骤。
> + 有些商品只有登录后才可以爬取，并且登录可以看到一些特定的价格这与未登录用户看到的价格不同。
> + 不同的电商网站爬取方式不同，解析方式也不同，因此可以作为每一个实现类中的特定实现。
> + 生成海报的步骤基本一样，但会有特定的商品来源标识。所以这样三个步骤可以使用模版模式来设定，并有具体的场景做子类实现。
### 2.2 场景描述图
![在这里插入图片描述](https://img-blog.csdnimg.cn/40d2946be7d644a9a36843f6e8732102.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)

### 2.3 场景代码实现
**基础电商推广服务抽象类定义：**
```java
public abstract class AbstractNetMall {

    protected Logger logger = LoggerFactory.getLogger(AbstractNetMall.class);

    String uId;   // 用户ID
    String uPwd;  // 用户密码

    public AbstractNetMall(String uId, String uPwd) {
        this.uId = uId;
        this.uPwd = uPwd;
    }

    /**
     * 生成商品推广海报
     *
     * @param skuUrl 商品地址(京东、淘宝、当当)
     * @return 海报图片base64位信息
     */
    public String generateGoodsPoster(String skuUrl) {
        if (!login(uId, uPwd)) return null;             // 1. 验证登录
        Map<String, String> reptile = reptile(skuUrl);  // 2. 爬虫商品
        return createBase64(reptile);                   // 3. 组装海报
    }

    // 模拟登录
    protected abstract Boolean login(String uId, String uPwd);

    // 爬虫提取商品信息(登录后的优惠价格)
    protected abstract Map<String, String> reptile(String skuUrl);

    // 生成商品海报信息
    protected abstract String createBase64(Map<String, String> goodsInfo);
}
```
**模拟JD商城海报生成实现类定义：**
```java
public class JDNetMall extends AbstractNetMall {

    public JDNetMall(String uId, String uPwd) {
        super(uId, uPwd);
    }

    public Boolean login(String uId, String uPwd) {
        logger.info("模拟京东用户登录 uId：{} uPwd：{}", uId, uPwd);
        return true;
    }

    public Map<String, String> reptile(String skuUrl) {
        String str = HttpClient.doGet(skuUrl);
        Pattern p9 = Pattern.compile("(?<=title\\>).*(?=</title)");
        Matcher m9 = p9.matcher(str);
        Map<String, String> map = new ConcurrentHashMap<String, String>();
        if (m9.find()) {
            map.put("name", m9.group());
        }
        map.put("price", "5999.00");
        logger.info("模拟京东商品爬虫解析：{} | {} 元 {}", map.get("name"), map.get("price"), skuUrl);
        return map;
    }
    public String createBase64(Map<String, String> goodsInfo) {
        BASE64Encoder encoder = new BASE64Encoder();
        logger.info("模拟生成京东商品base64海报");
        return encoder.encode(JSONUtil.toJsonStr(goodsInfo).getBytes());
    }

}
```
**模拟淘宝商品海报生成实现定义：**
```java
public class TaoBaoNetMall extends AbstractNetMall {

    public TaoBaoNetMall(String uId, String uPwd) {
        super(uId, uPwd);
    }

    @Override
    public Boolean login(String uId, String uPwd) {
        logger.info("模拟淘宝用户登录 uId：{} uPwd：{}", uId, uPwd);
        return true;
    }

    @Override
    public Map<String, String> reptile(String skuUrl) {
        String str = HttpClient.doGet(skuUrl);
        Pattern p9 = Pattern.compile("(?<=title\\>).*(?=</title)");
        Matcher m9 = p9.matcher(str);
        Map<String, String> map = new ConcurrentHashMap<String, String>();
        if (m9.find()) {
            map.put("name", m9.group());
        }
        map.put("price", "4799.00");
        logger.info("模拟淘宝商品爬虫解析：{} | {} 元 {}", map.get("name"), map.get("price"), skuUrl);
        return map;
    }

    @Override
    public String createBase64(Map<String, String> goodsInfo) {
        BASE64Encoder encoder = new BASE64Encoder();
        logger.info("模拟生成淘宝商品base64海报");
        return encoder.encode(JSONUtil.toJsonStr(goodsInfo).getBytes());
    }

}
```
**模拟当当商品海报生成实现定义:**
```java
public class DangDangNetMall extends AbstractNetMall {

    public DangDangNetMall(String uId, String uPwd) {
        super(uId, uPwd);
    }

    @Override
    public Boolean login(String uId, String uPwd) {
        logger.info("模拟当当用户登录 uId：{} uPwd：{}", uId, uPwd);
        return true;
    }

    @Override
    public Map<String, String> reptile(String skuUrl) {
        String str = HttpClient.doGet(skuUrl);
        Pattern p9 = Pattern.compile("(?<=title\\>).*(?=</title)");
        Matcher m9 = p9.matcher(str);
        Map<String, String> map = new ConcurrentHashMap<String, String>();
        if (m9.find()) {
            map.put("name", m9.group());
        }
        map.put("price", "4548.00");
        logger.info("模拟当当商品爬虫解析：{} | {} 元 {}", map.get("name"), map.get("price"), skuUrl);
        return map;
    }

    @Override
    public String createBase64(Map<String, String> goodsInfo) {
        BASE64Encoder encoder = new BASE64Encoder();
        logger.info("模拟生成当当商品base64海报");
        return encoder.encode(JSONUtil.toJsonStr(goodsInfo).getBytes());
    }

}
```

**测试用例定义：**
```java
@Slf4j
public class TemplateTest {

    @Test
    public void test() {
        AbstractNetMall abstractNetMall = new JDNetMall("1000001", "*******");
        String base64 = abstractNetMall.generateGoodsPoster("https://item.jd.com/100008348542.html");
        log.info("测试结果：{}", base64);
    }
}
```
**预期结果输出：**
```java
11:59:31.944 [main] INFO com.smartfrank.pattern.example.AbstractNetMall - 模拟京东用户登录 uId：1000001 uPwd：*******
11:59:33.369 [main] INFO com.smartfrank.pattern.example.AbstractNetMall - 模拟京东商品爬虫解析：【AppleiPhone 11】Apple iPhone 11 (A2223) 128GB 黑色 移动联通电信4G手机 双卡双待【行情 报价 价格 评测】-京东 | 5999.00 元 https://item.jd.com/100008348542.html
11:59:33.369 [main] INFO com.smartfrank.pattern.example.AbstractNetMall - 模拟生成京东商品base64海报
11:59:35.486 [main] INFO com.smartfrank.pattern.TemplateTest - 测试结果：eyJwcmljZSI6IjU5OTkuMDAiLCJuYW1lIjoi44CQQXBwbGVpUGhvbmUgMTHjgJFBcHBsZSBpUGhv
bmUgMTEgKEEyMjIzKSAxMjhHQiDpu5HoibIg56e75Yqo6IGU6YCa55S15L+hNEfmiYvmnLog5Y+M
5Y2h5Y+M5b6F44CQ6KGM5oOFIOaKpeS7tyDku7fmoLwg6K+E5rWL44CRLeS6rOS4nCJ9
```
### 2.4 模板方法模式优点
> + 它封装了不变部分，扩展可变部分。它把认为是不变部分的算法封装到父类中实现，而把可变部分算法由子类继承实现，便于子类继续扩展。
> + 它在父类中提取了公共的部分代码，便于代码复用。
> + 部分方法是由子类实现的，因此子类可以通过扩展方式增加相应的功能，符合开闭原则。
### 2.5 模板方法模式缺点
>+  对每个不同的实现都需要定义一个子类，这会导致类的个数增加，系统更加庞大，设计也更加抽象，间接地增加了系统实现的复杂度。
> + 父类中的抽象方法由子类实现，子类执行的结果会影响父类的结果，这导致一种反向的控制结构，它提高了代码阅读的难度。
> + 由于继承关系自身的缺点，如果父类添加新的抽象方法，则所有子类都要改一遍。
## 三、总结
> + 通过上面的实现可以看到模版模式在定义统一结构也就是执行标准上非常方便，也就很好的控制了后续的实现者不用关心调用逻辑，按照统一方式执行。那么类的继承者只需要关心具体的业务逻辑实现即可。
> + 另外模版模式也是为了解决子类通用方法，放到父类中设计的优化。让每一个子类只做子类需要完成的内容，而不需要关心其他逻辑。这样提取公用代码，行为由父类管理，扩展可变部分，也就非常有利于开发拓展和迭代。

[代码案例](https://gitee.com/unicornlai/smart-design-pattern/tree/master/smart-dp-template)

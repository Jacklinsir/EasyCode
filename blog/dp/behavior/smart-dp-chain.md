---
title: 手撸设计模式-责任链模式
date: 2021-11-26
tags:
  - 责任链模式
categories:
  - 设计模式
---

## 一 、责任链模式介绍
### 1.1 定义
> + 责任链模式（Chain of Responsibility Pattern）为请求创建了一个接收者对象的链。这种模式给予请求的类型，对请求的发送者和接收者进行解耦。这种类型的设计模式属于行为型模式。
> + 在这种模式中，通常每个接收者都包含对另一个接收者的引用。如果一个对象不能处理该请求，那么它会把相同的请求传给下一个接收者，直到有对象处理它为止。
### 1.2 责任链模式UML结构图
![UML结构图](https://img-blog.csdnimg.cn/bbc06e484aeb4f07b857bc862959a0c1.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
### 1.3 责任链模式结构详细
> 1. 抽象处理者（AbstractLogger）角色: 定义一个处理请求的抽象类，包含抽象处理方法和一个后继连接。
> 2. 具体处理者（ConsoleLogger）角色: 实现抽象处理者角色，在实现处理者抽象方法，判断能否处理本次请求，如果可以处理请求则进行处理，否则将该请求转给它的后继者。
> 3. 客户类（Client）角色: 创建处理链，并向链头的具体处理者对象提交请求，它不关心处理细节和请求的传递过程。
### 1.3 用例代码实现
**抽象处理类定义：**
```java
public abstract class AbstractLogger {
    public static int INFO = 1;
    public static int DEBUG = 2;
    public static int ERROR = 3;

    /**
     * 日志级别
     */
    protected Integer level;

    /**
     * 责任链中的下一个元素
     */
    protected AbstractLogger nextLogger;

    public void setNextLogger(AbstractLogger nextLogger) {
        this.nextLogger = nextLogger;
    }

    public void logMessage(Integer level, String message) {
        if (this.level <= level) {
            write(message);
        }
        //转发给下一个责任链
        if (nextLogger != null) {
            nextLogger.logMessage(level, message);
        }
    }

    /**
     * 抽象具体写日志方法
     *
     * @param message
     */
    protected abstract void write(String message);
}
```
**ConsoleLogger级别日志类定义：**
```java
public class ConsoleLogger extends AbstractLogger {

    public ConsoleLogger(Integer level) {
        this.level = level;
    }
    @Override
    protected void write(String message) {
        System.out.println("Standard Console::Logger: " + message);
    }
}
```
**ErrorLogger级别日志类定义：**
```java
public class ErrorLogger extends AbstractLogger {
    public ErrorLogger(Integer level) {
        this.level = level;
    }
    @Override
    protected void write(String message) {
        System.out.println("File::Logger: " + message);
    }
}
```
**FileLogger级别日志类定义：**
```java
public class FileLogger extends AbstractLogger {

    public FileLogger(Integer level) {
        this.level = level;
    }
    @Override
    protected void write(String message) {
        System.out.println("File::Logger: " + message);
    }
}
```
**测试用例定义：**
```java
public class ClientTest {

    private static AbstractLogger getChainOfLoggers(){

        AbstractLogger errorLogger = new ErrorLogger(AbstractLogger.ERROR);
        AbstractLogger fileLogger = new FileLogger(AbstractLogger.DEBUG);
        AbstractLogger consoleLogger = new ConsoleLogger(AbstractLogger.INFO);

        errorLogger.setNextLogger(fileLogger);
        fileLogger.setNextLogger(consoleLogger);

        return errorLogger;
    }

    public static void main(String[] args) {
        AbstractLogger loggerChain = getChainOfLoggers();

        loggerChain.logMessage(AbstractLogger.INFO, "info");

        loggerChain.logMessage(AbstractLogger.DEBUG, "debug");

        loggerChain.logMessage(AbstractLogger.ERROR, "error");
    }
}
```
**预期输出结果：**
```properties
Connected to the target VM, address: '127.0.0.1:59791', transport: 'socket'
Standard Console::Logger: info
File::Logger: debug
Standard Console::Logger: debug
Error Console::Logger: error
File::Logger: error
Standard Console::Logger: error
Disconnected from the target VM, address: '127.0.0.1:59791', transport: 'socket'
```
## 二、责任链模式应用场景：
### 2.1 场景概述
> 像是这些一线电商类的互联网公司，阿里、京东、拼多多等，在618期间都会做一些运营活动场景以及提供的扩容备战，就像过年期间百度的红包一样。但是所有开发的这些系统都需要陆续的上线，因为临近618有时候也有一些紧急的调整的需要上线，但为了保障线上系统的稳定性是尽可能的减少上线的，也会相应的增强审批力度。就像一级响应、二级响应一样。

>而这审批的过程在随着特定时间点会增加不同级别的负责人加入，每个人就像责任链模式中的每一个核心点。对于研发小伙伴并不需要关心具体的审批流程处理细节，只需要知道这个上线更严格，级别也更高，但对于研发人员来说同样是点击相同的提审按钮，等待审核。
>实现目标，活动天数不一样经过不一样的人员审批，1天--->运营人员  3天--->运营经理  6天---> 运营总监。具体实现看代码用例！

### 2.2 场景模式图
![在这里插入图片描述](https://img-blog.csdnimg.cn/d224e773f4c54da184b2cf01647ede57.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)

**下面根据面向对象的思想我们得定义需要用到的对象。我们采用责任链模式和建造者模式来实现审批过程！**
### 2.3 场景代码实现
**构建活动请求对象（采用建造者模式）**
```java
/**
 * Description: 构建请求对象
 * <br/>
 * Request
 *
 * @author laiql
 * @date 2021/11/2 10:23
 */
public class Request {
    /**
     * 活动id
     */
    private String activityId;
    /**
     * 活动名
     */
    private String activityName;
    /**
     * 活动开始时间
     */
    private Integer activityTime;
    /**
     * 一级审批
     */
    private String levelOne;
    /**
     * 二级审批
     */
    private String levelTwo;
    /**
     * 三级审批
     */
    private String levelThree;

    public Request(Builder builder) {
        super();
        this.activityId = builder.activityId;
        this.activityName = builder.activityName;
        this.activityTime = builder.activityTime;
        this.levelOne = builder.levelOne;
        this.levelTwo = builder.levelTwo;
        this.levelThree = builder.levelThree;
    }

    /**
     * 使用建造者模式
     */
    public static class Builder {
        public String activityId;
        public String activityName;
        public Integer activityTime;
        public String levelOne;
        public String levelTwo;
        public String levelThree;

        public Builder() {
        }

        public Builder setActivityId(String activityId) {
            this.activityId = activityId;
            return this;
        }

        public Builder setActivityName(String activityName) {
            this.activityName = activityName;
            return this;
        }

        public Builder setactivityTime(Integer activityTime) {
            this.activityTime = activityTime;
            return this;
        }

        public Builder setLevelOne(String levelOne) {
            this.levelOne = levelOne;
            return this;
        }

        public Builder setLevelTwo(String levelTwo) {
            this.levelTwo = levelTwo;
            return this;
        }

        public Builder setLevelThree(String levelThree) {
            this.levelThree = levelThree;
            return this;
        }

        public Builder newRequest(Request request) {
            this.activityId = request.activityId;
            this.activityName = request.activityName;
            this.activityTime = request.activityTime;
            //可以增加参数判断
            this.levelOne = request.levelOne;
            this.levelTwo = request.levelTwo;
            this.levelThree = request.levelThree;
            return this;
        }

        public Request build() {
            return new Request(this);
        }
    }

    public String activityId() {
        return activityId;
    }

    public String activityName() {
        return activityName;
    }

    public Integer activityTime() {
        return activityTime;
    }

    public String levelOne() {
        return levelOne;
    }

    public String levelTwo() {
        return levelTwo;
    }

    public String levelThree() {
        return levelThree;
    }

    @Override
    public String toString() {
        return "Request{" +
                "activityId='" + activityId + '\'' +
                ", activityName='" + activityName + '\'' +
                ", activityTime=" + activityTime +
                ", levelOne='" + levelOne + '\'' +
                ", levelTwo='" + levelTwo + '\'' +
                ", levelThree='" + levelThree + '\'' +
                '}';
    }
}
```
**定义审批结果对象：**
```java
/**
 * Description: 授权结果
 * <br/>
 * AuthResult
 *
 * @author laiql
 * @date 2021/11/2 10:32
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResult {
    private boolean isRatify;
    private String info;
}
```
**抽象处理请求接口定义：**
```java
public interface Ratify {
    /**
     * 处理请求
     *
     * @param chain
     * @return
     */
    public AuthResult deal(Chain chain);

    /**
     * 接口描述：对request和Result封装，用来转发
     */
    interface Chain {
        /**
         * 获取当前request请求
         *
         * @return
         */
        Request request();

        /**
         * 转发request请求
         *
         * @param request
         * @return
         */
        AuthResult proceed(Request request);
    }
}
```
**实现Chain的真正的包装Request和转发功能类定义：**
```java
public class RealChain implements Ratify.Chain {

    /**
     * 具体的请求Request实例
     */
    public Request request;
    /**
     * Ratify接口的实现类集合
     */
    public List<Ratify> ratifyList;
    /**
     * 已经处理过该request的责任人数量
     */
    private Integer index;

    public RealChain(Request request, List<Ratify> ratifyList, Integer index) {
        this.request = request;
        this.ratifyList = ratifyList;
        this.index = index;
    }

    /**
     * 返回当前Request对象或者返回当前进行包装后的Request对象
     *
     * @return
     */
    @Override
    public Request request() {
        return request;
    }

    /**
     * 具体转发功能
     *
     * @param request
     * @return
     */
    @Override
    public AuthResult proceed(Request request) {
        AuthResult proceed = null;
        if (this.ratifyList.size() > this.index) {
            RealChain realChain = new RealChain(this.request, this.ratifyList, this.index + 1);
            Ratify ratify = this.ratifyList.get(this.index);
            proceed = ratify.deal(realChain);
        }
        return proceed;
    }
}
```
**定义日常活动审批责任类：**
```java
@Slf4j
public class DailyAuthHandler implements Ratify {
    @Override
    public AuthResult deal(Chain chain) {
        Request request = chain.request();
        if (request.activityTime() > 1) {
            Request newRequest = new Request.Builder().newRequest(request).setLevelOne("1级审批 - " + "运营人员:[张三] - 审批意见:[同意]").build();
            log.info("活动状态:{}", newRequest.toString());
            //交给二级人员审批
            return chain.proceed(newRequest);
        }
        return new AuthResult(true, "运营人员:[张三] - 审批意见:[同意]");
    }
}
```
**定义促销活动审批责任类：**
```java
@Slf4j
public class PromotionAuthHandler implements Ratify {
    @Override
    public AuthResult deal(Ratify.Chain chain) {
        Request request = chain.request();
        if (request.activityTime() > 3) {
            Request newRequest = new Request.Builder().newRequest(request).setLevelTwo("2级审批 - " + "运营经理:[李四] - 审批意见:[同意]").build();
            log.info("活动状态:{}", newRequest.toString());
            //交给三级人员审批
            return chain.proceed(newRequest);
        }
        return new AuthResult(true, "运营经理:[李四] - 审批意见:[同意]");
    }
}
```
**大促活动审批责任类定有：**
```java
@Slf4j
public class Activity618AuthHandler implements Ratify {
    @Override
    public AuthResult deal(Ratify.Chain chain) {
        Request request = chain.request();
        if (request.activityTime() <= 7) {
            Request buildRequest = new Request.Builder().newRequest(request).setLevelThree("3级审批 - " + "运营总监:[王五] - 审批意见:[同意]").build();
            log.info("活动状态:{}", buildRequest.toString());
        } else {
            log.info("活动状态:{}", request.toString());
            return new AuthResult(false, "审批失败！暂时不支持7天以上活动！");
        }
        return new AuthResult(true, "运营总监:[王五] - 审批意见:[同意]");
    }
}
```
**测试用例定义：**
```java
    @Test
    public void test() {
        //构造活动
        Request request = new Request.Builder().setActivityId("0000000000001")
                .setActivityName("618大促销")
                .setactivityTime(2).build();
        ChainOfResponsibilityClient chain = new ChainOfResponsibilityClient();
        AuthResult authResult = chain.execute(request);
        log.info("执行结果:{}", authResult);
    }
```
执行预期结果：
```properties
15:49:52.786 [main] INFO com.smartfrank.pattern.example.handler.DailyAuthHandler - 活动状态:Request{activityId='0000000000001', activityName='618大促销', activityTime=6, levelOne='1级审批 - 运营人员:[张三] - 审批意见:[同意]', levelTwo='null', levelThree='null'}
15:49:52.790 [main] INFO com.smartfrank.pattern.example.handler.PromotionAuthHandler - 活动状态:Request{activityId='0000000000001', activityName='618大促销', activityTime=6, levelOne='null', levelTwo='2级审批 - 运营经理:[李四] - 审批意见:[同意]', levelThree='null'}
15:49:52.790 [main] INFO com.smartfrank.pattern.example.handler.Activity618AuthHandler - 活动状态:Request{activityId='0000000000001', activityName='618大促销', activityTime=6, levelOne='null', levelTwo='null', levelThree='3级审批 - 运营总监:[王五] - 审批意见:[同意]'}
15:49:52.790 [main] INFO com.smartfrank.pattern.ChainTest - 执行结果:AuthResult(isRatify=true, info=运营总监:[王五] - 审批意见:[同意])
```
### 2.4 优缺点
**优点：**
>+ 降低耦合度，将请求的发送者和接收者解耦。
>+ 简化了对象，使得对象不需要知道链的结构。
>+ 增强了对象指派职责的灵活性，通过改变链内的成员或者调动它们的次序，允许动态地新增或者删除责任。
>+ 增加新的请求处理类很方便。
   **缺点：**
>+ 不能保证请求一定被接收。
>+ 系统性能将受到一定影响，而且在进行代码调试时不太方便，可能会造成循环调用。
>+ 可能不容易观察运行时的特征，有碍于除错。

## 三、总结
> 从上面场景案例代码中我们可以体会到，使用了设计模式，代码将变得更加面向对象，符合软件设计原则，同时我们的代码结构变得清晰干净了。
> 责任链模式很好的处理单一职责和开闭原则，简单了耦合也使对象关系更加清晰，而且外部的调用方并不需要关心责任链是如何进行处理的*(以上程序中可以把责任链的组合进行包装，在提供给外部使用)*。但除了这些优点外也需要是适当的场景才进行使用，避免造成性能以及编排混乱调试测试疏漏问题。

[代码地址](https://gitee.com/unicornlai/smart-design-pattern/tree/master/smart-dp-chain)
<HideArticle/>
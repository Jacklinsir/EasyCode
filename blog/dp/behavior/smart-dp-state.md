---
title: 手撸设计模式-状态模式
date: 2021-11-26
tags:
  - 状态模式 
categories:
  - 设计模式
---

## 一 、状态模式介绍
### 1.1 状态模式定义
> + 状态（State）模式的定义：对有状态的对象，把复杂的“判断逻辑”提取到不同的状态对象中，允许状态对象在其内部状态发生改变时改变其行为。
> + 当一个对象内部状态发生改变时，允许改变对象的行为，这个对象看起来可以说是修改了其他的类。
### 1.2 状态模式结构：
> 状态模式把受环境改变的对象行为包装在不同的状态对象里，其意图是让一个对象在其内部状态改变的时候，其行为也随之改变。现在我们来分析其基本结构和实现方法。

**主要有以下模式角色：**
> + 环境类（Context）角色：也称为上下文，它定义了客户端需要的接口，内部维护一个当前状态，并负责具体状态的切换。
> + 抽象状态（State）角色：定义一个接口，用以封装环境对象中的特定状态所对应的行为，可以有一个或多个行为。
>+ 具体状态（Concrete State）角色：实现抽象状态所对应的行为，并且在需要的情况下进行状态切换。

### 1.3 UML结构图
![在这里插入图片描述](https://img-blog.csdnimg.cn/b34896dcd2c140f88ac05b8dc82ce80d.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
### 1.4 状态模式代码实现
**抽象状态类定义:**
```java
public abstract class State {
    /**
     * 抽象处理状态
     */
    public abstract void handlerState(Context context);
}
```
**环境上下文类定义:**
```java
public class Context {

    private State state;

    /**
     * 初始化具体状态对象
     */
    public Context(State state) {
        this.state = state;
    }

    /**
     * 获取状态
     */
    public State getState() {
        return state;
    }

    /**
     * 设置状态
     */
    public void setState(State state) {
        this.state = state;
    }

    /**
     * 执行处理状态
     */
    public void executeState(){
        this.state.handlerState(this);
    }
}
```
**业务状态A定义：**
```java
public class ConcreteStateA extends State {
    @Override
    public void handlerState(Context context) {
        System.out.println("ConcreteStateA.handlerState - 当前状态是A");
        context.setState(new ConcreteStateA());
    }
}
```
**业务状态B定义：**
```java
public class ConcreteStateB extends State {
    @Override
    public void handlerState(Context context) {
        System.out.println("ConcreteStateB.handlerState - 当前状态是B");
        context.setState(new ConcreteStateB());
    }
}
```
**客户端定义：**
```java
public class StateClient {

    public static void main(String[] args) {
        //设置开始状态
        Context context = new Context(new ConcreteStateA());
        //执行A状态
        context.executeState();

        //流转新的状态
        context.setState(new ConcreteStateB());
        //执行B状态
        context.executeState();
    }
}
```

**预期输出结果：**
```java
ConcreteStateA.handlerState - 当前状态是A
ConcreteStateB.handlerState - 当前状态是B
```
## 二、状态模式场景
### 2.1 场景定义
> + 在上图中也可以看到我们的流程节点中包括了各个状态到下一个状态扭转的关联条件，比如；审核通过才能到活动中，而不能从编辑中直接到活动中，而这些状态的转变就是我们要完成的场景处理。
>+ 大部分程序员基本都开发过类似的业务场景，需要对活动或者一些配置需要审核后才能对外发布，而这个审核的过程往往会随着系统的重要程度而设立多级控制，来保证一个活动可以安全上线，避免造成资损。
> + 当然有时候会用到一些审批流的过程配置，也是非常方便开发类似的流程的，也可以在配置中设定某个节点的审批人员。但这不是我们主要体现的点，在本案例中我们主要是模拟学习对一个活动的多个状态节点的审核控制。
### 2.2 场景描述图
![在这里插入图片描述](https://img-blog.csdnimg.cn/59dd6330ed02455da0e906d9ca7f7497.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)

### 2.3 场景代码实现
**抽象状态接口定义：**
```java
public interface State {
    /**
     * 活动提审
     */
    Result activityReview(Context context);
    /**
     * 审核通过
     */
    Result examinationPassed(Context context);
    /**
     * 审核拒绝
     */
    Result reviewRejected(Context context);
    /**
     * 撤审撤销
     */
    Result withdrawalOfTrial(Context context);
    /**
     * 活动关闭
     */
    Result activityClosed(Context context);
    /**
     * 活动开启
     */
    Result activityOn(Context context);
    /**
     * 活动执行
     */
    Result activityExecution(Context context);
}
```
**状态枚举定义：**
```java
public enum Status {

    // 1创建编辑、2待审核、3审核通过(任务扫描成活动中)、4审核拒绝(可以撤审到编辑状态)、5活动中、6活动关闭、7活动开启(任务扫描成活动中)
    Editing, Check, Pass, Refuse, Doing, Close, Open
}
```
**抽象状态类:**
```java
public abstract class AbstractState implements State {
    protected static final RuntimeException EXCEPTION = new RuntimeException("操作流程不允许");
     //抽象类默认实现了 State 接口所有方法
    //该类的所有方法，其子类即具体的状态类可以有选择的进行重写，减少了冗余代码
    @Override
    public Result activityReview(Context context) {
        throw EXCEPTION;
    }

    @Override
    public Result examinationPassed(Context context) {
        throw EXCEPTION;
    }

    @Override
    public Result reviewRejected(Context context) {
        throw EXCEPTION;
    }

    @Override
    public Result withdrawalOfTrial(Context context) {
        throw EXCEPTION;
    }

    @Override
    public Result activityClosed(Context context) {
        throw EXCEPTION;
    }

    @Override
    public Result activityOn(Context context) {
        throw EXCEPTION;
    }

    @Override
    public Result activityExecution(Context context) {
        throw EXCEPTION;
    }
}

```
**活动信息模型：**
```java
public class ActivityInfo {

    private String activityId;    // 活动ID
    private String activityName;  // 活动名称
    private Enum<Status> status;  // 活动状态
    private Date beginTime;       // 开始时间
    private Date endTime;         // 结束时间
}
```
**环境上下文类定义：**
```java
public class Context extends AbstractState {
    private State state;
    private ActivityInfo activityInfo;

    public Context(State state, ActivityInfo activityInfo) {
        this.state = state;
        this.activityInfo = activityInfo;
    }

    /**
     * 获取当前状态
     *
     * @return
     */
    public State getState() {
        return state;
    }

    /**
     * 设置流转状态
     *
     * @param state 下一个状态
     */
    public void setState(State state) {
        this.state = state;
    }

    /**
     * 获取当前活动信息
     *
     * @return
     */
    public ActivityInfo getActivityInfo() {
        return activityInfo;
    }

    /**
     * 设置活动信息
     *
     * @param activityInfo
     */
    public void setActivityInfo(ActivityInfo activityInfo) {
        this.activityInfo = activityInfo;
    }

    @Override
    public Result activityReview(Context context) {
        return this.state.activityReview(context);
    }

    @Override
    public Result examinationPassed(Context context) {
        return this.state.examinationPassed(context);
    }

    @Override
    public Result reviewRejected(Context context) {
        return this.state.reviewRejected(context);
    }

    @Override
    public Result withdrawalOfTrial(Context context) {
        return this.state.withdrawalOfTrial(context);
    }

    @Override
    public Result activityClosed(Context context) {
        return this.state.activityClosed(context);
    }

    @Override
    public Result activityOn(Context context) {
        return this.state.activityOn(context);
    }

    @Override
    public Result activityExecution(Context context) {
        return this.state.activityExecution(context);
    }
}
```
**活动Service业务定义：**
```java
public class ActivityService {

    private static Map<String, Enum<Status>> statusMap = new ConcurrentHashMap<String, Enum<Status>>();

    public static ActivityInfo init(String activityId, Enum<Status> status) {
        // 模拟查询活动信息
        ActivityInfo activityInfo = new ActivityInfo();
        activityInfo.setActivityId(activityId);
        activityInfo.setActivityName("618营销活动");
        activityInfo.setStatus(status);
        activityInfo.setBeginTime(new Date());
        activityInfo.setEndTime(new Date());
        statusMap.put(activityId, status);
        return activityInfo;
    }

    /**
     * 查询活动信息
     *
     * @param activityId 活动ID
     * @return 查询结果
     */
    public static ActivityInfo queryActivityInfo(String activityId) {
        // 模拟查询活动信息
        ActivityInfo activityInfo = new ActivityInfo();
        activityInfo.setActivityId(activityId);
        activityInfo.setActivityName("618营销活动");
        activityInfo.setStatus(statusMap.get(activityId));
        activityInfo.setBeginTime(new Date());
        activityInfo.setEndTime(new Date());
        return activityInfo;
    }

    /**
     * 查询活动状态
     *
     * @param activityId 活动ID
     * @return 查询结果
     */
    public static Enum<Status> queryActivityStatus(String activityId) {
        return statusMap.get(activityId);
    }

    /**
     * 执行状态变更
     *
     * @param activityId   活动ID
     * @param beforeStatus 变更前状态
     * @param afterStatus  变更后状态 b
     */
    public static synchronized void execStatus(String activityId, Enum<Status> beforeStatus, Enum<Status> afterStatus) {
        statusMap.put(activityId, afterStatus);
    }
}
```
**具体状态流程定义：CheckState，CloseState，DoingState，EditingState，OpenState，PassState，RefuseState**
```java
//待审核状态
public class CheckState extends AbstractState {

    @Override
    public Result examinationPassed(Context context) {
        extractedExecStatus(context.getActivityInfo(), Status.Pass);
        return new Result("0000", "活动审核通过完成");
    }

    @Override
    public Result reviewRejected(Context context) {
        extractedExecStatus(context.getActivityInfo(), Status.Refuse);
        return new Result("0000", "活动审核撤销回到编辑中");
    }

    @Override
    public Result withdrawalOfTrial(Context context) {
        extractedExecStatus(context.getActivityInfo(), Status.Editing);
        return super.withdrawalOfTrial(context);
    }

    @Override
    public Result activityClosed(Context context) {
        extractedExecStatus(context.getActivityInfo(), Status.Close);
        return new Result("0000", "活动审核关闭完成");
    }

    /**
     * 执行活动状态流转状态
     *
     * @param activityInfo 活动信息
     * @param status       状态
     */
    private void extractedExecStatus(ActivityInfo activityInfo, Status status) {
        ActivityService.execStatus(activityInfo.getActivityId(), activityInfo.getStatus(), status);
    }
}
```
**...其他状态参考代码案例！这里不在累赘！**

**测试用例定义：**
```java
 @Test
    public void stateTest() {
        String activityId = "100001";
        ActivityInfo activityInfo = ActivityService.init(activityId, Status.Editing);
        Context context = new Context(new EditingState(), activityInfo);
        Result result = context.activityReview(context);

        log.info("测试结果(编辑中To提审活动)：{}", JSONUtil.toJsonStr(result));
        log.info("活动信息：{}", JSONUtil.toJsonStr(ActivityService.queryActivityInfo(activityId)));

        context.setState(new PassState());
        result = context.activityClosed(context);
        log.info("测试结果(提审活动To审核成功)：{}", JSONUtil.toJsonStr(result));
        log.info("活动信息：{}", JSONUtil.toJsonStr(ActivityService.queryActivityInfo(activityId)));

        result = context.activityExecution(context);
        log.info("测试结果(审核成功To开启活动中)：{}", JSONUtil.toJsonStr(result));
        log.info("活动信息：{}", JSONUtil.toJsonStr(ActivityService.queryActivityInfo(activityId)));

    }
```
**预期输出结果：**
```java
15:09:24.403 [main] INFO com.smartfrank.pattern.StateTest - 测试结果(编辑中To提审活动)：{"code":"0000","info":"活动提审成功"}
15:09:24.408 [main] INFO com.smartfrank.pattern.StateTest - 活动信息：{"activityName":"618营销活动","activityId":"100001","beginTime":1636528164406,"endTime":1636528164406,"status":"Check"}
15:09:24.409 [main] INFO com.smartfrank.pattern.StateTest - 测试结果(提审活动To审核成功)：{"code":"0000","info":"活动审核关闭完成"}
15:09:24.409 [main] INFO com.smartfrank.pattern.StateTest - 活动信息：{"activityName":"618营销活动","activityId":"100001","beginTime":1636528164409,"endTime":1636528164409,"status":"Close"}
15:09:24.409 [main] INFO com.smartfrank.pattern.StateTest - 测试结果(审核成功To开启活动中)：{"code":"0000","info":"活动变更活动中完成"}
15:09:24.409 [main] INFO com.smartfrank.pattern.StateTest - 活动信息：{"activityName":"618营销活动","activityId":"100001","beginTime":1636528164409,"endTime":1636528164409,"status":"Doing"}
```
### 2.4 状态模式优点
> + 结构清晰，状态模式将与特定状态相关的行为局部化到一个状态中，并且将不同状态的行为分割开来，满足“单一职责原则”。
> + 将状态转换显示化，减少对象间的相互依赖。将不同的状态引入独立的对象中会使得状态转换变得更加明确，且减少对象间的相互依赖。
> + 状态类职责明确，有利于程序的扩展。通过定义新的子类很容易地增加新的状态和转换。
### 2.5 状态模式缺点
> + 状态模式的使用必然会增加系统的类与对象的个数。
> + 状态模式的结构与实现都较为复杂，如果使用不当会导致程序结构和代码的混乱。
> + 状态模式对开闭原则的支持并不太好，对于可以切换状态的状态模式，增加新的状态类需要修改那些负责状态转换的源码，否则无法切换到新增状态，而且修改某个状态类的行为也需要修改对应类的源码。
## 三、总结
> 经过上面案例体现，我们可以发现状态模式让代码结构有很强的可读性，同事也满足开闭原则，同时状态模式将每个状态的行为封装到对应的一个类中。
> 在当一个事件或者对象有很多种状态，状态之间会相互转换，对不同的状态要求不同行为的时候，可以考虑使用状态模式。

[代码案例](https://gitee.com/unicornlai/smart-design-pattern/tree/master/smart-dp-state)
<HideArticle/>
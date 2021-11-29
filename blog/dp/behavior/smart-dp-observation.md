---
title: 手撸设计模式-观察者模式
date: 2021-11-26
tags:
  - 观察者模式
categories:
  - 设计模式
---

## 一 、观察者模式介绍
### 1.1 定义
> + 当对象间存在一对多关系时，则使用观察者模式（Observer Pattern）。这种模式有时又称作发布-订阅模式、模型-视图模式，它是对象行为型模式。
> + 举例：观察者一般可以看做是第三者，比如在学校上自习的时候，大家肯定都有过交头接耳、各种玩耍的经历，这时总会有一个“放风”的小伙伴，当老师即将出现时及时“通知”大家老师来了。
### 1.2 观察者模式结构
>实现观察者模式时要注意具体目标对象和具体观察者对象之间不能直接调用，否则将使两者之间紧密耦合起来，这违反了面向对象的设计原则。
>>**观察者模式的主要角色:**
>> + 抽象主题（Subject）角色：也叫抽象目标类，它提供了一个用于保存观察者对象的聚集类和增加、删除观察者对象的方法，以及通知所有观察者的抽象方法。
>> + 具体主题（Concrete Subject）角色：也叫具体目标类，它实现抽象目标中的通知方法，当具体主题的内部状态发生改变时，通知所有注册过的观察者对象。
>> + 抽象观察者（Observer）角色：它是一个抽象类或接口，它包含了一个更新自己的抽象方法，当接到具体主题的更改通知时被调用。
>> + 具体观察者（Concrete Observer）角色：实现抽象观察者中定义的抽象方法，以便在得到目标的更改通知时更新自身的状态。

### 1.3 观察者模式UML结构图
![UML结构图](https://img-blog.csdnimg.cn/5c0f718dffb147efaeb29b6df65af624.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_19,color_FFFFFF,t_70,g_se,x_16)

### 1.4 观察者模式代码实现
**抽象观察者接口定义：**
```java
public interface Observer {
    /**
     * 执行业务
     */
    void execute();
}
```
**具体观察者类定义：**
```java
public class ConcreteObserver implements Observer {
    @Override
    public void execute() {
        System.out.println("收到消息，开始处理业务");
    }
}
```
**抽象主题类定义：**
```java
public abstract class Subject {

    /**
     * 观察者容器
     */
    protected List<Observer> observers = new CopyOnWriteArrayList<>();

    /**
     * 向观察者容器增加
     *
     * @param observer 观察者对象
     */
    public void addObserver(Observer observer) {
        this.observers.add(observer);
    }

    /**
     * 删除容器中的观察者类
     *
     * @param observer 观察者对象
     */
    public void deleteObserver(Observer observer) {
        this.observers.remove(observer);
    }

    /**
     * 通知所有观察者
     */
    public abstract void notifyObserver();
}
```
**具体主题对象定义：**
```java
public class ConcreteSubject extends Subject {

    /**
     * 调用通知所有注册过的观察者对象
     */
    @Override
    public void notifyObserver() {
        System.out.println("具体目标发生改变...");
        for (Observer observer : observers) {
            //调用通知所有注册过的观察者对象执行业务
            observer.execute();
        }
    }
}
```
**客户端测试定义：**
```java
public class Client {

    public static void main(String[] args) {
        //创建一个主题
        ConcreteSubject concreteSubject = new ConcreteSubject();
        Observer observer = new ConcreteObserver();
        //将观察者加入观察者容器
        concreteSubject.addObserver(observer);
        //开始活动
        concreteSubject.notifyObserver();
    }
}
```
**预期结果输出：**
```java
Connected to the target VM, address: '127.0.0.1:55318', transport: 'socket'
具体目标发生改变...
收到消息，开始处理业务
Disconnected from the target VM, address: '127.0.0.1:55318', transport: 'socket'
```

## 二、观察者模式场景
### 2.1 场景描述
> 除了在日常生活中能遇到观察者模式外，在编程开发也能遇到，比如在抽奖业务中，中间可能存在发送MQ消息，使用Message短信通知客户中奖等场景等，例如我们经常使用的MQ服务，虽然MQ服务是有一个通知中心并不是每一个类服务进行通知，但整体上也可以算作是观察者模式的思路设计。再比如可能有做过的一些类似事件监听总线，让主线服务与其他辅线业务服务分离，为了使系统降低耦合和增强扩展性，也会使用观察者模式进行处理。

### 2.2 场景模拟
![在这里插入图片描述](https://img-blog.csdnimg.cn/1ad30ec4ff88436a836fbb38d8fae089.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)

### 2.3 代码案例实现
**事件监听抽象接口定义：**
```java
public interface EventListener {

    void doEvent(LotteryResult lotteryResult);
}

```
**短信事件监听定义：**
```java
@Slf4j
public class MessageEventListener implements EventListener {
    @Override
    public void doEvent(LotteryResult lotteryResult) {
        log.info("记录用户:{} -Message- 抽奖结果:{}", lotteryResult.getUId(), lotteryResult.getMsg());
    }
}
```
**MQ事件监听定义：**
```java
@Slf4j
public class MQEventListener implements EventListener {
    @Override
    public void doEvent(LotteryResult lotteryResult) {
        log.info("记录用户:{} -MQ- 抽奖结果:{}", lotteryResult.getUId(), lotteryResult.getMsg());
    }
}
```
**事件处理器定义：**
```java
public class EventManager {

    Map<Enum<EventType>, List<EventListener>> listeners = new HashMap<>();

    public EventManager(Enum<EventType>... operations) {
        for (Enum<EventType> operation : operations) {
            this.listeners.put(operation, new ArrayList<>());
        }
    }

    /**
     * 订阅
     *
     * @param eventType 事件类型
     * @param listener  监听器
     */
    public void subscribe(Enum<EventType> eventType, EventListener listener) {
        List<EventListener> eventListeners = listeners.get(eventType);
        eventListeners.add(listener);
    }


    /**
     * 取消订阅
     *
     * @param eventType 事件类型
     * @param listener  监听
     */
    public void unsubscribe(Enum<EventType> eventType, EventListener listener) {
        List<EventListener> eventListeners = listeners.get(eventType);
        eventListeners.remove(listener);
    }

    /**
     * 通知
     *
     * @param eventType     事件类型
     * @param lotteryResult 通知结果
     */
    public void notify(Enum<EventType> eventType, LotteryResult lotteryResult) {
        List<EventListener> eventListeners = listeners.get(eventType);
        for (EventListener eventListener : eventListeners) {
            eventListener.doEvent(lotteryResult);
        }
    }

    /**
     * 事件类型枚举
     */
    public enum EventType {
        MQ, MESSAGE
    }
}

```
**抽奖结果定义：**
```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LotteryResult {
    /**
     * 用户ID
     */
    private String uId;
    /**
     * 抽奖信息
     */
    private String msg;
    /**
     * 业务时间
     */
    private Date dateTime;
}
```
**模拟抽奖服务定义：**
```java
public class LuckDrawService {
    /**
     * 模拟抽奖
     * @param uId
     * @return
     */
    public String lottery(String uId) {
        return Math.abs(uId.hashCode()) % 2 == 0 ? "恭喜你，编码[".concat(uId).concat("]").concat("在本次活动中奖") : "很遗憾，编码[".concat(uId).concat("]").concat("在本次抽奖未中奖！");
    }
}
```
**抽奖业务抽象类定义：**
```java
public abstract class LotteryService {
    private EventManager eventManager;

    public LotteryService() {
        //初始化事件处理器
        eventManager = new EventManager(EventManager.EventType.MQ, EventManager.EventType.MESSAGE);
        eventManager.subscribe(EventManager.EventType.MQ, new MQEventListener());
        eventManager.subscribe(EventManager.EventType.MESSAGE, new MessageEventListener());
    }

    /**
     * 抽奖后通知事件类型
     *
     * @param uId 用户id
     * @return
     */
    public LotteryResult draw(String uId) {
        LotteryResult lotteryResult = doDraw(uId);
        //调用通知
        eventManager.notify(EventManager.EventType.MQ, lotteryResult);
        eventManager.notify(EventManager.EventType.MESSAGE, lotteryResult);
        return lotteryResult;
    }

    /**
     * 真正执行抽奖业务
     *
     * @param uId
     * @return
     */
    protected abstract LotteryResult doDraw(String uId);
}
```
**抽奖业务实现定义：**
```java
public class LotteryServiceImpl extends LotteryService {
    private LuckDrawService luckDrawService = new LuckDrawService();

    @Override
    protected LotteryResult doDraw(String uId) {
        return new LotteryResult(uId, luckDrawService.lottery(uId), new Date());
    }
}
```
**测试用例定义：**
```java
    @Test
    public void test() {
        LotteryServiceImpl lotteryService = new LotteryServiceImpl();
        LotteryResult result = lotteryService.draw("10000003");
        System.out.println("抽奖结果:" + JSONUtil.toJsonStr(result));
    }
```

**预期运行结果定义：**
```java
14:39:58.777 [main] INFO com.smartfrank.pattern.example.event.listener.MQEventListener - 记录用户:10000003 -MQ- 抽奖结果:恭喜你，编码[10000003]在本次活动中奖
14:39:58.781 [main] INFO com.smartfrank.pattern.example.event.listener.MessageEventListener - 记录用户:10000003 -Message- 抽奖结果:恭喜你，编码[10000003]在本次活动中奖
抽奖结果:{"msg":"恭喜你，编码[10000003]在本次活动中奖","dateTime":1635921598774,"uId":"10000003"}
```
### 2.4 优点
>1、观察者和被观察者是抽象耦合的。
>2、建立一套触发机制。
### 2.5 缺点
>1、如果一个被观察者对象有很多的直接和间接的观察者的话，将所有的观察者都通知到会花费很多时间。
>2、如果在观察者和观察目标之间有循环依赖的话，观察目标会触发它们之间进行循环调用，可能导致系统崩溃。
> 3、观察者模式没有相应的机制让观察者知道所观察的目标对象是怎么发生变化的，而仅仅只是知道观察目标发生了变化。
## 三、总结
> 综合上述场景，可得出当前拆分出了核心流程与辅助流程的代码。一般代码中的核心流程不会经常变化。但辅助流程会随着业务的各种变化而变化，包括；营销、裂变、促活等等，因此使用设计模式架设代码就显得非常有必要。
> 此种设计模式从结构上是满足开闭原则的，当你需要新增其他的监听事件或者修改监听逻辑，是不需要改动事件处理类的。但是可能你不能控制调用顺序以及需要做一些事件结果的返回继续操作，所以使用的过程时需要考虑场景的合理性。

[代码案例](https://gitee.com/unicornlai/smart-design-pattern/tree/master/smart-dp-observation)
<HideArticle/>
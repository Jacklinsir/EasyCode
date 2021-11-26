---
title: 手撸设计模式-代理模式
date: 2021-11-26
tags:
  - 代理模式
categories:
  - 设计模式
---

## 一 、代理模式介绍
### 1.1 定义
>+ 代理(Proxy)是一种设计模式,提供了对目标对象另外的访问方式;即通过代理对象访问目标对象.这样做的好处是:可以在目标对象实现的基础上,增强额外的功能操作,即扩展目标对象的功能。
>+ 比如给某一个对象提供一个代理对象，并由代理对象控制对原对象的引用。通俗的来讲代理模式就是我们生活中常见的中介。

### 1.2 代理模式分类
>  我们有多种不同的方式来实现代理。如果按照代理创建的时期来进行分类的话， 可以分为两种：静态代理、动态代理（jdk，cglib）。静态代理是由程序员创建或特定工具自动生成源代码，在对其编译。在程序运行之前，代理类.class文件就已经被创建了。动态代理是在程序运行时通过反射机制动态创建的。

### 1.3 静态代理实现
**通用接口定义：**
```java
public interface IRun {
    void run();
}
```
**通用接口实现类定义:**
```java
public class RealizeRun implements IRun {
    @Override
    public void run() {
        System.out.println("正在执行主流程保存数据库");
    }
}
```
**通用接口代理类定义：**
```java
public class StaticProxy implements IRun {

    private IRun run;

    public StaticProxy(IRun run) {
        super();
        this.run = run;
    }

    @Override
    public void run() {
        begin();
        run.run();
        end();
    }
    public void end() {
        System.out.println("static-代理-开启事务");
    }
    public void begin() {
        System.out.println("static-代理-提交事务");
    }
}
```
**预期结果：**
```java
static-代理-提交事务
正在执行主流程保存数据库
static-代理-开启事务
```
### 1.4 动态代理实现
#### 1.4.1 Jdk代理（基于接口代理）
**jdk动态代理工厂类定义：**
```java
public class ProxyJdkFactory implements InvocationHandler {

    //定义目标对象
    private Object target;

    public ProxyJdkFactory(Object target) {
        this.target = target;
    }

    /**
     * 获取被代理接口实例对象
     *
     * @param <T>
     * @return
     */
    public <T> T getProxy() {
        return (T) Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), this);
    }


    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        begin();
        Object invoke = method.invoke(target, args);
        end();
        return invoke;
    }
    private void begin() {
        System.out.println("jdk-代理-开启事务");
    }
    private void end() {
        System.out.println("jdk-代理-提交事务");
    }
}
```
**预期运行结果：**
```java
jdk-代理-开启事务
正在执行主流程保存数据库
jdk-代理-提交事务
```
#### 1.4.2 Cglib动态代理 (基于实现类代理)
**环境依赖：**
```java
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-aop</artifactId>
        <version>2.4.5</version>
    </dependency>
```
**Cglib动态代理工厂定义：**
```java
public class ProxyCglibFactory implements MethodInterceptor {

    //代理的目标对象
    private Object target;

    public ProxyCglibFactory(Object target) {
        this.target = target;
    }

    /**
     * 获取被代理类实例对象
     *
     * @param <T>
     * @return
     */
    public <T> T getProxy() {
        //Cglib 获取代理对象工具
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(target.getClass());
        enhancer.setCallback(this);
        return (T) enhancer.create();
    }

    @Override
    public Object intercept(Object obj, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
        begin();
        Object invoke = method.invoke(target, args);
        end();
        return invoke;
    }

    private void begin() {
        System.out.println("cglib-代理-开始事务");
    }
    private void end() {
        System.out.println("cglib-代理-提交事务");
    }
}
```
**预期运行结果：**
```java
cglib-代理-开始事务
正在执行主流程保存数据库
cglib-代理-提交事务
```
## 二、代理模式应用场景
### 2.1 场景举例：
> 1. 你的数据库访问层面经常会提供一个较为基础的应用，以此来减少应用服务扩容时不至于数据库连接数暴增。
> 2. 使用过的一些中间件例如；RPC框架，在拿到jar包对接口的描述后，中间件会在服务启动的时候生成对应的代理类，当调用接口的时候，实际是通过代理类发出的socket信息进行通过。
> 3. 另外像我们常用的MyBatis，基本是定义接口但是不需要写实现类，就可以对xml或者自定义注解里的sql语句进行增删改查操作。

### 2.2 场景用例模拟图：
![在这里插入图片描述](https://img-blog.csdnimg.cn/18fbfe8f4cab44aab6691d4f34c7ad2c.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
### 2.3 代理类模式模拟场景
> 通过使用代理模式模拟实现一个Mybatis中对类的代理过程，也就是只需要定义接口，就可以关联到方法注解中的sql语句完成对数据库的操作。
**注意点：**
> + BeanDefinitionRegistryPostProcessor，spring的接口类用于处理对bean的定义注册。
> + GenericBeanDefinition，定义bean的信息，在mybatis-spring中使用到的是；ScannedGenericBeanDefinition 略有不同。
> + FactoryBean，用于处理bean工厂的类，这个类非常见。

### 2.4 代理模式中间件模型结构
![代理模式模型结构图](https://img-blog.csdnimg.cn/7b8fc0993f6042d8a600dd174b11b029.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
> + 此模型中涉及的类并不多，但都是抽离出来的核心处理类。主要的事情就是对类的代理和注册到spring中。
> + 上图中最上面是关于中间件的实现部分，下面对应的是功能的使用。

### 2.5 场景代码实现
**注解定义：**
```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Select {
    /**
     * sql语句
     * @return
     */
    String value() default "";
}
```
**查询dao接口定义：**
```java
public interface IUserDao {
    @Select("select username from t_user where id = #{uId}")
    String queryUserInfo(String uId);
}
```
**Mapper工厂代理类:**
```java
@Slf4j
public class MapperFactoryBean<T> implements FactoryBean<T> {

    private Class<T> mapperInterface;

    public MapperFactoryBean(Class<T> mapperInterface) {
        this.mapperInterface = mapperInterface;
    }

    @Override
    public T getObject() throws Exception {
        InvocationHandler handler = (proxy, method, args) -> {
            Select annotation = method.getAnnotation(Select.class);
            log.info("SQL：{}", annotation.value().replace("#{uId}", args[0].toString()));
            return args[0] + ",代理模式实战";
        };
        return (T) Proxy.newProxyInstance(this.mapperInterface.getClassLoader(), new Class[]{mapperInterface}, handler);
    }

    @Override
    public Class<?> getObjectType() {
        return mapperInterface;
    }
    /**
     * 对象为单例的
     *
     * @return
     */
    @Override
    public boolean isSingleton() {
        return true;
    }
}
```
>+  如果你有阅读过mybatis源码，是可以看到这样的一个类；MapperFactoryBean，这里我们也模拟一个这样的类，在里面实现我们对代理类的定义。
> + 通过继承FactoryBean，提供bean对象，也就是方法；T getObject()。
    在方法getObject()中提供类的代理以及模拟对sql语句的处理，这里包含了用户调用dao层方法时候的处理逻辑。
> + 还有最上面我们提供构造函数来透传需要被代理类，Class<T> mapperInterface，在mybatis中也是使用这样的方式进行透传。
> + 另外getObjectType()提供对象类型反馈，以及isSingleton()返回类是单例的

**注册Bean工厂定义：**
```java
/**
 * Description: 注册Bean到Spring容器中
 * <br/>
 * RegisterBeanFactory
 *
 * @author laiql
 * @date 2021/11/1 11:31
 */
public class RegisterBeanFactory implements BeanDefinitionRegistryPostProcessor {
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry beanDefinitionRegistry) throws BeansException {
        //生成Bean定义
        GenericBeanDefinition beanDefinition = new GenericBeanDefinition();
        beanDefinition.setBeanClass(MapperFactoryBean.class);
        beanDefinition.setScope("singleton");
        beanDefinition.getConstructorArgumentValues().addGenericArgumentValue(IUserDao.class);

        //定义Bean持有对象
        BeanDefinitionHolder definitionHolder = new BeanDefinitionHolder(beanDefinition, "userDao");
        //Bean注册
        BeanDefinitionReaderUtils.registerBeanDefinition(definitionHolder, beanDefinitionRegistry);
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory configurableListableBeanFactory) throws BeansException {
    }
}
```
> + 这里我们将代理的bean交给spring容器管理，也就可以非常方便让我们可以获取到代理的bean。这部分是spring中关于一个bean注册过程的源码。
> + GenericBeanDefinition，用于定义一个bean的基本信息setBeanClass(MapperFactoryBean.class);，也包括可以透传给构造函数信息addGenericArgumentValue(IUserDao.class);
> + 最后使用 BeanDefinitionReaderUtils.registerBeanDefinition，进行bean的注册，也就是注册到DefaultListableBeanFactory中。

**配置文件定义：**
```java
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd"
       default-autowire="byName">
    <bean id="userDao" class="com.smartfrank.pattern.proxy.example.RegisterBeanFactory"/>
</beans>
```
**测试用例定义：**
```java
@Slf4j
public class ProxyTest {
    @Test
    public void proxyTest() {
        BeanFactory factory = new ClassPathXmlApplicationContext("spring-config.xml");
        IUserDao userDao = factory.getBean("userDao", IUserDao.class);
        String userInfo = userDao.queryUserInfo("10001");
        log.info("预期测试验证结果: {}", userInfo);

    }
}
```

**测试预期运行结果：**
```java
13:44:25.153 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@6e4784bc
13:44:25.306 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 1 bean definitions from class path resource [spring-config.xml]
13:44:25.340 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'userDao'
13:44:25.379 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Overriding bean definition for bean 'userDao' with a different definition: replacing [Generic bean: class [com.smartfrank.pattern.proxy.example.RegisterBeanFactory]; scope=; abstract=false; lazyInit=false; autowireMode=1; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null; defined in class path resource [spring-config.xml]] with [Generic bean: class [com.smartfrank.pattern.proxy.example.MapperFactoryBean]; scope=singleton; abstract=false; lazyInit=null; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null]
13:44:25.388 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'userDao'
13:44:25.412 [main] INFO com.smartfrank.pattern.proxy.example.MapperFactoryBean - SQL：select username from t_user where id = 10001
13:44:25.413 [main] INFO com.smartfrank.pattern.proxy.ProxyTest - 预期测试验证结果: 10001,代理模式实战
Disconnected from the target VM, address: '127.0.0.1:60233', transport: 'socket'
```
### 2.6 代理模式优点
> 1、代理模式能将代理对象与真实被调用的目标对象分离。
> 2、一定程度上降低了系统的耦合度，扩展性好。
> 3、可以起到保护目标对象的作用。
> 4、可以对目标对象的功能增强。
### 2.7 代理模式缺点
> 1、代理模式会造成系统设计中类的数量增加。
> 2、在客户端和目标对象增加一个代理对象，会造成请求处理速度变慢。
> 3、增加了系统的复杂度。

## 三、总结
> + 关于这部分代理模式的讲解我们采用了开发一个关于mybatis-spring中间件中部分核心功能来体现代理模式的强大之处，所以涉及到了一些关于代理类的创建以及spring中bean的注册这些知识点，可能在平常的业务开发中都是很少用到的，但是在中间件开发中确实非常常见的操作。
> + 代理模式的设计方式可以让代码更加整洁、干净易于维护，虽然在这部分开发中额外增加了很多类也包括了自己处理bean的注册等，但是这样的中间件复用性极高也更加智能，可以非常方便的扩展到各个服务应用中。

[案例代码地址](https://gitee.com/unicornlai/smart-design-pattern/tree/master/smart-dp-proxy)
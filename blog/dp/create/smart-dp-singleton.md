---
title: 手撸设计模式-单例模式
date: 2021-11-25
tags:
  - 单例模式
categories:
  - 设计模式
---
# 单例模式应用场景
>单例模式（Singleton Pattern）是指确保一个类在单线程和多线程情况下绝对只有一个实例，并且提供一个全局的访问点。单例模式是创建型模式。单例模式在现实生活中也很广泛。比如：公司CEO、CTO、都是单已存在的，是常见的单例模式。在J2EE标准中，ServletContext、ServletContextConfig等。在Spring框架应用中ApplicationContext，数据库的连接池都是单例模式。
# 饿汉式单例
+ 介绍
  我们先观察一下单例模式的类图如下：
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/20210214180953520.png)
>饿汉式单例是在类加载的时候就立即初始化，并且创建单例对象。绝对线程安全，在线程还没有出现以前就是实例化了，不可能存在线程访问安全问题。
+ 优点：
>没有加任何的锁、执行效率比较高，在用户体验上来考虑，比懒汉式更好。
+ 缺点：
> 类加载的时候就初始化，不管用户是否需要使用都占着空间，比较浪费内存，有着占着茅坑不拉屎的蕴意。
+ 注意：
> 在SpringIOC容器中ApplicationContext本身就是典型的饿汉式单例模式。

**饿汉式单例-代码案例**
```java
/**
 * Description: 饿汉式单例模式
 * <br/>
 * HungrySimpleSingleton
 *
 * @author laiql
 * @date 2021/1/17 2:25 下午
 */
public class HungrySimpleSingleton {

    private static final HungrySimpleSingleton instance = new HungrySimpleSingleton();

    private HungrySimpleSingleton() {}
    
    public static HungrySimpleSingleton getInstance() {
        return instance;
    }
}
```
**饿汉式静态代码块单例-代码案例**
```java
/**
 * Description: 静态饿汉式单例模式
 * <br/>
 * HungrySaticSingleton
 *
 * @author laiql
 * @date 2021/1/17 2:25 下午
 */
public class HungrySaticSingleton {
    private static HungrySaticSingleton instance;
    
    private HungrySaticSingleton() {}
    static {
        instance = new HungrySaticSingleton();
    }
    public static HungrySaticSingleton getInstance() {
        return instance;
    }
}
```
>以上两种写法都很简单，也很好理解，但是饿汉式适用单例对象较少的情况，更优的写法请看下面介绍。
# 懒汉式单例
+ 介绍
>懒汉式单例模式的特点：只有被外部类调用内部类的才会加载，称为懒汉式单例模式。

**懒汉式单例模式-代码案例**
```java
/**
 * Description: 懒汉式简单-单例模式
 * <br/>
 * LazySimpleSingleton
 *
 * @author laiql
 * @date 2021/1/17 2:28 下午
 */
public class LazySimpleSingleton {

    private static LazySimpleSingleton simpleSingleton = null;
    
    private LazySimpleSingleton() {}
    /**
     * 存在线程安全问题
     * 在方法加锁：{
     *     隐患1：会导致整个类的所有方法被锁死。
     *     隐患2：加锁会导致性能降低。
     * }
     * @return
     */
    public static LazySimpleSingleton getInstance() {
        if (simpleSingleton == null) {
            simpleSingleton = new LazySimpleSingleton();
        }
        return simpleSingleton;
    }
}
```
**注意⚠️**
> 懒汉式单例模式会存在线程不安全，再并发环境下一定纪几率出现创建两个不同的的对象结果，意味着懒汉式单例模式存在多线程不安全问题。
> 解决方案：
> 就是在获取实例上加上synchronized关键字，问题解决，但是引出新的问题。比如 因为在方法加了synchronized关键字会导致整个类被锁，同时用synchronized加锁，在线程数量比较多的时候，如果CPU分配压力上升，会导致大批量的线程出现堵塞，从而导致程序运行性能大幅度下降。所以该方法不是最优解决方案，更优写法请看下面介绍。
# 双重检验锁单例
+ 介绍：
> 双重检验锁，就是在在原来基础上进行优化，对创建实例对象过程中增加多次检验，只有检验通过才能创建实例对象，这样即兼顾了线程安全有提升了程序性能问题。

**懒汉式双重检验锁单例模式-代码案例**
```java
/**
 * Description: 双重检验锁单利模式
 * <br/>
 * DoubleCheckLockSingleton
 *
 * @author laiql
 * @date 2021/2/7 8:48 上午
 */
public class DoubleCheckLockSingleton {

    private volatile static DoubleCheckLockSingleton instance;

    private DoubleCheckLockSingleton() {
    }

    /**
     * 可能出现的问题：
     * 1：指令重排会导致线程不安全
     * {
     * 1.分配内存给这个对象
     * 2.初始化对象
     * 3.设置lazy指向刚分配的内存地址
     * 4.初次访问对象
     * }
     * 解决方案：
     * 在静态常量增加 volatile关键字防止指令重排
     *
     * @return
     */
    public static DoubleCheckLockSingleton getInstance() {
        if (instance == null) {
            synchronized (DoubleCheckLockSingleton.class) {
                if (instance == null) {
                    instance = new DoubleCheckLockSingleton();
                }
            }
        }
        return instance;
    }
}
```
**注意⚠️**
> 双重检验锁单例模式可能出现的问题：指令重排
> 因为代码编译完成被加载进JVM虚拟机的时候字节码会进行指令重排，所以我们需要增加防止指令重排关键字volatile，可以解决指令重排问题。
# Java机制单例模式（性能最优）
+ 介绍
> 这里利用Java中内部类加载机制实现单例模式，默认内部类不加载，只有使用具体Class类的时候会先进行内部类初始化，实现单例模式，具体实现如下：

**Java机制静态内部类-代码案例实现**
```java
/**
 * Description: 静态内部类实现单例模式
 * <br/>
 * LazyInnerSingleton
 *
 * @author laiql
 * @date 2021/2/14 7:25 下午
 */
public class LazyInnerSingleton {

    private LazyInnerSingleton() {}

    /**
     * 对外部提供调用实例
     * 该方法不允许被重写
     *
     * @return
     */
    public final static LazyInnerSingleton getInstance() {
        return LazyHolder.LAZY;
    }

    /**
     * 默认不加载
     */
    private static class LazyHolder {
        public static final LazyInnerSingleton LAZY = new LazyInnerSingleton();
    }
}
```
**注意⚠️**
> 好处：这种形式兼顾了饿汉式的内存浪得问题，也兼顾synchronized加锁性能问题，内部类一定要在方法调用前初始化，巧妙的避免了线程问题。
> 坏处：会导致反射破坏单例模式和序列化破坏单例情况。

**反射破坏单例模式-代码案例**
```java
public class Test {
    public static void main(String[] args) throws IllegalAccessException, InvocationTargetException, InstantiationException, NoSuchMethodException {
        //通过字节码创建对象
        Class<LazyInnerSingleton> lazyInnerSingletonClass = LazyInnerSingleton.class;
        //通过反射拿到私有的构造方法
        Constructor<LazyInnerSingleton> declaredConstructor = lazyInnerSingletonClass.getDeclaredConstructor(null);
        //设置访问权限
        declaredConstructor.setAccessible(true);
        LazyInnerSingleton obj1 = LazyInnerSingleton.getInstance();
        LazyInnerSingleton obj2 = declaredConstructor.newInstance();
        System.out.println(obj1 == obj2); //false
    }
}
```
**优化方案**
>经过上述案例的复现，两次创建的对象都是不一样的，破坏了单例原则，解决方案，我们在构造方法做一下限制，如果通过反射强制访问，直接抛出异常。
>优化过后的代码如下：
```java
/**
 * Description: 静态内部类实现单例模式
 * <br/>
 * LazyInnerSingleton
 *
 * @author laiql
 * @date 2021/2/14 7:25 下午
 */
public class LazyInnerSingleton {

    /**
     * 增加构造方法限制，防止非法创建
     */
    private LazyInnerSingleton() {
        if (LazyHolder.LAZY != null) {
            throw new RuntimeException("非法创建对象！");
        }
    }

    /**
     * 对外部提供调用实例
     * 该方法不允许被重写
     *
     * @return
     */
    public final static LazyInnerSingleton getInstance() {
        return LazyHolder.LAZY;
    }
    /**
     * 默认不加载
     */
    private static class LazyHolder {
        public static final LazyInnerSingleton LAZY = new LazyInnerSingleton();
    }
}
```
**反序列化破坏单利模式**
>当我们创建完成一个单例对象后，有时候需要将对象序列化写入到磁盘，下次使用时候再次从磁盘中读取到对象，反序列化转化成内存对象，反序列化后的对象会重新分配内存，即就是重新创建，那如果序列化的目标对象为单例对象，就违背了单例模式的原则，相当于破坏了单例模式。

**反序列化破坏单例模式-代码案例**
```java
/**
 * Description: 反序列化破坏单例模式案例
 * <br/>
 * SerializableDestroySingleton
 *
 * @author laiql
 * @date 2021/2/14 8:09 下午
 */
public class SerializableDestroySingleton implements Serializable {

    private SerializableDestroySingleton() {
    }

    private final static SerializableDestroySingleton INSTANCE = new SerializableDestroySingleton();

    public static SerializableDestroySingleton getInstance() {
        return INSTANCE;
    }
}
```
**测试案例**
```java
public class TestDemo {

    public static void main(String[] args) {
        SerializableDestroySingleton obj1 = null;
        SerializableDestroySingleton obj2 = SerializableDestroySingleton.getInstance();
        FileOutputStream fileOutputStream = null;
        try {
            fileOutputStream = new FileOutputStream("SerializableDestroySingleton.class");
            ObjectOutputStream outputStream = new ObjectOutputStream(fileOutputStream);
            outputStream.writeObject(obj2);
            outputStream.flush();
            outputStream.close();

            FileInputStream fileInputStream = new FileInputStream("SerializableDestroySingleton.class");
            ObjectInputStream inputStream = new ObjectInputStream(fileInputStream);
            obj1 = (SerializableDestroySingleton) inputStream.readObject();
            inputStream.close();
            System.out.println(obj1);
            System.out.println(obj2);
            System.out.println(obj1 == obj2);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```
**输出结果：**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210214203351529.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIxMDc3NzE1,size_16,color_FFFFFF,t_70)
**解决方案：**
> 从上面运行结果中，可以看出，反序列化后的对象和手动创建的对象是不一致的，实例化两次违背了单例模式的原则，那么，我们如何保证反序列化的情况也能实现单例模式？其实很简单，我们只需要在在单例对象增加readResolve()方法即可。来看代码优化：

```java
package com.laiql.dp.singleton.serializable;

import java.io.Serializable;

/**
 * Description: 反序列化破坏单例模式案例
 * <br/>
 * SerializableDestroySingleton
 *
 * @author laiql
 * @date 2021/2/14 8:09 下午
 */
public class SerializableDestroySingleton implements Serializable {

    private SerializableDestroySingleton() {
    }

    private final static SerializableDestroySingleton INSTANCE = new SerializableDestroySingleton();

    public static SerializableDestroySingleton getInstance() {
        return INSTANCE;
    }

    /**
     * 增加该方法防止序列化破坏单例模式
     * @return
     */
    private Object readResolve() {
        return INSTANCE;
    }
}
```
**运行结果：**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210214204013614.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIxMDc3NzE1,size_16,color_FFFFFF,t_70)
**有关readResolve()方法解释：**
>我们一起来看一下JDK源码，为什么重写readResolve()方法可以实现反序列化单例模式呢！
>请看这篇文章：[https://blog.csdn.net/u011499747/article/details/50982956](https://blog.csdn.net/u011499747/article/details/50982956)
# 注册单例
+ 介绍
> 注册式单例模式又称为登记式单利，就是将每个实例都登记到某一个地方，使用唯一的标识获取实例，注册式单利有两种写法：一种为容器缓存，一种为枚举登记。
>
**枚举登记单例模式-代码案例**
```java
public enum EnumSingleton {
    /**
     * 实例
     */
    INSTANCE;

    private Object data;

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public static EnumSingleton getInstance() {
        return INSTANCE;
    }
}
```

**测试代码**

```java
public class TestRegistryDemo {

    public static void main(String[] args) {
        EnumSingleton obj1 = null;
        EnumSingleton obj2 = EnumSingleton.getInstance();
        //设置对象
        obj2.setData(new Object());
        FileOutputStream fileOutputStream = null;
        try {
            fileOutputStream = new FileOutputStream("EnumSingleton.class");
            ObjectOutputStream outputStream = new ObjectOutputStream(fileOutputStream);
            outputStream.writeObject(obj2);
            outputStream.flush();
            outputStream.close();

            FileInputStream fileInputStream = new FileInputStream("EnumSingleton.class");
            ObjectInputStream inputStream = new ObjectInputStream(fileInputStream);
            obj1 = (EnumSingleton) inputStream.readObject();
            inputStream.close();
            System.out.println(obj1.getData());
            System.out.println(obj2.getData());
            System.out.println(obj1.getData() == obj2.getData());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```
**注意⚠️**
>在枚举登记模式中，我们可以发现我们没有做任何特别处理，结果和我们预期的一样，请看下面字节码解释：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210214211641471.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIxMDc3NzE1,size_16,color_FFFFFF,t_70)
> 原来，枚举单例在静态代码块中对INSTANCE赋值，是饿汉式的实现。至此，我们还可以试想一下，序列化能否破坏枚举单例，请看下面源码实现：
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/20210214212146436.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIxMDc3NzE1,size_16,color_FFFFFF,t_70)
> 具体可以看readEnum()方法实现：
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/20210214212315558.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIxMDc3NzE1,size_16,color_FFFFFF,t_70)
> 经过源码翻译，枚举登记模式不会被序列化破坏。我们在试想一下，会不会被反射破坏呢？
> 经过笔者测试是不会被破坏的。

**测试案例：**
```java
public class TestRegistryDemo1 {

    public static void main(String[] args) {
        try {
            Class<EnumSingleton> enumSingletonClass = EnumSingleton.class;
            Constructor<EnumSingleton> declaredConstructor = enumSingletonClass.getDeclaredConstructor(null);
            declaredConstructor.setAccessible(true);
            EnumSingleton enumSingleton = declaredConstructor.newInstance();
            System.out.println(enumSingleton);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```
**输出结果：**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210214212843523.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIxMDc3NzE1,size_16,color_FFFFFF,t_70)
**容器缓存式-单例模式**
+ 介绍：
>容器式写法适用于创建实例非常多的请看，便于管理，但是，是在非线程安全的。

**代码案例如下：**
```java
/**
 * Description: 注册式容器缓存单例模式
 * <br/>
 * ContainerSingleton
 *
 * @author laiql
 * @date 2021/2/14 9:31 下午
 */
public class ContainerSingleton {
    private static Map<String, Object> ioc = new ConcurrentHashMap<>();

    public static Object getBean(String className) {
        synchronized (ioc) {
            if (!ioc.containsKey(className)) {
                Object obj = null;
                try {
                    obj = Class.forName(className).newInstance();
                    ioc.put(className, obj);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return obj;
            } else {
                return ioc.get(className);
            }
        }
    }
}
```
**注意⚠️**
> 我们也还可以看一下Spring中的容器单例实现代码实现：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210214213527221.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIxMDc3NzE1,size_16,color_FFFFFF,t_70)

# ThreadLocal 线程单例
+ 介绍：
> 在线程中也存在单例实现的如TreadLocal，TreadLocal不能保证其创建的对着的全局唯一，但是能保证单个线程中式唯一的，天生的线程安全。

**案例代码：**
```java
/**
 * Description: ThreadLocal单例模式案例
 * <br/>
 * ThreadLocalSingleton
 * 
 * @author laiql
 * @date 2021/2/14 9:41 下午
 */
public class ThreadLocalSingleton {
    
    private static final ThreadLocal<ThreadLocalSingleton> threadLocalInstance = ThreadLocal.withInitial(() -> new ThreadLocalSingleton());

    private ThreadLocalSingleton() {
    }
    public static ThreadLocalSingleton getInstance() {
        return threadLocalInstance.get();
    }
}
```
> 案例解释：
> 在主线程 main 中无论调用多少次，获取到的实例都是同一个，都在两个子线程中分别获取到了不同的实例。那么 ThreadLocal 是如果实现这样的效果的呢？我们知道上面的单例模式为了达到线程安全的目的，给方法上锁，以时间换空间。ThreadLocal 将所有的对象全部放在 ThreadLocalMap 中，为每个线程都提供一个对象，实际上是以空间换时间来实现线程间隔离的。

# 总结
>单例模式在我们日常开发也是频繁常见，单例模式可以保证内存里只有一个实例，减少了内存开销；可以避免对资源的多重占用。
<HideArticle/>
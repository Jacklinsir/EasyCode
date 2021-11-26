---
title: 手撸设计模式-工厂方法模式
date: 2021-11-25
tags:
  - 工厂方法模式
categories:
  - 设计模式
---
# 工厂模式的历史由来
>在现实社会上我们都知道，有一种企业叫工厂，在原始社会自给自足（没有工厂）、后来通过迭代进化到农耕文化社会（**简单工厂**，民间酒坊）、工业革命社会出现了流水线（**工厂方法**，自产自销）、现代产业链代工厂（**抽象工厂**，富士康）等。
>![在这里插入图片描述](https://img-blog.csdnimg.cn/20210215105017602.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIxMDc3NzE1,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210215105051316.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIxMDc3NzE1,size_16,color_FFFFFF,t_70)
下面我开始由简到繁以次介绍相关工厂。
# 简单工厂模式
> 简单工厂（Simple Factory Pattern）是指由一个工厂对象决定创建出哪一种产品类的实例对象。简单工厂适用于工厂类负责创建的对象较少的场景，且客户端只需要传入工厂类的参数，对于创建对象的逻辑客户端不需要关心。

>接下来我们以案例为准，我们现在需要录制一门Java课程和大数据课程对象。现在需要录制视频，所以我们定一个课程标准接口ICourse接口。如下：
```java
public interface ICourse{
	/** 录制视频 */
	public void record();
}
```
>创建一个Java课程实现类JavaCourse类：
```java
public class JavaCourse implements ICourse {
    @Override
    public void study() {
        System.out.println("这是一门Java课程");
    }
}
```
>创建一个大数据课程实现类BigDataCourse类：
```java
public class BigDataCourse implements ICourse {
    @Override
    public void study() {
        System.out.println("这是一门BigData课程");
    }
}
```
>创建一个CourseFactory工厂类：
>在这里我们提供了三种实现:
>+ 第一种通过形参方法传递创建不同类型的实例对象。
>+ 第二种通过参数ClassName 反射机制创建对应对象。
>+ 第三种根据字节码创建对象。
```java
/**
 * Description: 简单工厂模式
 * <br/>
 * OrdinaryFactory
 *
 * @author laiql
 * @date 2021/1/16 8:37 下午
 */
public class CourseFactory {

    /**
     * 根据名字创建工厂
     * 弊端：
     * 如果name写错了会导致创建报错
     *
     * @param name
     * @return
     */
    public ICourse instantiateName(String name) {
        try {
            if ("java".equals(name)) {
                return new JavaCourse();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 通过参数ClassName 反射机制创建对应对象
     * 弊端：如果字节码名传递错误也会导致错误
     *
     * @param className
     * @return
     */
    public ICourse instantiateClassName(String className) {
        try {
            return (ICourse) Class.forName(className).newInstance();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 根据字节码创建对象
     *
     * @param clazz
     * @return
     */
    public ICourse instantiateClazz(Class<? extends ICourse> clazz) {
        try {
            return clazz.newInstance();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
```
> 测试类：
```java
public class CourseFactoryTest {

    public static void main(String[] args) {
        //传统调用方式
        ICourse course = new JavaCourse();
        course.study();

        //通过工厂方式调用
        CourseFactory courseFactory = new OrdinaryFactory();
        courseFactory.instantiateName("java").study();
        courseFactory.instantiateClassName("com.laiql.dp.factory.JavaCourse").study();
        courseFactory.instantiateClazz(JavaCourse.class).study();
    }
}
```
**简单工厂总结：**
+ 优点：
> 简单易用
+ 缺点：
> 拓展性比较差，如果后续业务增加需要大量化修改代码，不符软件设计原则中的开闭原则。经过后面两种优化之后可以增加拓展性问题，简单工厂在JDK源码也非常常见。使用推荐第三种写法。根据字节码对象创建创建实例。
# 工厂方法模式
>工厂方法模式（Factory Method Pattern）是指定一个创建对象的接口，让实现这个接口的类来决定实例化哪一个类，工厂方法让类类的实例化推迟到子类中进行，在工厂方法模式中用户只需要关心所需产品对应的工厂，无需关心创建的细节，而且加入新的产品符合开闭原则。
工厂方法模式主要解决产品拓展的问题，再简单工厂中，随着产品链的丰富，如果每一个业务的创建逻辑有区别的化，工厂的指责会变的越来越多，有点像万能工厂，并不便于维护。根据单一指责原则我们将职能继续拆分，专人干专事。

**工厂方法模式-案例代码**
>建立一个工厂模型
```java
/**
 * Description: 建立一个工厂模型
 * <br/>
 * IMethodFactory
 *
 * @author laiql
 * @date 2021/1/16 8:57 下午
 */
public interface IMethodFactory {
    /**
     * 定义一个对象创建方法，前提这个方式需要被业务对象实现
     */
    ICourse create();
}
```
>建立对应的业务对象工厂
```java
/**
 * Description: 业务对象工厂
 * <br/>
 * JavaFactory
 *
 * @author laiql
 * @date 2021/1/16 9:01 下午
 */
public class JavaFactory implements IMethodFactory {

    public ICourse create() {
        return new JavaCourse();
    }
}
```
```java
/**
 * Description: 业务对象工厂
 * <br/>
 * PythonFactory
 *
 * @author laiql
 * @date 2021/1/16 9:01 下午
 */
public class PythonFactory implements IMethodFactory {

    public ICourse create() {
        return new PythonCourse();
    }
}
```
**测试类MethodFactoryTest：**
```java
/**
 * Description: 工厂方法测试
 * 优点：符合软件设计原则上的开闭原则
 * <br/>
 * MethodFactoryTest
 *
 * @author laiql
 * @date 2021/1/16 9:03 下午
 */
public class MethodFactoryTest {
    public static void main(String[] args) {
        IMethodFactory javaFactory = new JavaFactory();
        javaFactory.create().study();
        IMethodFactory pythonFactory = new PythonFactory();
        pythonFactory.create().study();
    }
}
```
**类图：**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210215115115306.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIxMDc3NzE1,size_16,color_FFFFFF,t_70)
**适用场景：**
> 1. 创建对象需要大量重复的代码
> 2. 客户端（应用层）不依赖于产品类实例如何被创建、实现等细节。
> 3. 一个类通过其子类来指定创建哪个对象。

**缺点：**
> 1. 类的个数容易过多，增加复杂度。
> 2. 增加了系统的抽象性和理解难度。
# 抽象工厂模式
> 抽象工厂模式（Abastract Factory Pattern）是指提供一个创建一系列的相关或相互依赖对象的接口，无须指定他们具体的类。客户端（应用层）不依赖于产品类实例如何被创建、实现等细节，强调的是一系列相关的产品对象（属于统一产品族）一起使用创建对象需要大量重复的代码，需要提供一个产品类的库，所有的产品以同样的的接口出现，从而使客户端不依赖于具体的实现。具体案例，请看这两个概念：**产品等级结构和产品族**，看下面图：
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/20210215120542511.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIxMDc3NzE1,size_16,color_FFFFFF,t_70)
> 从上图中看出有正方形，圆形和菱形三种图形，相同颜色深浅的就代表同一个产品族，相同形状的代表同一个产品等级结构。同样可以从生活中来举例，比如，美的电器生产多种家用电器。那么上图中，颜色最深的正方形就代表美的洗衣机、颜色最深的圆形代表美的空调、颜色最深的菱形代表美的热水器，颜色最深的一排都属于美的品牌，都是美的电器这个产品族。再看最右侧的菱形，颜色最深的我们指定了代表美的热水器，那么第二排颜色稍微浅一点的菱形，代表海信的热水器。同理，同一产品结构下还有格力热水器，格力空调，格力洗衣机。再看下面的这张图，最左侧的小房子我们就认为具体的工厂，有美的工厂，有海信工厂，有格力工厂。每个品牌的工厂都生产洗衣机、热水器和空调。
![在这里插入图片描述](https://img-blog.csdnimg.cn/2021021512065099.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIxMDc3NzE1,size_16,color_FFFFFF,t_70)

**抽象工厂-代码案例**
>先定义一个产品等级抽象
```java
/**
 * Description: 笔记
 * <br/>
 * Note
 *
 * @author laiql
 * @date 2021/1/16 9:22 下午
 */
public abstract class Note {
    /**
     * 笔记
     */
    public abstract void produce();
}
```
```java
/**
 * Description: 视频
 * <br/>
 * Video
 *
 * @author laiql
 * @date 2021/1/16 9:20 下午
 */
public abstract class Video {
    /**
     * 视频
     */
    public abstract void produce();
}
```
>业务对象继承抽象

```java
public class JavaNote extends Note {

    @Override
    public void produce() {
        System.out.println("Java 笔记");
    }
}
//----------------------------
public class JavaVideo extends Video {

    @Override
    public void produce() {
        System.out.println("这是Java 视频");
    }
}
//=============================
public class PythonNote extends Note {
    @Override
    public void produce() {
        System.out.println("这是Python笔记");
    }
}
//----------------------------
public class PythonVideo extends Video {
    @Override
    public void produce() {
        System.out.println("这是Python 视频");
    }
}
```
>创建工厂

```java
/**
 * Description: 创建工厂
 * <br/>
 * AbstCourseFactory
 *
 * @author laiql
 * @date 2021/1/16 9:27 下午
 */
public interface AbstCourseFactory {

    Note getNote();

    Video getVideo();
}
```
>创建业务实例工厂对象

```java
/**
 * Description:
 * <br/>
 * JavaCourseFactory
 *
 * @author laiql
 * @date 2021/1/16 9:30 下午
 */
public class JavaCourseFactory implements AbstCourseFactory {

    @Override
    public Note getNote() {
        return new JavaNote();
    }
    @Override
    public Video getVideo() {
        return new JavaVideo();
    }
}
//=========================
public class PythonCourseFactory implements AbstCourseFactory {
    @Override
    public Note getNote() {
        return new PythonNote();
    }

    @Override
    public Video getVideo() {
        return new PythonVideo();
    }
}
```
>抽象工厂测试：
```java
public class AbstFactoryTest {

    public static void main(String[] args) {
        AbstCourseFactory abstCourseFactory = new JavaCourseFactory();
        abstCourseFactory.getNote().produce();
        abstCourseFactory.getVideo().produce();
        AbstCourseFactory abstCourseFactory1 = new PythonCourseFactory();
        abstCourseFactory1.getVideo().produce();
        abstCourseFactory1.getNote().produce();
    }
}
```
**抽象工厂总结：**
>    上面的代码完整地描述了两个产品族 Java 课程和 Python 课程，也描述了两个产品等级视频和手记。抽象工厂非常完美清晰地描述这样一层复杂的关系。但是，不知道大家有没有发现，如果我们再继续扩展产品等级，将源码 Source 也加入到课程中，那么我们的代码从抽象工厂，到具体工厂要全部调整，很显然不符合开闭原则。因此抽象工厂也是有缺点的：
1、	规定了所有可能被创建的产品集合，产品族中扩展新的产品困难，需要修改抽象工厂的接口。
2、	增加了系统的抽象性和理解难度。

# 总结
>但在实际应用中，我们千万不能犯强迫症甚至有洁癖。在实际需求中产品等级结构升级是非常正常的一件事情。我们可以根据实际情况，只要不是频繁升级，可以不遵循开闭原则。代码每半年升级一次或者每年升级一次又有何不可呢？

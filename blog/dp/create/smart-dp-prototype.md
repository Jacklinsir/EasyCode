---
title: 手撸设计模式-原型模式
date: 2021-11-25
tags:
  - 原型模式
categories:
  - 设计模式
---
# 原型模式场景介绍
>场景一：在我们开发过程中你一定遇见过getter和setter赋值操作。这样虽然看过去很清晰，但是背地里是一种纯属体力劳动的骚操作。那么接下来原型模式可以帮我们解决这种大幅度getter和setter的操作。
>原型模式（Prototype Pattern）是指原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。
原型模式主要适用于以下场景：
1、类初始化消耗资源较多。
2、new 产生的一个对象需要非常繁琐的过程（数据准备、访问权限等）
3、构造函数比较复杂。
4、循环体中生产大量对象时。
在 Spring 中，原型模式应用得非常广泛。例如 scope=“prototype”，在我们经常用
的 JSON.parseObject()也是一种原型模式。下面，我们来看看原型模式类结构图：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210215130039362.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIxMDc3NzE1,size_16,color_FFFFFF,t_70)
# 原型模式之浅度克隆
**介绍**
> 在浅度克隆中，创建一个新对象，新对象的属性和原来对象完全相同，对于非基本类型属性，仍指向原有属性所指向的对象的内存地址。

**原型模式之浅度克隆-代码案例**
>一个标准的原型模式代码，应该是这样设计的。先创建原型 Prototype 接口：
```java
public interface Prototype{
    Prototype clone();
}
```
>创建具体需要克隆的对象 ConcretePrototypeA
```java
public class ConcretePrototypeA implements Prototype {

    private int age;
    private String name;
    private List hobbies;

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List getHobbies() {
        return hobbies;
    }

    public void setHobbies(List hobbies) {
        this.hobbies = hobbies;
    }

    @Override
    public ConcretePrototypeA clone() {
        ConcretePrototypeA concretePrototype = new ConcretePrototypeA();
        concretePrototype.setAge(this.age);
        concretePrototype.setName(this.name);
        concretePrototype.setHobbies(this.hobbies);
        return concretePrototype;
    }

}
```
>创建Client对象
```java
public class Client {

    private Prototype prototype;

    public Client(Prototype prototype){
        this.prototype = prototype;
    }
    public Prototype startClone(Prototype concretePrototype){
        return concretePrototype.clone();
    }
}
```
>创建测试案例：
```java
public class PrototypeTest {

    public static void main(String[] args) {

        // 创建一个具体的需要克隆的对象
        ConcretePrototypeA concretePrototype = new ConcretePrototypeA();
        // 填充属性，方便测试
        concretePrototype.setAge(18);
        concretePrototype.setName("prototype");
        List hobbies = new ArrayList<String>();
        concretePrototype.setHobbies(hobbies);
        System.out.println(concretePrototype);

        // 创建Client对象，准备开始克隆
        Client client = new Client(concretePrototype);
        ConcretePrototypeA concretePrototypeClone = (ConcretePrototypeA) client.startClone(concretePrototype);
        System.out.println(concretePrototypeClone);

        System.out.println("克隆对象中的引用类型地址值：" + concretePrototypeClone.getHobbies());
        System.out.println("原对象中的引用类型地址值：" + concretePrototype.getHobbies());
        System.out.println("对象地址比较：" + (concretePrototypeClone.getHobbies() == concretePrototype.getHobbies()));
    }
}

```
**输出结果：**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210215131909357.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIxMDc3NzE1,size_16,color_FFFFFF,t_70)
**总结：**
>从测试结果看出 hobbies 的引用地址是相同的，意味着复制的不是值，而是引用的地址。这 样 的 话 ， 如 果 我 们 修 改 任 意 一 个 对 象 中 的 属 性 值 ， concretePrototype 和concretePrototypeCone 的 hobbies 值都会改变。这就是我们常说的浅克隆。只是完整复制了值类型数据，没有赋值引用对象。换言之，所有的引用对象仍然指向原来的对象，
显然不是我们想要的结果。下面我们来看深度克隆继续改造。
# 原型模式之深度克隆
**介绍**
> 在深度克隆中，创建一个新对象，属性中引用的其他对象也会被克隆，不再指向原有对象地址。
总之深浅克隆都会在堆中新分配一块区域，区别在于对象属性引用的对象是否需要进行克隆（递归性的）
案例：
我们换一个场景，大家都知道齐天大圣。首先它是一只猴子，有七十二般变化，把一根毫毛就可以吹出千万个泼猴，手里还拿着金箍棒，金箍棒可以变大变小。这就是我们耳熟能详的原型模式的经典体现。


**原型模式之深度克隆-代码案例**
>创建原型猴子 Monkey 类：
```java
public class Monkey {
    public int height;
    public int weight;
    public Date birthday;

}
```
>创建引用对象金箍棒 Jingubang 类：
```java
public class JinGuBang implements Serializable {
    public float h = 100;
    public float d = 10;

    public void big(){
        this.d *= 2;
        this.h *= 2;
    }
    public void small(){
        this.d /= 2;
        this.h /= 2;
    }
}
```
>创建具体的对象齐天大圣 QiTianDaSheng 类：
```java
public class QiTianDaSheng extends Monkey implements Cloneable, Serializable {

    public JinGuBang jinGuBang;

    public QiTianDaSheng() {
        //只是初始化
        this.birthday = new Date();
        this.jinGuBang = new JinGuBang();
    }

    @Override
    protected Object clone() {
        return this.deepClone();
    }

    //深克隆实现
    public Object deepClone() {
        try {

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ObjectOutputStream oos = new ObjectOutputStream(bos);
            oos.writeObject(this);

            ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
            ObjectInputStream ois = new ObjectInputStream(bis);

            QiTianDaSheng copy = (QiTianDaSheng) ois.readObject();
            copy.birthday = new Date();
            return copy;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    //浅克隆实现
    public QiTianDaSheng shallowClone(QiTianDaSheng target) {

        QiTianDaSheng qiTianDaSheng = new QiTianDaSheng();
        qiTianDaSheng.height = target.height;
        qiTianDaSheng.weight = target.height;

        qiTianDaSheng.jinGuBang = target.jinGuBang;
        qiTianDaSheng.birthday = new Date();
        return qiTianDaSheng;
    }


}

```
>测试案例代码：

```java
public class DeepCloneTest {

    public static void main(String[] args) {

        QiTianDaSheng qiTianDaSheng = new QiTianDaSheng();
        try {
            QiTianDaSheng clone = (QiTianDaSheng)qiTianDaSheng.clone();
            System.out.println("深克隆：" + (qiTianDaSheng.jinGuBang == clone.jinGuBang));
        } catch (Exception e) {
            e.printStackTrace();
        }

        QiTianDaSheng q = new QiTianDaSheng();
        QiTianDaSheng n = q.shallowClone(q);
        System.out.println("浅克隆：" + (q.jinGuBang == n.jinGuBang));
    }
}

```
**输出结果：**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210215132503120.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIxMDc3NzE1,size_16,color_FFFFFF,t_70)
**注意⚠️>克隆破坏单例模式**

>如果我们克隆的目标的对象是单例对象，那意味着，深克隆就会破坏单例。实际上防止克隆破坏单例解决思路非常简单，禁止深克隆便可。要么在我们的单例类不实现Cloneable 接口；要么我们重写 clone()方法，在 clone 方法中返回单例对象即可，
>具体代码如下：
```java
@Override
protected Object clone() throws CloneNotSupportedException {
        return INSTANCE;
        }
```

**Cloneable 源码分析**
>先看我们常用的 ArrayList 就实现了 Cloneable 接口，来看代码 clone()方法的实现：
```java
   public Object clone() {
        try {
        ArrayList<?> v = (ArrayList<?>) super.clone();
        v.elementData = Arrays.copyOf(elementData, size);
        v.modCount = 0;
        return v;
        } catch (CloneNotSupportedException e) {
        // this shouldn't happen, since we are Cloneable
        throw new InternalError(e);
        }
        }
```
<HideArticle/>
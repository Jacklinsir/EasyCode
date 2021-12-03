---
title: 手撸设计模式-组合模式
date: 2021-11-26
tags:
  - 组合模式
categories:
  - 设计模式
---

## 一、组合模式模式介绍
### 1.1 定义
>+  组合（Composite Pattern）模式的定义：有时又叫作整体-部分（Part-Whole）模式，它是一种将对象组合成树状的层次结构的模式，用来表示“整体-部分”的关系，使用户对单个对象和组合对象具有一致的访问性，属于结构型设计模式。
>+ 组合模式提供了一种层级结构，并允许我们忽略对象与对象集合之间的差别。

### 1.2 组合模式结构
> + 抽象构件（Component）角色：它的主要作用是为树叶构件和树枝构件声明公共接口，并实现它们的默认行为。在透明式的组合模式中抽象构件还声明访问和管理子类的接口；在安全式的组合模式中不声明访问和管理子类的接口，管理工作由树枝构件完成。（总的抽象类或接口，定义一些通用的方法，比如新增、删除）
> + 树叶构件（Leaf）角色：是组合中的叶节点对象，它没有子节点，用于继承或实现抽象构件。
> + 树枝构件（Composite）角色 / 中间构件：是组合中的分支节点对象，它有子节点，用于继承和实现抽象构件。它的主要作用是存储和管理子部件，通常包含 Add()、Remove()、GetChild() 等方法。
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/5d519cade5d34eb2a7dfddd5f63ba4e4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_19,color_FFFFFF,t_70,g_se,x_16)

### 1.3 组合模式UML
![在这里插入图片描述](https://img-blog.csdnimg.cn/9e9fe15f0c534e02a65042b78114678f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
### 1.4 代码实现
**抽象构建定义：**
```java
public abstract class Component {

    public void add(Component component) {
        throw new UnsupportedOperationException("禁止操作");
    }

    public void remove(Component component) {
        throw new UnsupportedOperationException("禁止操作");
    }

    public Component getChild(int index) {
        throw new UnsupportedOperationException("禁止操作");
    }

    /**
     * 抽象打印方法留给子类实现
     */
    public abstract void operation();

}
```
**树枝构件定义：**
```java
public class Composite extends Component {
    private ArrayList<Component> children = new ArrayList<Component>();

    @Override
    public void add(Component component) {
        children.add(component);
    }

    @Override
    public void remove(Component component) {
        children.remove(component);
    }

    @Override
    public Component getChild(int index) {
        return children.get(index);
    }

    @Override
    public void operation() {
        for (Component child : children) {
            child.operation();
        }
    }
}
```
**树叶构件定义：**
```java
public class Leaf extends Component {

    private String name;

    public Leaf(String name) {
        this.name = name;
    }

    @Override
    public void operation() {
        System.out.println("树叶" + name + "：被访问！");
    }
}
```
**组合模式客户端测试定义：**
```java
public class CompositePattern {

    public static void main(String[] args) {
        //树枝 1 节点
        Composite cs1 = new Composite();
        //树枝 2 节点
        Composite cs2 = new Composite();
        //树枝 2 节点
        Composite cs3 = new Composite();

        //new 4 个树叶节点
        Leaf leaf1 = new Leaf("1");
        Leaf leaf2 = new Leaf("2");
        Leaf leaf3 = new Leaf("3");
        Leaf leaf4 = new Leaf("4");
        Leaf leaf5 = new Leaf("5");

        //添加叶子
        cs1.add(leaf1);

        //添加树枝
        cs1.add(cs2);
        //添加叶子
        cs2.add(leaf2);
        cs2.add(leaf3);

        //添加树枝
        cs1.add(cs3);
        //添加叶子
        cs3.add(leaf4);
        cs3.add(leaf5);

        cs1.operation();
    }
}
```
**预期输出结果：**
```java
树叶1：被访问！
树叶2：被访问！
树叶3：被访问！
树叶4：被访问！
树叶5：被访问！
```
## 二、组合模式场景
### 2.1 场景介绍
>这里以一个营销场景来模拟一个类似的决策场景，体现出组合模式在其中起到的重要性。另外，组合模式不只是可以运用于规则决策树，还可以做服务包装将不同的接口进行组合配置，对外提供服务能力，减少开发成本。
### 2.2 场景描述图
![在这里插入图片描述](https://img-blog.csdnimg.cn/8598a19f33584612b74d81592062c32e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)

### 2.4 代码实现
**决策引擎流程接口定义：**
```java
public interface IEngine {

    EngineResult process(final Long treeId, final String userId, TreeRich treeRich, final Map<String, String> decisionMatter);

}
```
**决策节点配置定义：**
```java
public class EngineConfig {
    static Map<String, LogicFilter> logicFilterMap;

    static {
        logicFilterMap = new ConcurrentHashMap<>();
        logicFilterMap.put("userAge",new UserAgeFilter());
        logicFilterMap.put("userGender",new UserGenderFilter());
    }

    public Map<String, LogicFilter> getLogicFilterMap() {
        return logicFilterMap;
    }

    public void setLogicFilterMap(Map<String, LogicFilter> logicFilterMap) {
        EngineConfig.logicFilterMap = logicFilterMap;
    }
}
```
**决策引擎抽象类提供基础服务定义：**
```java
public abstract class EngineBase extends EngineConfig implements IEngine {

    private Logger logger = LoggerFactory.getLogger(EngineBase.class);

    @Override
    public abstract EngineResult process(Long treeId, String userId, TreeRich treeRich, Map<String, String> decisionMatter);

    protected TreeNode engineDecisionMaker(TreeRich treeRich, Long treeId, String userId, Map<String, String> decisionMatter) {
        TreeRoot treeRoot = treeRich.getTreeRoot();
        Map<Long, TreeNode> treeNodeMap = treeRich.getTreeNodeMap();
        // 规则树根ID
        Long rootNodeId = treeRoot.getTreeRootNodeId();
        TreeNode treeNodeInfo = treeNodeMap.get(rootNodeId);
        //节点类型[NodeType]；1子叶、2果实
        while (treeNodeInfo.getNodeType().equals(1)) {
            String ruleKey = treeNodeInfo.getRuleKey();
            LogicFilter logicFilter = logicFilterMap.get(ruleKey);
            String matterValue = logicFilter.matterValue(treeId, userId, decisionMatter);
            Long nextNode = logicFilter.filter(matterValue, treeNodeInfo.getTreeNodeLinkList());
            treeNodeInfo = treeNodeMap.get(nextNode);
            logger.info("决策树引擎=>{} userId：{} treeId：{} treeNode：{} ruleKey：{} matterValue：{}", treeRoot.getTreeName(), userId, treeId, treeNodeInfo.getTreeNodeId(), ruleKey, matterValue);
        }
        return treeNodeInfo;
    }
}
```
**决策引擎处理器定义：**
```java
public class TreeEngineHandle extends EngineBase {

    @Override
    public EngineResult process(Long treeId, String userId, TreeRich treeRich, Map<String, String> decisionMatter) {
        // 决策流程
        TreeNode treeNode = engineDecisionMaker(treeRich, treeId, userId, decisionMatter);
        // 决策结果
        return new EngineResult(userId, treeId, treeNode.getTreeNodeId(), treeNode.getNodeValue());
    }
}
```
**逻辑决策器接口定义：**
```java
public interface LogicFilter {


    /**
     * 逻辑决策器
     *
     * @param matterValue          决策值
     * @param treeNodeLineInfoList 决策节点
     * @return 下一个节点Id
     */
    Long filter(String matterValue, List<TreeNodeLink> treeNodeLineInfoList);

    /**
     * 获取决策值
     *
     * @param decisionMatter 决策物料
     * @return 决策值
     */
    String matterValue(Long treeId, String userId, Map<String, String> decisionMatter);
}
```
**决策抽象类提供基础服务定义：**
```java
public abstract class BaseLogic implements LogicFilter {

    @Override
    public Long filter(String matterValue, List<TreeNodeLink> treeNodeLinkList) {
        for (TreeNodeLink nodeLine : treeNodeLinkList) {
            if (decisionLogic(matterValue, nodeLine)) {
                return nodeLine.getNodeIdTo();
            }
        }
        return 0L;
    }

    @Override
    public abstract String matterValue(Long treeId, String userId, Map<String, String> decisionMatter);

    /**
     * 决策逻辑
     *
     * @param matterValue 决策值
     * @param nodeLink    规则树线信息
     * @return
     */
    private boolean decisionLogic(String matterValue, TreeNodeLink nodeLink) {
        switch (nodeLink.getRuleLimitType()) {
            case 1:
                return matterValue.equals(nodeLink.getRuleLimitValue());
            case 2:
                return Double.parseDouble(matterValue) > Double.parseDouble(nodeLink.getRuleLimitValue());
            case 3:
                return Double.parseDouble(matterValue) < Double.parseDouble(nodeLink.getRuleLimitValue());
            case 4:
                return Double.parseDouble(matterValue) >= Double.parseDouble(nodeLink.getRuleLimitValue());
            case 5:
                return Double.parseDouble(matterValue) <= Double.parseDouble(nodeLink.getRuleLimitValue());
            default:
                return false;
        }
    }

}

```
**年龄节点过滤定义：**
```java
public class UserAgeFilter extends BaseLogic {
    @Override
    public String matterValue(Long treeId, String userId, Map<String, String> decisionMatter) {
        return decisionMatter.get("age");
    }
}
```
**性别节点过滤定义：**
```java
public class UserGenderFilter extends BaseLogic {
    @Override
    public String matterValue(Long treeId, String userId, Map<String, String> decisionMatter) {
        return decisionMatter.get("gender");
    }
}

```
**测试用例定义：**
```java
	 @Before
	 public void init(){
	 //省略部分初始化代码
	 }
   @Test
    public void combinationTest() {
        logger.info("决策树组合结构信息：\r\n" + JSONUtil.toJsonStr(treeRich));

        IEngine treeEngineHandle = new TreeEngineHandle();

        Map<String, String> decisionMatter = new HashMap<>();
        decisionMatter.put("gender", "man");
        decisionMatter.put("age", "18");

        EngineResult result = treeEngineHandle.process(10001L, "Oli09pLkdjh", treeRich, decisionMatter);
        logger.info("测试结果：{}", JSONUtil.toJsonStr(result));

    }
```
**预期输出结果：**
```java
Connected to the target VM, address: '127.0.0.1:50327', transport: 'socket'
15:02:50.468 [main] INFO com.smartfrank.pattern.combination.CombinationTest - 决策树组合结构信息：
{"treeNodeMap":{"11":{"treeNodeLinkList":[{"ruleLimitValue":"25","ruleLimitType":3,"nodeIdTo":111,"nodeIdFrom":11},{"ruleLimitValue":"25","ruleLimitType":4,"nodeIdTo":112,"nodeIdFrom":11}],"treeNodeId":11,"nodeType":1,"ruleKey":"userAge","treeId":10001,"ruleDesc":"用户年龄"},"12":{"treeNodeLinkList":[{"ruleLimitValue":"25","ruleLimitType":3,"nodeIdTo":121,"nodeIdFrom":12},{"ruleLimitValue":"25","ruleLimitType":4,"nodeIdTo":122,"nodeIdFrom":12}],"treeNodeId":12,"nodeType":1,"ruleKey":"userAge","treeId":10001,"ruleDesc":"用户年龄"},"121":{"treeNodeId":121,"nodeType":2,"treeId":10001,"nodeValue":"果实C"},"1":{"treeNodeLinkList":[{"ruleLimitValue":"man","ruleLimitType":1,"nodeIdTo":11,"nodeIdFrom":1},{"ruleLimitValue":"woman","ruleLimitType":1,"nodeIdTo":12,"nodeIdFrom":1}],"treeNodeId":1,"nodeType":1,"ruleKey":"userGender","treeId":10001,"ruleDesc":"用户性别[男/女]"},"122":{"treeNodeId":122,"nodeType":2,"treeId":10001,"nodeValue":"果实D"},"111":{"treeNodeId":111,"nodeType":2,"treeId":10001,"nodeValue":"果实A"},"112":{"treeNodeId":112,"nodeType":2,"treeId":10001,"nodeValue":"果实B"}},"treeRoot":{"treeRootNodeId":1,"treeId":10001,"treeName":"规则决策树"}}
15:02:50.471 [main] INFO com.smartfrank.pattern.combination.example.service.engine.EngineBase - 决策树引擎=>规则决策树 userId：Oli09pLkdjh treeId：10001 treeNode：11 ruleKey：userGender matterValue：man
15:02:50.473 [main] INFO com.smartfrank.pattern.combination.example.service.engine.EngineBase - 决策树引擎=>规则决策树 userId：Oli09pLkdjh treeId：10001 treeNode：112 ruleKey：userAge matterValue：29
15:02:50.474 [main] INFO com.smartfrank.pattern.combination.CombinationTest - 测试结果：{"userId":"Oli09pLkdjh","treeId":10001,"nodeValue":"果实B","nodeId":112,"isSuccess":false}
Disconnected from the target VM, address: '127.0.0.1:50327', transport: 'socket'
```
### 2.5 组合模式优点
> + 组合模式使得客户端代码可以一致地处理单个对象和组合对象，无须关心自己处理的是单个对象，还是组合对象，这简化了客户端代码。
> + 更容易在组合体内加入新的对象，客户端不会因为加入了新的对象而更改源代码，满足“开闭原则”。
### 2.6 组合模式缺点
> + 设计较复杂，客户端需要花更多时间理清类之间的层次关系。
> + 不容易限制容器中的构件。
> + 不容易用继承的方法来增加构件的新功能。
## 三、总结
> + 从以上的决策树场景来看，组合模式的主要解决的是一系列简单逻辑节点或者扩展的复杂逻辑节点在不同结构的组织下，对于外部的调用是仍然可以非常简单的。
> + 这部分设计模式保证了开闭原则，无需更改模型结构你就可以提供新的逻辑节点的使用并配合组织出新的关系树。但如果是一些功能差异化非常大的接口进行包装就会变得比较困难，但也不是不能很好的处理，只不过需要做一些适配和特定化的开发。

[代码案例](https://gitee.com/unicornlai/smart-design-pattern/tree/master/smart-dp-combination)
<HideArticle/>
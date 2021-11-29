module.exports = {
    "title": "从码农到工匠",
    "description": "生命不息，奋斗不止！",
    "dest": "public",
    "head": [
        [
            'script',
            { "charset": "utf-8", "src": "https://readmore.openwrite.cn/js/readmore.js" },
        ],
        [
            "link",
            {
                "rel": "icon",
                "href": "/favicon.ico"
            }
        ],
        [
            "meta",
            {
                "name": "viewport",
                "content": "width=device-width,initial-scale=1,user-scalable=no"
            }
        ],
    ],
    "theme": "reco",
    "themeConfig": {
        "nav": [
            {
                "text": "Home",
                "link": "/",
            },
            {
                "text": "Java基础",
                "link": "/blog/java/demo.md"
            },
            {
                "text": "设计模式",
                "items": [
                    {
                        "text": "创建型模式",
                        "link": "/blog/dp/create/smart-dp-factory.md"
                    },
                    {
                        "text": "结构型模式",
                        "link": "/blog/dp/structure/smart-dp-adapter.md"
                    },
                    {
                        "text": "行为型模式",
                        "link": "/blog/dp/behavior/smart-dp-chain.md"
                    }
                ]
            },
            {
                "text": "Spring全家桶",
                "items": [
                    {
                        "text": "Spring",
                        "link": "/blog/spring/demo.md"
                    },
                    {
                        "text": "SpringBoot",
                        "link": "/blog/springboot/demo.md"
                    },
                    {
                        "text": "SpringCloud",
                        "link": "/blog/springcloud/demo.md"
                    }
                ]
            },
            {
                "text": "Java面试",
                "link": "/blog/interview/demo.md"
            },
            {
                "text": "系统架构",
                "link": "/blog/system/demo.md"
            },
            {
                "text": "中间件",
                "link": "/blog/middleware/demo.md"
            },
            {
                "text": "Devops",
                "items": [
                    {
                        "text": "K8s",
                        "link": "/blog/devops/k8s/aliyun-deploy-k8s.md"
                    },
                    {
                        "text": "Jenkins",
                        "link": "/blog/devops/jenkins/demo.md"
                    }
                ]
            },
            // {
            //   "text": "时间线",
            //   "link": "/timeline/"
            // },
            {
                "text": "GitHub",
                "link": "https://github.com/Jacklinsir"
            }
        ],

        //侧边栏
        "sidebar": {
            '/blog/dp/create/': [
                ['smart-dp-factory.md', '手撸设计模式之-工厂模式'],
                ['smart-dp-singleton.md', '手撸设计模式之-单例模式'],
                ['smart-dp-prototype.md', '手撸设计模式之-原型模式'],
                ['smart-dp-builder.md', '手撸设计模式之-建造者模式']
            ],
            '/blog/dp/behavior/': [
                ['smart-dp-chain.md', '手撸设计模式之-责任链模式'],
                ['smart-dp-delegate.md', '手撸设计模式之-委派模式'],
                ['smart-dp-observation.md', '手撸设计模式之-观察者模式'],
                ['smart-dp-state.md', '手撸设计模式之-状态模式'],
                ['smart-dp-strategy.md', '手撸设计模式之-策略模式'],
                ['smart-dp-template.md', '手撸设计模式之-模板模式']
            ],
            '/blog/dp/structure/': [
                ['smart-dp-adapter.md', '手撸设计模式之-适配器模式'],
                ['smart-dp-bridging.md', '手撸设计模式之-桥接模式'],
                ['smart-dp-combination.md', '手撸设计模式之-组合模式'],
                ['smart-dp-decorate.md', '手撸设计模式之-装饰器模式'],
                ['smart-dp-facade.md', '手撸设计模式之-外观模式'],
                ['smart-dp-flyweight.md', '手撸设计模式之-享元模式'],
                ['smart-dp-proxy.md', '手撸设计模式之-代理模式']
            ],
            '/blog/devops/k8s/': [
                ['aliyun-deploy-k8s.md', '阿里云-ECS云服务器跨地域部署k8s集群']
            ]
        },

        "type": "blog",
        "blogConfig": {},

        "friendLink": [
            {
                "title": "从码农到工匠",
                "desc": "生命不息，奋斗不止！",
                "email": "frank.lai1226@gmail.com",
                "link": "https://www.easyjava.cn"
            }
        ],

        // "logo": "/logo.png",
        "search": true,
        "searchMaxSuggestions": 10,
        "lastUpdated": "Last Updated",
        "author": "EasyJava",
        "authorAvatar": "/avatar.png",
        "record": "赣ICP备2021010404号",
        "startYear": "2021"
    },
    "markdown": {
        "lineNumbers": false
    }
}
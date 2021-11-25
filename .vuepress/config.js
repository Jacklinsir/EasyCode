module.exports = {
  "title": "从码农到工匠",
  "description": "生命不息，奋斗不止！",
  "dest": "public",
  "head": [
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
    ]
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
        "link": "/blog/demo.md"
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
            "link": "/blog/dp/structure/"
          },
          {
            "text": "行为型模式",
            "link": "/blog/dp/behavior/"
          }
        ]
      },
      {
        "text": "Spring全家桶",
        "items": [
          {
            "text": "Spring",
            "link": "/blog/demo.md"
          },
          {
            "text": "SpringBoot",
            "link": "/blog/demo.md"
          },
          {
            "text": "SpringCloud",
            "link": "/blog/demo.md"
          }
        ]
      },
      {
        "text": "Java面试",
        "link": "/blog/demo.md"
      },
      {
        "text": "系统架构",
        "link": "/blog/demo.md"
      },
      {
        "text": "中间件",
        "link": "/blog/demo.md"
      },
      {
        "text": "Devops",
        "items": [
          {
            "text": "K8s",
            "link": "/blog/demo.md"
          },
          {
            "text": "Jenkins",
            "link": "/blog/demo.md"
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
      '/blog/dp/': [
        ['create/smart-dp-factory.md', '手撸设计模式之-工厂模式'],
        ['create/smart-dp-singleton.md', '手撸设计模式之-单例模式'],
        ['create/smart-dp-prototype.md', '手撸设计模式之-原型模式'],
        ['create/smart-dp-builder.md', '手撸设计模式之-建造者模式']
      ]
    },

    "type": "blog",
    "blogConfig": {
    },

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
    "lineNumbers": true
  }
}
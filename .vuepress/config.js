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
        "link": "/docs/"
      },
      {
        "text": "设计模式",
        "items": [
          {
            "text": "创建型模式",
            "link": "/docs/"
          },
          {
            "text": "结构型模式",
            "link": "/blogs/theme-reco/"
          },
          {
            "text": "行为型模式",
            "link": "/blogs/theme-reco/"
          }
        ]
      },
      {
        "text": "Spring全家桶",
        "items": [
          {
            "text": "Spring",
            "link": "/docs/theme-reco/"
          },
          {
            "text": "SpringBoot",
            "link": "/blogs/theme-reco/"
          },
          {
            "text": "SpringCloud",
            "link": "/blogs/theme-reco/"
          }
        ]
      },
      {
        "text": "Java面试",
        "link": "/docs/theme-reco/"
      },
      {
        "text": "系统架构",
        "link": "/docs/theme-reco/"
      },
      {
        "text": "中间件",
        "link": "/docs/theme-reco/"
      },
      {
        "text": "Devops",
        "items": [
          {
            "text": "K8s",
            "link": "/docs/theme-reco/"
          },
          {
            "text": "Jenkins",
            "link": "/blogs/theme-reco/"
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
      "/docs/theme-reco/": [
        "",
        "theme",
        "plugin",
        "api"
      ]
    },

    "type": "blog",
    "blogConfig": {
    },

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
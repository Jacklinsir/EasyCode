window.onload = function () {
    themeDefaultContent = $(
        '#app .theme-container .page .theme-reco-content'
    );
    themeDefaultContent.attr('id', 'container');
    btw = new BTWPlugin();
    btw.init({
        id: 'container',
        blogId: '28394-1637911381724-766',
        name: 'EasyJava',
        qrcode: 'https://www.easyjava.cn/images/weixin.jpg',
        keyword: '验证码',
    });
};
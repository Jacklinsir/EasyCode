window.onload = function () {
    themeDefaultContent = $(
        '#app .theme-container .page .theme-reco-content'
    );
    themeDefaultContent.attr('id', 'container');
    btw = new BTWPlugin();
    btw.init({
        id: 'container',
        blogId: '28394-1638155123642-717',
        name: 'EasyJava',
        qrcode: 'https://www.easyjava.cn/weixin.png',
        keyword: '验证码',
    });
};
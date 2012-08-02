function followshippingWin(url) {

    var self, closeBtn, webView;

    self = Ti.UI.createWindow({
        title : 'متابعة الشحن',
        modal : true,
        backgroundImage : '/images/common/bg.jpg',
        barImage : '/images/common/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    if (Ti.Platform.getOsname() !== 'android') {
        closeBtn = Ti.UI.createButton({
            title : 'اغلاق   ',
            height : '31dp',
            width : '67dp',
            color : '#000000',
            font : {
                fontFamily : 'Arial',
                fontSize : '14dp',
                fontWeight : 'bold'
            },
            backgroundImage : '/images/common/button_back.png'
        });

        closeBtn.addEventListener('click', function() {
            self.close();
        });

        self.setLeftNavButton(closeBtn);
    }

    webView = Ti.UI.createWebView({
        url : url
    });

    self.add(webView);

    return self;
}

module.exports = followshippingWin;

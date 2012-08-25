function aboutWin() {

    var self, closeBtn, logo, icon1, icon2, icon3;

    self = Ti.UI.createWindow({
        title : 'الدعم الفني',
        modal : true,
        backgroundImage : '/images/bg.jpg',
        barImage : '/images/Navigation_Bar.jpg',
        barColor : 'gray'
    });

    if (Ti.Platform.getOsname() !== 'android') {
        closeBtn = Ti.UI.createButton({
            title : 'اغلاق   ',
            height : 31,
            width : 67,
            color : '#000000',
            font : {
                fontFamily : 'Arial',
                fontSize : 14,
                fontWeight : 'bold'
            },
            backgroundImage : '/images/button_back.png'
        });

        closeBtn.addEventListener('click', function() {
            self.close();
        });

        self.setLeftNavButton(closeBtn);
    }

    logo = Ti.UI.createImageView({
        image : '/images/logo.png',
        width : 218,
        height : 106,
        right : 50,
        top : 20
    });
    self.add(logo);

    icon1 = Ti.UI.createImageView({
        image : '/images/icon_info_1.png',
        width : 39,
        height : 39,
        right : 10,
        top : 165
    });
    self.add(icon1);

    icon2 = Ti.UI.createImageView({
        image : '/images/icon_info_2.png',
        width : 40,
        height : 40,
        right : 10,
        top : 235
    });
    self.add(icon2);

    icon3 = Ti.UI.createImageView({
        image : '/images/icon_info_3.png',
        width : 40,
        height : 40,
        right : 10,
        top : 305
    });
    self.add(icon3);

    self.add(Ti.UI.createLabel({
        text : 'البديد الالكتروني',
        right : 55,
        top : 155,
        color : '#ffffff',
        font : {
            fontFamily : 'Arial',
            fontSize : 17,
            fontWeight : 'bold'
        }
    }));

    self.add(Ti.UI.createLabel({
        text : 'info@asalbarri.com',
        right : 55,
        top : 180,
        color : '#ffffff',
        font : {
            fontFamily : 'Arial',
            fontSize : 17,
            fontWeight : 'bold'
        }
    }));

    self.add(Ti.UI.createLabel({
        text : 'صفحة تويتر',
        right : 55,
        top : 225,
        color : '#ffffff',
        font : {
            fontFamily : 'Arial',
            fontSize : 17,
            fontWeight : 'bold'
        }
    }));

    self.add(Ti.UI.createLabel({
        text : '@asalbarri',
        right : 55,
        top : 250,
        color : '#ffffff',
        font : {
            fontFamily : 'Arial',
            fontSize : 17,
            fontWeight : 'bold'
        }
    }));

    self.add(Ti.UI.createLabel({
        text : 'رقم الجوال',
        right : 55,
        top : 295,
        color : '#ffffff',
        font : {
            fontFamily : 'Arial',
            fontSize : 17,
            fontWeight : 'bold'
        }
    }));

    self.add(Ti.UI.createLabel({
        text : '0592972777',
        right : 55,
        top : 320,
        color : '#ffffff',
        font : {
            fontFamily : 'Arial',
            fontSize : 17,
            fontWeight : 'bold'
        }
    }));
    return self;
}

module.exports = aboutWin;

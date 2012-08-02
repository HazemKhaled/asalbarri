function aboutWin() {

    var self, closeBtn, logo, icon1, icon2, icon3;

    self = Ti.UI.createWindow({
        title : 'الدعم الفني',
        modal : true,
        backgroundImage : '/images/bg.jpg',
        barImage : '/images/Navigation_Bar.jpg',
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
            backgroundImage : '/images/button_back.png'
        });

        closeBtn.addEventListener('click', function() {
            self.close();
        });

        self.setLeftNavButton(closeBtn);
    }

    logo = Ti.UI.createImageView({
        image : '/images/logo.png',
        width : '218dp',
        height : '106dp',
        right : '50dp',
        top : '20dp'
    });
    self.add(logo);

    icon1 = Ti.UI.createImageView({
        image : '/images/icon_info_1.png',
        width : '39dp',
        height : '39dp',
        right : '10dp',
        top : '165dp'
    });
    self.add(icon1);

    icon2 = Ti.UI.createImageView({
        image : '/images/icon_info_2.png',
        width : '40dp',
        height : '40dp',
        right : '10dp',
        top : '235dp'
    });
    self.add(icon2);

    icon3 = Ti.UI.createImageView({
        image : '/images/icon_info_3.png',
        width : '40dp',
        height : '40dp',
        right : '10dp',
        top : '305dp'
    });
    self.add(icon3);

    self.add(Ti.UI.createLabel({
        text : 'البديد الالكتروني',
        right : '55dp',
        top : '155dp',
        color : '#ffffff',
        font : {
            fontFamily : 'Arial',
            fontSize : '17dp',
            fontWeight : 'bold'
        }
    }));

    self.add(Ti.UI.createLabel({
        text : 'info@asalbarri.com',
        right : '55dp',
        top : '180dp',
        color : '#ffffff',
        font : {
            fontFamily : 'Arial',
            fontSize : '17dp',
            fontWeight : 'bold'
        }
    }));

    self.add(Ti.UI.createLabel({
        text : 'صفحة تويتر',
        right : '55dp',
        top : '225dp',
        color : '#ffffff',
        font : {
            fontFamily : 'Arial',
            fontSize : '17dp',
            fontWeight : 'bold'
        }
    }));

    self.add(Ti.UI.createLabel({
        text : '@asalbarri',
        right : '55dp',
        top : '250dp',
        color : '#ffffff',
        font : {
            fontFamily : 'Arial',
            fontSize : '17dp',
            fontWeight : 'bold'
        }
    }));

    self.add(Ti.UI.createLabel({
        text : 'رقم الجوال',
        right : '55dp',
        top : '295dp',
        color : '#ffffff',
        font : {
            fontFamily : 'Arial',
            fontSize : '17dp',
            fontWeight : 'bold'
        }
    }));

    self.add(Ti.UI.createLabel({
        text : '0592972777',
        right : '55dp',
        top : '320dp',
        color : '#ffffff',
        font : {
            fontFamily : 'Arial',
            fontSize : '17dp',
            fontWeight : 'bold'
        }
    }));
    return self;
}

module.exports = aboutWin;

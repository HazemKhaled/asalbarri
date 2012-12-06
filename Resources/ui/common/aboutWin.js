function aboutWin() {

    var self, closeBtn, logo, icon1, icon2, icon3, mailLbl, twitterLbl, mobileNumberLbl;

    self = Ti.UI.createWindow({
        title : 'الدعم الفني',
        navBarHidden : false,
        backgroundImage : '/images/bg.jpg',
        barImage : '/images/Navigation_Bar.jpg',
        barColor : 'gray',
        modal : Ti.Platform.getOsname() === 'iphone'
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

    mailLbl = Ti.UI.createLabel({
        text : 'البريد الالكتروني\ninfo@asalbarri.com',
        right : 55,
        top : 165,
        color : '#ffffff',
        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
        font : {
            fontFamily : 'Arial',
            fontSize : 17,
            fontWeight : 'bold'
        }
    });
    mailLbl.addEventListener('click', function() {
        Ti.UI.createEmailDialog({
            toRecipients : ['info@asalbarri.com']
        }).open();
    });

    self.add(mailLbl);

    twitterLbl = Ti.UI.createLabel({
        text : 'صفحة تويتر\n@asalbarri',
        right : 55,
        top : 235,
        color : '#ffffff',
        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
        font : {
            fontFamily : 'Arial',
            fontSize : 17,
            fontWeight : 'bold'
        }
    });
    twitterLbl.addEventListener('click', function() {
        Ti.Platform.openURL('http://twitter.com/asalbarri');
    });
    self.add(twitterLbl);

    mobileNumberLbl = Ti.UI.createLabel({
        text : 'رقم الجوال\n0592972777',
        right : 55,
        top : 305,
        color : '#ffffff',
        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
        font : {
            fontFamily : 'Arial',
            fontSize : 17,
            fontWeight : 'bold'
        }
    });
    mobileNumberLbl.addEventListener('click', function() {
        Ti.Platform.openURL('tel:0592972777');
    });
    self.add(mobileNumberLbl);
    return self;
}

module.exports = aboutWin;

function aboutWin() {

    var self, closeBtn;

    self = Ti.UI.createWindow({
        title : 'الدعم الفني',
        modal : true,
        backgroundColor : 'white',
        backgroundImage : 'images/common/bg_2.jpg',
        barImage : 'images/common/Navigation_Bar.jpg'
    });

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
        backgroundImage : 'images/common/button_back.png'
    });

    closeBtn.addEventListener('click', function() {
        self.close();
    });

    self.setLeftNavButton(closeBtn);

    self.add(Ti.UI.createLabel({
        text : 'Hi all :)'
    }));

    return self;
}

module.exports = aboutWin;

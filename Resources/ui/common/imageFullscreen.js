function imageFullscreenView(e) {

    var self, closeBtn, scrollView, img;

    self = Ti.UI.createWindow({
        title : e.title,
        modal : true,
        backgroundImage : '/images/common/bg.jpg',
        barImage : '/images/common/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    if (Ti.Platform.getOsname() !== 'android') {
        closeBtn = Ti.UI.createButton({
            title : 'رجوع'
        });

        closeBtn.addEventListener('click', function() {
            self.close();
        });

        self.setLeftNavButton(closeBtn);
    }

    scrollView = Ti.UI.createScrollView({
        width : '100%',
        height : '100%',
        verticalBounce : true,
        horizontalBounce : true
    });

    img = Ti.UI.createImageView({
        image : Ti.App.APIURL + 'api/pic/product/' + e.productID + '/' + (Ti.Platform.displayCaps.getPlatformWidth() * 2) + '/' + (Ti.Platform.displayCaps.getPlatformHeight() * 2) + '/3',
        width : '100%',
        height : 'auto',
        canScale : true,
        defaultImage : '/images/common/default.png'
    });

    if (Ti.Platform.getOsname() !== 'android') {
        img.addEventListener('dblclick', function(e) {

            if (img.getWidth() > Ti.Platform.displayCaps.getPlatformWidth()) {

                img.setWidth('100%');
                img.setHeight('100%');

                scrollView.setContentWidth('100%');
                scrollView.setContentHeight('100%');

            } else {

                scrollView.setContentWidth(Ti.Platform.displayCaps.getPlatformWidth() * 2);
                scrollView.setContentHeight((Ti.Platform.displayCaps.getPlatformHeight() - 44) * 2);

                img.setWidth(Ti.Platform.displayCaps.getPlatformWidth() * 2);
                img.setHeight('auto');

                scrollView.setContentOffset({
                    x : (e.x * 2) - (Ti.Platform.displayCaps.getPlatformWidth() / 2),
                    y : (e.y * 2) - ((Ti.Platform.displayCaps.getPlatformHeight() - 44) / 2)
                }, true);
            }
        });
    }

    scrollView.add(img);

    self.add(scrollView);
    return self;
}

module.exports = imageFullscreenView;

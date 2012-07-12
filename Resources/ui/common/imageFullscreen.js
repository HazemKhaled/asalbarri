function imageFullscreenView(e) {

    var self, closeBtn, scrollView, img;

    self = Ti.UI.createWindow({
        title : e.title,
        modal : true
    });

    closeBtn = Ti.UI.createButton({
        title : 'رجوع'
    });

    closeBtn.addEventListener('click', function() {
        self.close();
    });

    if (Ti.Platform.getOsname() === 'android') {
        self.add(closeBtn);
    } else {
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
        width : 'auto',
        height : 'auto'
    });

    img.addEventListener('dblclick', function(e) {

        if (img.getWidth() > Ti.Platform.displayCaps.getPlatformWidth()) {

            img.setWidth('auto');
            img.setHeight('auto');

            scrollView.setContentWidth('100%');
            scrollView.setContentHeight('100%');

        } else {

            scrollView.setContentWidth(Ti.Platform.displayCaps.getPlatformWidth() * 2);
            scrollView.setContentHeight((Ti.Platform.displayCaps.getPlatformHeight() - 44) * 2);

            img.setWidth(Ti.Platform.displayCaps.getPlatformWidth() * 2);

            scrollView.setContentOffset({
                x : (e.x * 2) - (Ti.Platform.displayCaps.getPlatformWidth() / 2),
                y : (e.y * 2) - ((Ti.Platform.displayCaps.getPlatformHeight() - 44) / 2)
            }, true);
        }
    });

    scrollView.add(img);

    self.add(scrollView);
    return self;
}

module.exports = imageFullscreenView;

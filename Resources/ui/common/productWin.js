function productWin(product) {
	var self = Ti.UI.createWindow({
		title : product.title,
		backgroundColor : 'white'
	});

	var mainScroll = Ti.UI.createScrollView();
	self.add(mainScroll);

	var picWidth = Ti.Platform.displayCaps.platformWidth - 40;
	var productImg = Ti.UI.createImageView({
		image : Ti.App.APIURL + 'api/pic/product/' + product.id + '/123/' + picWidth + '/1',
		width : picWidth + 'dp',
		height : '123dp',
		top : '34dp',
		zIndex : 99
	});

	productImg.addEventListener('click', function() {

		var fullscreen = require('ui/common/imageFullscreen');
		new fullscreen({
			title : product.title,
			productID : product.id
		}).open();
	});

	mainScroll.add(productImg);

	// description
	var descLbl = Ti.UI.createLabel({
		text : product.desc,
		height : 'auto',
		align : 'right',
		width : Ti.Platform.osname == 'android' ? '100%' : picWidth + 'dp',
		top : '250dp',
		color : '#000000'
	});
	mainScroll.add(descLbl);

	return self;
};

module.exports = productWin;

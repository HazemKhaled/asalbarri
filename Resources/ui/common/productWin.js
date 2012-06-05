function productWin(product) {
	var self = Ti.UI.createWindow({
		title : product.title,
		backgroundColor : 'white'
	});

	var mainScroll = Ti.UI.createScrollView();
	self.add(mainScroll);

	var picWidth = Ti.Platform.displayCaps.platformWidth - 40;
	var img = Ti.UI.createImageView({
		image : Ti.App.APIURL + 'thumb/product/' + product.id + '/123/34/1',
		width : picWidth + 'dp',
		height : '123dp',
		top : '34dp',
		zIndex : 99
	});

	img.addEventListener('click', function() {

		Ti.App.fireEvent('openImageWindow', {
			data : product
		});
	});

	mainScroll.add(img);

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

function cartWin() {
	var self = Ti.UI.createWindow({
		title : 'سلة التسوق',
		backgroundColor : 'white'
	});

	self.add(Ti.UI.createLabel({
		text : 'Hello from cart :)'
	}));

	return self;
};

module.exports = cartWin;

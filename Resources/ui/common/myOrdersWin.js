function myOrdersWin() {
	var self = Ti.UI.createWindow({
		title : 'طلباتي',
		backgroundColor : 'white'
	});

	self.add(Ti.UI.createLabel({
		text : 'Hello from myOrders :)'
	}));

	return self;
};

module.exports = myOrdersWin;

function aboutWin() {
	var self = Ti.UI.createWindow({
		title : 'الدعم الفني',
		modal : true,
		backgroundColor : 'white'
	});

	self.add(Ti.UI.createLabel({
		text : 'Hi all :)'
	}));

	return self;
};

module.exports = aboutWin;

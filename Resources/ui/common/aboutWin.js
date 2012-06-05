function aboutWin() {
	var self = Ti.UI.createWindow({
		title : 'الدعم الفني',
		modal : true,
		backgroundColor : 'white'
	});

		var closeBtn = Ti.UI.createButton({
			title : 'اغلاق'
		});

		closeBtn.addEventListener('click', function() {
			Ti.App.fireEvent('closeAboutWindow');
		});

		self.setLeftNavButton(closeBtn);
		
	self.add(Ti.UI.createLabel({
		text : 'Hi all :)'
	}));

	return self;
};

module.exports = aboutWin;

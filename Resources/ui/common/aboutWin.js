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
			self.close();
		});

		self.setLeftNavButton(closeBtn);
		
	self.add(Ti.UI.createLabel({
		text : 'Hi all :)'
	}));

	return self;
};

module.exports = aboutWin;

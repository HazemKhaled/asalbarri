function walletWin() {
	var self = Ti.UI.createWindow({
		title : 'المحفظة',
		fullscreen : false,
		backgroundColor : 'white'
	});

	self.addEventListener('focus', function() {

		var auth = require('/lib/auth');
		Ti.App.fireEvent('closeLoginWindow');
		if (!auth.isLogedIn()) {

			Ti.App.fireEvent('openLoginWindow');
		}

	});

	return self;
};

module.exports = walletWin;

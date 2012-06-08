function walletWin() {
	var self = Ti.UI.createWindow({
		title : 'المحفظة',
		fullscreen : false,
		backgroundColor : 'white'
	});


	self.addEventListener('focus', function() {
		var auth = require('/lib/auth');
		if(auth.loginRequired() != false){
			
			self.add(Ti.UI.createLabel({
				text : 'wallet'
			}));
		}
	});


	return self;
};

module.exports = walletWin;

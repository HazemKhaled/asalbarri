function walletWin() {
	var self = Ti.UI.createWindow({
		title : 'المحفظة',
		fullscreen : false,
		backgroundColor : 'white'
	});


	self.addEventListener('focus', function() {
		
		var auth = require('/lib/auth');
		Ti.App.fireEvent('closeLoginWindow');
		var userID = auth.isLogedIn();
		if(userID == false)
		{
			
			Ti.App.fireEvent('openLoginWindow');
		}else{
			
			if(auth.loginRequired() != false){
				
				self.add(Ti.UI.createLabel({
					text : 'wallet'
				}));
			}
		}
		
	});


	return self;
};

module.exports = walletWin;

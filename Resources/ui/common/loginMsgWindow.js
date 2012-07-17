function loginMsgWindow() {

	var androidshift = 0, auth = require('/lib/auth'), self, loginBtn;

	self = Ti.UI.createWindow({
		title : 'دخول',
		backgroundImage : 'images/common/bg.jpg',
		barImage : 'images/common/Navigation_Bar.jpg',
		barColor : '#d3d3d3'
	});

	self.add(Ti.UI.createLabel({
		text : 'يرجى تسجيل الدخول',
		width : '100%',
		top : (40 + androidshift) + 'dp',
		color : '#ffffff',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontFamily : 'Arial',
			fontSize : '17dp',
			fontWeight : 'bold'
		}
	}));

	loginBtn = auth.loginBtn(Ti.UI.createButton({
		title : 'تسجيل دخول',
		top : (100 + androidshift) + 'dp',
		backgroundImage : 'images/common/button_ok.png',
		paddingLeft : '5dp',
		paddingRight : '5dp',
		color : '#000000'
	}));
	self.add(loginBtn);

	self.addEventListener('focus', function() {

		var auth = require('/lib/auth');
		if (!auth.isLogedIn()) {

			self.close();
		}
	});

	return self;
}

module.exports = loginMsgWindow;

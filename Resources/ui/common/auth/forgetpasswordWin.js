function forgetpasswordWin() {
	var androidshift = 0
	var self = Ti.UI.createWindow({
		title : 'آسترجاع كلمه المرور',
		fullscreen : false,
		navBarHidden : Ti.Platform.osname == 'iphone' ? false : true,
		orientationModes : [Titanium.UI.PORTRAIT]
	});

	var emailField = Ti.UI.createTextField({
		height : '40dp',
		left : '5%',
		width : '90%',
		top : 75 + androidshift + 'dp',
		hintText : 'البريد الخاص بك',
		returnKeyType : Ti.UI.RETURNKEY_SEND,
		keyboardType : Titanium.UI.KEYBOARD_EMAIL,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	self.add(emailField);
	emailField.focus();
	var submit = Ti.UI.createButton({
		title : 'آرسال كلمه المرور'
	});

	submit.addEventListener('click', function() {
		var email = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

		if(!email.test(emailField.value)) {
			Ti.UI.createAlertDialog({
				title : 'خطآ في البريد ',
				message : '"آستخدم بريدك المسجل لدينا"تحقق من بريدك',
				cancel : 0,
				buttonNames : ['ok']
			}).show();
			return false;
		}
		var xhr = Ti.Network.createHTTPClient();

		xhr.onload = function() {
			Ti.App.fireEvent('hideLoading');
			var request = JSON.parse(this.responseText);

			if(request.errors.login) {

				Ti.UI.createAlertDialog({
					title : 'خطآ',
					message : request.errors.login,
					cancel : 0,
					buttonNames : ['ok']
				}).show();

				Ti.App.fireEvent('hideLoading');
				return false;
			} else {

				var alertWindow = Ti.UI.createAlertDialog({
					title : request.msg,
					cancel : 0,
					buttonNames : ['ok']
				});
				Ti.App.fireEvent('hideLoading');
				alertWindow.addEventListener('click', function(ev) {
					switch(ev.index) {
						case 0:
							Ti.App.fireEvent('closeForgetpasswordWindow');
							break;
					}
				});
				alertWindow.show();
			}
		};

		xhr.onerror = function(e) {
			Ti.UI.createAlertDialog({
				message : 'خطآ في الآتصال',
				cancel : 0,
				buttonNames : ['ok']
			}).show();
			Ti.App.fireEvent('hideLoading');
		}
		xhr.open('POST', Ti.App.APIURL + 'authapi/forgot_password');
		xhr.send({
			login : emailField.value
		});
		Ti.App.fireEvent('showLoading');

	});

	emailField.addEventListener('return', function() {
		submit.fireEvent('click');
	});
	self.add(submit);

	return self;
};

module.exports = forgetpasswordWin;

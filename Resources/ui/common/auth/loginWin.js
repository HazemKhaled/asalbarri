function loginWin() {
	var androidshift = 0;
	var self = Ti.UI.createWindow({
		title : 'دخول',
		backgroundColor : 'white'
	});

	Ti.App.Properties.setDouble('loginOpendOn', new Date().getTime());

	var auth = require('/lib/auth');

	var scrollview = Ti.UI.createScrollView({
		contentWidth : Ti.Platform.displayCaps.platformWidth,
		contentHeight : 'auto'
	});

	var userField = Ti.UI.createTextField({
		hintText : 'اسم المستخدم',
		textAlign : 'right',
		height : '40dp',
		width : '90%',
		left : '5%',
		top : (75 + androidshift) + 'dp',
		returnKeyType : Ti.UI.RETURNKEY_NEXT,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});

	userField.addEventListener('return', function() {
		passField.focus();
	});
	scrollview.add(userField);
	self.add(scrollview);
	userField.focus();
	var passField = Ti.UI.createTextField({
		hintText : 'كلمة المرور',
		textAlign : 'right',
		height : '40dp',
		width : '90%',
		left : '5%',
		top : (125 + androidshift) + 'dp',
		passwordMask : true,
		returnKeyType : Ti.UI.RETURNKEY_SEND,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	passField.addEventListener('return', function() {
		submit.fireEvent('click');
	});
	scrollview.add(passField);

	var submit = Ti.UI.createButton({
		title : 'دخول'
	});
	if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
		self.setRightNavButton(submit);
	} else {
		scrollview.add(submit);
	}

	submit.addEventListener('click', function() {
		var email = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

		if (userField.value.length < 6) {
			Ti.UI.createAlertDialog({
				title : 'اسم المستخدم',
				message : 'تآكد من صحة اسم المستخدم',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			userField.focus();

			return false;
		}

		if (passField.value.length < 3) {
			Ti.UI.createAlertDialog({
				title : 'كلمة المرور',
				message : 'تآكد من صحة كلمة المرور',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			passField.focus();

			return false;
		}

		var xhr = Ti.Network.createHTTPClient();
		xhr.onerror = function() {
			Ti.UI.createAlertDialog({
				title : 'خطآ في الآتصال',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();

			Ti.App.fireEvent('hideLoading');
		}
		xhr.onload = function() {

			Ti.App.fireEvent('hideLoading');

			try {
				var response = JSON.parse(this.responseText);
			} catch(e) {
				Ti.UI.createAlertDialog({
					message : 'خطآ في الآتصال وجاري آخبار الآداره',
					cancel : 0,
					buttonNames : ['موافق']
				}).show();

				return false;
			}

			var k = null;
			if (response.errors) {
				for (k in response.errors) {

					if (response.errors[k] == response.errors.password) {
						Ti.UI.createAlertDialog({
							title : 'تآكد من صحة اسم المستخدم الخاص بك',
							cancel : 0,
							buttonNames : ['موافق']
						}).show();
						return false;

					} else if (response.errors[k] == response.errors.password) {
						Ti.UI.createAlertDialog({
							title : 'كلمة المرور',
							message : 'تآكد من صحة كلمة المرور الخاصة بك',
							cancel : 0,
							buttonNames : ['موافق']
						}).show();
						return false;

					} else {
						var dialouge = Ti.UI.createAlertDialog({
							title : 'خطآ في الدخول',
							message : 'يمكنك التواصل معنا آذا واجهت مشكله',
							cancel : 0,
							buttonNames : ['الغاء', 'مراسله'],
						})
						dialouge.addEventListener('click', function(ev) {
							switch(ev.index) {
								case 1:
									var emailDialog = Ti.UI.createEmailDialog()
									emailDialog.subject = "";
									emailDialog.toRecipients = ['support@eshtery.me'];
									emailDialog.open();
									break;
							}
						})

						dialouge.show();
						return false;
					}

				}
			}
			Ti.App.Properties.setInt('userID', response.userID);

			Ti.App.fireEvent('closeLoginWindow');
		}

		xhr.open('POST', Ti.App.APIURL + 'authapi/login');
		xhr.send({
			login : userField.value,
			password : passField.value
		});
		Ti.App.fireEvent('showLoading');

	});
	var registerBtn = auth.registerBtn(Ti.UI.createButton({
		title : 'تسجيل',
		top : (215 + androidshift) + 'dp'
	}));
	scrollview.add(registerBtn);

	var forgetBtn = auth.forgetBtn(Ti.UI.createButton({
		title : 'استرجع كلمة المرور',
		top : (255 + androidshift) + 'dp'
	}));

	scrollview.add(forgetBtn);

	return self;
};

module.exports = loginWin;

function loginWin() {

	var self, auth = require('/lib/auth'), scrollview, userField, passField, submitBtn, registerBtn, forgetBtn, androidOffset = 0;

	self = Ti.UI.createWindow({
		title : 'دخول',
		backgroundImage : '/images/bg.jpg',
		barImage : '/images/Navigation_Bar.jpg',
		barColor : 'gray'
	});

	self.addEventListener('open', function() {
		userField.focus();
	});

	Ti.App.Properties.setDouble('loginOpendOn', new Date().getTime());

	scrollview = Ti.UI.createScrollView({
		contentWidth : Ti.Platform.displayCaps.platformWidth,
		layout : 'vertical'
	});

	userField = Ti.UI.createTextField({
		hintText : 'البريد الإلكتروني / رقم الجوال',
		textAlign : Ti.App.autoAlignHintext(),
		height : 33,
		width : '90%',
		left : '5%',
		top : 15,
		returnKeyType : Ti.UI.RETURNKEY_NEXT,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		font : {
			fontSize : '13dp'
		},
		color : '#000000'
	});

	userField.addEventListener('return', function() {
		passField.focus();
	});
	scrollview.add(userField);

	self.add(scrollview);

	userField.focus();

	passField = Ti.UI.createTextField({
		hintText : 'كلمة المرور',
		textAlign : Ti.App.autoAlignHintext(),
		height : 33,
		width : '90%',
		left : '5%',
		top : 15,
		passwordMask : true,
		returnKeyType : Ti.UI.RETURNKEY_SEND,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		font : {
			fontSize : '13dp'
		},
		color : '#000000'
	});
	passField.addEventListener('return', function() {
		submitBtn.fireEvent('click');
	});
	scrollview.add(passField);

	submitBtn = Ti.UI.createButton({
		title : 'دخول'
	});

	if (Ti.Platform.getOsname() === 'android') {
		androidOffset = 44;

		submitBtn.height = 33;
		submitBtn.width = '90%';
		submitBtn.top = 15;
		submitBtn.backgroundImage = '/images/button_ok.png';
		submitBtn.color = '#ffffff';

		scrollview.add(submitBtn);
	} else {
		self.setRightNavButton(submitBtn);
	}

	submitBtn.addEventListener('click', function() {

		if (userField.value.length < 4) {
			Ti.UI.createAlertDialog({
				title : 'خطأ',
				message : 'تأكد من صحة اسم المستخدم',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			userField.focus();

			return false;
		}

		if (passField.value.length < 3) {
			Ti.UI.createAlertDialog({
				title : 'خطأ',
				message : 'تأكد من صحة كلمة المرور',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			passField.focus();

			return false;
		}

		var xhr = Ti.Network.createHTTPClient();
		xhr.onerror = function() {
			Ti.UI.createAlertDialog({
				title : 'خطأ في الآتصال',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();

			Ti.App.fireEvent('hideLoading');
		};

		xhr.onload = function() {

			var response, k = null, dialog, sendSupportEmailDialogEvent;

			Ti.App.fireEvent('hideLoading');

			try {
				response = JSON.parse(this.responseText);
			} catch(e) {
				Ti.UI.createAlertDialog({
					message : 'خطأ في الآتصال، تاكد من اتصال الانترنت الخاص بك.',
					cancel : 0,
					buttonNames : ['موافق']
				}).show();

				return false;
			}

			if (response.errors) {

				sendSupportEmailDialogEvent = function(ev) {
					if (ev.index === 0) {
						var emailDialog = Ti.UI.createEmailDialog({
							toRecipients : ['support@asalbarri.com']
						});
						emailDialog.open();
					}
				};

				for (k in response.errors) {

					if (response.errors.hasOwnProperty(k)) {

						if (response.errors[k] === response.errors.password) {
							Ti.UI.createAlertDialog({
								title : 'خطأ',
								message : 'تأكد من صحة اسم المستخدم الخاص بك',
								cancel : 0,
								buttonNames : ['موافق']
							}).show();

						} else if (response.errors[k] === response.errors.password) {
							Ti.UI.createAlertDialog({
								title : 'خطأ',
								message : 'تأكد من صحة كلمة المرور الخاصة بك',
								cancel : 0,
								buttonNames : ['موافق']
							}).show();

						} else {
							dialog = Ti.UI.createAlertDialog({
								title : 'خطأ في الدخول',
								message : 'يمكنك التواصل معنا آذا واجهت مشكله',
								cancel : 0,
								buttonNames : ['الغاء', 'مراسله']
							});

							dialog.addEventListener('click', function(ev) {
								if (ev.index === 1) {
									var emailDialog = Ti.UI.createEmailDialog({
										toRecipients : ['support@asalbarri.com']
									});
									emailDialog.open();
								}
							});

							dialog.show();
						}
						return false;
					}

				}
			}
			Ti.App.Properties.setInt('userID', response.userID);
			Ti.App.Properties.setString('userName', userField.value);
			Ti.App.fireEvent('showWalletAfterLogin');
			Ti.App.fireEvent('showMyordersAfterLogin');

			Ti.App.dialog.options = Ti.App.linksArray.concat(['تغير بيناتي', 'تسجيل خروج', 'اغلاق']);
			Ti.App.dialog.destructive = 5;

			Ti.App.fireEvent('closeLoginWindow');
		};

		xhr.open('POST', Ti.App.APIURL + 'authapi/login');
		xhr.send({
			login : userField.value,
			password : passField.value
		});
		Ti.App.fireEvent('showLoading');

	});
	registerBtn = auth.registerBtn(Ti.UI.createButton({
		title : 'تسجيل جديد',
		height : 33,
		width : '90%',
		top : 15 + androidOffset,
		backgroundImage : '/images/button_ok.png',
		color : '#ffffff'
	}));
	scrollview.add(registerBtn);

	forgetBtn = auth.forgetBtn(Ti.UI.createButton({
		title : 'استرجع كلمة المرور',
		height : 33,
		width : '90%',
		top : 15 + androidOffset,
		backgroundImage : '/images/button_cancel.png',
		color : '#ffffff'
	}));

	scrollview.add(forgetBtn);

	return self;
}

module.exports = loginWin;

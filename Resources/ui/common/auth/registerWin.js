function openRegisterWindow() {
	var androidshift = 0;
	var self = Ti.UI.createWindow({
		title : 'تسجيل',
		backgroundColor : 'white'
	});

	self.addEventListener('open', function() {
		mobileField.focus();
	})
	var scrollview = Ti.UI.createScrollView({
		contentWidth : Ti.Platform.displayCaps.platformWidth,
		contentHeight : 'auto'
	});

	var mobileField = Ti.UI.createTextField({
		height : '40dp',
		left : '5%',
		width : '90%',
		top : (80 + androidshift) + 'dp',
		hintText : 'اسم المستخدم',
		textAlign : 'right',
		returnKeyType : Ti.UI.RETURNKEY_NEXT,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	mobileField.addEventListener('change', autoTextAlign);
	mobileField.addEventListener('return', function() {
		emailField.focus();
	});

	scrollview.add(mobileField);
	mobileField.focus();
	var emailField = Ti.UI.createTextField({
		height : '40dp',
		left : '5%',
		width : '90%',
		top : (130 + androidshift) + 'dp',
		hintText : 'البريد الخاص بك',
		textAlign : 'right',
		returnKeyType : Ti.UI.RETURNKEY_NEXT,
		keyboardType : Ti.UI.KEYBOARD_EMAIL,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	emailField.addEventListener('change', autoTextAlign);
	emailField.addEventListener('return', function() {
		passField.focus();
	});

	scrollview.add(emailField);

	var passField = Ti.UI.createTextField({
		height : '40dp',
		left : '5%',
		width : '90%',
		top : (180 + androidshift) + 'dp',
		hintText : 'كلمة المرور',
		textAlign : 'right',
		passwordMask : true,
		returnKeyType : Ti.UI.RETURNKEY_NEXT,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	passField.addEventListener('change', autoTextAlign);
	passField.addEventListener('return', function() {
		confirmpassField.focus();
	});

	scrollview.add(passField);

	var confirmpassField = Ti.UI.createTextField({
		height : '40dp',
		left : '5%',
		width : '90%',
		top : (230 + androidshift) + 'dp',
		hintText : 'تآكيد كلمة المرور',
		textAlign : 'right',
		passwordMask : true,
		returnKeyType : Ti.UI.RETURNKEY_JOIN,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	confirmpassField.addEventListener('change', autoTextAlign);
	confirmpassField.addEventListener('return', function() {
		submit.fireEvent('click');
	});

	scrollview.add(confirmpassField);

	var submit = Ti.UI.createButton({
		title : 'تسجيل',
		top : (280 + androidshift) + 'dp',
		right : Ti.Platform.osname == 'iphone' ? '5%' : '50%'
	});

	submit.addEventListener('click', function() {

		var email = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		var mobileNumber = /^[0-9]{9,12}$/;

		if (!mobileNumber.test(mobileField.value)) {
			Ti.UI.createAlertDialog({
				title : 'خطآ',
				message : 'تحقق من اسم المستخدم',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			mobileField.focus();

			return false;
		}

		if (!email.test(emailField.value)) {
			Ti.UI.createAlertDialog({
				title : 'خطآ',
				message : 'خطآ في البريد الآلكتروني',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			email.focus();

			return false;
		}

		if (passField.value.length < 3) {
			Ti.UI.createAlertDialog({
				title : 'خطآ في كلمة المرور',
				message : 'يجب آن تكون كلمة المرور آكبر من ٣ آحرف',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			passField.focus();

			return false;
		}

		if (passField.value != confirmpassField.value) {
			Ti.UI.createAlertDialog({
				title : 'خطآ في كلمة المرور',
				message : 'يجب آن تكون كلمة المرور و تآكيدها متطابقين',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			passField.focus();

			return false;
		}

		var xhr = Ti.Network.createHTTPClient({});
		xhr.onerror = function() {
			Ti.UI.createAlertDialog({
				title : 'خطآ في الآتصال',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			Ti.App.fireEvent('hideLoading');
		}
		xhr.onload = function() {
			try {
				var request = JSON.parse(this.responseText);
			} catch(e) {
				Ti.UI.createAlertDialog({
					title : 'خطآ',
					message : 'خطآ في الآتصال، حاول مرة اخرى.',
					cancel : 0,
					buttonNames : ['موافق']
				}).show();
				Ti.App.fireEvent('hideLoading');

				return false;
			}
			if (request.errors) {
				var msgBox = Ti.UI.createAlertDialog({
					title : 'خطآ',
					message : 'هذا البريد او اسم المستخدم مسجلين لدينا بالفعل، إذا كنت مسجل من قبل ونسيت كلمة المرور اضغط على زر نسيت كلمة المرور',
					cancel : 0,
					buttonNames : ['موافق', 'نسيت كلمة المرور؟']
				});

				msgBox.show();

				msgBox.addEventListener('click', function(e) {
					if (e.index == 1) {
						Ti.App.fireEvent('openForgetpasswordWindow');
					}
				});
				Ti.App.fireEvent('hideLoading');

				return false;
			};

			Ti.UI.createAlertDialog({
				title : request.msg + "يمكنك تسجيل الدخول الآن",
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			Ti.App.fireEvent('hideLoading');
			Ti.App.fireEvent('closeRegisterWindow');
		}

		xhr.open('POST', Ti.App.APIURL + 'authapi/register');
		xhr.send({
			username : mobileField.value,
			email : emailField.value,
			password : passField.value,
			confirm_password : confirmpassField.value
		});
		Ti.App.fireEvent('showLoading');

	});
	if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
		self.setRightNavButton(submit);
	} else {
		scrollview.add(submit)
	}
	self.add(scrollview);

	return self;
};

module.exports = openRegisterWindow;

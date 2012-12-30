function forgetpasswordWin() {

	var self, emailField, mobileField, submitBtn;

	self = Ti.UI.createWindow({
		title : 'آسترجاع كلمه المرور',
		backgroundImage : '/images/bg.jpg',
		barImage : '/images/Navigation_Bar.jpg',
		barColor : 'gray',
		layout : 'vertical'
	});

	self.addEventListener('open', function() {
		emailField.focus();
	});

	emailField = Ti.UI.createTextField({
		top : 15,
		hintText : 'البريد الخاص بك',
		textAlign : Ti.App.autoAlignHintext(),
		//autocapitalization : false,
		returnKeyType : Ti.UI.RETURNKEY_SEND,
		keyboardType : Ti.UI.KEYBOARD_EMAIL,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		height : 33,
		width : '90%',
		font : {
			fontSize : '13dp'
		},
		color : '#000000'
	});

	// align left if empty
	emailField.addEventListener('change', Ti.App.autoTextAlign);
	emailField.addEventListener('return', function() {
		submitBtn.fireEvent('click');
	});

	self.add(emailField);

	self.add(Ti.UI.createLabel({
		text : 'او',
		top : 15,
		font : {
			fontSize : '22dp'
		},
		color : '#ffffff'
	}));

	mobileField = Ti.UI.createTextField({
		top : 15,
		hintText : 'رقم الجوال',
		textAlign : Ti.App.autoAlignHintext(),
		returnKeyType : Ti.UI.RETURNKEY_SEND,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		keyboardType : Ti.UI.KEYBOARD_PHONE_PAD,
		height : 33,
		width : '90%',
		font : {
			fontSize : '13dp'
		},
		color : '#000000'
	});
	mobileField.addEventListener('change', Ti.App.autoTextAlign);
	mobileField.addEventListener('return', function() {
		submitBtn.fireEvent('click');
	});

	self.add(mobileField);

	submitBtn = Ti.UI.createButton({
		title : 'آرسال'
	});

	submitBtn.addEventListener('click', function() {
		var xhr, data = {}, emailRGX = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

		if (mobileField.getValue().length > 0 && mobileField.getValue().length < 7) {
			Ti.UI.createAlertDialog({
				title : 'خطأ',
				message : 'تحقق من رقم الجوال',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			mobileField.focus();

			return false;
		} else if (emailField.getValue().length > 0 && emailRGX.test(emailField.value) === false) {
			Ti.UI.createAlertDialog({
				title : 'خطأ في البريد',
				message : 'تأكد من ادخالك البريد الالكتروني بشكل صحيح',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			emailField.focus();

			return false;
		} else if (mobileField.getValue().length == 0 && emailField.getValue().length == 0) {
			Ti.UI.createAlertDialog({
				title : 'خطأ',
				message : 'ادخل بريدك او رقم جوالك لإسترجاع كلمة المرور',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			emailField.focus();

			return false;
		} else if (mobileField.getValue().length > 0 && emailField.getValue().length > 0) {
			Ti.UI.createAlertDialog({
				title : 'خطأ',
				message : 'ادخل فقط احد الحقلين لاسترجاع كلمة المرور',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			emailField.focus();

			return false;
		} else {
			if (mobileField.getValue().length > 0) {
				data.mobile = mobileField.getValue();
			} else {
				data.login = emailField.getValue();
			}
		}

		Ti.App.fireEvent('showLoading');

		xhr = Ti.Network.createHTTPClient();
		xhr.onerror = function() {
			Ti.UI.createAlertDialog({
				title : 'خطأ في الآتصال',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			Ti.App.fireEvent('hideLoading');
		};

		xhr.onload = function() {

			Ti.App.fireEvent('hideLoading');

			var request, alertMsg;

			try {
				request = JSON.parse(this.responseText);
			} catch (e) {
				Ti.UI.createAlertDialog({
					title : 'خطأ',
					message : request.errors.login,
					cancel : 0,
					buttonNames : ['موافق']
				}).show();

				return false;
			}

			if (request.errors) {

				Ti.UI.createAlertDialog({
					title : 'خطأ',
					message : request.errors.login,
					cancel : 0,
					buttonNames : ['موافق']
				}).show();

				return false;
			}

			Ti.UI.createAlertDialog({
				title : request.msg,
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			Ti.App.fireEvent('hideLoading');
			Ti.App.fireEvent('closeForgetpasswordWindow');
		};

		xhr.open('POST', Ti.App.APIURL + 'authapi/forgot_password');

		xhr.send(data);

	});

	if (Ti.Platform.getOsname() === 'android') {

		submitBtn.height = 33;
		submitBtn.width = '90%';
		submitBtn.top = 15;
		submitBtn.backgroundImage = '/images/button_ok.png';
		submitBtn.color = '#ffffff';

		self.add(submitBtn);
	} else {
		self.setRightNavButton(submitBtn);
	}

	return self;
}

module.exports = forgetpasswordWin;

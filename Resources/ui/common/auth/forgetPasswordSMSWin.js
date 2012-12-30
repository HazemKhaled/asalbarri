function Window(mobileNumber) {

	var self, codeField, submitBtn;

	self = Ti.UI.createWindow({
		title : 'تفعيل العضوية',
		backgroundImage : '/images/bg.jpg',
		barImage : '/images/Navigation_Bar.jpg',
		barColor : 'gray',
		layout : 'vertical'
	});

	self.addEventListener('open', function() {
		codeField.focus();
	});

	if (Ti.Platform.getOsname() !== 'android') {
		closeBtn = Ti.UI.createButton({
			title : 'اغلاق   ',
			height : 31,
			width : 67,
			color : '#000000',
			font : {
				fontFamily : 'Arial',
				fontSize : 14,
				fontWeight : 'bold'
			},
			backgroundImage : '/images/button_back.png'
		});

		closeBtn.addEventListener('click', function() {

			Ti.App.myTabGroup.getActiveTab().close(self);
			Ti.App.fireEvent('closeForgetpasswordWindow');
		});

		self.setLeftNavButton(closeBtn);
	} else {
		self.addEventListener('android:back', function() {
			self.close();
			Ti.App.fireEvent('closeForgetpasswordWindow');
		});
	}

	self.add(Ti.UI.createLabel({
		text : 'سيصلك الان رسالة بها كود تفعيل، اكتبها هنا لتفعيل عضويتك.\n يمكنك تخطي هذه الخطوة وقم بالضغط على الرابط الذي وصلك على بريدك.',
		top : 15,
		width : '90%',
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		font : {
			fontSize : '22dp'
		},
		color : '#ffffff'
	}));

	codeField = Ti.UI.createTextField({
		top : 15,
		hintText : 'كود التفعيل',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		returnKeyType : Ti.UI.RETURNKEY_NEXT,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		height : 33,
		width : '90%',
		font : {
			fontSize : '13dp'
		},
		color : '#000000'
	});
	codeField.addEventListener('return', function() {
		passField.focus();
	});

	self.add(codeField);

	passField = Ti.UI.createTextField({
		height : 33,
		width : '90%',
		top : 15,
		hintText : 'كلمة المرور',
		textAlign : Ti.App.autoAlignHintext(),
		passwordMask : true,
		returnKeyType : Ti.UI.RETURNKEY_NEXT,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		font : {
			fontSize : '13dp'
		},
		color : '#000000'
	});
	passField.addEventListener('change', Ti.App.autoTextAlign);
	passField.addEventListener('return', function() {
		confirmpassField.focus();
	});

	self.add(passField);

	confirmpassField = Ti.UI.createTextField({
		height : 33,
		width : '90%',
		top : 15,
		hintText : 'تآكيد كلمة المرور',
		textAlign : Ti.App.autoAlignHintext(),
		passwordMask : true,
		returnKeyType : Ti.UI.RETURNKEY_JOIN,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		font : {
			fontSize : '13dp'
		},
		color : '#000000'
	});
	confirmpassField.addEventListener('change', Ti.App.autoTextAlign);
	confirmpassField.addEventListener('return', function() {
		submitBtn.fireEvent('click');
	});

	self.add(confirmpassField);

	submitBtn = Ti.UI.createButton({
		title : 'تغيير'
	});

	submitBtn.addEventListener('click', function() {
		var xhr, data = {};

		if (codeField.getValue().length == 0) {
			Ti.UI.createAlertDialog({
				title : 'خطأ',
				message : 'تاكد من ادخال كود التفعيل',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			codeField.focus();

			return false;
		}

		if (passField.value.length < 3) {
			Ti.UI.createAlertDialog({
				title : 'خطأ في كلمة المرور',
				message : 'يجب آن تكون كلمة المرور آكبر من ٣ آحرف',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			passField.focus();

			return false;
		}

		if (passField.value !== confirmpassField.value) {
			Ti.UI.createAlertDialog({
				title : 'خطأ في كلمة المرور',
				message : 'يجب آن تكون كلمة المرور و تآكيدها متطابقين',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			passField.focus();

			return false;
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
					message : 'خطأ في الآتصال',
					cancel : 0,
					buttonNames : ['موافق']
				}).show();

				return false;
			}

			if (request.done == -1) {

				Ti.UI.createAlertDialog({
					title : 'خطأ',
					message : 'كود التفعيل خطأ، اعد المحاولة',
					cancel : 0,
					buttonNames : ['موافق']
				}).show();

				return false;
			}

			Ti.UI.createAlertDialog({
				title : 'مرحباً بك',
				message : 'تم تغيير كلمة المرور بنجاح',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();

			Ti.App.myTabGroup.getActiveTab().close(self);
			Ti.App.fireEvent('closeRegisterWindow');
		};

		xhr.open('POST', Ti.App.APIURL + 'authapi/forgot_password_confirm');

		xhr.send({
			mobile : mobileNumber,
			code : codeField.getValue(),
			new_password : passField.getValue()
		});

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

module.exports = Window;

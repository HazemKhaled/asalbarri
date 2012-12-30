function openRegisterWindow() {
	var self, scrollview, passField, confirmpassField, submitBtn, closeBtn;

	self = Ti.UI.createWindow({
		title : 'تسجيل',
		backgroundImage : '/images/bg.jpg',
		barImage : '/images/Navigation_Bar.jpg',
		barColor : 'gray',
		modal : true
	});

	self.addEventListener('open', function() {
		passField.focus();
	});

	scrollview = Ti.UI.createScrollView({
		contentWidth : Ti.Platform.displayCaps.platformWidth,
		layout : 'vertical'
	});

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

	scrollview.add(passField);

	confirmpassField = Ti.UI.createTextField({
		height : 33,
		width : '90%',
		top : 15,
		hintText : 'تآكيد كلمة المرور',
		textAlign : Ti.App.autoAlignHintext(),
		passwordMask : true,
		returnKeyType : Ti.UI.RETURNKEY_SEND,
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

	scrollview.add(confirmpassField);

	submitBtn = Ti.UI.createButton({
		title : 'تعديل'
	});

	submitBtn.addEventListener('click', function() {

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

		xhr = Ti.Network.createHTTPClient({});
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

			var request, msgBox;

			try {
				request = JSON.parse(this.responseText);
			} catch(e) {
				Ti.UI.createAlertDialog({
					title : 'خطأ',
					message : 'خطأ في الآتصال، حاول مرة اخرى.',
					cancel : 0,
					buttonNames : ['موافق']
				}).show();

				return false;
			}

			try {
				Ti.UI.createAlertDialog({
					title : request.msg,
					cancel : 0,
					buttonNames : ['موافق']
				}).show();
			} catch (e) {
				Ti.API.log('error', 'server cant not send the msg');
			}
			Ti.App.fireEvent('hideLoading');
			Ti.App.fireEvent('closeRegisterWindow');
		};

		xhr.open('POST', Ti.App.APIURL + 'authapi/register');
		xhr.send({
			password : passField.getValue(),
			confirm_password : confirmpassField.getValue()
		});
		Ti.App.fireEvent('showLoading');

	});

	if (Ti.Platform.getOsname() === 'android') {

		submitBtn.height = 33;
		submitBtn.width = '90%';
		submitBtn.top = 15;
		submitBtn.backgroundImage = '/images/button_ok.png';
		submitBtn.color = '#ffffff';

		scrollview.add(submitBtn);
	} else {
		self.setRightNavButton(submitBtn);

		closeBtn = Ti.UI.createButton({
			title : 'اغلاق'
		});

		closeBtn.addEventListener('click', function() {
			self.close();
		});

		self.setLeftNavButton(closeBtn);
	}
	self.add(scrollview);

	return self;
}

module.exports = openRegisterWindow;

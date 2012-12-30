function Window() {
	var self, auth, scrollview, mobileField, addressField, emailField, submitBtn, closeBtn;

	auth = require('/lib/auth');

	self = Ti.UI.createWindow({
		title : 'تسجيل',
		backgroundImage : '/images/bg.jpg',
		barImage : '/images/Navigation_Bar.jpg',
		barColor : 'gray'
	});

	self.addEventListener('open', function() {

		Ti.App.getHttpRequest('api/editProfile/' + auth.isLogedIn(), function(data) {

			mobileField.setValue(data.mob);
			addressField.setValue(data.shipping_address);
			emailField.setValue(data.email);

			mobileField.focus();
		}, function() {
			self.close();
		});
	});

	scrollview = Ti.UI.createScrollView({
		contentWidth : Ti.Platform.displayCaps.platformWidth,
		layout : 'vertical'
	});

	mobileField = Ti.UI.createTextField({
		top : 15,
		hintText : 'رقم الجوال',
		textAlign : Ti.App.autoAlignHintext(),
		returnKeyType : Ti.UI.RETURNKEY_NEXT,
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
		addressField.focus();
	});

	scrollview.add(mobileField);

	addressField = Ti.UI.createTextField({
		top : 15,
		hintText : 'عنوان الشحن',
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		returnKeyType : Ti.UI.RETURNKEY_NEXT,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		height : 33,
		width : '90%',
		font : {
			fontSize : '13dp'
		},
		color : '#000000'
	});
	addressField.addEventListener('change', Ti.App.autoTextAlign);
	addressField.addEventListener('return', function() {
		emailField.focus();
	});

	scrollview.add(addressField);

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
	emailField.addEventListener('change', Ti.App.autoTextAlign);
	emailField.addEventListener('return', function() {
		submitBtn.fireEvent('click');
	});

	scrollview.add(emailField);

	submitBtn = Ti.UI.createButton({
		title : 'تعديل'
	});

	submitBtn.addEventListener('click', function() {

		var xhr, emailRGX = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

		if (mobileField.getValue().length < 7) {
			Ti.UI.createAlertDialog({
				title : 'خطأ',
				message : 'تحقق من رقم الجوال',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			mobileField.focus();

			return false;
		}
		if (addressField.getValue().length < 4) {
			Ti.UI.createAlertDialog({
				title : 'خطأ',
				message : 'تحقق من ادخال عنوان الشحن',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			addressField.focus();

			return false;
		}

		if (!emailRGX.test(emailField.value)) {
			Ti.UI.createAlertDialog({
				title : 'خطأ',
				message : 'تأكد من ادخالك البريد الالكتروني بشكل صحيح',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();
			emailField.focus();

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
				Ti.API.info(this.responseText);
				Ti.UI.createAlertDialog({
					title : 'خطأ',
					message : 'خطأ في الآتصال، حاول مرة اخرى.',
					cancel : 0,
					buttonNames : ['موافق']
				}).show();

				return false;
			}

			Ti.App.fireEvent('hideLoading');
			self.close();
		};

		xhr.open('POST', Ti.App.APIURL + 'api/editProfile/' + auth.isLogedIn());
		xhr.send({
			mob : mobileField.getValue(),
			shaddress : addressField.getValue(),
			email : emailField.getValue()
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
	}
	self.add(scrollview);

	return self;
}

module.exports = Window;

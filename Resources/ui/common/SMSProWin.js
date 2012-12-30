function Window() {

	var self, nameField, mobileField, submitBtn, closeBtn;

	self = Ti.UI.createWindow({
		title : 'اشترك في العروض',
		backgroundImage : '/images/bg.jpg',
		barImage : '/images/Navigation_Bar.jpg',
		barColor : 'gray',
		layout : 'vertical'
	});

    Ti.include('/lib/menu.js');
    menusGenerator(self);

	self.addEventListener('open', function() {
		nameField.focus();
	});

	self.add(Ti.UI.createLabel({
		text : 'اضف رقم جوالك للحصول علي احدث العروض الحصرية لك',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		top : 15,
		color : '#ffffff'
	}));

	nameField = Ti.UI.createTextField({
		hintText : 'اسمك',
		textAlign : Ti.App.autoAlignHintext(),
		height : 33,
		width : '90%',
		left : '5%',
		top : 15,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType : Ti.UI.RETURNKEY_NEXT,
		font : {
			fontSize : '13dp'
		},
		color : '#000000'
	});
	nameField.addEventListener('return', function() {
		mobileField.focus();
	});

	self.add(nameField);

	mobileField = Ti.UI.createTextField({
		hintText : 'رقم الجوال',
		textAlign : Ti.App.autoAlignHintext(),
		height : 33,
		width : '90%',
		left : '5%',
		top : 15,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		keyboardType : Ti.UI.KEYBOARD_PHONE_PAD,
		returnKeyType : Ti.UI.RETURNKEY_SEND,
		font : {
			fontSize : '13dp'
		},
		color : '#000000'
	});
	mobileField.addEventListener('return', function() {
		submitBtn.fireEvent('click');
	});

	self.add(mobileField);

	submitBtn = Ti.UI.createButton({
		title : 'اشتراك'
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
	submitBtn.addEventListener('click', function() {

		if (nameField.getValue().length <= 2) {

			Ti.UI.createAlertDialog({
				title : 'خطأ',
				message : 'تاكد من ادخال اسمك',
				buttonNames : ['موافق']
			}).show();
			nameField.focus();
			return false;
		}
		if (mobileField.getValue().length <= 5) {

			Ti.UI.createAlertDialog({
				title : 'خطأ',
				message : 'تاكد من ادخال رقم جوالك',
				buttonNames : ['موافق']
			}).show();
			mobileField.focus();
			return false;
		}

		Ti.App.fireEvent('showLoading');

		var xhr = Ti.Network.createHTTPClient();

		xhr.open('GET', Ti.App.APIURL + 'api/smspro/');

		xhr.setOnerror(function() {

			Ti.App.fireEvent('hideLoading');

			Ti.UI.createAlertDialog({
				title : 'خطأ في الاتصال',
				message : 'حاول مرة اخرى',
				buttonNames : ['موافق']
			}).show();
		});

		xhr.setOnload(function() {
			Ti.App.fireEvent('hideLoading');

			self.close();
		});

		xhr.send({
			smspro_name : nameField.getValue(),
			smspro_mob : mobileField.getValue()
		});
	});

	return self;
};

module.exports = Window;


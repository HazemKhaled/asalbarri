function menusGenerator(self) {
	var aboutBtn, settingBtn, optionsDialogOpts, dialog, auth;

	Ti.App.linksArray = [Ti.App.Properties.getString('currencyName', 'دولار أمريكي') + ' (تغيير)', 'اخبارنا', 'س و ج', 'عروض خاصة', 'رسائل SMS'];

	//openAboutWindow
	if (Ti.Platform.getOsname() === 'android') {
		self.activity.onCreateOptionsMenu = function(e) {
			aboutBtn = e.menu.add({
				title : 'اعدادات',
				icon : '/images/action_settings.png',
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM
			});

			aboutBtn.addEventListener('click', function() {
				Ti.App.dialog.show();
			});

			aboutBtn = e.menu.add({
				title : 'عن البرنامج',
				icon : '/images/action_about.png',
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM
			});

			aboutBtn.addEventListener('click', function() {
				Ti.App.fireEvent('openAboutWindow');
			});
		};
	} else {
		if (self.hideAboutBtn == false) {// only on home window
			aboutBtn = Ti.UI.createButton({
				height : 31,
				width : 31,
				color : '#000000',
				backgroundImage : '/images/icon_2.png'
			});

			aboutBtn.addEventListener('click', function() {
				Ti.App.fireEvent('openAboutWindow');
			});
			self.setLeftNavButton(aboutBtn);
		}
		//openSettingWindow
		settingBtn = Ti.UI.createButton({
			height : 31,
			width : 31,
			color : '#000000',
			backgroundImage : '/images/icon_1.png'
		});
		settingBtn.addEventListener('click', function() {
			Ti.App.dialog.show();
		});

		self.setRightNavButton(settingBtn);
	}

	// options dialog
	optionsDialogOpts = {
		options : Ti.App.linksArray.concat(['تسجيل دخول', 'تسجيل جديد', 'اغلاق']),
		cancel : 7,
		title : 'اعدادات'
	};

	Ti.App.dialog = Ti.UI.createOptionDialog(optionsDialogOpts);

	auth = require('/lib/auth');
	if (auth.isLogedIn() !== false) {
		Ti.App.dialog.options = Ti.App.linksArray.concat(['تغير بيناتي', 'تغير كلمة المرور', 'تسجيل خروج', 'اغلاق']);
		Ti.App.dialog.destructive = 7;
	}

	// add event listener
	Ti.App.dialog.addEventListener('click', function(e) {
		//aboutBtn.title = 'You selected ' + e.index;
		if (auth.isLogedIn() === false) {
			switch(e.index) {
				case 5:

					Ti.App.fireEvent('openLoginWindow');
					break;
				case 6:

					Ti.App.fireEvent('openRegisterWindow');
					break;
			}
		} else {
			switch(e.index) {
				case 5:

					var ProfileWinModule = require('ui/common/auth/profileWin');
					new ProfileWinModule().open();
					break;
				case 6:

					var PasswordWinModule = require('ui/common/auth/passwordWin');
					new PasswordWinModule().open();
					break;
				case 7:

					Ti.App.Properties.removeProperty('userID');
					//Ti.App.fireEvent('cartEmpty');
					Ti.App.fireEvent('showWalletBeforLogin');
					Ti.App.fireEvent('showMyordersBeforLogin');
					Ti.App.fireEvent('closeOrderProductsWindow');
					Ti.App.dialog.options = Ti.App.linksArray.concat(['تسجيل دخول', 'تسجيل جديد', 'اغلاق']);
					Ti.App.dialog.destructive = 99;
					break;
			}
		}

		switch(e.index) {
			case 0:
				Ti.App.fireEvent('openCurrencyWindow');
				break;
			case 1:
				Ti.App.fireEvent('openNewsWindow');
				break;
			case 2:
				Ti.App.fireEvent('openFaqWindow');
				break;
			case 3:
				var OffersListWinModule = require('ui/common/offersListWin');
				new OffersListWinModule().open();
				break;
			case 4:
				var SMSProWinModule = require('ui/common/SMSProWin');
				new SMSProWinModule().open();
				break;
		}
	});
}
function menusGenerator(self) {
	var aboutBtn, settingBtn, auth;

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

	Ti.App.fireEvent('updateSystemMenu')

}
function menusGenerator(self) {
    var aboutBtn, settingBtn, optionsDialogOpts, dialog, auth;

    //openAboutWindow
    if (Ti.Platform.getOsname() === 'android') {
        self.activity.onCreateOptionsMenu = function(e) {
            aboutBtn = e.menu.add({
                title : 'اعدادات',
                icon : '/images/action_settings.png',
                showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM
            });

            aboutBtn.addEventListener('click', function() {
                dialog.show();
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
        if (!self.showAboutBtn) {// only on home window
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
            dialog.show();
        });

        self.setRightNavButton(settingBtn);
    }

    // options dialog
    optionsDialogOpts = {
        options : ['تسجيل دخول', 'تسجيل جديد', Ti.App.Properties.getString('currencyName', 'دولار أمريكي') + ' (تغيير)', 'اخبارنا', 'س و ج', 'اغلاق'],
        cancel : 5,
        title : 'اعدادات'
    };

    dialog = Ti.UI.createOptionDialog(optionsDialogOpts);

    auth = require('/lib/auth');
    if (auth.isLogedIn() !== false) {
        dialog.options = ['تسجيل خروج', 'بيانات المستخدم', Ti.App.Properties.getString('currencyName', 'دولار أمريكي') + ' (تغيير)', 'اخبارنا', 'س و ج', 'اغلاق'];
        dialog.destructive = 0;
    }

    // add event listener
    dialog.addEventListener('click', function(e) {
        //aboutBtn.title = 'You selected ' + e.index;
        if (auth.isLogedIn() === false) {
            switch(e.index) {
                case 0:

                    Ti.App.fireEvent('openLoginWindow');
                    break;
                case 1:

                    Ti.App.fireEvent('openRegisterWindow');
                    break;
            }
        } else {
            switch(e.index) {
                case 0:

                    Ti.App.Properties.removeProperty('userID');
                    Ti.App.fireEvent('cartEmpty');
                    Ti.App.fireEvent('showWalletBeforLogin');
                    Ti.App.fireEvent('showMyordersBeforLogin');
                    Ti.App.fireEvent('closeOrderProductsWindow');
                    Ti.App.dialog.destructive = null;
                    Ti.App.dialog.options = ['تسجيل دخول', 'تسجيل جديد', Ti.App.Properties.getString('currencyName', 'دولار أمريكي') + ' (تغيير)', 'اخبارنا', 'س و ج', 'اغلاق'];
                    break;
                case 1:

                    var userNameMsg = Ti.UI.createAlertDialog({
                        title : 'بيانات المستخدم',
                        message : 'العضو الحالي هو : ' + Ti.App.Properties.getString('userName')
                    });
                    userNameMsg.show();
                    break;
            }
        }

        switch(e.index) {
            case 2:
                Ti.App.fireEvent('openCurrencyWindow');
                break;
            case 3:
                Ti.App.fireEvent('openNewsWindow');
                break;
            case 4:
                Ti.App.fireEvent('openFaqWindow');
                break;
        }
    });

    Ti.App.dialog = dialog;
}
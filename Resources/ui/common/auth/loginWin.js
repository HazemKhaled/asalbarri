function loginWin() {

    var androidshift = 0, self, auth = require('/lib/auth'), scrollview, userField, passField, submitBtn, registerBtn, forgetBtn;

    self = Ti.UI.createWindow({
        title : 'دخول',
        backgroundImage : 'images/common/bg.jpg',
        barImage : 'images/common/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    Ti.App.Properties.setDouble('loginOpendOn', new Date().getTime());

    scrollview = Ti.UI.createScrollView({
        contentWidth : Ti.Platform.displayCaps.platformWidth
    });

    userField = Ti.UI.createTextField({
        hintText : 'اسم المستخدم',
        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
        height : '40dp',
        width : '90%',
        left : '5%',
        top : (75 + androidshift) + 'dp',
        returnKeyType : Ti.UI.RETURNKEY_NEXT,
        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });

    userField.addEventListener('return', function() {
        passField.focus();
    });
    scrollview.add(userField);

    self.add(scrollview);

    userField.focus();

    passField = Ti.UI.createTextField({
        hintText : 'كلمة المرور',
        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
        height : '40dp',
        width : '90%',
        left : '5%',
        top : (125 + androidshift) + 'dp',
        passwordMask : true,
        returnKeyType : Ti.UI.RETURNKEY_SEND,
        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    passField.addEventListener('return', function() {
        submitBtn.fireEvent('click');
    });
    scrollview.add(passField);

    submitBtn = Ti.UI.createButton({
        title : 'دخول'
    });

    if (Ti.Platform.getOsname() === 'android') {
        self.add(submitBtn);
    } else {
        self.setRightNavButton(submitBtn);
    }

    submitBtn.addEventListener('click', function() {

        if (userField.value.length < 4) {
            Ti.UI.createAlertDialog({
                title : 'اسم المستخدم',
                message : 'تآكد من صحة اسم المستخدم',
                cancel : 0,
                buttonNames : ['موافق']
            }).show();
            userField.focus();

            return false;
        }

        if (passField.value.length < 3) {
            Ti.UI.createAlertDialog({
                title : 'كلمة المرور',
                message : 'تآكد من صحة كلمة المرور',
                cancel : 0,
                buttonNames : ['موافق']
            }).show();
            passField.focus();

            return false;
        }

        var xhr = Ti.Network.createHTTPClient();
        xhr.onerror = function() {
            Ti.UI.createAlertDialog({
                title : 'خطآ في الآتصال',
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
                    message : 'خطآ في الآتصال وجاري آخبار الآداره',
                    cancel : 0,
                    buttonNames : ['موافق']
                }).show();

                return false;
            }

            if (response.errors) {

                sendSupportEmailDialogEvent = function(ev) {
                    if (ev.index === 0) {
                        var emailDialog = Ti.UI.createEmailDialog({
                            toRecipients : ['support@eshtery.me']
                        });
                        emailDialog.open();
                    }
                };

                for (k in response.errors) {

                    if (response.errors.hasOwnProperty(k)) {

                        if (response.errors[k] === response.errors.password) {
                            Ti.UI.createAlertDialog({
                                title : 'تآكد من صحة اسم المستخدم الخاص بك',
                                cancel : 0,
                                buttonNames : ['موافق']
                            }).show();

                        } else if (response.errors[k] === response.errors.password) {
                            Ti.UI.createAlertDialog({
                                title : 'كلمة المرور',
                                message : 'تآكد من صحة كلمة المرور الخاصة بك',
                                cancel : 0,
                                buttonNames : ['موافق']
                            }).show();

                        } else {
                            dialog = Ti.UI.createAlertDialog({
                                title : 'خطآ في الدخول',
                                message : 'يمكنك التواصل معنا آذا واجهت مشكله',
                                cancel : 0,
                                buttonNames : ['الغاء', 'مراسله']
                            });

                            dialog.addEventListener('click', sendSupportRequestMailFormEvent);

                            dialog.show();
                        }
                    }

                }
            }
            Ti.App.Properties.setInt('userID', response.userID);

            Ti.App.dialog.options = ['تسجيل خروج', 'بيانات المستخدم', Ti.App.Properties.getString('currencyName') + ' (تغيير)', 'اغلاق'];

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
        title : 'تسجيل',
        top : (215 + androidshift) + 'dp'
    }));
    scrollview.add(registerBtn);

    forgetBtn = auth.forgetBtn(Ti.UI.createButton({
        title : 'استرجع كلمة المرور',
        top : (255 + androidshift) + 'dp'
    }));

    scrollview.add(forgetBtn);

    return self;
}

module.exports = loginWin;

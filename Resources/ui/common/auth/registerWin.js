function openRegisterWindow() {
    var androidshift = 0, self, scrollview, mobileField, emailField, passField, confirmpassField, submitBtn;

    self = Ti.UI.createWindow({
        title : 'تسجيل',
        backgroundImage : 'images/common/bg.jpg',
        barImage : 'images/common/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    self.addEventListener('open', function() {
        mobileField.focus();
    });
    scrollview = Ti.UI.createScrollView({
        contentWidth : Ti.Platform.displayCaps.platformWidth
    });

    mobileField = Ti.UI.createTextField({
        top : (25 + androidshift) + 'dp',
        hintText : 'اسم المستخدم',
        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
        returnKeyType : Ti.UI.RETURNKEY_NEXT,
        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        height : '33dp',
        width : '90%',
        backgroundImage : 'images/common/bg_total_price.png'
    });
    mobileField.addEventListener('change', Ti.App.autoTextAlign);
    mobileField.addEventListener('return', function() {
        emailField.focus();
    });

    scrollview.add(mobileField);
    mobileField.focus();
    emailField = Ti.UI.createTextField({
        top : (65 + androidshift) + 'dp',
        hintText : 'البريد الخاص بك',
        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
        autocapitalization : false,
        returnKeyType : Ti.UI.RETURNKEY_SEND,
        keyboardType : Ti.UI.KEYBOARD_EMAIL,
        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        height : '33dp',
        width : '90%',
        backgroundImage : 'images/common/bg_total_price.png'
    });
    emailField.addEventListener('change', Ti.App.autoTextAlign);
    emailField.addEventListener('return', function() {
        passField.focus();
    });

    scrollview.add(emailField);

    passField = Ti.UI.createTextField({
        height : '33dp',
        width : '90%',
        backgroundImage : 'images/common/bg_total_price.png',
        top : (105 + androidshift) + 'dp',
        hintText : 'كلمة المرور',
        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
        passwordMask : true,
        returnKeyType : Ti.UI.RETURNKEY_NEXT,
        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    passField.addEventListener('change', Ti.App.autoTextAlign);
    passField.addEventListener('return', function() {
        confirmpassField.focus();
    });

    scrollview.add(passField);

    confirmpassField = Ti.UI.createTextField({
        height : '33dp',
        width : '90%',
        backgroundImage : 'images/common/bg_total_price.png',
        top : (145 + androidshift) + 'dp',
        hintText : 'تآكيد كلمة المرور',
        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
        passwordMask : true,
        returnKeyType : Ti.UI.RETURNKEY_JOIN,
        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    confirmpassField.addEventListener('change', Ti.App.autoTextAlign);
    confirmpassField.addEventListener('return', function() {
        submitBtn.fireEvent('click');
    });

    scrollview.add(confirmpassField);

    submitBtn = Ti.UI.createButton({
        title : 'تسجيل',
        top : (280 + androidshift) + 'dp',
        right : Ti.Platform.getOsname() === 'iphone' ? '5%' : '50%'
    });

    submitBtn.addEventListener('click', function() {

        var xhr, emailRGX = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/, mobileNumberRGX = /^[0-9]{9,12}$/;

        if (!mobileNumberRGX.test(mobileField.value)) {
            Ti.UI.createAlertDialog({
                title : 'خطآ',
                message : 'تحقق من اسم المستخدم',
                cancel : 0,
                buttonNames : ['موافق']
            }).show();
            mobileField.focus();

            return false;
        }

        if (!emailRGX.test(emailField.value)) {
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

        if (passField.value !== confirmpassField.value) {
            Ti.UI.createAlertDialog({
                title : 'خطآ في كلمة المرور',
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
                title : 'خطآ في الآتصال',
                cancel : 0,
                buttonNames : ['موافق']
            }).show();
            Ti.App.fireEvent('hideLoading');
        };
        xhr.onload = function() {

            var request, msgBox;

            try {
                request = JSON.parse(this.responseText);
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
                msgBox = Ti.UI.createAlertDialog({
                    title : 'خطآ',
                    message : 'هذا البريد او اسم المستخدم مسجلين لدينا بالفعل، إذا كنت مسجل من قبل ونسيت كلمة المرور اضغط على زر نسيت كلمة المرور',
                    cancel : 0,
                    buttonNames : ['موافق', 'نسيت كلمة المرور؟']
                });

                msgBox.show();

                msgBox.addEventListener('click', function(e) {
                    if (e.index === 1) {
                        Ti.App.fireEvent('openForgetpasswordWindow');
                    }
                });
                Ti.App.fireEvent('hideLoading');

                return false;
            }

            Ti.UI.createAlertDialog({
                title : request.msg + "يمكنك تسجيل الدخول الآن",
                cancel : 0,
                buttonNames : ['موافق']
            }).show();
            Ti.App.fireEvent('hideLoading');
            Ti.App.fireEvent('closeRegisterWindow');
        };

        xhr.open('POST', Ti.App.APIURL + 'authapi/register');
        xhr.send({
            username : mobileField.value,
            email : emailField.value,
            password : passField.value,
            confirm_password : confirmpassField.value
        });
        Ti.App.fireEvent('showLoading');

    });

    if (Ti.Platform.getOsname() === 'android') {
        scrollview.add(submitBtn);
    } else {
        self.setRightNavButton(submitBtn);
    }
    self.add(scrollview);

    return self;
}

module.exports = openRegisterWindow;

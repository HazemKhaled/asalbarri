function openRegisterWindow() {
    var self, scrollview, mobileField, emailField, passField, confirmpassField, submitBtn;

    self = Ti.UI.createWindow({
        title : 'تسجيل',
        backgroundImage : '/images/bg.jpg',
        barImage : '/images/Navigation_Bar.jpg',
        barColor : 'gray'
    });
    scrollview = Ti.UI.createScrollView({
        contentWidth : Ti.Platform.displayCaps.platformWidth
    });

    mobileField = Ti.UI.createTextField({
        top : 25,
        hintText : 'اسم المستخدم',
        textAlign : Ti.App.autoAlignHintext(),
        returnKeyType : Ti.UI.RETURNKEY_NEXT,
        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        height : 33,
        width : '90%',
        font : {
            fontSize : '13dp'
        },
		color : '#000000'
    });

    self.addEventListener('open', function() {
        mobileField.focus();
    });
    mobileField.addEventListener('change', Ti.App.autoTextAlign);
    mobileField.addEventListener('return', function() {
        emailField.focus();
    });

    scrollview.add(mobileField);

    emailField = Ti.UI.createTextField({
        top : 65,
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
        passField.focus();
    });

    scrollview.add(emailField);

    passField = Ti.UI.createTextField({
        height : 33,
        width : '90%',
        top : 105,
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
        top : 145,
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

    scrollview.add(confirmpassField);

    submitBtn = Ti.UI.createButton({
        title : 'تسجيل'
    });

    submitBtn.addEventListener('click', function() {

        var xhr, emailRGX = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

        if (mobileField.getValue().length < 4) {
            Ti.UI.createAlertDialog({
                title : 'خطأ',
                message : 'تحقق من اسم المستخدم',
                cancel : 0,
                buttonNames : ['موافق']
            }).show();
            mobileField.focus();

            return false;
        }

        if (!emailRGX.test(emailField.value)) {
            Ti.UI.createAlertDialog({
                title : 'خطأ',
                message : 'خطأ في البريد الآلكتروني',
                cancel : 0,
                buttonNames : ['موافق']
            }).show();
            emailField.focus();

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
            if (request.errors) {
                msgBox = Ti.UI.createAlertDialog({
                    title : 'خطأ',
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

                return false;
            }

            Ti.UI.createAlertDialog({
                title : request.msg,
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

        submitBtn.height = 33;
        submitBtn.width = '90%';
        submitBtn.top = 185;
        submitBtn.backgroundImage = '/images/button_ok.png';
        submitBtn.color = '#ffffff';

        scrollview.add(submitBtn);
    } else {
        self.setRightNavButton(submitBtn);
    }
    self.add(scrollview);

    return self;
}

module.exports = openRegisterWindow;

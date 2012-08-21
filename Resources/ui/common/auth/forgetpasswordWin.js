function forgetpasswordWin() {

    var self, emailField, submitBtn;

    self = Ti.UI.createWindow({
        title : 'آسترجاع كلمه المرور',
        backgroundImage : '/images/bg.jpg',
        barImage : '/images/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    self.addEventListener('open', function() {
        emailField.focus();
    });

    emailField = Ti.UI.createTextField({
        top : 25,
        hintText : 'البريد الخاص بك',
        textAlign : Ti.App.autoAlignHintext(),
        //autocapitalization : false,
        returnKeyType : Ti.UI.RETURNKEY_SEND,
        keyboardType : Ti.UI.KEYBOARD_EMAIL,
        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        height : 33,
        width : '90%',
        backgroundImage : '/images/bg_total_price.png',
        font : {
            fontSize : '13dp'
        }
    });

    // align left if empty
    emailField.addEventListener('change', Ti.App.autoTextAlign);

    self.add(emailField);

    submitBtn = Ti.UI.createButton({
        title : 'آرسال'
    });

    submitBtn.addEventListener('click', function() {
        var xhr, emailRGX = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

        if (emailRGX.test(emailField.value) === false) {
            Ti.UI.createAlertDialog({
                title : 'خطآ في البريد',
                message : '"آستخدم بريدك المسجل لدينا"تحقق من بريدك',
                cancel : 0,
                buttonNames : ['موافق']
            }).show();
            emailField.focus();

            return false;
        }

        xhr = Ti.Network.createHTTPClient();

        xhr.onload = function() {

            Ti.App.fireEvent('hideLoading');

            var request, alertMsg;
            try {
                request = JSON.parse(this.responseText);
            } catch (e) {
                Ti.UI.createAlertDialog({
                    title : 'خطآ',
                    message : request.errors.login,
                    cancel : 0,
                    buttonNames : ['موافق']
                }).show();

                return false;
            }

            if (request.errors.login) {

                Ti.UI.createAlertDialog({
                    title : 'خطآ',
                    message : request.errors.login,
                    cancel : 0,
                    buttonNames : ['موافق']
                }).show();

                return false;
            }

            alertMsg = Ti.UI.createAlertDialog({
                title : request.msg,
                cancel : 0,
                buttonNames : ['موافق']
            });

            alertMsg.addEventListener('click', function(ev) {
                if (ev.index === 0) {
                    Ti.App.fireEvent('closeForgetpasswordWindow');
                }
            });
            alertMsg.show();
        };

        xhr.onerror = function(e) {
            Ti.UI.createAlertDialog({
                title : 'خطآ في الآتصال',
                cancel : 0,
                buttonNames : ['موافق']
            }).show();
            Ti.App.fireEvent('hideLoading');
        };

        xhr.open('POST', Ti.App.APIURL + 'authapi/forgot_password');

        xhr.send({
            login : emailField.value
        });
        Ti.App.fireEvent('showLoading');

    });

    emailField.addEventListener('return', function() {
        submitBtn.fireEvent('click');
    });

    if (Ti.Platform.getOsname() === 'android') {

        submitBtn.height = 33;
        submitBtn.width = '90%';
        submitBtn.top = 65;
        submitBtn.backgroundImage = '/images/button_ok.png';
        submitBtn.color = '#ffffff';

        self.add(submitBtn);
    } else {
        self.setRightNavButton(submitBtn);
    }

    return self;
}

module.exports = forgetpasswordWin;

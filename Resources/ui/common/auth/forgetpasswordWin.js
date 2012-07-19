function forgetpasswordWin() {

    var androidshift = 0, self, emailField, submitBtn;

    self = Ti.UI.createWindow({
        title : 'آسترجاع كلمه المرور',
        backgroundImage : 'images/common/bg.jpg',
        barImage : 'images/common/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    self.addEventListener('open', function() {
        emailField.focus();
    });

    emailField = Ti.UI.createTextField({
        top : (25 + androidshift) + 'dp',
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

            var request = JSON.parse(this.responseText), alertMsg;

            Ti.App.fireEvent('hideLoading');

            if (request.errors.login) {

                Ti.UI.createAlertDialog({
                    title : 'خطآ',
                    message : request.errors.login,
                    cancel : 0,
                    buttonNames : ['موافق']
                }).show();

                Ti.App.fireEvent('hideLoading');
                return false;
            }

            alertMsg = Ti.UI.createAlertDialog({
                title : request.msg,
                cancel : 0,
                buttonNames : ['موافق']
            });

            Ti.App.fireEvent('hideLoading');

            alertWindow.addEventListener('click', function(ev) {
                if (ev.index === 0) {
                    Ti.App.fireEvent('closeForgetpasswordWindow');
                }
            });
            alertWindow.show();
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
        self.add(submitBtn);
    } else {
        self.setRightNavButton(submitBtn);
    }

    return self;
}

module.exports = forgetpasswordWin;

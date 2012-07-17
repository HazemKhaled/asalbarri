exports.isLogedIn = function() {

    return Ti.App.Properties.hasProperty('userID') ? Ti.App.Properties.getInt('userID') : false;
};

exports.loginBtn = function(btn) {

    btn.addEventListener('click', function() {
        Ti.App.fireEvent('openLoginWindow');
    });
    return btn;
};

exports.logoutBtn = function(btn) {

    btn.addEventListener('click', function() {
        Ti.App.Properties.removeProperty('userID');
    });
    return btn;
};

exports.registerBtn = function(btn) {

    btn.addEventListener('click', function() {
        Ti.App.fireEvent('openRegisterWindow');
    });
    return btn;
};

exports.forgetBtn = function(btn) {

    btn.addEventListener('click', function() {
        Ti.App.fireEvent('openForgetpasswordWindow');
    });
    return btn;
};

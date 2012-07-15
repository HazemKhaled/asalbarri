function alertDialogPro() {
    var win = Ti.UI.createWindow({
        backgroundColor : 'gray',
        fullscreen : true,
        navBarHidden : false,
        opacity : 0.50
    });
    win.orientationModes = [Ti.UI.PORTRAIT];

    var blur = Ti.UI.createAnimation({
        opacity : 0.50
    })
    var shadow = Ti.UI.createView({
        left : 20,
        top : 100,
        right : 20,
        bottom : 200,
        opacity : 0.50,
        backgroundColor : 'black',
        borderRadius : 10,
        borderColor : 'black'
    });
    var frmLog = Ti.UI.createView({
        top : 110,
        left : 30,
        right : 30,
        bottom : 210,
        opacity : 1,
        borderRadius : 10,
        backgroundColor : 'white',
        layout : "vertical"
    });

    var txtuser = Ti.UI.createTextField({
        hintText : "Enter Username",
        top : 30,
        left : 30,
        right : 30,
        txtID : "txtuser"
    });
    var txtpass = Ti.UI.createTextField({
        hintText : "Enter Password",
        left : 30,
        right : 30,
        txtID : "txtpass"
    });
    var btngroup = Ti.UI.createView({
        layout : "vertical"
    });
    var btnLog = Ti.UI.createButton({
        title : "Login",
        btnID : "btnLog",
        width : 100
    });
    var btnSign = Ti.UI.createButton({
        title : "SignUp",
        btnID : "btnSign",
        width : 100
    });
    frmLog.add(txtuser);
    frmLog.add(txtpass);
    frmLog.add(btnLog);
    frmLog.add(btnSign);
    shadow.animate(blur);
    win.add(shadow);
    win.add(frmLog);
    return win;
}

module.exports = alertDialogPro; 
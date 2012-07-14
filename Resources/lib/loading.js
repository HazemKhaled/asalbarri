/**
 *
 * @Auther Hazem Khaled <Hazem.Khald@gmail.com>
 *
 Ti.App.addEventListener('showLoading', function(e) {

 var loading = require('lib/loading');

 loading.show();

 Ti.App.addEventListener('hideLoading', function(e) {
 loading.hide();
 });

 Ti.App.addEventListener('msgLoading', function(e) {
 loading.setMsg(e.text);
 });
 });
 */

var indWin = null, actInd = null;

var messageLbl = Ti.UI.createLabel({
    text : 'جاري التحميل',
    color : '#fff',
    textAlign : 'center',
    font : {
        fontSize : 20,
        fontWeight : 'bold'
    },
    top : 260
});

exports.hide = function() {
    if (Ti.Platform.getOsname() !== 'android') {
        if (indWin !== null) {
            indWin.close({
                opacity : 0,
                duration : 500
            });
        }
        indWin = null;
    } else {
        if (actInd) {
            actInd.hide();
            actInd = null;
        }
    }
};

exports.show = function() {

    if (Ti.Platform.getOsname() !== 'android') {
        // window container
        indWin = Ti.UI.createWindow({
            //height : 150,
            //width : 150,
            backgroundColor : '#111111',
            opacity : 0.6
        });

        // black view
        var indView = Ti.UI.createView({
            height : 170,
            width : 150,
            backgroundColor : '#000000',
            borderRadius : 10,
            opacity : 0.9
        });
        indWin.add(indView);
    }

    // loading indicator
    actInd = Ti.UI.createActivityIndicator({
        height : 30,
        width : 30
    });

    if (Ti.Platform.getOsname() !== 'android') {
        actInd.style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
        indWin.add(actInd);

        indWin.add(messageLbl);
        indWin.open();
    } else {
        actInd.message = "جاري التحميل";
    }
    actInd.show();
}

exports.setMsg = function(msg, loadingTxt) {

    if (loadingTxt == undefined) {
        loadingTxt = 'جاري التحميل';
    }

    if (Ti.Platform.getOsname() != 'android') {
        messageLbl.text = loadingTxt + "\n" + msg;
    } else {
        actInd.message = loadingTxt + "\n" + msg;
    }
}
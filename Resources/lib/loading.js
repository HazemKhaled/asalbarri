var indWin = Ti.UI.createWindow({
	backgroundColor : '#111111',
	opacity : 0.6,
	fullscreen : true
});
// black view
var indView = Ti.UI.createView({
	layout : 'vertical',
	backgroundColor : '#000000',
	borderRadius : 10,
	opacity : 0.9,
	height : 100,
	width : 150
});
indWin.add(indView);

if (Ti.Platform.name === 'iPhone OS') {
	var style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
} else {
	var style = Ti.UI.ActivityIndicatorStyle.BIG;
}
var activityIndicator = Ti.UI.createActivityIndicator({
	style : style,
	top : 10,
	height : Ti.UI.SIZE,
	width : Ti.UI.SIZE
});

// The activity indicator must be added to a window or view for it to appear
indView.add(activityIndicator);

var messageLbl = Ti.UI.createLabel({
	text : 'جاري التحميل',
	color : '#fff',
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	font : {
		fontFamily : 'Helvetica Neue',
		fontSize : 20,
		fontWeight : 'bold'
	},
	top : 10
});
indView.add(messageLbl);

exports.hide = function() {

	indWin.close();
	activityIndicator.hide();
};

exports.show = function() {

	indWin.open();
	activityIndicator.show();
};

exports.setMsg = function(msg, loadingTxt) {

	if (loadingTxt == undefined) {
		loadingTxt = 'جاري التحميل';
	}

	if (Ti.Platform.getOsname() != 'android') {
		messageLbl.text = loadingTxt + "\n" + msg;
	} else {
		activityIndicator.message = loadingTxt + "\n" + msg;
	}
};

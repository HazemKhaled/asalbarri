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

var indWin = null;
var actInd = null;

var messageLbl = Titanium.UI.createLabel({
	text : 'جاري التحميل',
	color : '#fff',
	width : 'auto',
	height : 'auto',
	textAlign : 'center',
	font : {
		fontSize : 20,
		fontWeight : 'bold'
	},
	top : 260
});

exports.hide = function() {
	if(Ti.Platform.osname !== 'android') {
		if(indWin !== null)
			indWin.close({
				opacity : 0,
				duration : 500
			});
		indWin = null;
	} else {
		try{
		actInd.hide();
		}catch(e){
			
		}
		actInd = null
	}
};

exports.show = function() {

	if(actInd) {
		return;
	}

	if(Ti.Platform.osname != 'android') {
		// window container
		indWin = Titanium.UI.createWindow({
			//height : 150,
			//width : 150,
			backgroundColor : '#111111',
			opacity : 0.6
		});

		// black view
		var indView = Titanium.UI.createView({
			height : 170,
			width : 150,
			backgroundColor : '#000000',
			borderRadius : 10,
			opacity : 0.9
		});
		indWin.add(indView);
	}

	// loading indicator
	actInd = Titanium.UI.createActivityIndicator({
		height : 30,
		width : 30
	});

	if(Ti.Platform.osname != 'android') {
		actInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.BIG;
		indWin.add(actInd);

		indWin.add(messageLbl);
		indWin.open();
	} else {
		actInd.message = "جاري التحميل";
	}
	actInd.show();
}

exports.setMsg = function(msg, loadingTxt) {

	if(loadingTxt == undefined) {
		loadingTxt = 'جاري التحميل';
	}

	if(Ti.Platform.osname != 'android') {
		messageLbl.text = loadingTxt + "\n" + msg;
	} else {
		actInd.message = loadingTxt + "\n" + msg;
	}
}
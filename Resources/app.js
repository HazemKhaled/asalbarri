/*
* A tabbed application, consisting of multiple stacks of windows associated with tabs in a tab group.
* A starting point for tab-based application with multiple top-level windows.
* Requires Titanium Mobile SDK 1.8.0+.
*
* In app.js, we generally take care of a few things:
* - Bootstrap the application with any data we need
* - Check for dependencies like device type, platform version or network connection
* - Require and open our top-level UI component
*
*/

//bootstrap and check dependencies
if (Ti.version < 1.8) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

Ti.App.APIURL = 'http://demo.hgicom.com/asalbarri/asal/';
//Ti.App.APIURL = 'http://192.168.1.16/hgicms_1.3.0/asal/';
//Ti.App.APIURL = 'http://169.254.175.156/hgicms_1.3.0/asal/';

// This is a single context application with mutliple windows in a stack
//(function() {
//determine platform and form factor and render approproate components
var osname = Ti.Platform.osname, version = Ti.Platform.version, height = Ti.Platform.displayCaps.platformHeight, width = Ti.Platform.displayCaps.platformWidth;

//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
//yourself what you consider a tablet form factor for android
Ti.App.isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));

var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
new ApplicationTabGroup().open();

if (Ti.App.Properties.hasProperty('currency') == false) {
	Ti.App.Properties.setInt('currency', 0);
	Ti.App.Properties.setString('currencyName', 'ريال سعودي');
}
//Ti.UI.currentTab
Ti.include('/lib/events.js');
//})();

function walletWin() {

	var self, androidshift = 0, loadinLabel, chargeBtn, balancCurr, img, loginBtn, msgLabel;

	self = Ti.UI.createWindow({
		title : 'المحفظة',
		backgroundImage : 'images/common/bg.jpg',
		barImage : 'images/common/Navigation_Bar.jpg',
		barColor : '#d3d3d3'
	});

	Ti.App.addEventListener('showWalletAfterLogin', function() {

		loadinLabel = Ti.UI.createLabel({
			text : 'جاري التحميل ....',
			left : 0,
			right : '10dp',
			top : '10dp',
			color : '#000000',
			textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT
		});
		self.add(loadinLabel);

		function getBalance() {

			var xhr = Ti.Network.createHTTPClient();

			xhr.open('GET', Ti.App.APIURL + 'api/walletBalance/' + Ti.App.Properties.getInt('userID') + '/' + Ti.App.Properties.getInt('currency'));

			xhr.onerror = function() {

				loadinLabel.setText('لا يوجد نتائج هنا في الوقت الحالي !!');
			};

			xhr.onload = function() {

				var row = JSON.parse(this.responseText);
				balanceLbl.text = row.balance;
				loadinLabel.setVisible(false);
				balanceTitle.setVisible(true);
				balanceLbl.setVisible(true);
				balancCurr.setVisible(true);
			};

			xhr.send();
		}

		chargeBtn = Ti.UI.createButton({
			title : 'شحن المحفظة',
			top : '200dp',
			right : '1%',
			left : '1%',
			width : '98%',
			color : '#000000',
			backgroundImage : 'images/common/button_ok.png'
		});

		chargeBtn.addEventListener('click', function() {
			Ti.App.fireEvent('openChargeWalletWindow');
		});

		self.add(chargeBtn);

		img = Ti.UI.createImageView({
			image : 'images/common/wallet_balance.png',
			width : '144dp',
			height : '166dp',
			right : '100dp',
			top : '20px'
		});
		self.add(img);

		balanceTitle = Ti.UI.createLabel({
			text : 'الرصيد',
			left : 0,
			right : '150dp',
			top : '60dp',
			color : '#000000',
			visible : false,
			textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
			font : {
				fontFamily : 'Arial',
				fontSize : '16dp',
				fontWeight : 'bold'
			}
		});
		self.add(balanceTitle);

		balanceLbl = Ti.UI.createLabel({
			text : '',
			left : 0,
			right : '155dp',
			top : '85dp',
			color : '#000000',
			visible : false,
			textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
			color : 'red',
			font : {
				fontFamily : 'Arial',
				fontSize : '20dp',
				fontWeight : 'bold'
			}
		});
		Ti.App.balanceLbl = balanceLbl;
		self.add(Ti.App.balanceLbl);

		balancCurr = Ti.UI.createLabel({
			text : Ti.App.Properties.getString('currencyName'),
			left : 0,
			right : '127dp',
			top : '110dp',
			color : '#000000',
			visible : false,
			textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
			font : {
				fontFamily : 'Arial',
				fontSize : '15dp',
				fontWeight : 'bold'
			}
		});
		self.add(balancCurr);

		getBalance();

		self.remove(loginBtn);
		self.remove(msgLabel);
	});

	Ti.App.addEventListener('showWalletBeforLogin', function() {

		msgLabel = Ti.UI.createLabel({
			text : 'يرجى تسجيل الدخول',
			width : '100%',
			top : (40 + androidshift) + 'dp',
			color : '#ffffff',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : {
				fontFamily : 'Arial',
				fontSize : '17dp',
				fontWeight : 'bold'
			}
		});
		self.add(msgLabel);

		loginBtn = auth.loginBtn(Ti.UI.createButton({
			title : 'تسجيل دخول',
			top : (100 + androidshift) + 'dp',
			backgroundImage : 'images/common/button_ok.png',
			paddingLeft : '5dp',
			paddingRight : '5dp',
			color : '#000000'
		}));
		self.add(loginBtn);

		self.remove(balancCurr);
		self.remove(Ti.App.balanceLbl);
		self.remove(balanceTitle);
		self.remove(img);
		self.remove(loadinLabel);
		self.remove(chargeBtn);
	});

	var auth = require('/lib/auth');
	if (!auth.isLogedIn()) {

		Ti.App.fireEvent('showWalletBeforLogin');
	} else {

		Ti.App.fireEvent('showWalletAfterLogin');
	}

	return self;
}

module.exports = walletWin;

Ti.App.addEventListener('showLoading', function(e) {

	var loading = require('lib/loading');

	loading.show();

	Ti.App.addEventListener('hideLoading', function(e) {
		loading.hide();
	});
});

Ti.App.addEventListener('openLoginWindow', function() {

	if (Ti.Platform.getOsname() !== 'android') {
		Ti.App.catalogTab.setActive(true);
	}

	var LoginModule = require('/ui/common/auth/loginWin'), loginWin;

	loginWin = new LoginModule();
	Ti.App.myTabGroup.getActiveTab().open(loginWin);

	Ti.App.addEventListener('closeLoginWindow', function(e) {

		if (Ti.Platform.getOsname() === 'android') {
			loginWin.close();
		} else {
			Ti.App.catalogTab.close(loginWin);
		}
	});
});

Ti.App.addEventListener('openRegisterWindow', function(e) {

	if (Ti.Platform.getOsname() !== 'android') {
		Ti.App.catalogTab.setActive(true);
	}

	var RegisterWinModule = require('/ui/common/auth/registerWin'), registerWin;

	registerWin = new RegisterWinModule();

	Ti.App.myTabGroup.getActiveTab().open(registerWin);

	Ti.App.addEventListener('closeRegisterWindow', function(e) {

		if (Ti.Platform.getOsname() === 'android') {
			registerWin.close();
		} else {
			Ti.App.catalogTab.close(registerWin);
		}
	});
});

Ti.App.addEventListener('openForgetpasswordWindow', function(e) {

	var ForgetpasswordWinModule = require('/ui/common/auth/forgetpasswordWin'), forgetpasswordWin;

	forgetpasswordWin = new ForgetpasswordWinModule();

	Ti.App.myTabGroup.getActiveTab().open(forgetpasswordWin);

	Ti.App.addEventListener('closeForgetpasswordWindow', function(e) {

		if (Ti.Platform.getOsname() === 'android') {
			forgetpasswordWin.close();
		} else {
			Ti.App.catalogTab.close(forgetpasswordWin);
		}
	});
});

Ti.App.addEventListener('openAboutWindow', function() {
	var AboutWinModule = require('/ui/common/aboutWin'), aboutWin;

	aboutWin = new AboutWinModule();

	aboutWin.open();
});

Ti.App.addEventListener('openCurrencyWindow', function() {
	var CurrencyWinModule = require('/ui/common/currencyWin');
	Ti.App.myTabGroup.getActiveTab().open(new CurrencyWinModule());
});

Ti.App.addEventListener('openNewsWindow', function() {
	var WinModule = require('/ui/common/newsWin');

	Ti.App.myTabGroup.getActiveTab().open(new WinModule());
});

Ti.App.addEventListener('openFaqWindow', function() {
	var WinModule = require('/ui/common/faqWin');

	Ti.App.myTabGroup.getActiveTab().open(new WinModule());
});

Ti.App.addEventListener('openChargeWalletWindow', function() {
	var ChargeWalletWinModule = require('/ui/common/chargeWalletWin');

	new ChargeWalletWinModule().open();
});

Ti.App.addEventListener('openCategoryWindow', function(e) {
	var CategoryWin = require('ui/common/categoryWin'), categoryWin;

	categoryWin = new CategoryWin(e.parent);
	Ti.App.catalogTab.open(categoryWin);

	Ti.App.addEventListener('closeCategoryWindow', function(e) {

		if (Ti.Platform.getOsname() === 'android') {
			categoryWin.close();
		} else {
			Ti.App.catalogTab.close(categoryWin);
		}
	});
});

Ti.App.addEventListener('openProductListWindow', function(e) {
	var ProductsListWin = require('ui/common/productsListWin');

	Ti.App.catalogTab.open(new ProductsListWin(e.data));
});

Ti.App.addEventListener('openProductWindow', function(e) {

	var ProductWinModule = require('/ui/common/productWin'), productWin;

	productWin = new ProductWinModule(e.data);
	Ti.App.myTabGroup.getActiveTab().open(productWin);

	Ti.App.addEventListener('closeProductWindow', function(e) {

		if (Ti.Platform.getOsname() === 'android') {
			productWin.close();
		} else {
			Ti.App.myTabGroup.getActiveTab().close(productWin);
		}
	});
});

Ti.App.addEventListener('openOrderProductsWindow', function(e) {

	var OrderProductsWinModule = require('/ui/common/orderProductsWin'), orderProductsWin;

	orderProductsWin = new OrderProductsWinModule(e.data);
	Ti.App.orderTab.open(orderProductsWin);

	Ti.App.addEventListener('closeOrderProductsWindow', function(e) {

		if (Ti.Platform.getOsname() === 'android') {
			orderProductsWin.close();
		} else {
			Ti.App.catalogTab.close(orderProductsWin);
		}
	});
});

Ti.App.addEventListener('cartAdd', function(e) {

	var cart = Ti.App.Properties.getObject('cart', {});

	if (e.quantity === 0) {
		delete cart[e.productID];
	} else {

		cart[e.productID] = {
			id : e.productID,
			title : e.productTitle,
			quantity : e.quantity,
			price : e.price,
			price_shown_coupon : e.price_shown_coupon
		};
	}
	Ti.App.Properties.setObject('cart', cart);

	if (Ti.Platform.getOsname() !== 'android') {
		Ti.App.cartTab.setBadge(Ti.App.cartQuantityCounter(cart).totalNet.toFixed(0));
	}

	if (Ti.Platform.getOsname() !== 'android') {
		Ti.App.cartTab.setActive(true);
	}
});

Ti.App.addEventListener('cartEmpty', function(e) {
	Ti.App.Properties.setObject('cart', {});

	if (Ti.Platform.getOsname() !== 'android') {
		Ti.App.cartTab.setBadge(0);
	}
});

Ti.App.addEventListener('openShippingWindow', function() {

	var ShippingWinModule = require('/ui/common/shippingWin'), shippingWin;

	shippingWin = new ShippingWinModule();
	Ti.App.cartTab.open(shippingWin);

	Ti.App.addEventListener('closeShippingWindow', function(e) {

		if (Ti.Platform.getOsname() === 'android') {
			shippingWin.close();
		} else {
			Ti.App.catalogTab.close(shippingWin);
		}
	});

});

Ti.App.addEventListener('openfollowshippingWinndow', function(e) {

	var followshippingWinModule = require('/ui/common/followshippingWin'), followshippingWin;

	followshippingWin = new followshippingWinModule(e.url);
	//Ti.App.myOrders.open(followshippingWin);
	followshippingWin.open();
});

Ti.App.addEventListener('updateSystemMenu', function(e) {
	var linksArray = [Ti.App.Properties.getString('currencyName') + ' (تغيير)', 'اخبارنا', 'سؤال و جواب', 'رسائل SMS'];

	Ti.App.dialog = Ti.UI.createOptionDialog({
		options : linksArray.concat(['تسجيل دخول', 'تسجيل جديد', 'اغلاق']),
		cancel : 6,
		title : 'اعدادات'
	});

	// add event listener
	Ti.App.dialog.addEventListener('click', function(e) {
		//aboutBtn.title = 'You selected ' + e.index;
		if (auth.isLogedIn() === false) {
			switch(e.index) {
				case 4:

					Ti.App.fireEvent('openLoginWindow');
					break;
				case 5:

					Ti.App.fireEvent('openRegisterWindow');
					break;
			}
		} else {
			switch(e.index) {
				case 4:

					var ProfileWinModule = require('ui/common/auth/profileWin');
					Ti.App.myTabGroup.getActiveTab().open(new ProfileWinModule());
					break;
				case 5:

					Ti.App.Properties.removeProperty('userID');
					//Ti.App.fireEvent('cartEmpty');
					Ti.App.fireEvent('showWalletBeforLogin');
					Ti.App.fireEvent('showMyordersBeforLogin');
					Ti.App.fireEvent('closeOrderProductsWindow');
					Ti.App.fireEvent('updateSystemMenu');
					break;
			}
		}

		switch(e.index) {
			case 0:
				Ti.App.fireEvent('openCurrencyWindow');
				break;
			case 1:
				Ti.App.fireEvent('openNewsWindow');
				break;
			case 2:
				Ti.App.fireEvent('openFaqWindow');
				break;
			case 3:
				var SMSProWinModule = require('ui/common/SMSProWin');
				Ti.App.myTabGroup.getActiveTab().open(new SMSProWinModule());
				break;
		}
		//Ti.App.dialog = undefined;
	});

	auth = require('/lib/auth');
	if (auth.isLogedIn() !== false) {
		Ti.App.dialog.options = linksArray.concat(['تغير بيناتي', 'تسجيل خروج', 'اغلاق']);
		Ti.App.dialog.destructive = 5;
	} else {
		Ti.App.dialog.options = linksArray.concat(['تسجيل دخول', 'تسجيل جديد', 'اغلاق']), Ti.App.dialog.destructive = 99;
	}
});

Ti.App.addEventListener('orderRequest', function(e) {

	var auth, orderData, cartProducts, xhr;

	auth = require('/lib/auth');

	orderData = {
		products : [],
		userID : auth.isLogedIn(),
		countryID : e.countryID,
		couponCode : Ti.App.Properties.getString('couponCode', null),
		paymentMethod : e.paymentMethod
	};

	cartProducts = Ti.App.Properties.getObject('cart', {});

	for (i in cartProducts) {
		if (cartProducts.hasOwnProperty(i)) {

			orderData.products.push({
				id : cartProducts[i].id,
				q : cartProducts[i].quantity
			});
		}
	}
	orderData.products = JSON.stringify(orderData.products);
	//alert(orderData);

	Ti.App.fireEvent('showLoading');

	xhr = Ti.Network.createHTTPClient({
		timeout : 45000
	});

	xhr.open('POST', Ti.App.APIURL + 'api/AddOrder');
	xhr.onerror = function() {
		Ti.App.fireEvent('hideLoading');

		Ti.UI.createAlertDialog({
			title : 'خطأ',
			message : 'خطا في الاتصال، تاكد من اتصال الانترنت لديك وحاول مرة اخرى',
			buttonNames : ['موافق']
		}).show();
	};

	xhr.onload = function() {
		var results, TowcoWinModule;
		try {
			results = JSON.parse(this.responseText);
		} catch (error) {
			Ti.App.fireEvent('hideLoading');

			Ti.UI.createAlertDialog({
				title : 'خطأ',
				message : 'خطا في الاتصال، تاكد من اتصال الانترنت لديك وحاول مرة اخرى',
				buttonNames : ['موافق']
			}).show();
		}

		//alert(results);
		Ti.App.fireEvent('hideLoading');

		if (e.paymentMethod === 'tocheckout') {

			TowcoWinModule = require('/ui/common/2coWin');
			new TowcoWinModule(results.orderID, results.totalPrice).open();

		} else {

			if (Ti.Platform.getOsname() !== 'android') {
				Ti.App.orderTab.setActive(true);
			} else {
				Ti.UI.createAlertDialog({
					title : 'مبروك',
					message : 'تم ارسال طلبك بنجاح، يمكنك متابعة الطلب بالظغط على "الطلبات" في الاعلى.',
					cancel : 0,
					buttonNames : ['موافق']
				}).show();
			}
			Ti.App.fireEvent('closeShippingWindow');
			Ti.App.fireEvent('cartEmpty');
			Ti.App.fireEvent('showMyordersAfterLogin');
			Ti.App.Properties.removeProperty('coupon');
			Ti.App.Properties.removeProperty('couponCode');
			Ti.App.getHttpRequest('api/walletBalance/' + Ti.App.Properties.getInt('userID') + '/' + Ti.App.Properties.getInt('currency', 2), function(results) {

				Ti.App.balanceLbl.text = results.balance;
			});
		}
	};

	xhr.send(orderData);

});

Ti.App.cartQuantityByProductID = function(productID) {

	var cart = Ti.App.Properties.getObject('cart', {});

	return cart[productID] === undefined ? 0 : cart[productID].quantity;
};

Ti.App.cartQuantityCounter = function(cart) {

	if (cart === undefined) {
		cart = Ti.App.Properties.getObject('cart', {});
	}

	var data = {
		quantity : null,
		count : 0,
		total : 0,
		coupon : Ti.App.Properties.getInt('coupon', 0),
		totalNet : 0
	}, q;

	for (q in cart) {
		if (cart.hasOwnProperty(q)) {
			data.quantity += cart[q].quantity;
			data.count += 1;
			data.total += parseFloat(cart[q].price) * parseInt(cart[q].quantity, 10);
		}
	}

	data.totalNet = data.total - data.coupon;

	return data;
};

Ti.App.autoTextAlign = function(e) {

	if (e.value.length === 0) {
		e.source.setTextAlign(Ti.App.autoAlignHintext());
	} else {
		e.source.setTextAlign(Ti.UI.TEXT_ALIGNMENT_LEFT);
	}
};

Ti.App.autoAlignHintext = function() {
	if (Ti.Platform.getOsname() !== 'android') {
		return Ti.UI.TEXT_ALIGNMENT_RIGHT;
	}

	if (Ti.Platform.Android.API_LEVEL >= 14) {
		return Ti.UI.TEXT_ALIGNMENT_RIGHT;
	}

	return Ti.UI.TEXT_ALIGNMENT_LEFT;
};

Ti.App.getHttpRequest = function(action, loadCallBack, errorCallBack) {
	//http://www.asalbarri.com/asalbarri/asal/api/walletBalance/1/1

	Ti.App.fireEvent('showLoading');

	var xhr = Ti.Network.createHTTPClient({
		timeout : 45000
	});

	xhr.open('GET', Ti.App.APIURL + action);
	xhr.onerror = function() {
		Ti.App.fireEvent('hideLoading');

		Ti.UI.createAlertDialog({
			title : 'خطأ',
			message : 'خطا في الاتصال، تاكد من اتصال الانترنت لديك وحاول مرة اخرى',
			buttonNames : ['موافق']
		}).show();

		if ( typeof errorCallBack === 'function') {
			errorCallBack();
		}
	};

	xhr.onload = function() {
		try {
			var results = JSON.parse(this.responseText);
		} catch (e) {
			var results = this.responseText;
		}

		if ( typeof loadCallBack === 'function') {
			loadCallBack(results);
		}

		Ti.App.fireEvent('hideLoading');
	};

	xhr.send();
};

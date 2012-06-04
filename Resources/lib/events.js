var loading = null;
Ti.App.addEventListener('showLoading', function(e) {

	if (!loading) {
		var loading = require('lib/loading');
	}
	loading.show();

	Ti.App.addEventListener('hideLoading', function(e) {
		loading.hide();
	});
});

Ti.App.addEventListener('openLoginWindow', function() {

	var LoginWin = require('/ui/common/auth/loginWin');

	var loginWin = new LoginWin();
	Ti.App.orderTab.open(loginWin);

	Ti.App.addEventListener('closeLoginWindow', function(e) {

		Ti.App.orderTab.close(loginWin);
	});
});

Ti.App.addEventListener('openRegisterWindow', function(e) {
	var RegisterWin = require('/ui/common/auth/registerWin');

	var registerWin = new RegisterWin();

	Ti.App.orderTab.open(registerWin);

	Ti.App.addEventListener('closeRegisterWindow', function(e) {

		Ti.App.orderTab.close(registerWin);
	});
});

Ti.App.addEventListener('openForgetpasswordWindow', function(e) {

	var ForgetpasswordWin = require('/ui/common/auth/forgetpasswordWin');

	var forgetpasswordWin = new ForgetpasswordWin();

	Ti.App.orderTab.open(forgetpasswordWin);

	Ti.App.addEventListener('closeForgetpasswordWindow', function(e) {

		Ti.App.orderTab.close(forgetpasswordWin);
	});
});

Ti.App.addEventListener('addItem', function(e) {

	if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
		var addToCart = require('ui/ios/addToCart');

		var addtocart = new addToCart(e);
		addtocart.open();
	} else {
		var addToCart = require('ui/android/addToCart');
		var addtocart = new addToCart(e);
		addtocart.open();
	}

});

Ti.App.addEventListener('chekOut', function() {

	if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
		var CheckOut = require('ui/ios/chekOut');

		var checkOut = new CheckOut();

		navGroup.open(checkOut);
	} else {
		var CheckOut = require('ui/android/chekOut');

		var checkOut = new CheckOut();
		checkOut.open();
	}

	Ti.App.addEventListener('refreshCheckOutWin', function() {
		checkOut.fireEvent('refresh');
	});

	Ti.App.addEventListener('closeCheckoutWin', function(e) {

		if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {

			navGroup.close(checkOut);
		} else {
			checkOut.close();
		}
	});
});

Ti.App.addEventListener('order', function(e) {

	if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
		var Order = require('ui/ios/order');

		var order = new Order(e);
		navGroup.open(order);
	} else {
		var Order = require('ui/android/order');

		var order = new Order(e);
		order.open();

		Ti.App.addEventListener('fillAddressesPicker', function() {
			order.fireEvent('getAdresses');
		});

	}

	Ti.App.addEventListener('closeorderwin', function(e) {

		if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
			navGroup.close(order);

		} else {
			order.close();
		}
	});
});

Ti.App.addEventListener('openFolloworderWin', function(e) {

	if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
		var Follow = require('ui/ios/follow');

		var follow = new Follow();

		navGroup.open(follow);
	} else {

		var Follow = require('ui/android/follow');

		var follow = new Follow();

		follow.open();

	}

	Ti.App.addEventListener('closeFolloworderWin', function(e) {

		if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
			navGroup.close(follow);

		} else {
			follow.close();
		}
	});
});

Ti.App.addEventListener('refreshCatalogData', function(e) {
	refreshCatalogData()
});
function refreshCatalogData(callback) {

	if (Ti.App.Properties.hasProperty('lastUpdate')) {
		var alertWindow = Ti.UI.createAlertDialog({
			title : 'عروض جديدة',
			message : 'اضغط على تحديث للحصول على احدث العروض ومنتجات جديدة',
			cancel : 1,
			buttonNames : ['تحديث', 'رفض']
		});
	} else {
		var alertWindow = Ti.UI.createAlertDialog({
			title : 'اهلاً بك',
			message : 'يتضح انك اول مرة تستخدم البرنامج، اضغط على "تحميل العروض الجديدة" لتحميل احدث العروض والمنتجات الجديدة',
			buttonNames : ['تحميل العروض الجديدة']
		});
	}

	alertWindow.addEventListener('click', function(ev) {
		switch(ev.index) {
			case 0:
				var xhr = Ti.Network.createHTTPClient();

				xhr.onerror = function(e) {
					Ti.UI.createAlertDialog({
						message : 'خطآ في الآتصال',
						cancel : 0,
						buttonNames : ['ok']
					}).show();

					Ti.App.fireEvent('hideLoading');
				}
				xhr.onload = function() {

					var request = JSON.parse(this.responseText);

					function catalog_update(request) {
						if ((request.brands).length > 0)
							brands_update(request.brands);
						if ((request.categories).length > 0)
							categories_update(request.categories);
						if ((request.categories_brands).length > 0)
							categories_brands_update(request.categories_brands);
						if ((request.categories_vendors).length > 0)
							categories_vendors_update(request.categories_vendors);
						if ((request.products).length > 0)
							products_update(request.products);
						if ((request.sku).length > 0)
							sku_update(request.sku);
						if ((request.vendors).length > 0)
							vendors_update(request.vendors);
						if ((request.vendors_regions).length > 0)
							vendors_regions_update(request.vendors_regions);
						if ((request.qrcode).length > 0)
							qrcode_update(request.qrcode);
						if ((request.products_qr).length > 0)
							products_qr_update(request.products_qr);

						var d = new Date().getTime();
						Ti.App.Properties.setDouble("lastUpdate", d);
					}

					catalog_update(request);

					function brands_update(data) {
						Ti.App.myDB.execute('DELETE from brands');
						for (me in data) {
							Ti.App.myDB.execute('REPLACE INTO brands VALUES(?, ?, ?)', [data[me]['id'], data[me]['title'], data[me]['sort']]);
						}
					}

					function categories_update(data) {
						Ti.App.myDB.execute('DELETE from categories');
						for (me in data) {
							Ti.App.myDB.execute('REPLACE INTO categories VALUES(?, ?, ?, ?, ?)', [data[me]['id'], data[me]['parent'], data[me]['title'], 0, data[me]['sort']]);
						}
					}

					function categories_brands_update(data) {
						Ti.App.myDB.execute('DELETE from categories_brands');
						for (me in data) {
							Ti.App.myDB.execute('REPLACE INTO categories_brands VALUES(?, ?, ?)', [data[me]['id'], data[me]['categories_id'], data[me]['brands_id']]);
						}
					}

					function categories_vendors_update(data) {
						Ti.App.myDB.execute('DELETE from categories_vendors');
						for (me in data) {
							Ti.App.myDB.execute('REPLACE INTO categories_vendors VALUES(?, ?, ?)', [data[me]['vendors_id'], data[me]['id'], data[me]['categories_id']]);
						}
					}

					function products_update(data) {
						Ti.App.myDB.execute('DELETE from products');
						for (me in data) {
							Ti.App.myDB.execute('REPLACE INTO products VALUES(?,?, ?, ?, ?, ?)', [data[me]['sort'], data[me]['desc'], data[me]['id'], data[me]['categoriy'], data[me]['brand'], data[me]['name']]);
						}
					}

					function sku_update(data) {
						Ti.App.myDB.execute('DELETE from sku');
						for (me in data) {
							Ti.App.myDB.execute('REPLACE INTO sku VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?,?)', [data[me]['sort'], data[me]['out_of_stock'], data[me]['vendors_id'], data[me]['barcode'], data[me]['unit'], data[me]['quantity_type'], data[me]['price'], data[me]['title'], data[me]['product_id'], data[me]['id']]);
						}
					}

					function vendors_update(data) {
						Ti.App.myDB.execute('DELETE from vendors');
						for (me in data) {
							Ti.App.myDB.execute('REPLACE INTO vendors VALUES(?, ?, ?, ?, ?, ?)', [data[me]['tax'], data[me]['id'], data[me]['title'], 0, data[me]['first_order'], data[me]['last_order']]);
						}
					}

					function vendors_regions_update(data) {
						Ti.App.myDB.execute('DELETE from vendors_regions');
						for (me in data) {
							Ti.App.myDB.execute('REPLACE INTO vendors_regions VALUES(?, ?, ?, ?, ?)', [data[me]['fees'], data[me]['delivery_in'], data[me]['id'], data[me]['vendors_id'], data[me]['regions_id']]);
						}
					}

					function qrcode_update(data) {
						Ti.App.myDB.execute('DELETE from qrcode');
						for (me in data) {
							Ti.App.myDB.execute('REPLACE INTO qrcode VALUES(?, ?, ?)', [data[me]['id'], '', data[me]['value']]);
						}
					}

					function products_qr_update(data) {
						Ti.App.myDB.execute('DELETE from products_qr');
						for (me in data) {
							Ti.App.myDB.execute('REPLACE INTO products_qr VALUES(?, ?, ?)', [data[me]['id'], data[me]['qrcode_id'], data[me]['products_id']]);
						}
					}

					var fhr = Ti.Network.createHTTPClient();

					fhr.onerror = function(e) {
						Ti.UI.createAlertDialog({
							message : 'خطآ في الآتصال',
							cancel : 0,
							buttonNames : ['ok']

						}).show();
						Ti.App.fireEvent('hideLoading');
					}

					fhr.onload = function() {
						Ti.App.myDB.execute('DELETE from regions');

						var request = JSON.parse(this.responseText);
						for (me in request) {
							Ti.App.myDB.execute('REPLACE INTO regions VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [request[me]['id'], request[me]['parent'], request[me]['name'], 0, 0, 0, 0, 0]);
						}
						Ti.App.fireEvent('hideLoading');

						if ( typeof callback == 'function') {
							callback();
						}
					}
					fhr.open('POST', "https://api.eshtery.me/api/regions");
					fhr.send();

				}
				xhr.open('POST', "https://api.eshtery.me/api/catalog");
				Ti.App.fireEvent('showLoading');
				xhr.send();

				break;
			case 1:

				if ( typeof callback == 'function') {
					callback();
				}
				break;
		}

	});
	alertWindow.show();

}
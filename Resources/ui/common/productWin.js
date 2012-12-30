function productWin(product) {

	var self, mainScroll, productImg, titleLbl, quantityField, quantityMinusBtn, quantityPlusBtn, descLbl, addToCartBtn, cartImg;

	self = Ti.UI.createWindow({
		title : product.title,
		backgroundImage : '/images/bg.jpg',
		barImage : '/images/Navigation_Bar.jpg',
		barColor : 'gray'
	});

	mainScroll = Ti.UI.createScrollView();
	self.add(mainScroll);

	productImg = Ti.UI.createImageView({
		image : Ti.App.APIURL + 'api/pic/product/' + product.id + '/90/90/1',
		width : 85,
		height : 85,
		right : 10,
		borderRadius : 45,
		defaultImage : '/images/default.png',
		top : 10
	});

	productImg.addEventListener('click', function() {

		var FullscreenWinModule = require('ui/common/imageFullscreen');
		new FullscreenWinModule({
			title : product.title,
			productID : product.id
		}).open();
	});

	mainScroll.add(productImg);

	titleLbl = Ti.UI.createLabel({
		text : product.title,
		left : 0,
		right : 110,
		top : 12,
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		color : '#ffffff',
		font : {
			fontFamily : 'Arial',
			fontSize : 17,
			fontWeight : 'bold'
		}
	});
	mainScroll.add(titleLbl);

	quantityField = Ti.UI.createLabel({
		text : Ti.App.cartQuantityByProductID(product.id) > 0 ? Ti.App.cartQuantityByProductID(product.id) : 1,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : 55,
		height : 25,
		right : 210,
		top : 50,
		backgroundImage : '/images/bg_input_quantity.png'
	});

	mainScroll.add(quantityField);

	quantityMinusBtn = Ti.UI.createButton({
		title : '',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : 39,
		height : 24,
		right : 160,
		top : 50,
		backgroundImage : '/images/icon_min.png'
	});
	mainScroll.add(quantityMinusBtn);

	quantityPlusBtn = Ti.UI.createButton({
		title : '',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : 39,
		height : 24,
		right : 110,
		top : 50,
		backgroundImage : '/images/icon_plus.png'
	});
	mainScroll.add(quantityPlusBtn);

	// + and - buttons with product quantity
	function getQuantityFieldValue() {
		return parseInt(quantityField.getText(), 10);
	}

	function setQuantityFieldValue(newValue) {
		var value = parseInt(newValue, 10);

		// is it in minus ?
		if (value < 0) {
			value = 0;
		}

		// is it more then inventory quantity
		if (value > parseInt(product.quantity, 10)) {

			Ti.UI.createAlertDialog({
				title : 'الكمية لا تكفي',
				message : 'متوفر الان فقط ' + product.quantity + ' وحدة من هذا المنتج',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();

			value = parseInt(product.quantity, 10);
		}

		quantityField.setText(value);
	}

	function plusMinusBtnsOnClick(e) {

		var value = getQuantityFieldValue();

		if (parseInt(product.quantity, 10) <= 0) {

			Ti.UI.createAlertDialog({
				title : 'غير متوفر',
				message : 'عفواً هذا المنتج غير متوفر بالمخازن الان.'
			}).show();

			return false;
		}

		if (e.source.title === '+') {
			setQuantityFieldValue(value + 1);
		} else {
			setQuantityFieldValue(value - 1);
		}
	}


	quantityMinusBtn.addEventListener('click', plusMinusBtnsOnClick);
	quantityPlusBtn.addEventListener('click', plusMinusBtnsOnClick);

	addToCartBtn = Ti.UI.createButton({
		title : 'اضف لسلة التسوق',
		height : 33,
		width : '96%',
		left : '2%',
		top : 100,
		backgroundImage : '/images/button_ok.png',
		paddingLeft : 5,
		paddingRight : 5,
		color : '#000000'
	});

	addToCartBtn.addEventListener('click', function() {

		if (parseInt(product.quantity, 10) < getQuantityFieldValue()) {
			Ti.UI.createAlertDialog({
				title : 'عفوا',
				message : 'متوفر في مخازننا فقط ' + product.quantity + ' وحدة.',
				buttonNames : ['موافق']
			}).show();
			return;
		}

		Ti.App.fireEvent('cartAdd', {
			productID : product.id,
			productTitle : product.title,
			quantity : getQuantityFieldValue(),
			price : product.price,
			price_shown_coupon : product.price_shown_coupon
		});

		Ti.App.fireEvent('closeProductWindow');
		Ti.App.fireEvent('closeCategoryWindow');
		if (Ti.Platform.getOsname() === 'android') {
			Ti.App.myTabGroup.setActiveTab(Ti.App.cartTab);
		}
	});

	mainScroll.add(addToCartBtn);

	// description
	descLbl = Ti.UI.createLabel({
		text : product.desc,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
		color : '#000000',
		top : 140,
		left : '2%',
		width : '96%',
		height : 199,
		backgroundImage : '/images/textarea_bg.png',
		paddingLeft : 5,
		paddingRight : 5
	});
	mainScroll.add(descLbl);

	if (Ti.Platform.getOsname() == 'android') {

		self.activity.onCreateOptionsMenu = function(e) {
			var shareBtn = e.menu.add({
				title : 'نشر',
				icon : '/images/share_icon.png',
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM
			});

			shareBtn.addEventListener('click', function() {
				var activity = Ti.Android.currentActivity;
				var intent = Ti.Android.createIntent({
					action : Ti.Android.ACTION_SEND,
					type : 'text/plain'
				});

				intent.putExtra(Ti.Android.EXTRA_TEXT, product.title);
				intent.putExtra(Ti.Android.EXTRA_SUBJECT, product.title + "\n\n" + product.desc + "\n\nمزيد من المعلومات:\n http://www.asalbarri.com/asal-product-" + product.id + '.html');
				activity.startActivity(Ti.Android.createIntentChooser(intent, 'Share'));
			});
		};
	} else {

		var shareBtn = Ti.UI.createButton({
			image : '/images/share_icon.png',
			width : 40,
			height : 40,
			top : 350
		});
		mainScroll.add(shareBtn);

		var Social = require('dk.napp.social');
		var shareSocial = Ti.UI.createOptionDialog({
			title : 'Select Service',
			options : ['Facebook', 'Twitter', 'Cancel'],
			cancel : 2
		});

		shareSocial.addEventListener("click", function(e) {

			switch (e.index) {
				case 0:
					if (Social.isFacebookSupported()) {//min iOS6 required
						Social.facebook({
							text : product.title,
							url : 'http://www.asalbarri.com/asal-product-' + product.id + '.html'
						});
					} else {
						//implement Ti.Facebook Method - iOS5
					}

					break;
				case 1:
					if (Social.isTwitterSupported()) {//min iOS6 required
						Social.twitter({
							text : product.title,
							url : 'http://www.asalbarri.com/asal-product-' + product.id + '.html'
						});
					} else {
						//implement iOS5 Twitter method
					}
					break;
			}
		});

		shareBtn.addEventListener('click', function() {
			shareSocial.show();
		});
	}

	cartImg = Ti.UI.createImageView({
		image : '/images/icon_add_cart.png',
		width : 32,
		height : 30,
		right : 60,
		top : 100
	});
	mainScroll.add(cartImg);

	return self;
}

module.exports = productWin;

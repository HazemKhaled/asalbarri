function productWin(product) {

	var self, mainScroll, productImg, titleLbl, quantityField, quantityMinusBtn, quantityPlusBtn, descLbl, addToCartBtn, cartImg;

	self = Ti.UI.createWindow({
		title : product.title,
		backgroundImage : '/images/common/bg.jpg',
		barImage : '/images/common/Navigation_Bar.jpg',
		barColor : '#d3d3d3'
	});

	mainScroll = Ti.UI.createScrollView();
	self.add(mainScroll);

	productImg = Ti.UI.createImageView({
		image : Ti.App.APIURL + 'api/pic/product/' + product.id + '/90/90/1',
		width : '85dp',
		height : '85dp',
		right : '10dp',
		borderRadius : 45,
		defaultImage : '/images/common/default.png',
		top : '10dp'
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
		right : '110dp',
		top : '12dp',
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		color : '#ffffff',
		font : {
			fontFamily : 'Arial',
			fontSize : '17dp',
			fontWeight : 'bold'
		}
	});
	mainScroll.add(titleLbl);

	quantityField = Ti.UI.createLabel({
		text : Ti.App.cartQuantityByProductID(product.id) > 0 ? Ti.App.cartQuantityByProductID(product.id) : 1,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : '55dp',
		height : '25dp',
		right : '210dp',
		top : '50dp',
		backgroundImage : '/images/common/bg_input_quantity.png'
	});

	self.add(quantityField);

	quantityMinusBtn = Ti.UI.createButton({
		title : '-',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : '39dp',
		height : '24dp',
		right : '160dp',
		top : '50dp',
		backgroundImage : '/images/common/icon_min.png'
	});
	self.add(quantityMinusBtn);

	quantityPlusBtn = Ti.UI.createButton({
		title : '+',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : '39dp',
		height : '24dp',
		right : '110dp',
		top : '50dp',
		backgroundImage : '/images/common/icon_plus.png'
	});
	self.add(quantityPlusBtn);

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

	// description
	descLbl = Ti.UI.createLabel({
		text : product.desc,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
		color : '#000000',
		top : '140dp',
		left : '2%',
		width : '96%',
		height : '199dp',
		backgroundImage : '/images/common/textarea_bg.png',
		paddingLeft : '5dp',
		paddingRight : '5dp'
	});
	mainScroll.add(descLbl);

	// description
	addToCartBtn = Ti.UI.createButton({
		title : 'اضف لسلة التسوق',
		height : '33dp',
		width : '96%',
		left : '2%',
		top : '100dp',
		backgroundImage : '/images/common/button_ok.png',
		paddingLeft : '5dp',
		paddingRight : '5dp',
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
	});

	mainScroll.add(addToCartBtn);

	cartImg = Ti.UI.createImageView({
		image : '/images/common/icon_add_cart.png',
		width : '32dp',
		height : '30dp',
		right : '60dp',
		top : '100dp'
	});
	mainScroll.add(cartImg);

	return self;
}

module.exports = productWin;

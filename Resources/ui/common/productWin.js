function productWin(product) {
	var self = Ti.UI.createWindow({
		title : product.title,
		backgroundColor : 'white'
	});

	var mainScroll = Ti.UI.createScrollView();
	self.add(mainScroll);

	//var picWidth = Ti.Platform.displayCaps.platformWidth - 40;
	var productImg = Ti.UI.createImageView({
		image : Ti.App.APIURL + 'api/pic/product/' + product.id + '/90/90/1',
		width : '90dp',
		height : '90dp',
		top : '10dp',
		right : '10dp',
		borderRadius : 45
	});

	productImg.addEventListener('click', function() {

		var fullscreen = require('ui/common/imageFullscreen');
		new fullscreen({
			title : product.title,
			productID : product.id
		}).open();
	});

	mainScroll.add(productImg);

	// description
	var titleLbl = Ti.UI.createLabel({
		text : product.title,
		textAlign : 'right',
		color : '#000000',
		top : '20dp',
		right : '110dp',
		left : '10dp'
	});
	mainScroll.add(titleLbl);

	// + and - buttons with product quantity
	function getQuantityFieldValue() {
		return parseInt(quantityField.getValue());
	}

	function setQuantityFieldValue(newValue) {
		var value = parseInt(newValue);

		// is it in minus ?
		if (value < 0) {
			value = 0;
		}

		// is it more then inventory quantity
		if (value > parseInt(product.quantity)) {

			Ti.UI.createAlertDialog({
				title : 'الكمية لا تكفي',
				message : 'متوفر الان فقط ' + product.quantity + ' وحدة من هذا المنتج',
				cancel : 0,
				buttonNames : ['موافق']
			}).show();

			value = parseInt(product.quantity);
		}

		quantityField.setValue(value);
	}

	var quantityField = Ti.UI.createTextField({
		value : cartQuantityByProductID(product.id),
		textAlign : 'center',
		width : '50dp',
		height : '40dp',
		left : '10dp',
		top : '70dp',
		editable : false,
		enabled : false
	});

	quantityField.addEventListener('change', function(e) {
		setQuantityFieldValue(getQuantityFieldValue());
	});

	self.add(quantityField);

	var quantityMinusBtn = Ti.UI.createButton({
		title : '-',
		textAlign : 'center',
		width : '40dp',
		height : '40dp',
		left : '65dp',
		top : '70dp'
	});
	self.add(quantityMinusBtn);

	var quantityPlusBtn = Ti.UI.createButton({
		title : '+',
		textAlign : 'center',
		width : '40dp',
		height : '40dp',
		left : '110dp',
		top : '70dp'
	});
	self.add(quantityPlusBtn);

	function plusMinusBtnsOnClick(e) {

		var value = getQuantityFieldValue();

		if (parseInt(product.quantity) <= 0) {

			Ti.UI.createAlertDialog({
				title : 'غير متوفر',
				message : 'عفواً هذا المنتج غير متوفر بالمخازن الان.'
			}).show();

			return false;
		}

		if (e.source.title == '+') {
			setQuantityFieldValue(value + 1);
		} else {
			setQuantityFieldValue(value - 1);
		}
	}


	quantityMinusBtn.addEventListener('click', plusMinusBtnsOnClick);
	quantityPlusBtn.addEventListener('click', plusMinusBtnsOnClick);

	// description
	var descLbl = Ti.UI.createLabel({
		text : product.desc,
		textAlign : 'right',
		color : '#000000',
		top : '120dp',
		right : '10dp',
		left : '10dp'
	});
	mainScroll.add(descLbl);

	// description
	var addToCartBtn = Ti.UI.createButton({
		title : 'اضف لسلة التسوق',
		top : '180dp'
	});

	addToCartBtn.addEventListener('click', function() {
		Ti.App.fireEvent('cartAdd', {
			productID : product.id,
			productTitle : product.title,
			quantity : getQuantityFieldValue()
		});

		Ti.App.fireEvent('closeProductWindow');
	});

	mainScroll.add(addToCartBtn);

	return self;
};

module.exports = productWin;

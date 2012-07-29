function cartWin() {

	var self, orderBtn, actionBtnBar, tableHeaderView, productTable, CouponWinModule, auth, priceLblCurr, pricebackground, totalLable, totalText, descountlable, descount;

	self = Ti.UI.createWindow({
		title : 'سلة التسوق',
		backgroundImage : 'images/common/bg.jpg',
		barImage : 'images/common/Navigation_Bar.jpg',
		barColor : '#d3d3d3'
	});

	orderBtn = Ti.UI.createButton({
		title : 'شراء'
	});
	orderBtn.addEventListener('click', function() {

		auth = require('/lib/auth');
		if (auth.isLogedIn() === false) {

			Ti.App.fireEvent('closeLoginWindow');
			Ti.App.fireEvent('openLoginWindow');
			return;
		}

		Ti.App.fireEvent('openShippingWindow');
	});

	if (Ti.Platform.getOsname() === 'android') {
		self.add(orderBtn);
	} else {
		self.setRightNavButton(orderBtn);
	}

	actionBtnBar = Ti.UI.createButtonBar({
		labels : ['تفريغ', 'كوبون خصم'],
		height : '35dp'
	});
	actionBtnBar.addEventListener('click', function(e) {

		switch (e.index) {
			case 0 :
				var confirmDialog = Ti.UI.createAlertDialog({
					title : 'متاكد',
					message : 'سيتم افراغ سلة التسوق؟',
					buttonNames : ['موافق', 'لا'],
					cancel : 1
				});

				confirmDialog.addEventListener('click', function(ec) {
					if (ec.index === 0) {
						Ti.App.fireEvent('cartEmpty');
						self.fireEvent('focus');
					}
				});

				confirmDialog.show();
				break;

			case 1 :

				CouponWinModule = require('/ui/common/couponWin');
				new CouponWinModule().open();
				break;
		}
	});

	tableHeaderView = Ti.UI.createView({
		height : '44dp'
	});
	tableHeaderView.add(actionBtnBar);

	productTable = Ti.UI.createTableView({
		backgroundColor : 'transparent',
		separatorColor : 'transparent',
		headerView : tableHeaderView
	});

	self.add(productTable);

	self.addEventListener('focus', function() {

		var rows, i, rowView, img, titleLbl, priceLbl, priceRowLbl, quantityLbl, rowViewArray = [], total = 0, coupon;

		rows = Ti.App.Properties.getObject('cart', {});

		for (i in rows) {
			if (rows.hasOwnProperty(i)) {
				//console.log(rows[i]);
				rowView = Ti.UI.createTableViewRow({
					height : '95dp',
					myTitle : rows[i].title,
					data : rows[i],
					className : 'cartRow',
					backgroundImage : 'images/common/TableViewRowBG.png',
					selectedBackgroundImage : 'images/common/TableViewRowSelectedBG.png'
				});

				img = Ti.UI.createImageView({
					image : Ti.App.APIURL + 'api/pic/product/' + rows[i].id + '/100/100/1',
					width : '85dp',
					height : '85dp',
					right : '10dp',
					borderRadius : 45,
					defaultImage : 'images/common/default.png'
				});
				rowView.add(img);

				titleLbl = Ti.UI.createLabel({
					text : rows[i].title,
					left : '10dp',
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
				rowView.add(titleLbl);

				pricebackground = Titanium.UI.createImageView({
					image : "images/common/bg_price.png",
					bottom : "11dp",
					right : "110dp",
					width : "auto",
					height : "auto"
				});
				rowView.add(pricebackground);

				priceLbl = Ti.UI.createLabel({
					text : rows[i].price,
					right : '120dp',
					width : '60dp',
					bottom : '27dp',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					font : {
						fontFamily : 'Arial',
						fontSize : '17dp',
						fontWeight : 'bold'
					}
				});
				rowView.add(priceLbl);

				priceLblCurr = Ti.UI.createLabel({
					text : Ti.App.Properties.getString('currencyName'),
					right : '110dp',
					width : '80dp',
					bottom : '16dp',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					font : {
						fontFamily : 'Arial',
						fontSize : '14dp'
					}
				});
				rowView.add(priceLblCurr);

				total += parseFloat(rows[i].price) * parseInt(rows[i].quantity, 10);
				priceRowLbl = Ti.UI.createLabel({
					text : parseFloat(rows[i].price) * parseInt(rows[i].quantity, 10),
					color : '#ffffff',
					left : '10dp',
					bottom : '10dp',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				});
				//rowView.add(priceRowLbl);

				quantityLbl = Ti.UI.createLabel({
					text : rows[i].quantity,
					textAlign : 'center',
					width : '55dp',
					height : '25dp',
					right : '205dp',
					top : '50dp',
					backgroundImage : 'images/common/bg_input_quantity.png'
				});
				rowView.add(quantityLbl);

				rowViewArray.push(rowView);
			}

		}

		coupon = Ti.App.Properties.getInt('coupon', 0);

		if (total > 0) {
			if (coupon > 0) {

				var rowView2 = Ti.UI.createTableViewRow({
					height : '35dp',
				});

				descountlable = Ti.UI.createLabel({
					text : 'قيمة الخصم  ',
					color : '#ffffff',
					textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
					font : {
						fontFamily : 'Arial',
						fontSize : '18dp',
						fontWeight : 'bold'
					},
					right : '10dp'
				});
				rowView2.add(descountlable);

				descount = Ti.UI.createLabel({
					text : ' ' + coupon + ' ' + Ti.App.Properties.getString('currencyName'),
					color : '#ffffff',
					textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
					font : {
						fontFamily : 'Arial',
						fontSize : '17dp'
					},
					right : '100dp',
					width : '150dp',
					height : '27dp',
					backgroundImage : 'images/common/button_discount_enter.png'
				});
				rowView2.add(descount);

				rowViewArray.push(rowView2);
			}

			var rowView3 = Ti.UI.createTableViewRow({
				height : '35dp'
			});

			total = total - coupon < 0 ? 0 : total - coupon;
			totalLable = Ti.UI.createLabel({
				text : 'الإجمالي  ',
				color : '#ffffff',
				textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
				font : {
					fontFamily : 'Arial',
					fontSize : '18dp',
					fontWeight : 'bold'
				},
				right : '10dp'
			});
			rowView3.add(totalLable);

			totalText = Ti.UI.createLabel({
				text : ' ' + total + ' ' + Ti.App.Properties.getString('currencyName'),
				color : '#ffffff',
				textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
				font : {
					fontFamily : 'Arial',
					fontSize : '17dp'
				},
				right : '100dp',
				width : '150dp',
				height : '27dp',
				backgroundImage : 'images/common/bg_total_account.png'
			});
			rowView3.add(totalText);

			rowViewArray.push(rowView3);
		}

		if (rowViewArray.length === 0) {// cart is empty

			rowViewArray.push(Ti.UI.createTableViewRow({
				title : 'سلة التسوق فارغة',
				color : '#ffffff'
			}));
		}

		productTable.setData(rowViewArray);
	});

	return self;
}

module.exports = cartWin;

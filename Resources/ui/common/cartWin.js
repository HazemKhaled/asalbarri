function cartWin() {
	var self = Ti.UI.createWindow({
		title : 'سلة التسوق',
		backgroundColor : 'white'
	});

	var orderBtn = Ti.UI.createButton({
		title : 'شراء'
	});
	orderBtn.addEventListener('click', function() {
		alert('soon');
	});

	self.setRightNavButton(orderBtn);

	var actionBtnBar = Ti.UI.createButtonBar({
		labels : ['تفريغ', 'كوبون خصم'],
		height : '35dp'
	});
	actionBtnBar.addEventListener('click', function(e) {

		if (e.index == 0) {
			var confirmDialog = Ti.UI.createAlertDialog({
				title : 'متاكد',
				message : 'سيتم افراغ سلة التسوق؟',
				buttonNames : ['موافق', 'لا'],
				cancel : 1
			});

			confirmDialog.addEventListener('click', function(ec) {
				if (ec.index == 0) {
					Ti.App.fireEvent('cartEmpty');
				}
			});

			confirmDialog.show();
		}
	});

	var tableHeaderView = Ti.UI.createView({
		height : '44dp'
	});
	tableHeaderView.add(actionBtnBar);

	var productTable = Ti.UI.createTableView({
		headerView : tableHeaderView,
		footerView : Ti.UI.createView({
			height : '40dp',
			backgroundColor : 'red'
		}),
	});

	self.add(productTable);

	self.addEventListener('focus', function() {

		var rows = Ti.App.Properties.getObject('cart', {});

		for (i in rows ) {
			console.log(rows);
			var rowView = Ti.UI.createTableViewRow({
				height : '110dp',
				myTitle : rows[i].title,
				data : rows[i]
			});

			var img = Ti.UI.createImageView({
				image : Ti.App.APIURL + 'api/pic/product/' + rows[i].id + '/100/100/1',
				width : '100dp',
				height : '100p',
				right : '5dp'
			});
			rowView.add(img);

			var titleLbl = Ti.UI.createLabel({
				text : rows[i].title,
				height : 'auto',
				left : 0,
				right : '110dp',
				top : '10dp',
				textAlign : 'right'
			});
			rowView.add(titleLbl);

			productTable.add(rowView);
		}
	});

	return self;
};

module.exports = cartWin;

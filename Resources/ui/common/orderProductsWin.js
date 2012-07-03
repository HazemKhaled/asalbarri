function orderProductsWin(parent) {
	var self = Ti.UI.createWindow({
		title : 'تفاصيل الطب',
		backgroundColor : 'white',
		backButtonTitle : 'طلباتي'
	});

	function filterData() {

		table.fireEvent('runLoading');

		var tableRows = [];

		var xhr = Ti.Network.createHTTPClient();

		xhr.open('GET', Ti.App.APIURL + 'api/productsByOrderID/' + parent.id);

		xhr.onerror = function() {
			table.fireEvent('reloadData', {
				rows : []
			});
		}

		xhr.onload = function() {
			var rows = JSON.parse(this.responseText);

			for (i in rows ) {
				var row = Ti.UI.createTableViewRow({
					height : '110dp',
					//hasChild : true,
					myTitle : rows[i].title,
					data : rows[i]
				});

				var img = Ti.UI.createImageView({
					image : Ti.App.APIURL + 'api/pic/cat/' + rows[i].id + '/100/100/1',
					width : '100dp',
					height : '100p',
					right : '5dp'
				});
				row.add(img);

				var titleLbl = Ti.UI.createLabel({
					text : rows[i].title,
					height : 'auto',
					left : 0,
					right : '110dp',
					top : '10dp',
					color : '#000000',
					textAlign : 'right'
				});
				row.add(titleLbl);

				var purchasesQtyLbl = Ti.UI.createLabel({
					text : 'الكمية : ',
					height : 'auto',
					left : 0,
					right : '110dp',
					top : '35dp',
					textAlign : 'right'
				});
				row.add(purchasesQtyLbl);

				var purchasesQty = Ti.UI.createLabel({
					text : rows[i].purchases_quantity,
					height : 'auto',
					left : 0,
					right : '190dp',
					top : '35dp',
					textAlign : 'right'
				});
				row.add(purchasesQty);

				var priceLbl = Ti.UI.createLabel({
					text : 'سعر الوحدة : ',
					height : 'auto',
					left : 0,
					right : '110dp',
					top : '60dp',
					textAlign : 'right'
				});
				row.add(priceLbl);

				var price = Ti.UI.createLabel({
					text : rows[i].purchases_unit_price + ' ' + Ti.App.Properties.getString('currencyName'),
					height : 'auto',
					left : 0,
					right : '190dp',
					top : '60dp',
					textAlign : 'right'
				});
				row.add(price);

				tableRows.push(row);
			}

			table.fireEvent('reloadData', {
				rows : tableRows
			});
		};

		xhr.send();
	}

	var search = Ti.UI.createSearchBar({
		hintText : 'بحث'
	});

	var table = Ti.UI.createTableView({
		height : 'auto',
		//search : search,
		filterAttribute : 'myTitle',
		//searchHidden : true
	});

	table.addEventListener('cleartable', function() {

		if (this.data.length > 0) {
			for (var i = this.data[0].rows.length - 1; i >= 0; i--) {
				this.deleteRow(i);
			}
		}

	});

	table.addEventListener('runLoading', function() {
		this.setData([{
			title : 'جاري التحميل ....'
		}]);
	});
	table.addEventListener('reloadData', function(e) {
		this.setData(e.rows.length > 0 ? e.rows : [{
			title : 'لا يوجد نتائج هنا في الوقت الحالي !!'
		}]);
	});

	filterData();

	Ti.App.orderProductsTable = table;

	self.add(table);
	return self;
};

module.exports = orderProductsWin;

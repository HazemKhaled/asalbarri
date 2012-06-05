function productsListWin(parent) {
	var self = Ti.UI.createWindow({
		title : parent.title,
		backgroundColor : 'white',
		backButtonTitle : 'عودة'
	});

	function filterData() {

		table.fireEvent('runLoading');

		var tableRows = [];

		var xhr = Ti.Network.createHTTPClient();

		xhr.open('GET', Ti.App.APIURL + 'api/productsByCatID/' + parent.id);

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
					image : Ti.App.APIURL + 'api/pic/product/' + rows[i].id + '/100/100/1',
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
					textAlign : 'right'
				});
				row.add(titleLbl);

				if (rows[i].price_shown_coupon) {
					var priceFitLbl = Ti.UI.createWebView({
						html : '<html><body style="margin: 0; direction: rtl;"><div style="text-decoration: line-through; ">' + rows[i].price + '</div></body></html>',
						height : '20dp',
						width : '30dp',
						right : '160dp',
						bottom : '10dp',
					});
					row.add(priceFitLbl);

					var priceLbl = Ti.UI.createLabel({
						text : rows[i].price_shown_coupon,
						height : 'auto',
						right : '110dp',
						bottom : '10dp',
						textAlign : 'right'
					});
				}

				var priceLbl = Ti.UI.createLabel({
					text : rows[i].price,
					height : 'auto',
					right : '110dp',
					bottom : '10dp',
					textAlign : 'right'
				});
				row.add(priceLbl);

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

	table.addEventListener('click', function(e) {

		if (e.rowData.data) {

			Ti.App.fireEvent('openProductWindow', {
				data : e.rowData.data
			});
		}
	});

	self.add(table);
	return self;
};

module.exports = productsListWin;

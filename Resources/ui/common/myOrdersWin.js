function myOrdersWin() {
	var self = Ti.UI.createWindow({
		title : 'طلباتي',
		backgroundColor : 'white'
	});

	function filterData() {

		table.fireEvent('runLoading');

		var tableRows = [];

		var xhr = Ti.Network.createHTTPClient();

		xhr.open('GET', Ti.App.APIURL + 'api/ordersByUserID/1' + Ti.App.properties.userID);

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

				var dateTitleLbl = Ti.UI.createLabel({
					text : 'التاريخ : ',
					height : 'auto',
					left : 0,
					right : '10dp',
					top : '10dp',
					textAlign : 'right'
				});
				row.add(dateTitleLbl);

				var dateLbl = Ti.UI.createLabel({
					text : rows[i].date,
					height : 'auto',
					left : 0,
					right : '65dp',
					top : '10dp',
					textAlign : 'right'
				});
				row.add(dateLbl);

				var totaltitleLbl = Ti.UI.createLabel({
					text : 'الاجمالي : ',
					height : 'auto',
					right : '10dp',
					top : '35dp',
					textAlign : 'right'
				});
				row.add(totaltitleLbl);

				var priceLbl = Ti.UI.createLabel({
					text : rows[i].total_price + ' ' + Ti.App.properties.currencyName,
					height : 'auto',
					right : '75dp',
					top : '35dp',
					textAlign : 'right'
				});
				row.add(priceLbl);

				var statusTitleLbl = Ti.UI.createLabel({
					text : 'حالة الطلب : ',
					height : 'auto',
					right : '10dp',
					top : '60dp',
					textAlign : 'right'
				});
				row.add(statusTitleLbl);

				var statustxt = '';
				if (rows[i].status == '0')
					statustxt = 'لم يتم البدأ';
				else if(rows[i].status == '1')
					statustxt = 'جاري الشحن';
				else if(rows[i].status == '2')
					statustxt = 'تم الوصول';

				var statusLbl = Ti.UI.createLabel({
				text : statustxt ,
				height : 'auto',
				right : '85dp',
				top : '60dp',
				textAlign : 'right'
				});
				row.add(statusLbl);

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
			title : 'مشكلة تحميل، حاول بعد قليل.'
		}]);
	});

	table.addEventListener('click', function(e) {

		if (e.rowData.data) {

			Ti.App.fireEvent('openOrderProductsWindow', {
				data : e.rowData.data
			});
		}
	});

	self.add(table);

	self.addEventListener('focus', function() {

		var auth = require('/lib/auth');
		Ti.App.fireEvent('closeLoginWindow');
		if (!auth.isLogedIn() && false) {

			Ti.App.fireEvent('openLoginWindow');
		} else {
			filterData();
		}

	});

	return self;
};

module.exports = myOrdersWin;

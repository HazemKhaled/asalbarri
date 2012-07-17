function productsListWin(parent) {

	var self, tableView;
	self = Ti.UI.createWindow({
		title : parent.title,
		backButtonTitle : 'عودة',
		backgroundImage : 'images/common/bg.jpg',
		barImage : 'images/common/Navigation_Bar.jpg',
		barColor : '#d3d3d3'
	});

	function filterData() {

		tableView.fireEvent('runLoading');

		var tableRows = [], xhr;

		xhr = Ti.Network.createHTTPClient();

		xhr.open('GET', Ti.App.APIURL + 'api/productsByCatID/' + parent.id + '/' + Ti.App.Properties.getInt('currency'));

		xhr.onerror = function() {
			tableView.fireEvent('reloadData', {
				rows : []
			});
		};

		xhr.onload = function() {
			var rows, i, row, img, titleLbl, purchasesQtyLbl, priceFitLbl, priceLbl, arrow, pricebackground, priceLblCurr, priceFitLbl;

			rows = JSON.parse(this.responseText);

			for (i in rows) {
				if (rows.hasOwnProperty(i)) {
					row = Ti.UI.createTableViewRow({
						height : '95dp',
						myTitle : rows[i].title,
						data : rows[i],
						backgroundImage : 'images/common/TableViewRowBG.png',
						selectedBackgroundImage : 'images/common/TableViewRowSelectedBG.png'
					});

					img = Ti.UI.createImageView({
						image : Ti.App.APIURL + 'api/pic/product/' + rows[i].id + '/100/100/1',
						width : '85dp',
						height : '85dp',
						right : '10dp',
						borderRadius : 45
					});
					row.add(img);

					arrow = Titanium.UI.createImageView({
						image : "images/common/icon_7.png",
						top : "6dp",
						left : "0dp",
						width : "auto",
						height : "auto"
					});
					row.add(arrow);

					titleLbl = Ti.UI.createLabel({
						text : rows[i].title,
						left : 0,
						right : '110dp',
						top : '10dp',
						textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
						color : '#ffffff',
						font : {
							fontFamily : 'Arial',
							fontSize : '17dp',
							fontWeight : 'bold'
						}
					});
					row.add(titleLbl);

					if (rows[i].price_shown_coupon > 0) {

						pricebackground = Titanium.UI.createImageView({
							image : "images/common/sss.png",
							bottom : "11dp",
							right : "110dp",
							width : "auto",
							height : "auto"
						});
						row.add(pricebackground);

						priceFitLbl = Ti.UI.createLabel({
							text : rows[i].price_shown_coupon,
							right : '205dp',
							width : '60dp',
							bottom : '27dp',
							textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
							color : '#ffffff',
							font : {
								fontFamily : 'Arial',
								fontSize : '17dp',
								fontWeight : 'bold'
							}
						});
						row.add(priceFitLbl);

						priceFitLblCurr = Ti.UI.createLabel({
							text : Ti.App.Properties.getString('currencyName'),
							right : '195dp',
							width : '80dp',
							bottom : '16dp',
							color : '#ffffff',
							textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
							font : {
								fontFamily : 'Arial',
								fontSize : '14dp'
							}
						});
						row.add(priceFitLblCurr);
					} else {

						pricebackground = Titanium.UI.createImageView({
							image : "images/common/bg_price_2.png",
							bottom : "11dp",
							right : "110dp",
							width : "auto",
							height : "auto"
						});
						row.add(pricebackground);
					}

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
					row.add(priceLbl);

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
					row.add(priceLblCurr);

					tableRows.push(row);
				}
			}

			tableView.fireEvent('reloadData', {
				rows : tableRows
			});
		};

		xhr.send();
	}

	tableView = Ti.UI.createTableView({
		filterAttribute : 'myTitle',
		backgroundColor : 'transparent',
		separatorColor : 'transparent'
	});

	tableView.addEventListener('runLoading', function() {
		this.setData([{
			title : 'جاري التحميل ....',
			color : '#ffffff'
		}]);
	});
	tableView.addEventListener('reloadData', function(e) {
		this.setData(e.rows.length > 0 ? e.rows : [{
			title : 'مشكلة تحميل، حاول بعد قليل.',
			color : '#ffffff'
		}]);
	});
	filterData();

	tableView.addEventListener('click', function(e) {

		if (e.rowData.data) {

			Ti.App.fireEvent('openProductWindow', {
				data : e.rowData.data
			});
		}
	});

	self.add(tableView);
	return self;
}

module.exports = productsListWin;

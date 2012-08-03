function myOrdersWin() {

	var self, tableView, auth = require('/lib/auth'), rows, i, row, dateTitleLbl, dateLbl, totaltitleLbl, priceLbl, statusTitleLbl, statustxt = '', statusLbl, loginBtn, msgLabel, submitBtn;

	self = Ti.UI.createWindow({
		title : 'طلباتي',
		backgroundImage : '/images/bg.jpg',
		barImage : '/images/Navigation_Bar.jpg',
		barColor : '#d3d3d3'
	});

	Ti.App.addEventListener('showMyordersAfterLogin', function() {

		function filterData() {

			tableView.fireEvent('runLoading');

			var tableRows = [], xhr;

			xhr = Ti.Network.createHTTPClient();

			xhr.open('GET', Ti.App.APIURL + 'api/ordersByUserID/1/' + Ti.App.Properties.getInt('userID') + '/' + Ti.App.Properties.getInt('currency'));

			xhr.onerror = function() {
				tableView.fireEvent('reloadData', {
					rows : []
				});
			};

			xhr.onload = function() {

				rows = JSON.parse(this.responseText);

				for (i in rows ) {
					if (rows.hasOwnProperty(i)) {
						row = Ti.UI.createTableViewRow({
							height : 95,
							myTitle : rows[i].title,
							data : rows[i],
							className : 'myOrderRow',
							backgroundImage : '/images/TableViewRowBG.png',
							selectedBackgroundImage : '/images/TableViewRowSelectedBG.png'
						});

						arrow = Titanium.UI.createImageView({
							image : '/images/icon_7.png',
							top : 6,
							left : 0,
							width : 23,
							height : 79
						});
						row.add(arrow);

						totaltitleLbl = Ti.UI.createLabel({
							text : 'الاجمالي : ',
							right : 10,
							top : 10,
							textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
							color : '#ffffff',
							font : {
								fontFamily : 'Arial',
								fontSize : 17,
								fontWeight : 'bold'
							}
						});
						row.add(totaltitleLbl);

						priceLbl = Ti.UI.createLabel({
							text : rows[i].total_price + ' ' + Ti.App.Properties.getString('currencyName'),
							right : 85,
							top : 10,
							textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
							color : '#ffffff',
							font : {
								fontFamily : 'Arial',
								fontSize : 17,
								fontWeight : 'bold'
							}
						});
						row.add(priceLbl);

						datebackground = Titanium.UI.createImageView({
							image : '/images/bg_time.png',
							top : 38,
							right : 0,
							width : 239,
							height : 22
						});
						row.add(datebackground);

						dateTitleLbl = Ti.UI.createLabel({
							text : 'التاريخ : ',
							left : 0,
							right : 10,
							top : 38,
							textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
							color : '#ffffff',
							font : {
								fontFamily : 'Tahoma',
								fontSize : 15
							}
						});
						row.add(dateTitleLbl);

						dateLbl = Ti.UI.createLabel({
							text : rows[i].date,
							left : 0,
							right : 60,
							top : 38,
							textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
							color : '#ffffff',
							font : {
								fontFamily : 'Tahoma',
								fontSize : 15
							}
						});
						row.add(dateLbl);

						statusTitleLbl = Ti.UI.createLabel({
							text : 'حالة الطلب : ',
							right : 10,
							top : 63,
							textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
							color : '#ffffff',
							font : {
								fontFamily : 'Tahoma',
								fontSize : 15
							}
						});
						row.add(statusTitleLbl);

						statustxt = '';
						if (rows[i].status === '0') {
							statustxt = 'لم يتم البدأ';
						} else if (rows[i].status === '1') {
							statustxt = 'جاري الشحن';
						} else if (rows[i].status === '2') {
							statustxt = 'تم الوصول';
						}

						if (rows[i].url) {
							statustxt += ' (اضغط لمتابعة الشحن)';
						}

						statusLbl = Ti.UI.createLabel({
							text : statustxt,
							right : 80,
							top : 63,
							textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
							color : '#ffffff',
							font : {
								fontFamily : 'Tahoma',
								fontSize : 15
							}
						});
						row.add(statusLbl);

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
				title : 'لا يوجد طلبات في الوقت الحالي !!',
				color : '#ffffff'
			}]);
		});

		tableView.addEventListener('click', function(e) {

			if (e.rowData.data) {

				Ti.App.fireEvent('openOrderProductsWindow', {
					data : e.rowData.data
				});
			}
		});

		self.add(tableView);

		filterData();

		submitBtn = Ti.UI.createButton({
			title : 'تحديث'
		});

		submitBtn.addEventListener('click', function() {
			filterData();
		});
		if (Ti.Platform.getOsname() === 'android') {
			submitBtn.bottom = 4;
			submitBtn.height = 33;
			submitBtn.width = '90%';
			submitBtn.color = '#ffffff';
			submitBtn.backgroundImage = '/images/button_ok.png';

			self.add(submitBtn);
		} else {
			self.setRightNavButton(submitBtn);
		}
		//setInterval(function(){filterData()},20000);

		self.remove(loginBtn);
		self.remove(msgLabel);
	});

	Ti.App.addEventListener('showMyordersBeforLogin', function() {

		msgLabel = Ti.UI.createLabel({
			text : 'يرجى تسجيل الدخول',
			width : '100%',
			top : 40,
			color : '#ffffff',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : {
				fontFamily : 'Arial',
				fontSize : 17,
				fontWeight : 'bold'
			}
		});
		self.add(msgLabel);

		loginBtn = auth.loginBtn(Ti.UI.createButton({
			title : 'تسجيل دخول',
			top : 40,
			height : 33,
			width : '90%',
			left : '5%',
			backgroundImage : '/images/button_ok.png',
			color : '#ffffff'
		}));

		self.add(loginBtn);

		self.remove(tableView);
		self.remove(dateTitleLbl);
		self.remove(dateLbl);
		self.remove(totaltitleLbl);
		self.remove(priceLbl);
		self.remove(statusTitleLbl);
		self.remove(statusLbl);
		self.remove(submitBtn);
	});

	if (!auth.isLogedIn()) {

		Ti.App.fireEvent('showMyordersBeforLogin');
	} else {

		Ti.App.fireEvent('showMyordersAfterLogin');
	}
	return self;
}

module.exports = myOrdersWin;

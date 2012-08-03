function categoryWin(parent) {

	var self, menu, aboutBtn, backBtn, settingBtn, optionsDialogOpts, dialog, auth, tableView;

	self = Ti.UI.createWindow({
		title : parent.title || 'عسل بري',
		backButtonTitle : 'عودة',
		backgroundImage : '/images/bg.jpg',
		barImage : '/images/Navigation_Bar.jpg',
		barColor : '#d3d3d3'
	});

	//openAboutWindow
	if (Ti.Platform.getOsname() === 'android') {
		self.activity.onCreateOptionsMenu = function(e) {
			aboutBtn = e.menu.add({
				title : 'اعدادات',
				icon : '/images/icon_1.png'
			});

			aboutBtn.addEventListener('click', function() {
				dialog.show();
			});

			aboutBtn = e.menu.add({
				title : 'عن عسل بري',
				icon : '/images/icon_2.png'
			});

			aboutBtn.addEventListener('click', function() {
				Ti.App.fireEvent('openAboutWindow');
			});
		};
	} else {
		aboutBtn = Ti.UI.createButton({
			height : 31,
			width : 31,
			color : '#000000',
			backgroundImage : '/images/icon_2.png'
		});

		aboutBtn.addEventListener('click', function() {
			Ti.App.fireEvent('openAboutWindow');
		});
		if (!parent.id) {// only on home window
			self.setLeftNavButton(aboutBtn);
		}
		//openSettingWindow
		settingBtn = Ti.UI.createButton({
			height : 31,
			width : 31,
			color : '#000000',
			backgroundImage : '/images/icon_1.png'
		});
		settingBtn.addEventListener('click', function() {
			dialog.show();
		});

		self.setRightNavButton(settingBtn);
	}

	// options dialog
	optionsDialogOpts = {
		options : ['تسجيل دخول', 'تسجيل جديد', Ti.App.Properties.getString('currencyName') + ' (تغيير)', 'اغلاق'],
		cancel : 3,
		title : 'اعدادات'
	};

	dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);

	auth = require('/lib/auth');
	if (auth.isLogedIn() !== false) {
		dialog.options = ['تسجيل خروج', 'بيانات المستخدم', Ti.App.Properties.getString('currencyName') + ' (تغيير)', 'اغلاق'];
		dialog.destructive = 0;
	}

	// add event listener
	dialog.addEventListener('click', function(e) {
		//aboutBtn.title = 'You selected ' + e.index;
		if (auth.isLogedIn() === false) {
			switch(e.index) {
				case 0:

					Ti.App.fireEvent('openLoginWindow');
					break;
				case 1:

					Ti.App.fireEvent('openRegisterWindow');
					break;
				case 2:

					Ti.App.fireEvent('openCurrencyWindow');
					break;
			}
		} else {
			switch(e.index) {
				case 0:

					Ti.App.Properties.removeProperty('userID');
					Ti.App.fireEvent('cartEmpty');
					Ti.App.fireEvent('showWalletBeforLogin');
					Ti.App.fireEvent('showMyordersBeforLogin');
					Ti.App.fireEvent('closeOrderProductsWindow');
					Ti.App.dialog.destructive = null;
					Ti.App.dialog.options = ['تسجيل دخول', 'تسجيل جديد', Ti.App.Properties.getString('currencyName') + ' (تغيير)', 'اغلاق'];
					break;
				case 1:

					var userNameMsg = Ti.UI.createAlertDialog({
						title : 'بيانات المستخدم',
						message : 'العضو الحالي هو : ' + Ti.App.Properties.getString('userName')
					});
					userNameMsg.show();
					break;
				case 2:

					Ti.App.fireEvent('openCurrencyWindow');
					break;
			}
		}
	});

	Ti.App.dialog = dialog;

	// called after recive new data, from main request or if we want to add remote search
	function filterData() {

		var tableRows = [], xhr;

		tableView.fireEvent('runLoading');

		xhr = Ti.Network.createHTTPClient();

		xhr.open('GET', Ti.App.APIURL + 'api/catsByID/' + parent.id);

		xhr.onerror = function() {
			tableView.fireEvent('reloadData', {
				rows : []
			});

			self.addEventListener('focus', filterData);
		};

		xhr.onload = function() {

			var rows, i, row, arrow, img, titleLbl, titleLbl2;

			self.removeEventListener('focus', filterData);

			rows = JSON.parse(this.responseText);

			for (i in rows ) {
				if (rows.hasOwnProperty(i)) {
					row = Ti.UI.createTableViewRow({
						height : 95,
						myTitle : rows[i].title,
						data : rows[i],
						className : 'categoryRow',
						backgroundImage : '/images/TableViewRowBG.png',
						selectedBackgroundImage : '/images/TableViewRowSelectedBG.png'
					});

					arrow = Titanium.UI.createImageView({
						image : '/images/icon_7.png',
						left : 0,
						width : 23,
						height : 79
					});
					row.add(arrow);

					img = Ti.UI.createImageView({
						image : Ti.App.APIURL + 'api/pic/cat/' + rows[i].id + '/100/100/1',
						width : 85,
						height : 85,
						right : 10,
						borderRadius : 45,
						defaultImage : '/images/default.png'
					});
					row.add(img);

					titleLbl = Ti.UI.createLabel({
						text : rows[i].title,
						left : 10,
						right : 110,
						top : 23,
						textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
						color : '#ffffff',
						font : {
							fontFamily : 'Arial',
							fontSize : 17,
							fontWeight : 'bold'
						}
					});
					row.add(titleLbl);

					if (rows[i].products_count > 0) {
						titleLbl = Ti.UI.createLabel({
							text : rows[i].products_count,
							bottom : 10,
							right : 110,
							color : 'red',
							height : 23,
							top : 50,
							width : 43,
							backgroundImage : '/images/bg_product_quantity.png',
							font : {
								fontSize : 16
							},
							textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
						});
						row.add(titleLbl);

						titleLbl2 = Ti.UI.createLabel({
							text : ' منتج',
							left : 10,
							bottom : 10,
							right : 155,
							color : '#ffffff',
							top : 30,
							font : {
								fontSize : 16
							},
							textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT
						});
						row.add(titleLbl2);

					}

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
			title : 'لا يوجد نتائج هنا في الوقت الحالي !!',
			color : '#ffffff'
		}]);
	});

	self.addEventListener('open', function() {
		filterData();
	});

	tableView.addEventListener('click', function(e) {

		if (e.rowData.data) {

			if (e.rowData.data.sub_cats_count > 0) {
				Ti.App.fireEvent('openCategoryWindow', {
					parent : e.rowData.data
				});
			} else if (e.rowData.data.products_count > 0) {
				Ti.App.fireEvent('openProductListWindow', {
					data : e.rowData.data
				});
			} else {
				Ti.UI.createAlertDialog({
					title : 'عفواً !',
					message : 'لا يوجد منتجات حالياً بهذا القسم',
					buttonNames : ['موافق']
				}).show();
			}
		}
	});

	self.add(tableView);
	return self;
}

module.exports = categoryWin;

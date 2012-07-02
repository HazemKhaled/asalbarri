function categoryWin(parent) {
	var self = Ti.UI.createWindow({
		title : parent.title ? parent.title : 'عسل بري',
		backgroundColor : 'white',
		backButtonTitle : 'عودة',
		backgroundImage : 'images/common/bg_2.jpg',
		barImage : 'images/common/Navigation_Bar.jpg'
	});

	self.setBackButtonTitleImage('mages/common/button_back.png');

	if (!parent.id) {// only on home window
		//openAboutWindow
		var aboutBtn = Ti.UI.createButton({
			height : '31dp',
			width : '31dp',
			color : '#000000',
			backgroundImage : 'images/common/icon_2.png'
		});

		aboutBtn.addEventListener('click', function() {
			Ti.App.fireEvent('openAboutWindow');
		});

		self.setLeftNavButton(aboutBtn);
	} else {
		var backBtn = Ti.UI.createButton({
			title : 'عودة   ',
			height : '31dp',
			width : '67dp',
			color : '#000000',
			font : {
				fontFamily : 'Arial',
				fontSize : '14dp',
				fontWeight : 'bold'
			},
			backgroundImage : 'images/common/button_back.png'
		});

		backBtn.addEventListener('click', function() {
			self.close();
		});

		self.setLeftNavButton(backBtn);
	}

	//openSettingWindow
	var settingBtn = Ti.UI.createButton({
		height : '31dp',
		width : '31dp',
		color : '#000000',
		backgroundImage : 'images/common/icon_1.png'
	});

	// options dialog
	var optionsDialogOpts = {

		options : ['تسجيل دخول', 'تسجيل جديد', Ti.App.Properties.getString('currencyName') + ' (تغيير)', 'اغلاق'],
		destructive : 1,
		cancel : 3,
		title : 'اعدادات'
	};

	var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);

	var auth = require('/lib/auth');
	if (auth.isLogedIn() != false) {
		dialog.options = ['تسجيل خروج', 'بيانات المستخدم', Ti.App.Properties.getString('currencyName') + ' (تغيير)', 'اغلاق'];
	}

	// add event listener
	dialog.addEventListener('click', function(e) {
		//aboutBtn.title = 'You selected ' + e.index;
		if (auth.isLogedIn() == false) {
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
					Ti.App.dialog.options = ['تسجيل دخول', 'تسجيل جديد', Ti.App.Properties.getString('currencyName') + ' (تغيير)', 'اغلاق'];
					break;
				case 1:

					// TODO : open user profule
					break;
				case 2:

					Ti.App.fireEvent('openCurrencyWindow');
					break;
			}
		}
	});

	Ti.App.dialog = dialog;
	settingBtn.addEventListener('click', function() {
		Ti.App.dialog.show();
	});

	self.setRightNavButton(settingBtn);

	// called after recive new data, from main request or if we want to add remote search
	function filterData() {

		table.fireEvent('runLoading');

		var tableRows = [];

		var xhr = Ti.Network.createHTTPClient();

		xhr.open('GET', Ti.App.APIURL + 'api/catsByID/' + parent.id);

		xhr.onerror = function() {
			table.fireEvent('reloadData', {
				rows : []
			});

			self.addEventListener('focus', filterData);
		}

		xhr.onload = function() {

			self.removeEventListener('focus', filterData);

			var rows = JSON.parse(this.responseText);

			for (i in rows ) {
				var row = Ti.UI.createTableViewRow({
					height : '95dp',
					myTitle : rows[i].title,
					data : rows[i],
					selectedBackgroundColor : 'transparent',
					selectedBackgroundImage : 'images/common/bg_h_one_item.png'
				});

				var rowSeparator = Titanium.UI.createImageView({
					image : "images/common/bg_one_item.png",
					bottom : "0dp",
					left : "0dp",
					width : "auto",
					height : "auto"
				});
				row.add(rowSeparator);

				var arrow = Titanium.UI.createImageView({
					image : "images/common/icon_7.png",
					top : "6dp",
					left : "0dp",
					width : "auto",
					height : "auto"
				});
				row.add(arrow);

				var img = Ti.UI.createImageView({
					image : Ti.App.APIURL + 'api/pic/cat/' + rows[i].id + '/100/100/1',
					width : '90dp',
					height : '90dp',
					right : '5dp',
					borderRadius : 45
				});
				row.add(img);

				var titleLbl = Ti.UI.createLabel({
					text : rows[i].title,
					left : '10dp',
					right : '110dp',
					top : '23dp',
					color : '#ffffff',
					font : {
						fontFamily : 'Arial',
						fontSize : '17dp',
						fontWeight : 'bold'
					},
					textAlign : 'right'
				});
				row.add(titleLbl);

				if (rows[i].products_count > 0) {
					var titleLbl = Ti.UI.createLabel({
						text : rows[i].products_count,
						bottom : '10dp',
						right : '110dp',
						color : 'red',
						top : '30dp',
						width : '30dp',
						font : {
							fontSize : '16dp'
						},
						textAlign : 'center',
						//backgroundImage : 'images/common/bg_h_one_item.png'
					});
					row.add(titleLbl);

					var titleLbl2 = Ti.UI.createLabel({
						text : ' منتج',
						left : '10dp',
						bottom : '10dp',
						right : '140dp',
						color : '#ffffff',
						top : '30dp',
						font : {
							fontSize : '16dp'
						},
						textAlign : 'right'
					});
					row.add(titleLbl2);

				}

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
		opacity : '1',
		//Set BG transparent
		backgroundColor : 'transparent',
		//Set row color - white
		rowBackgroundColor : 'transparent',
		separatorColor : 'transparent',
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
					message : 'لا يوجد منتجات حالياً بهذا القسم'
				}).show();
			}
		}
	});

	self.add(table);
	return self;
};

module.exports = categoryWin;

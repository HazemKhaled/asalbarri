function categoryWin(parent) {
	var self = Ti.UI.createWindow({
		title : parent.title ? parent.title : 'عسل بري',
		backgroundColor : 'white',
		backButtonTitle : 'عودة'
	});

	if (!parent.id) {// only on home window
		//openAboutWindow
		var aboutBtn = Ti.UI.createButton({
			title : 'الدعم'
		});

		aboutBtn.addEventListener('click', function() {
			Ti.App.fireEvent('openAboutWindow');
		});

		self.setLeftNavButton(aboutBtn);
	}

	//openSettingWindow
	var settingBtn = Ti.UI.createButton({
		title : 'اعدادات'
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
					height : '110dp',
					myTitle : rows[i].title,
					data : rows[i]
				});

				var img = Ti.UI.createImageView({
					image : Ti.App.APIURL + 'api/pic/cat/' + rows[i].id + '/100/100/1',
					width : '100dp',
					height : '100dp',
					right : '5dp'
				});
				row.add(img);

				var titleLbl = Ti.UI.createLabel({
					text : rows[i].title,
					left : '10dp',
					right : '110dp',
					color : '#000000',
					textAlign : 'right'
				});
				row.add(titleLbl);

				if (rows[i].products_count > 0) {
					var titleLbl = Ti.UI.createLabel({
						text : rows[i].products_count + ' منتج',
						left : '10dp',
						bottom : '10dp',
						right : '110dp',
						color : 'silver',
						font : {
							fontSize : '12dp'
						},
						textAlign : 'right'
					});
					row.add(titleLbl);
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

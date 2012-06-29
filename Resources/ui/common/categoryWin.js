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
<<<<<<< HEAD
		options:['تسجيل دخول', 'تسجيل جديد' , 'تغيير العملة', 'اغلاق'],
		destructive:1,
		cancel:3,
		title:'اعدادات'
=======
		options : ['تسجيل دخول', 'تسجيل جديد', 'تغيير العملة', 'اغلاق'],
		destructive : 1,
		cancel : 2,
		title : 'اعدادات'
>>>>>>> 2aa5fdaa8fd18a83a7d8226e703cb70da6c2a684
	};

	var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);

	var auth = require('/lib/auth');
	if (auth.isLogedIn() != false) {
		dialog.options = ['تسجيل خروج', 'بيانات المستخدم', 'تغيير العملة', 'اغلاق'];
	}

	// add event listener
	dialog.addEventListener('click', function(e) {
		//aboutBtn.title = 'You selected ' + e.index;
		if (auth.isLogedIn() == false) {
			if (e.index == 0) {
				Ti.App.fireEvent('openLoginWindow');
			} else if (e.index == 1) {
				Ti.App.fireEvent('openRegisterWindow');
			} else if (e.index == 2) {
				Ti.App.fireEvent('openCurrencyWindow');
			}
		} else {

		}
	});

	settingBtn.addEventListener('click', function() {
		dialog.show();
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

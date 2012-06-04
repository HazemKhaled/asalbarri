function categoryWin(parent) {
	var self = Ti.UI.createWindow({
		title : parent.title ? parent.title : 'عسل بري',
		backgroundColor : 'white',
		backButtonTitle : 'عودة'
	});

	if (!parent.id) {
		//openAboutWindow
		var aboutBtn = Ti.UI.createButton({
			title : 'الدعم'
		});

		aboutBtn.addEventListener('click', function() {
			Ti.App.fireEvent('openAboutWindow');
		});

		self.setLeftNavButton(aboutBtn);
	}

	function filterData() {

		table.fireEvent('runLoading');

		var tableRows = [];

		var xhr = Ti.Network.createHTTPClient();

		xhr.open('GET', Ti.App.APIURL + 'api/catsByID/' + parent.id);

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
					image : Ti.App.APITHUMB + 'w=150&h=78&src=' + rows[i].image,
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
					height : '100dp',
					color : '#000000',
					textAlign : 'right'
				});
				row.add(titleLbl);

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

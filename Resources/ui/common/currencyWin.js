function currencyWin() {

	var self, closeBtn, label, picker, selectedRow = null;

	self = Ti.UI.createWindow({
		title : 'تغيير العملة',
		backgroundImage : '/images/bg.jpg',
		barImage : '/images/Navigation_Bar.jpg',
		barColor : 'gray'
	});

    Ti.include('/lib/menu.js');
    menusGenerator(self);

	label = Ti.UI.createLabel();
	self.add(label);

	picker = Ti.UI.createPicker({
		selectionIndicator : true
	});

	function filterData() {

		var pickerRows = [], xhr;

		picker.fireEvent('runLoading');

		xhr = Ti.Network.createHTTPClient();

		xhr.open('GET', Ti.App.APIURL + 'api/getCurrencies');

		xhr.onerror = function() {

			picker.fireEvent('reloadData', {
				rows : []
			});
		};

		xhr.onload = function() {

			var rows, i, row;

			try {
				rows = JSON.parse(this.responseText);
			} catch (e) {

				Ti.UI.createAlertDialog({
					title : 'خطأ',
					message : 'خطأ في الآتصال، تاكد من اتصال الانترنت الخاص بك.',
					cancel : 0,
					buttonNames : ['اغلاق']
				}).show();
				return false;
			}

			for (i in rows ) {
				if (rows.hasOwnProperty(i)) {

					if (Ti.App.Properties.getInt('currency', 1) == rows[i].id || (selectedRow === null && rows[i].is_default == 1)) {
						selectedRow = i;
					}

					row = Ti.UI.createPickerRow({
						data : rows[i],
						title : rows[i].title
					});

					pickerRows.push(row);
				}
			}

			picker.fireEvent('reloadData', {
				rows : pickerRows
			});
		};

		xhr.send();
	}


	picker.addEventListener('runLoading', function() {
		label.setText('جاري التحميل ....');
	});
	picker.addEventListener('reloadData', function(e) {
		label.setVisible(false);
		this.add(e.rows.length > 0 ? e.rows : [{
			title : 'لا يوجد نتائج هنا في الوقت الحالي !!'
		}]);
		picker.setSelectedRow(0, selectedRow, true);
		self.add(picker);
	});
	picker.addEventListener('change', function(e) {
		Ti.App.Properties.setInt('currency', e.row.data.id);
		Ti.App.Properties.setString('currencyName', e.row.data.title);

		var auth = require('/lib/auth');
		if (auth.isLogedIn() !== false) {
			//Ti.App.dialog.setOptions(['تسجيل خروج', 'بيانات المستخدم', Ti.App.Properties.getString('currencyName', 'دولار أمريكي') + ' (تغيير)', 'اخبارنا', 'س و ج', 'اغلاق']);
		} else {
			//Ti.App.dialog.setOptions(['تسجيل دخول', 'تسجيل جديد', Ti.App.Properties.getString('currencyName', 'دولار أمريكي') + ' (تغيير)', 'اخبارنا', 'س و ج', 'اغلاق']);
		}
	});
	filterData();

	return self;
}

module.exports = currencyWin;

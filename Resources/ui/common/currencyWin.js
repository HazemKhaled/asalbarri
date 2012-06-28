function currencyWin() {
	var self = Ti.UI.createWindow({
		title : 'تغيير العملة',
		modal : true,
		backgroundColor : 'white'
	});

		var closeBtn = Ti.UI.createButton({
			title : 'اغلاق'
		});

		closeBtn.addEventListener('click', function() {
			self.close();
		});

		self.setLeftNavButton(closeBtn);
				
		var label = Ti.UI.createLabel();
		self.add(label)
		
		var picker = Ti.UI.createPicker();
		var selectedRow = 0;
		picker.selectionIndicator = true;
		
		function filterData() {

			picker.fireEvent('runLoading');
	
			var pickerRows = [];
				
			var xhr = Ti.Network.createHTTPClient();
	
			xhr.open('GET', Ti.App.APIURL + 'api/getCurrencies');
	
			xhr.onerror = function() {
				
				picker.fireEvent('reloadData', {
					rows : []
				});
			}
	
			xhr.onload = function() {
				
				var rows = JSON.parse(this.responseText);
				for (i in rows ) {
					
					if (Ti.App.Properties.currency == rows[i].id || 
						(selectedRow == 0 && rows[i].is_default == 1)) selectedRow = i;
					
					var row = Ti.UI.createPickerRow({
						title : rows[i].title,
						data : rows[i]
					});
				
					pickerRows.push(row);
				}
	
				picker.fireEvent('reloadData', {
					rows : pickerRows
				});
			};
	
			xhr.send();
		}

	picker.addEventListener('runLoading', function() {
		label.text = 'جاري التحميل ....';
	});
	picker.addEventListener('reloadData', function(e) {
		label.visible = false;
		this.add(e.rows.length > 0 ? e.rows : [{
			title : 'لا يوجد نتائج هنا في الوقت الحالي !!'
		}]);
		picker.setSelectedRow(0,selectedRow,true);
		self.add(picker);
	});
	picker.addEventListener('change',function(e)
	{
		Ti.App.properties.currency = e.row.data.id;
		Ti.App.properties.currencyName = e.row.title;
	});
	filterData();
		
	return self;
};

module.exports = currencyWin;

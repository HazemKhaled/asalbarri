function currencyWin() {

    var self, closeBtn, label, picker, selectedRow = null;

    self = Ti.UI.createWindow({
        title : 'تغيير العملة',
        modal : true,
        backgroundColor : 'white'
    });

    closeBtn = Ti.UI.createButton({
        title : 'اغلاق'
    });

    closeBtn.addEventListener('click', function() {
        self.close();
    });

    if (Ti.Platform.getOsname() !== 'android') {
        self.setLeftNavButton(closeBtn);
    }

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

            rows = JSON.parse(this.responseText);
            for (i in rows ) {

                if (Ti.App.Properties.getInt('currency') === rows[i].id || (selectedRow === null && rows[i].is_default === 1)) {
                    selectedRow = i;
                }

                row = Ti.UI.createPickerRow({
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
        Ti.App.Properties.setString('currencyName', e.row.title);

        var auth = require('/lib/auth');
        if (auth.isLogedIn() !== false) {
            Ti.App.dialog.setOptions(['تسجيل خروج', 'بيانات المستخدم', Ti.App.Properties.getString('currencyName') + ' (تغيير)', 'اغلاق']);
        } else {
            Ti.App.dialog.setOptions(['تسجيل دخول', 'تسجيل جديد', Ti.App.Properties.getString('currencyName') + ' (تغيير)', 'اغلاق']);
        }
    });
    filterData();

    return self;
}

module.exports = currencyWin;

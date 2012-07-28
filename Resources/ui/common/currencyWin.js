function currencyWin() {

    var self, closeBtn, label, picker, selectedRow = null;

    self = Ti.UI.createWindow({
        title : 'تغيير العملة',
        modal : true,
        backgroundImage : '/images/common/bg.jpg',
        barImage : '/images/common/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    if (Ti.Platform.getOsname() !== 'android') {
        closeBtn = Ti.UI.createButton({
            title : 'اغلاق'
        });

        closeBtn.addEventListener('click', function() {
            self.close();
        });
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
                if (rows.hasOwnProperty(i)) {

                    if (Ti.App.Properties.getInt('currency') == rows[i].id || (selectedRow === null && rows[i].is_default == 1)) {
                        selectedRow = i;
                    }

                    row = Ti.UI.createPickerRow({
                        data : rows[i]
                    });

                    row.add(Ti.UI.createLabel({
                        text : rows[i].title,
                        width : '100%',
                        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
                        font : {
                            fontFamily : 'Arial',
                            fontSize : '16dp',
                            fontWeight : 'bold'
                        }
                    }));

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
            Ti.App.dialog.setOptions(['تسجيل خروج', 'بيانات المستخدم', Ti.App.Properties.getString('currencyName') + ' (تغيير)', 'اغلاق']);
        } else {
            Ti.App.dialog.setOptions(['تسجيل دخول', 'تسجيل جديد', Ti.App.Properties.getString('currencyName') + ' (تغيير)', 'اغلاق']);
        }
    });
    filterData();

    return self;
}

module.exports = currencyWin;

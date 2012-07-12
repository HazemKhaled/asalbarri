function orderProductsWin(parent) {
    var self = Ti.UI.createWindow({
        title : 'تفاصيل الطب',
        backgroundColor : 'white',
        backButtonTitle : 'طلباتي'
    });

    function filterData() {

        tableView.fireEvent('runLoading');

        var tableRows = [], xhr;

        xhr = Ti.Network.createHTTPClient();

        xhr.open('GET', Ti.App.APIURL + 'api/productsByOrderID/' + parent.id);

        xhr.onerror = function() {
            tableView.fireEvent('reloadData', {
                rows : []
            });
        };

        xhr.onload = function() {

            var rows, i, row, img, titleLbl, purchasesQtyLbl, priceLbl, priceLbl2;

            rows = JSON.parse(this.responseText);

            for (i in rows) {
                row = Ti.UI.createTableViewRow({
                    height : '110dp',
                    myTitle : rows[i].title,
                    data : rows[i]
                });

                img = Ti.UI.createImageView({
                    image : Ti.App.APIURL + 'api/pic/cat/' + rows[i].id + '/100/100/1',
                    width : '100dp',
                    height : '100p',
                    right : '5dp'
                });
                row.add(img);

                titleLbl = Ti.UI.createLabel({
                    text : rows[i].title,
                    height : 'auto',
                    left : 0,
                    right : '110dp',
                    top : '10dp',
                    color : '#000000',
                    textAlign : 'right'
                });
                row.add(titleLbl);

                purchasesQtyLbl = Ti.UI.createLabel({
                    text : 'الكمية : ',
                    height : 'auto',
                    left : 0,
                    right : '110dp',
                    top : '35dp',
                    textAlign : 'right'
                });
                row.add(purchasesQtyLbl);

                purchasesQty = Ti.UI.createLabel({
                    text : rows[i].purchases_quantity,
                    height : 'auto',
                    left : 0,
                    right : '190dp',
                    top : '35dp',
                    textAlign : 'right'
                });
                row.add(purchasesQty);

                priceLbl = Ti.UI.createLabel({
                    text : 'سعر الوحدة : ',
                    height : 'auto',
                    left : 0,
                    right : '110dp',
                    top : '60dp',
                    textAlign : 'right'
                });
                row.add(priceLbl);

                priceLbl2 = Ti.UI.createLabel({
                    text : rows[i].purchases_unit_price + ' ' + Ti.App.Properties.getString('currencyName'),
                    height : 'auto',
                    left : 0,
                    right : '190dp',
                    top : '60dp',
                    textAlign : 'right'
                });
                row.add(price);

                tableRows.push(row);
            }

            tableView.fireEvent('reloadData', {
                rows : tableRows
            });
        };

        xhr.send();
    }

    tableView = Ti.UI.createTableView({
        height : 'auto',
        filterAttribute : 'myTitle'
    });

    tableView.addEventListener('cleartable', function() {

        if (this.data.length > 0) {
            var i = this.data[0].rows.length - 1;
            for (i; i >= 0; i -= 1) {
                this.deleteRow(i);
            }
        }

    });

    tableView.addEventListener('runLoading', function() {
        this.setData([{
            title : 'جاري التحميل ....'
        }]);
    });
    tableView.addEventListener('reloadData', function(e) {
        this.setData(e.rows.length > 0 ? e.rows : [{
            title : 'لا يوجد نتائج هنا في الوقت الحالي !!'
        }]);
    });

    filterData();

    //Ti.App.orderProductsTable = tableView;

    self.add(tableView);
    return self;
}

module.exports = orderProductsWin;

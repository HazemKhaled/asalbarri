function myOrdersWin() {

    var self, tableView;

    self = Ti.UI.createWindow({
        title : 'طلباتي',
        backgroundColor : 'white'
    });

    function filterData() {

        tableView.fireEvent('runLoading');

        var tableRows = [], xhr;

        xhr = Ti.Network.createHTTPClient();

        xhr.open('GET', Ti.App.APIURL + 'api/ordersByUserID/1' + Ti.App.Properties.getInt('userID'));

        xhr.onerror = function() {
            tableView.fireEvent('reloadData', {
                rows : []
            });
        };

        xhr.onload = function() {

            var rows, i, row, dateTitleLbl, dateLbl, totaltitleLbl, priceLbl, statusTitleLbl, statustxt = '', statusLbl;

            rows = JSON.parse(this.responseText);

            for (i in rows ) {
                if (rows.hasOwnProperty(i)) {
                    row = Ti.UI.createTableViewRow({
                        height : '110dp',
                        myTitle : rows[i].title,
                        data : rows[i]
                    });

                    dateTitleLbl = Ti.UI.createLabel({
                        text : 'التاريخ : ',
                        height : 'auto',
                        left : 0,
                        right : '10dp',
                        top : '10dp',
                        textAlign : 'right'
                    });
                    row.add(dateTitleLbl);

                    dateLbl = Ti.UI.createLabel({
                        text : rows[i].date,
                        height : 'auto',
                        left : 0,
                        right : '65dp',
                        top : '10dp',
                        textAlign : 'right'
                    });
                    row.add(dateLbl);

                    totaltitleLbl = Ti.UI.createLabel({
                        text : 'الاجمالي : ',
                        height : 'auto',
                        right : '10dp',
                        top : '35dp',
                        textAlign : 'right'
                    });
                    row.add(totaltitleLbl);

                    priceLbl = Ti.UI.createLabel({
                        text : rows[i].total_price + ' ' + Ti.App.Properties.getString('currencyName'),
                        height : 'auto',
                        right : '75dp',
                        top : '35dp',
                        textAlign : 'right'
                    });
                    row.add(priceLbl);

                    statusTitleLbl = Ti.UI.createLabel({
                        text : 'حالة الطلب : ',
                        height : 'auto',
                        right : '10dp',
                        top : '60dp',
                        textAlign : 'right'
                    });
                    row.add(statusTitleLbl);

                    statustxt = '';
                    if (rows[i].status === '0') {
                        statustxt = 'لم يتم البدأ';
                    } else if (rows[i].status === '1') {
                        statustxt = 'جاري الشحن';
                    } else if (rows[i].status === '2') {
                        statustxt = 'تم الوصول';
                    }

                    statusLbl = Ti.UI.createLabel({
                        text : statustxt,
                        height : 'auto',
                        right : '85dp',
                        top : '60dp',
                        textAlign : 'right'
                    });
                    row.add(statusLbl);

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
        height : 'auto',
        filterAttribute : 'myTitle'
    });

    tableView.addEventListener('runLoading', function() {
        this.setData([{
            title : 'جاري التحميل ....'
        }]);
    });
    tableView.addEventListener('reloadData', function(e) {
        this.setData(e.rows.length > 0 ? e.rows : [{
            title : 'مشكلة تحميل، حاول بعد قليل.'
        }]);
    });

    tableView.addEventListener('click', function(e) {

        if (e.rowData.data) {

            Ti.App.fireEvent('openOrderProductsWindow', {
                data : e.rowData.data
            });
        }
    });

    self.add(tableView);

    self.addEventListener('focus', function() {

        var auth = require('/lib/auth');
        Ti.App.fireEvent('closeLoginWindow');
        if (!auth.isLogedIn() && false) {

            Ti.App.fireEvent('openLoginWindow');
        } else {
            filterData();
        }

    });

    return self;
}

module.exports = myOrdersWin;

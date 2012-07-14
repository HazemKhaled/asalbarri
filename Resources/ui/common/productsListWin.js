function productsListWin(parent) {

    var self, tableView;
    self = Ti.UI.createWindow({
        title : parent.title,
        backButtonTitle : 'عودة',
        backgroundImage : 'images/common/bg.jpg',
        barImage : 'images/common/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    function filterData() {

        tableView.fireEvent('runLoading');

        var tableRows = [], xhr;

        xhr = Ti.Network.createHTTPClient();

        xhr.open('GET', Ti.App.APIURL + 'api/productsByCatID/' + parent.id + '/' + Ti.App.Properties.getInt('currency'));

        xhr.onerror = function() {
            tableView.fireEvent('reloadData', {
                rows : []
            });
        };

        xhr.onload = function() {
            var rows, i, row, img, titleLbl, purchasesQtyLbl, priceFitLbl, priceLbl;

            rows = JSON.parse(this.responseText);

            for (i in rows) {
                if (rows.hasOwnProperty(i)) {
                    row = Ti.UI.createTableViewRow({
                        height : '110dp',
                        myTitle : rows[i].title,
                        data : rows[i],
                        backgroundImage : 'images/common/TableViewRowBG.png',
                        selectedBackgroundImage : 'images/common/TableViewRowSelectedBG.png'
                    });

                    img = Ti.UI.createImageView({
                        image : Ti.App.APIURL + 'api/pic/product/' + rows[i].id + '/100/100/1',
                        width : '100dp',
                        height : '100p',
                        right : '5dp',
                        borderRadius : 45
                    });
                    row.add(img);

                    titleLbl = Ti.UI.createLabel({
                        text : rows[i].title,
                        left : 0,
                        right : '110dp',
                        top : '10dp',
                        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
                        color : '#ffffff',
                        font : {
                            fontFamily : 'Arial',
                            fontSize : '17dp',
                            fontWeight : 'bold'
                        }
                    });
                    row.add(titleLbl);

                    priceFitLbl = Ti.UI.createLabel({
                        text : rows[i].price_shown_coupon,
                        right : '160dp',
                        bottom : '10dp',
                        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT
                    });
                    row.add(priceFitLbl);

                    priceLbl = Ti.UI.createLabel({
                        text : rows[i].price,
                        right : '110dp',
                        bottom : '10dp',
                        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT
                    });
                    row.add(priceLbl);

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
        filterAttribute : 'myTitle',
        backgroundColor : 'transparent',
        separatorColor : 'transparent'
    });

    tableView.addEventListener('runLoading', function() {
        this.setData([{
            title : 'جاري التحميل ....',
            color : '#ffffff'
        }]);
    });
    tableView.addEventListener('reloadData', function(e) {
        this.setData(e.rows.length > 0 ? e.rows : [{
            title : 'مشكلة تحميل، حاول بعد قليل.',
            color : '#ffffff'
        }]);
    });
    filterData();

    tableView.addEventListener('click', function(e) {

        if (e.rowData.data) {

            Ti.App.fireEvent('openProductWindow', {
                data : e.rowData.data
            });
        }
    });

    self.add(tableView);
    return self;
}

module.exports = productsListWin;

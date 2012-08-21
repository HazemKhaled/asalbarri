function productsListWin(parent) {

    var self, tableView;
    self = Ti.UI.createWindow({
        title : parent.title,
        backButtonTitle : 'عودة',
        backgroundImage : '/images/bg.jpg',
        barImage : '/images/Navigation_Bar.jpg',
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
            var rows, i, row, img, titleLbl, purchasesQtyLbl, priceFitLbl, priceLbl, arrow, pricebackground, priceLblCurr, priceFitLbl;

            try {
                rows = JSON.parse(this.responseText);
            } catch (e) {

                tableView.fireEvent('reloadData', {
                    rows : []
                });
                return false;
            }

            for (i in rows) {
                if (rows.hasOwnProperty(i)) {
                    row = Ti.UI.createTableViewRow({
                        height : 95,
                        myTitle : rows[i].title,
                        data : rows[i],
                        className : 'productRow',
                        backgroundImage : '/images/TableViewRowBG.png',
                        selectedBackgroundImage : '/images/TableViewRowSelectedBG.png'
                    });

                    img = Ti.UI.createImageView({
                        image : Ti.App.APIURL + 'api/pic/product/' + rows[i].id + '/100/100/1',
                        width : 85,
                        height : 85,
                        right : 10,
                        borderRadius : 45,
                        defaultImage : '/images/default.png'
                    });
                    row.add(img);

                    arrow = Titanium.UI.createImageView({
                        image : '/images/icon_7.png',
                        top : 6,
                        left : 0,
                        width : 23,
                        height : 79
                    });
                    row.add(arrow);

                    titleLbl = Ti.UI.createLabel({
                        text : rows[i].title,
                        left : 0,
                        right : 110,
                        top : 10,
                        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
                        color : '#ffffff',
                        font : {
                            fontFamily : 'Arial',
                            fontSize : 17,
                            fontWeight : 'bold'
                        }
                    });
                    row.add(titleLbl);

                    if (rows[i].price_shown_coupon > 0) {

                        pricebackground = Titanium.UI.createImageView({
                            image : '/images/sss.png',
                            bottom : 11,
                            right : 110,
                            width : 170,
                            height : 38
                        });
                        row.add(pricebackground);

                        priceFitLbl = Ti.UI.createLabel({
                            text : rows[i].price_shown_coupon,
                            right : 205,
                            width : 60,
                            bottom : 27,
                            textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
                            color : '#ffffff',
                            font : {
                                fontFamily : 'Arial',
                                fontSize : 17,
                                fontWeight : 'bold'
                            }
                        });
                        row.add(priceFitLbl);

                        priceFitLblCurr = Ti.UI.createLabel({
                            text : Ti.App.Properties.getString('currencyName'),
                            right : 195,
                            width : 80,
                            bottom : 16,
                            color : '#ffffff',
                            textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
                            color : '#ffffff',
                            font : {
                                fontFamily : 'Arial',
                                fontSize : 14
                            }
                        });
                        row.add(priceFitLblCurr);
                    } else {

                        pricebackground = Titanium.UI.createImageView({
                            image : '/images/bg_price_2.png',
                            bottom : 11,
                            right : 110,
                            width : 83,
                            height : 38
                        });
                        row.add(pricebackground);
                    }

                    priceLbl = Ti.UI.createLabel({
                        text : rows[i].price,
                        right : 120,
                        width : 60,
                        bottom : 27,
                        textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
                        color : '#000000',
                        font : {
                            fontFamily : 'Arial',
                            fontSize : 17,
                            fontWeight : 'bold'
                        }
                    });
                    row.add(priceLbl);

                    priceLblCurr = Ti.UI.createLabel({
                        text : Ti.App.Properties.getString('currencyName'),
                        right : 110,
                        width : 80,
                        bottom : 16,
                        textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
                        color : '#000000',
                        font : {
                            fontFamily : 'Arial',
                            fontSize : 14
                        }
                    });
                    row.add(priceLblCurr);

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

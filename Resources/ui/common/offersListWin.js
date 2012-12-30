function offersListWin() {

    var self, tableView;
    self = Ti.UI.createWindow({
        title : 'عروض خاصة',
        backButtonTitle : 'عودة',
        backgroundImage : '/images/bg.jpg',
        barImage : '/images/Navigation_Bar.jpg',
        barColor : 'gray'
    });

    Ti.include('/lib/menu.js');
    menusGenerator(self);

    function filterData() {

        tableView.fireEvent('runLoading');

        var tableRows = [], xhr;

        xhr = Ti.Network.createHTTPClient();

        xhr.open('GET', Ti.App.APIURL + 'api/productsByOffers/2/' + Ti.App.Properties.getInt('currency', 1));

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
                        backgroundImage : '/images/TableViewRowBG.jpg',
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

                    arrow = Ti.UI.createImageView({
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

                        pricebackground = Ti.UI.createView({
                            backgroundImage : '/images/sss.png',
                            bottom : 11,
                            right : 110,
                            width : 170,
                            height : 38
                        });
                        row.add(pricebackground);

                        pricebackground.add(Ti.UI.createLabel({
                            text : parseFloat(rows[i].price).toFixed(2),
                            left : 0,
                            top : 0,
                            width : 85,
                            textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
                            color : '#ffffff',
                            font : {
                                fontSize : 17,
                                fontWeight : 'bold'
                            }
                        }));

                        pricebackground.add(Ti.UI.createLabel({
                            text : Ti.App.Properties.getString('currencyName', 'دولار أمريكي'),
                            left : 0,
                            bottom : -5,
                            width : 85,
                            height : 38,
                            textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
                            color : '#ffffff',
                            font : {
                                fontSize : 14
                            }
                        }));

                        pricebackground.add(Ti.UI.createLabel({
                            text : parseFloat(rows[i].price_shown_coupon).toFixed(2),
                            right : 0,
                            top : 0,
                            width : 85,
                            textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
                            color : '#000000',
                            font : {
                                fontSize : 17,
                                fontWeight : 'bold'
                            }
                        }));

                        pricebackground.add(Ti.UI.createLabel({
                            text : Ti.App.Properties.getString('currencyName', 'دولار أمريكي'),
                            right : 0,
                            bottom : -5,
                            width : 85,
                            height : 38,
                            textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
                            color : '#000000',
                            font : {
                                fontSize : 14
                            }
                        }));
                    } else {

                        pricebackground = Ti.UI.createView({
                            backgroundImage : '/images/bg_price_2.png',
                            bottom : 11,
                            right : 110,
                            width : 83,
                            height : 38
                        });
                        row.add(pricebackground);

                        pricebackground.add(Ti.UI.createLabel({
                            text : parseFloat(rows[i].price).toFixed(2),
                            left : 0,
                            top : 0,
                            width : 85,
                            textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
                            color : '#000000',
                            font : {
                                fontSize : 17,
                                fontWeight : 'bold'
                            }
                        }));

                        pricebackground.add(Ti.UI.createLabel({
                            text : Ti.App.Properties.getString('currencyName', 'دولار أمريكي'),
                            left : 0,
                            bottom : -5,
                            width : 85,
                            height : 38,
                            textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
                            color : '#000000',
                            font : {
                                fontSize : 14
                            }
                        }));
                    }

                    tableRows.push(row);
                }
            }

            tableView.fireEvent('reloadData', {
                rows : tableRows
            });
        };

        xhr.send();
    }

    var searchBar = Ti.UI.createSearchBar();

    tableView = Ti.UI.createTableView({
        filterAttribute : 'myTitle',
        //search : searchBar,
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
        searchBar.blur();
    });
    filterData();

    tableView.addEventListener('click', function(e) {

        if (e.rowData.data) {

            Ti.App.myTabGroup.setActiveTab(Ti.App.catalogTab);

            Ti.App.fireEvent('openProductWindow', {
                data : e.rowData.data
            });
        }
    });

    self.add(tableView);

    return self;
}

module.exports = offersListWin;

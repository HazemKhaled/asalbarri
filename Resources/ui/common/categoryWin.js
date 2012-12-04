function categoryWin(parent) {

    var self, backBtn, tableView;

    self = Ti.UI.createWindow({
        title : parent.title || 'عسل بري',
        backButtonTitle : 'عودة',
        backgroundImage : '/images/bg.jpg',
        barImage : '/images/Navigation_Bar.jpg',
        barColor : 'gray'
    });

    Ti.include('/lib/menu.js');
    menusGenerator(self);

    // called after recive new data, from main request or if we want to add remote search
    function filterData() {

        var tableRows = [], xhr;

        tableView.fireEvent('runLoading');

        xhr = Ti.Network.createHTTPClient();

        xhr.open('GET', Ti.App.APIURL + 'api/catsByID/' + parent.id);

        xhr.onerror = function() {
            tableView.fireEvent('reloadData', {
                rows : []
            });

            self.addEventListener('focus', filterData);
        };

        xhr.onload = function() {

            var rows, i, row, arrow, img, titleLbl, titleLbl2;

            self.removeEventListener('focus', filterData);

            try {
                rows = JSON.parse(this.responseText);
            } catch (e) {
                tableView.fireEvent('reloadData', {
                    rows : []
                });

                self.addEventListener('focus', filterData);

                return false;
            }

            for (i in rows ) {
                if (rows.hasOwnProperty(i)) {
                    row = Ti.UI.createTableViewRow({
                        height : 95,
                        myTitle : rows[i].title,
                        data : rows[i],
                        className : 'categoryRow',
                        backgroundImage : '/images/TableViewRowBG.jpg',
                        selectedBackgroundImage : '/images/TableViewRowSelectedBG.png'
                    });

                    arrow = Ti.UI.createImageView({
                        image : '/images/icon_7.png',
                        left : 0,
                        width : 23,
                        height : 79
                    });
                    row.add(arrow);

                    img = Ti.UI.createImageView({
                        image : Ti.App.APIURL + 'api/pic/cat/' + rows[i].id + '/100/100/1',
                        width : 85,
                        height : 85,
                        right : 10,
                        borderRadius : 45,
                        defaultImage : '/images/default.png'
                    });
                    row.add(img);

                    titleLbl = Ti.UI.createLabel({
                        text : rows[i].title,
                        left : 10,
                        right : 110,
                        top : 23,
                        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
                        color : '#ffffff',
                        font : {
                            fontFamily : 'Arial',
                            fontSize : 17,
                            fontWeight : 'bold'
                        }
                    });
                    row.add(titleLbl);

                    if (rows[i].products_count > 0) {
                        titleLbl = Ti.UI.createLabel({
                            text : rows[i].products_count,
                            bottom : 10,
                            right : 110,
                            color : 'red',
                            height : 23,
                            top : 50,
                            width : 43,
                            backgroundImage : '/images/bg_product_quantity.png',
                            font : {
                                fontSize : 16
                            },
                            textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
                        });
                        row.add(titleLbl);

                        titleLbl2 = Ti.UI.createLabel({
                            text : ' منتج',
                            left : 10,
                            bottom : 10,
                            right : 155,
                            color : '#ffffff',
                            top : 30,
                            font : {
                                fontSize : 16
                            },
                            textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT
                        });
                        row.add(titleLbl2);

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
            title : 'لا يوجد نتائج هنا في الوقت الحالي !!',
            color : '#ffffff'
        }]);
    });

    self.addEventListener('open', function() {
        filterData();
    });

    tableView.addEventListener('click', function(e) {

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
                    message : 'لا يوجد منتجات حالياً بهذا القسم',
                    buttonNames : ['موافق']
                }).show();
            }
        }
    });

    self.add(tableView);
    return self;
}

module.exports = categoryWin;

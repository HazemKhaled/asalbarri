function categoryWin(parent) {

    var self, aboutBtn, backBtn, settingBtn, optionsDialogOpts, dialog, auth, tableView;

    self = Ti.UI.createWindow({
        title : parent.title || 'عسل بري',
        backButtonTitle : 'عودة',
        backgroundImage : 'images/common/bg.jpg',
        barImage : 'images/common/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    if (!parent.id) {// only on home window
        //openAboutWindow
        aboutBtn = Ti.UI.createButton({
            height : '31dp',
            width : '31dp',
            color : '#000000',
            backgroundImage : 'images/common/icon_2.png'
        });

        aboutBtn.addEventListener('click', function() {
            Ti.App.fireEvent('openAboutWindow');
        });

        if (Ti.Platform.getOsname() === 'android') {
            self.add(aboutBtn);
        } else {
            self.setLeftNavButton(aboutBtn);
        }
    }

    //openSettingWindow
    settingBtn = Ti.UI.createButton({
        height : '31dp',
        width : '31dp',
        color : '#000000',
        backgroundImage : 'images/common/icon_1.png'
    });

    // options dialog
    optionsDialogOpts = {
        options : ['تسجيل دخول', 'تسجيل جديد', Ti.App.Properties.getString('currencyName') + ' (تغيير)', 'اغلاق'],
        cancel : 3,
        title : 'اعدادات'
    };

    dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);

    auth = require('/lib/auth');
    if (auth.isLogedIn() !== false) {
        dialog.options = ['تسجيل خروج', 'بيانات المستخدم', Ti.App.Properties.getString('currencyName') + ' (تغيير)', 'اغلاق'];
        dialog.destructive = 2;
    }

    // add event listener
    dialog.addEventListener('click', function(e) {
        //aboutBtn.title = 'You selected ' + e.index;
        if (auth.isLogedIn() === false) {
            switch(e.index) {
                case 0:

                    Ti.App.fireEvent('openLoginWindow');
                    break;
                case 1:

                    Ti.App.fireEvent('openRegisterWindow');
                    break;
                case 2:

                    Ti.App.fireEvent('openCurrencyWindow');
                    break;
            }
        } else {
            switch(e.index) {
                case 0:

                    Ti.App.Properties.removeProperty('userID');
                    Ti.App.dialog.options = ['تسجيل دخول', 'تسجيل جديد', Ti.App.Properties.getString('currencyName') + ' (تغيير)', 'اغلاق'];
                    break;
                case 1:

                    // TODO : open user profule
                    break;
                case 2:

                    Ti.App.fireEvent('openCurrencyWindow');
                    break;
            }
        }
    });

    Ti.App.dialog = dialog;
    settingBtn.addEventListener('click', function() {
        Ti.App.dialog.show();
    });

    if (Ti.Platform.getOsname() === 'android') {
        self.add(settingBtn);
    } else {
        self.setRightNavButton(settingBtn);
    }

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

            rows = JSON.parse(this.responseText);

            for (i in rows ) {
                if (rows.hasOwnProperty(i)) {
                    row = Ti.UI.createTableViewRow({
                        height : '95dp',
                        myTitle : rows[i].title,
                        data : rows[i],
                        backgroundImage : 'images/common/TableViewRowBG.png',
                        selectedBackgroundImage : 'images/common/TableViewRowSelectedBG.png'
                    });

                    arrow = Titanium.UI.createImageView({
                        image : "images/common/icon_7.png",
                        top : "6dp",
                        left : "0dp",
                        width : "auto",
                        height : "auto"
                    });
                    row.add(arrow);

                    img = Ti.UI.createImageView({
                        image : Ti.App.APIURL + 'api/pic/cat/' + rows[i].id + '/100/100/1',
                        width : '85dp',
                        height : '85dp',
                        right : '10dp',
                        borderRadius : 45
                    });
                    row.add(img);

                    titleLbl = Ti.UI.createLabel({
                        text : rows[i].title,
                        left : '10dp',
                        right : '110dp',
                        top : '23dp',
                        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
                        color : '#ffffff',
                        font : {
                            fontFamily : 'Arial',
                            fontSize : '17dp',
                            fontWeight : 'bold'
                        }
                    });
                    row.add(titleLbl);

                    if (rows[i].products_count > 0) {
                        titleLbl = Ti.UI.createLabel({
                            text : rows[i].products_count,
                            bottom : '10dp',
                            right : '110dp',
                            color : 'red',
                            top : '30dp',
                            width : '30dp',
                            font : {
                                fontSize : '16dp'
                            },
                            textAlign : 'center'
                        });
                        row.add(titleLbl);

                        titleLbl2 = Ti.UI.createLabel({
                            text : ' منتج',
                            left : '10dp',
                            bottom : '10dp',
                            right : '140dp',
                            color : '#ffffff',
                            top : '30dp',
                            font : {
                                fontSize : '16dp'
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
    filterData();

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

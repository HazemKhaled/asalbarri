function cartWin() {

    var self, orderBtn, actionBtnBar, tableHeaderView, productTable;

    self = Ti.UI.createWindow({
        title : 'سلة التسوق',
        backgroundImage : 'images/common/bg.jpg',
        barImage : 'images/common/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    orderBtn = Ti.UI.createButton({
        title : 'شراء'
    });
    orderBtn.addEventListener('click', function() {
        alert('soon');
    });

    if (Ti.Platform.getOsname() === 'android') {
        self.add(orderBtn);
    } else {
        self.setRightNavButton(orderBtn);
    }

    actionBtnBar = Ti.UI.createButtonBar({
        labels : ['تفريغ', 'كوبون خصم'],
        height : '35dp'
    });
    actionBtnBar.addEventListener('click', function(e) {

        if (e.index === 0) {
            var confirmDialog = Ti.UI.createAlertDialog({
                title : 'متاكد',
                message : 'سيتم افراغ سلة التسوق؟',
                buttonNames : ['موافق', 'لا'],
                cancel : 1
            });

            confirmDialog.addEventListener('click', function(ec) {
                if (ec.index === 0) {
                    Ti.App.fireEvent('cartEmpty');
                }
            });

            confirmDialog.show();
        }
    });

    tableHeaderView = Ti.UI.createView({
        height : '44dp'
    });
    tableHeaderView.add(actionBtnBar);

    productTable = Ti.UI.createTableView({
        headerView : tableHeaderView,
        footerView : Ti.UI.createView({
            height : '40dp',
            backgroundColor : 'red'
        })
    });

    self.add(productTable);

    self.addEventListener('focus', function() {

        var rows, i, rowView, img, titleLbl;

        rows = Ti.App.Properties.getObject('cart', {});

        for (i in rows) {
            if (rows.hasOwnProperty(i)) {
                console.log(rows[i]);
                rowView = Ti.UI.createTableViewRow({
                    height : '110dp',
                    myTitle : rows[i].title,
                    data : rows[i]
                });

                img = Ti.UI.createImageView({
                    image : Ti.App.APIURL + 'api/pic/product/' + rows[i].id + '/100/100/1',
                    width : '100dp',
                    height : '100p',
                    right : '5dp'
                });
                rowView.add(img);

                titleLbl = Ti.UI.createLabel({
                    text : rows[i].title,
                    left : 0,
                    right : '110dp',
                    top : '10dp',
                    textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT
                });
                rowView.add(titleLbl);

                productTable.add(rowView);
            }
        }
    });

    return self;
}

module.exports = cartWin;

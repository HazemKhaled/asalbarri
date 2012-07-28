function cartWin() {

    var self, orderBtn, emptyBtn, couponBtn, tableHeaderView, productTable, CouponWinModule, auth;

    self = Ti.UI.createWindow({
        title : 'سلة التسوق',
        backgroundImage : '/images/common/bg.jpg',
        barImage : '/images/common/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    orderBtn = Ti.UI.createButton({
        title : 'شراء'
    });
    orderBtn.addEventListener('click', function() {

        if (Ti.App.cartQuantityCounter().count === 0) {

            Ti.UI.createAlertDialog({
                title : 'لا يوجد؟',
                message : 'لا يوجد منتجات في سلة التسوق حتى الان.',
                buttonNames : ['موافق']
            }).show();
            return;
        }

        auth = require('/lib/auth');
        if (auth.isLogedIn() === false) {

            Ti.App.fireEvent('closeLoginWindow');
            Ti.App.fireEvent('openLoginWindow');
            return;
        }

        Ti.App.fireEvent('openShippingWindow');
    });

    if (Ti.Platform.getOsname() === 'android') {

        orderBtn.height = '33dp';
        orderBtn.width = '90%';
        orderBtn.bottom = '4dp';
        orderBtn.backgroundImage = '/images/common/button_ok.png';
        orderBtn.color = '#ffffff';

        self.add(orderBtn);
    } else {
        self.setRightNavButton(orderBtn);
    }

    emptyBtn = Ti.UI.createButton({
        title : 'تفريغ'
    });
    emptyBtn.addEventListener('click', function() {

        var confirmDialog = Ti.UI.createAlertDialog({
            title : 'متاكد',
            message : 'سيتم افراغ سلة التسوق؟',
            buttonNames : ['موافق', 'لا'],
            cancel : 1
        });

        confirmDialog.addEventListener('click', function(ec) {
            if (ec.index === 0) {
                Ti.App.fireEvent('cartEmpty');
                self.fireEvent('focus');
            }
        });

        confirmDialog.show();
    });

    couponBtn = Ti.UI.createButton({
        title : 'كوبون خصم'
    });
    couponBtn.addEventListener('click', function(e) {

        CouponWinModule = require('/ui/common/couponWin');
        new CouponWinModule().open();
    });

    tableHeaderView = Ti.UI.createView({
        layout : 'horizontal',
        height : '44dp'
    });
    tableHeaderView.add(emptyBtn);
    tableHeaderView.add(couponBtn);

    productTable = Ti.UI.createTableView({
        backgroundColor : 'transparent',
        separatorColor : 'transparent',
        headerView : tableHeaderView
    });

    if (Ti.Platform.getOsname() === 'android') {
        productTable.bottom = '44dp';
    }

    self.add(productTable);

    self.addEventListener('focus', function() {

        var rows, i, rowView, img, titleLbl, priceLbl, priceRowLbl, quantityLbl, rowViewArray = [], total = 0, coupon;

        rows = Ti.App.Properties.getObject('cart', {});

        for (i in rows) {
            if (rows.hasOwnProperty(i)) {
                //console.log(rows[i]);
                rowView = Ti.UI.createTableViewRow({
                    height : '110dp',
                    myTitle : rows[i].title,
                    data : rows[i],
                    className : 'cartRow',
                    backgroundImage : '/images/common/TableViewRowBG.png',
                    selectedBackgroundImage : '/images/common/TableViewRowSelectedBG.png'
                });

                img = Ti.UI.createImageView({
                    image : Ti.App.APIURL + 'api/pic/product/' + rows[i].id + '/100/100/1',
                    width : '100dp',
                    height : '100p',
                    right : '5dp',
                    borderRadius : 45,
                    defaultImage : '/images/common/default.png'
                });
                rowView.add(img);

                titleLbl = Ti.UI.createLabel({
                    text : rows[i].title,
                    color : '#ffffff',
                    left : '40dp',
                    right : '110dp',
                    top : '10dp',
                    textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT
                });
                rowView.add(titleLbl);

                priceLbl = Ti.UI.createLabel({
                    text : 'السعر : ' + rows[i].price,
                    color : '#ffffff',
                    right : '110dp',
                    bottom : '10dp',
                    textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT
                });
                rowView.add(priceLbl);

                total += parseFloat(rows[i].price) * parseInt(rows[i].quantity, 10);
                priceRowLbl = Ti.UI.createLabel({
                    text : parseFloat(rows[i].price) * parseInt(rows[i].quantity, 10),
                    color : '#ffffff',
                    left : '10dp',
                    bottom : '10dp',
                    textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
                });
                rowView.add(priceRowLbl);

                quantityLbl = Ti.UI.createLabel({
                    text : rows[i].quantity,
                    color : '#ffffff',
                    left : '10dp',
                    top : '10dp',
                    textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
                });
                rowView.add(quantityLbl);

                rowViewArray.push(rowView);
            }

        }

        coupon = Ti.App.Properties.getInt('coupon', 0);

        if (total > 0) {
            if (coupon > 0) {
                rowViewArray.push(Ti.UI.createTableViewRow({
                    title : 'قيمة الخصم : ' + coupon + ' جنية',
                    color : '#ffffff',
                    font : {
                        fontSize : '15dp'
                    }
                }));
            }

            total = total - coupon < 0 ? 0 : total - coupon;
            rowViewArray.push(Ti.UI.createTableViewRow({
                title : 'الإجمالي : ' + total + ' جنية',
                color : '#ffffff'
            }));
        }

        if (rowViewArray.length === 0) {// cart is empty

            rowViewArray.push(Ti.UI.createTableViewRow({
                title : 'سلة التسوق فارغة'
            }));
        }

        productTable.setData(rowViewArray);
    });

    return self;
}

module.exports = cartWin;

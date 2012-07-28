function productWin(product) {

    var self, mainScroll, productImg, titleLbl, quantityField, quantityMinusBtn, quantityPlusBtn, descLbl, addToCartBtn;

    self = Ti.UI.createWindow({
        title : product.title,
        backgroundImage : '/images/common/bg.jpg',
        barImage : '/images/common/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    mainScroll = Ti.UI.createScrollView();
    self.add(mainScroll);

    productImg = Ti.UI.createImageView({
        image : Ti.App.APIURL + 'api/pic/product/' + product.id + '/90/90/1',
        width : '90dp',
        height : '90dp',
        top : '10dp',
        right : '10dp',
        borderRadius : 45,
        defaultImage : '/images/common/default.png'
    });

    productImg.addEventListener('click', function() {

        var FullscreenWinModule = require('ui/common/imageFullscreen');
        new FullscreenWinModule({
            title : product.title,
            productID : product.id
        }).open();
    });

    mainScroll.add(productImg);

    titleLbl = Ti.UI.createLabel({
        text : product.title,
        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
        color : '#ffffff',
        font : {
            fontFamily : 'Arial',
            fontSize : '17dp',
            fontWeight : 'bold'
        },
        top : '25dp',
        right : '110dp',
        left : '10dp'
    });
    mainScroll.add(titleLbl);

    quantityField = Ti.UI.createLabel({
        text : Ti.App.cartQuantityByProductID(product.id) > 0 ? Ti.App.cartQuantityByProductID(product.id) : 1,
        textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
        width : '50dp',
        height : '40dp',
        left : '10dp',
        top : '70dp'
    });

    self.add(quantityField);

    quantityMinusBtn = Ti.UI.createButton({
        title : '-',
        width : '40dp',
        height : '40dp',
        left : '65dp',
        top : '70dp'
    });
    self.add(quantityMinusBtn);

    quantityPlusBtn = Ti.UI.createButton({
        title : '+',
        width : '40dp',
        height : '40dp',
        left : '110dp',
        top : '70dp'
    });
    self.add(quantityPlusBtn);

    // + and - buttons with product quantity
    function getQuantityFieldValue() {
        return parseInt(quantityField.getText(), 10);
    }

    function setQuantityFieldValue(newValue) {
        var value = parseInt(newValue, 10);

        // is it in minus ?
        if (value < 0) {
            value = 0;
        }

        // is it more then inventory quantity
        if (value > parseInt(product.quantity, 10)) {

            Ti.UI.createAlertDialog({
                title : 'الكمية لا تكفي',
                message : 'متوفر الان فقط ' + product.quantity + ' وحدة من هذا المنتج',
                cancel : 0,
                buttonNames : ['موافق']
            }).show();

            value = parseInt(product.quantity, 10);
        }

        quantityField.setText(value);
    }

    function plusMinusBtnsOnClick(e) {

        var value = getQuantityFieldValue();

        if (parseInt(product.quantity, 10) <= 0) {

            Ti.UI.createAlertDialog({
                title : 'غير متوفر',
                message : 'عفواً هذا المنتج غير متوفر بالمخازن الان.'
            }).show();

            return false;
        }

        if (e.source.title === '+') {
            setQuantityFieldValue(value + 1);
        } else {
            setQuantityFieldValue(value - 1);
        }
    }


    quantityMinusBtn.addEventListener('click', plusMinusBtnsOnClick);
    quantityPlusBtn.addEventListener('click', plusMinusBtnsOnClick);

    // description
    descLbl = Ti.UI.createLabel({
        text : product.desc,
        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
        color : '#000000',
        top : '120dp',
        right : '10dp',
        left : '10dp'
    });
    mainScroll.add(descLbl);

    // description
    addToCartBtn = Ti.UI.createButton({
        title : 'اضف لسلة التسوق',
        top : '180dp'
    });

    addToCartBtn.addEventListener('click', function() {

        if (parseInt(product.quantity, 10) < getQuantityFieldValue()) {
            Ti.UI.createAlertDialog({
                title : 'عفواً',
                message : 'متوفر في مخازننا فقط ' + product.quantity + ' وحدة.',
                buttonNames : ['موافق']
            }).show();
            return;
        }

        Ti.App.fireEvent('cartAdd', {
            productID : product.id,
            productTitle : product.title,
            quantity : getQuantityFieldValue(),
            price : product.price
        });

        Ti.App.fireEvent('closeProductWindow');
    });

    mainScroll.add(addToCartBtn);

    return self;
}

module.exports = productWin;

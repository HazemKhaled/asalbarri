function xml_rss() {
    var win = Ti.UI.createWindow({
        title : 'اسئلة واجوبة',
        backgroundImage : '/images/bg.jpg',
        barImage : '/images/Navigation_Bar.jpg',
        barColor : 'gray'
    });

    var xhr = Ti.Network.createHTTPClient();
    xhr.open("GET", "http://www.asalbarri.com/asal/api/faq");
    xhr.onload = function() {
        var rows, i, row, tableview, data = [];

        Ti.API.log(this.responseText);

        try {
            rows = JSON.parse(this.responseText);
        } catch (e) {
            return false;
        }

        for (i in rows) {
            row = Ti.UI.createTableViewRow({
                question : rows[i].question,
                answer : rows[i].answer,
                backgroundImage : '/images/TableViewRowBG.jpg',
                selectedBackgroundImage : '/images/TableViewRowSelectedBG.png',
            });

            row.add(Ti.UI.createLabel({
                text : rows[i].question,
                color : '#fff',
                font : {
                    fontSize : 24
                },
                textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
                height : 50,
                right : 5
            }));
            data.push(row);
        }
        tableview = Ti.UI.createTableView({
            data : data,
            backgroundColor : 'transparent',
            separatorColor : 'transparent'
        });
        win.add(tableview);
        tableview.addEventListener('click', function(e) {
            var w = Ti.UI.createWindow({
                title : e.row.question,
                backgroundImage : '/images/bg.jpg',
                barImage : '/images/Navigation_Bar.jpg',
                barColor : 'gray',
                navBarHidden : false,
                modal : Ti.Platform.getOsname() === 'iphone'
            });

            var scrollView = Ti.UI.createScrollView({
                layout : 'vertical',
                size : Ti.UI.FILL
            });
            w.add(scrollView);

            scrollView.add(Ti.UI.createLabel({
                text : rows[i].question,
                color : '#fff',
                font : {
                    fontSize : 24
                },
                textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
                right : 10,
                left : 10,
                top : 5
            }));
            scrollView.add(Ti.UI.createLabel({
                text : e.row.answer,
                color : '#fff',
                textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
                right : 10,
                left : 10,
                top : 10
            }));
            var b = Ti.UI.createButton({
                title : 'اغلاق'
            });
            w.setLeftNavButton(b);
            b.addEventListener('click', function() {
                w.close();
            });
            w.open();
        });
    };
    xhr.send();

    return win;
};

module.exports = xml_rss;


function xml_rss() {
    var win = Ti.UI.createWindow({
        title : 'اخبارنا',
        backgroundImage : '/images/bg.jpg',
        barImage : '/images/Navigation_Bar.jpg',
        barColor : 'gray'
    });

    // create table view data object
    var data = [];

    var xhr = Ti.Network.createHTTPClient();
    xhr.open("GET", "http://www.asalbarri.com/asalbarri/plugins-rss-news.html");
    xhr.onload = function() {
        try {
            var doc = this.responseXML.documentElement;
            var items = doc.getElementsByTagName("item");
            var x = 0;
            //var doctitle = doc.evaluate("//channel/title/text()").item(0).nodeValue;

            var c = 0;
            for (c; c < items.length; c++) {
                var item = items.item(c);

                var title = item.getElementsByTagName("title").item(0).text;
                var row = Ti.UI.createTableViewRow({
                    height : 95,
                    titleText : title,
                    description : item.getElementsByTagName("description").item(0).text,
                    url : item.getElementsByTagName("link").item(0).text,
                    backgroundImage : '/images/TableViewRowBG.jpg',
                    selectedBackgroundImage : '/images/TableViewRowSelectedBG.png',
                });
                var label = Ti.UI.createLabel({
                    text : title,
                    textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
                    color : '#ffffff',
                    font : {
                        fontFamily : 'Arial',
                        fontSize : 17,
                        fontWeight : 'bold'
                    },
                    right : 5,
                    top : 5,
                    bottom : 5,
                    left : 5
                });
                row.add(label);
                data[x++] = row;

            }
            var tableview = Ti.UI.createTableView({
                data : data,
                backgroundColor : 'transparent',
                separatorColor : 'transparent'
            });
            win.add(tableview);
            tableview.addEventListener('click', function(e) {
                var w = Ti.UI.createWindow({
                    title : e.row.titleText,
                    backgroundImage : '/images/bg.jpg',
                    barImage : '/images/Navigation_Bar.jpg',
                    barColor : 'gray',
                    navBarHidden : false,
                    modal : Ti.Platform.getOsname() === 'iphone'
                });
                var wb = Ti.UI.createWebView({
                    url : e.row.url
                    //html : " " + e.row.description
                });
                w.add(wb);
                var b = Ti.UI.createButton({
                    title : 'اغلاق'
                });
                w.setLeftNavButton(b);
                b.addEventListener('click', function() {
                    w.close();
                });
                w.open();
            });
        } catch(E) {
            Ti.API.log(E);
        }
    };
    xhr.send();

    return win;
};

module.exports = xml_rss;


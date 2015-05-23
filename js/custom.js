/*! @author Robert Hunt <rob.hunt@plugandplaydesign.co.uk>

 Name: Best of British Unsigned Music Map Custom jQuery Code

 Version: 1.0

 Copyright: ©2012

*/



// GLOBAL VARS

google.load('visualization', '1', {});



var type = 0,
bandid = '1MTG5aD_8QB57gTl0nkh4_Yfk4DsUNA0fX4zfbm4',
radioid = '1u8pAfKtChPSCm1-v-4HM3js2CqMAVkHLA4SfEhU',
data_taipei_treeid = '2615ee1b-08c7-4cc6-9ade-7cf1a81eb93d',
treeid = '1MPt7TDkCz47_oZZ2VGGZZ1X8UcfeIb0jNGv0-8gb',
map,
geocoder,
markerArr = [],
bandArr = [],
radioArr = [],
ibArr = [],
inactiveMarker = 'images/Tree.png' ,//"http://www.bestofbritishunsigned.com/music-map/images/band-marker.png",
activeMarker = 'images/Tree-3.png', //"http://www.bestofbritishunsigned.com/music-map/images/band-marker-selected.png",
farZoom = 6,
closeZoom = 12,
maxZoomLevel = 3,
closeLat = 25.043454,
closeLng = 121.538808,
farLat = 25.043454,
farLng = 121.538808,
GoogleFusionTablesAPIkey = 'AIzaSyBCUUAjeEqzjKc3rIc7-pqFVFEpGFvsawo',
treewebsiteLink = 'http://www.culture.gov.taipei/frontsite/tree/treeProtectListAction.do?method=doReadDetail&treeId=';



Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};
google.maps.Map.prototype.clearMarkers = function(markerIdx) {
    markerIdx = (typeof markerIdx != "undefined" && markerIdx >= 0) ? markerIdx : - 1;
    if (type == 0) {
        tempInactiveMarker = inactiveMarker.replace("radio", "band");
    } else {
        if (type == 1) {
            tempInactiveMarker = inactiveMarker.replace("band", "radio");
        }
    }
    if (typeof markerIdx != "undefined" && markerIdx >= 0) {
        markerArr[markerIdx][0].setVisible(false);
        markerArr[markerIdx][0].setIcon(tempInactiveMarker);
    } else {
        for (var i = 0; i < markerArr.length; i++) {
            markerArr[i][0].setVisible(false);
            markerArr[i][0].setIcon(tempInactiveMarker);
        }
    }
};
google.maps.Map.prototype.disableMarkers = function(markerIdx) {
    markerIdx = (typeof markerIdx != "undefined" && markerIdx >= 0) ? markerIdx : - 1;
    if (type == 0) {
        tempInactiveMarker = inactiveMarker.replace("Tree", "Tree-3").replace(".png", "-disabled.png");
    } else {
        if (type == 1) {
            tempInactiveMarker = inactiveMarker.replace("Tree-3", "Tree").replace(".png", "-disabled.png");
        }
    }
    if (typeof markerIdx != "undefined" && markerIdx >= 0) {
        markerArr[markerIdx][0].setIcon(tempInactiveMarker);
        markerArr[markerIdx][0].setClickable(false);
    } else {
        for (var i = 0; i < markerArr.length; i++) {
            markerArr[i][0].setIcon(tempInactiveMarker);
            markerArr[i][0].setClickable(false);
        }
    }
};
google.maps.Map.prototype.showMarkers = function(markerIdx) {
    markerIdx = (typeof markerIdx != "undefined" && markerIdx >= 0) ? markerIdx : - 1;
    tempMarkerArr = markerArr;
    if (type == 0) {
        tempInactiveMarker = inactiveMarker.replace("Tree", "Tree-3");
    } else {
        if (type == 1) {
            tempInactiveMarker = inactiveMarker.replace("Tree-3", "Tree");
        }
    }
    if (typeof markerIdx != "undefined" && markerIdx >= 0) {
        tempMarkerArr[markerIdx][0].setIcon(tempInactiveMarker);
        tempMarkerArr[markerIdx][0].setVisible(true);
        tempMarkerArr[markerIdx][0].setClickable(true);
        var lat = tempMarkerArr[markerIdx][0].getPosition().lat();
        var lng = tempMarkerArr[markerIdx][0].getPosition().lng();
        
        map.setZoom(closeZoom);
        var latLng = new google.maps.LatLng(lat, lng);
        map.panTo(latLng);
    } else {
        for (var i = 0; i < tempMarkerArr.length; i++) {
            tempMarkerArr[i][0].setIcon(tempInactiveMarker);
            tempMarkerArr[i][0].setVisible(true);
            tempMarkerArr[i][0].setClickable(true);
            var lat = tempMarkerArr[i][0].getPosition().lat();
            var lng = tempMarkerArr[i][0].getPosition().lng();
            
            map.setZoom(closeZoom);
            var latLng = new google.maps.LatLng(closeLat, closeLng);
            map.panTo(latLng);
        }
    }
    markerArr = tempMarkerArr;
};
function updateDataHeight($data) {
    $("#left-main").animate({
        height: $data.outerHeight(true)
    }, 250);
}
function optSort(a, b) {
    return (a.value > b.value) ? 1 : - 1;
}
function updateFilters(markerArr) {
    var autoArr = markerArr;
    var $sortGenre = $("#sort-genre");
    var $sortShow = $("#sort-show");
    var genreList = [], showList = [];
    var $defaultOpt = $sortGenre.find("option.top");
    $sortGenre.empty().append($defaultOpt);
    $defaultOpt = $sortShow.find("option.top");
    $sortShow.empty().append($defaultOpt);
    for (var i = 0, len = autoArr.length; i < len; i++) {
        if ($.inArray(autoArr[i][0]["genre"], genreList) < 0 && autoArr[i][0]["genre"] != "") {
            $("<option />", {
                value: autoArr[i][0]["genre"],
                text: autoArr[i][0]["genre"]
            }).appendTo("#sort-genre");
            genreList.push(autoArr[i][0]["genre"]);
        }
        if ($.inArray(autoArr[i][0]["show"], showList) < 0 && autoArr[i][0]["show"] != "") {
            $("<option />", {
                value: autoArr[i][0]["show"],
                text: autoArr[i][0]["show"]
            }).appendTo("#sort-show");
            showList.push(autoArr[i][0]["show"]);
        }
    }
    $sortGenre.find("option:not(.top)").sort(optSort).appendTo("#sort-genre");
    $sortShow.find("option:not(.top)").sort(optSort).appendTo("#sort-show");
    genreList = genreList.clean("");
    showList = showList.clean("");
}
/******* Used by original method ***********
function setData(tableid) {
    if (markerArr.length > 0) {
        markerArr = [];
    }
    var query = new google.visualization.Query("http://www.google.com/fusiontables/gvizdata?tq=" + encodeURIComponent("SELECT * FROM " + tableid));
    //var query = new google.visualization.Query("http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=" + tableid + "&format=xml");
    query.send(getData);
}
function getData(response) {
    numRows = response.getDataTable().getNumberOfRows();
    numCols = response.getDataTable().getNumberOfColumns();
    for (i = 0; i < numRows; i++) {
        var row = [];
        for (j = 0; j < numCols; j++) {
            row.push(response.getDataTable().getValue(i, j));
        }
        dropMarkers(row, i);
    }
    updateFilters(markerArr);
    for (i = 0; i < markerArr.length; i++) {
        var lat = markerArr[i][0].getPosition().lat();
        var lng = markerArr[i][0].getPosition().lng();
        if ((lat < 49.6 || lat > 61) && (lng<-13.41 || lng>-1.46)) {
            map.setZoom(farZoom);
            var latLng = new google.maps.LatLng(farLat, farLng);
            map.panTo(latLng);
        } else {
            map.setZoom(closeZoom);
            var latLng = new google.maps.LatLng(closeLat, closeLng);
            map.panTo(latLng);
        }
    }
}
*/
function setDataAjax(tableid) {
    var query = "SELECT * FROM " + tableid;
    var encodedQuery = encodeURIComponent(query);

    // Construct the URL
    var url = ['https://www.googleapis.com/fusiontables/v2/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key=' + GoogleFusionTablesAPIkey);
    url.push('&callback=?');

    // Send the JSONP request using jQuery
    $.ajax({
        url: url.join(''),
        dataType: 'jsonp',
        success: function (data) {
            var rows = data['rows'];
            for (i = 0; i < rows.length; i++) {
                dropMarkers(rows[i], i);
            }
            updateFilters(markerArr);
            for (i = 0; i < markerArr.length; i++) {
                var lat = markerArr[i][0].getPosition().lat();
                var lng = markerArr[i][0].getPosition().lng();
                map.setZoom(closeZoom);
                var latLng = new google.maps.LatLng(closeLat, closeLng);
                map.panTo(latLng);
            }           
        }
    });
}
function timeAgo(dateString) {
    var rightNow = new Date();
    var then = new Date(dateString);
    if ($.browser.msie) {
        then = Date.parse(dateString.replace(/( \+)/, " UTC$1"));
    }
    var diff = rightNow - then;
    var second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24, week = day * 7;
    if (isNaN(diff) || diff < 0) {
        return "";
    }
    if (diff < second * 2) {
        return "right now";
    }
    if (diff < minute) {
        return Math.floor(diff / second) + " seconds ago";
    }
    if (diff < minute * 2) {
        return "about 1 minute ago";
    }
    if (diff < hour) {
        return Math.floor(diff / minute) + " minutes ago";
    }
    if (diff < hour * 2) {
        return "about 1 hour ago";
    }
    if (diff < day) {
        return Math.floor(diff / hour) + " hours ago";
    }
    if (diff > day && diff < day * 2) {
        return "yesterday";
    }
    if (diff < day * 365) {
        return Math.floor(diff / day) + " days ago";
    } else {
        return "over a year ago";
    }
}
function autolink(str, attributes) {
    if (typeof str === "undefined") {
        return;
    }
    attributes = attributes || {};
    var attrs = "";
    for (name in attributes) {
        attrs += " " + name + '="' + attributes[name] + '"';
    }
    var reg = new RegExp("(\\s?)((http|https|ftp)://[^\\s<]+[^\\s<.)])", "gim");
    str = str.toString().replace(reg, '$1<a href="$2"' + attrs + ">$2</a>");
    return str;
}
function changeData(marker, currentIdx, dataHTML, clear) {
    var clear = clear || false;
    if (!markerArr[currentIdx][1] && clear === false) {
        markerArr[currentIdx][1] = true;
        marker.setIcon(activeMarker);
        $("#loading-data").fadeIn(600, "linear", function() {
            $("#full-data").html(dataHTML).fadeIn(350, "linear", function() {
                updateDataHeight($(this));
            });
            $("#no-data").fadeOut(200);
            //var twitAcc = $("#full-data #twitter-feed").data("account");
            //var $twitFeed = $("#full-data #twitter-feed .tweets");
            /*
            if (twitAcc) {
                $.jTwitter(twitAcc, 1, function(data) {
                    $twitFeed.siblings("#loading-tweets").fadeIn(600);
                    $twitFeed.empty();
                    var tweetCount = 0;
                    $.each(data, function(i, post) {
                        tweetCount++;
                        var date = post.created_at;
                        var text = post.text;
                        if ($.browser.msie) {
                            date = date.replace(/[+]\d{4}/, "");
                        }
                        $twitFeed.append('<div class="tweet"><a class="tweet-account" href="https://twitter.com/' + post.user.screen_name + '" title="' + post.user.screen_name + '" target="_blank" rel="nofollow">' + post.user.screen_name + '</a><p class="tweet-text">' + autolink(text, {
                            target: "_blank",
                            rel: "nofollow"
                        }) + '</p><span class="tweet-date">' + timeAgo(date) + "</span></div>");
                    });
                    if (tweetCount > 0) {
                        $twitFeed.siblings("#loading-tweets").fadeOut(600, "linear", function() {
                            console.log($twitFeed);
                            $twitFeed.fadeIn(350, "linear", function() {
                                updateDataHeight($(this).add($("#full-data")));
                            });
                        });
                    } else {
                        $twitFeed.fadeOut(200);
                        updateDataHeight($("#full-data"));
                    }
                });
            }
            */
        }).fadeOut(600);
    } else {
        markerArr[currentIdx][1] = false;
        $("#loading-data").fadeOut(600, "linear", function() {
            $("#no-data").fadeIn(350, "linear", function() {
                updateDataHeight($(this));
            });
            $("#full-data").empty().fadeOut(200);
        });
    }
}
function createInfoBox(marker, row, currentIndex) {
    if (typeof ibArr[currentIndex] != "undefined" && ibArr[currentIndex] !== false && ibArr[currentIndex].length > 0) {
        ibArr[currentIndex].show();
    } else {
        var boxText = document.createElement("div");
        boxText.innerHTML = row[1] + ". " + row[3] ;
        var myOptions = {
            content: boxText,
            disableAutoPan: false,
            maxWidth: 0,
            pixelOffset: new google.maps.Size( - 62.5, - 80),
            zIndex: null,
            closeBoxURL: "",
            infoBoxClearance: new google.maps.Size(1, 1),
            isHidden: false,
            pane: "floatPane",
            enableEventPropagation: false
        };
        ib = new InfoBox(myOptions);
        ib.open(map, marker);
        ibArr[currentIndex] = ib;
    }
}
function closeInfoBox(currentIndex) {
    ibArr[currentIndex].hide();
}
function addMarker(coordinate, row) {
    var marker = new google.maps.Marker({
        map: map,
        position: coordinate,
        animate: google.maps.Animation.DROP,
        icon: new google.maps.MarkerImage(inactiveMarker),
        location: (type == 0) ? row[2]: row[3],
        name: row[1],
        genre: row[18],
        show: row[3]
    });
    markerArr.push([marker, false]);
    return marker;
}
function dropMarkers(row, i) {
    if (row[21] && row[22]) {
        codeAddress(row, i);
    }
}
function codeAddress(row, currentIdx) {
    /********** Original Version *************
    var tableCos = (type == 0) ? row[1]: row[2];
    tableCos = tableCos.replace(" ", "").split(",");
    var coordinate = new google.maps.LatLng(tableCos[0], tableCos[1]);
    var marker = addMarker(coordinate, row);
    if (type == 0) {
        var dataHTML = "<h3>" + row[0] + '</h3><span class="location">' + row[2] + "</span>";
        if (row[3]) {
            dataHTML = dataHTML + '<a class="webLink" href="' + row[3] + '" title="" target="_blank" rel="nofollow">' + row[3] + "</a>";
        }
        if (row[5] || row[6] || row[7]) {
            dataHTML = dataHTML + '<ul class="social">';
            if (row[5]) {
                dataHTML = dataHTML + '<li class="first facebook"><a href="' + row[5] + '" title="" target="_blank" rel="nofollow"></a></li>';
            }
            if (row[6]) {
                dataHTML = dataHTML + '<li class="twitter"><a href="' + row[6] + '" title="" target="_blank" rel="nofollow"></a></li>';
            }
            if (row[7]) {
                dataHTML = dataHTML + '<li class="last music"><a href="' + row[7] + '" title="" target="_blank" rel="nofollow"></a></li>';
            }
            dataHTML = dataHTML + "</ul>";
        }
        if (row[9]) {
            dataHTML = dataHTML + '<span class="featuredOn">Featured on Show #' + row[9] + "</span>";
        }
        if (row[4]) {
            dataHTML = dataHTML + "<hr /><p>" + autolink(row[4].replace(/\n/g, "<br />"), {
                target: "_blank",
                rel: "nofollow"
            }) + "</p>";
        }
        if (row[6]) {
            var twitAcc = row[6].split("/");
            twitAcc = twitAcc[twitAcc.length - 1];
            if (twitAcc == "testing") {
                dataHTML = dataHTML + '<hr /><div id="twitter-feed" data-account="' + twitAcc + '"><h4>Latest Tweet</h4><div id="loading-tweets"><img alt="Loading Data" title="Loading Data" src="images/loading.gif" width="32" height="32" /></div><div class="tweets"></div></div>';
            }
        }
    } else {
        if (type == 1) {
            var dataHTML = "<h3>" + row[0] + '</h3><span class="station location">' + row[3] + "</span>";
            if (row[4]) {
                dataHTML = dataHTML + '<a class="webLink" href="' + row[4] + '" title="" target="_blank" rel="nofollow">' + row[4] + "</a>";
            }
            if (row[5] || row[6] || row[7]) {
                dataHTML = dataHTML + '<ul class="social">';
                if (row[7]) {
                    dataHTML = dataHTML + '<li class="first facebook"><a href="' + row[7] + '" title="" target="_blank" rel="nofollow"></a></li>';
                }
                if (row[8]) {
                    dataHTML = dataHTML + '<li class="twitter"><a href="' + row[8] + '" title="" target="_blank" rel="nofollow"></a></li>';
                }
                if (row[9]) {
                    dataHTML = dataHTML + '<li class="last music"><a href="' + row[9] + '" title="" target="_blank" rel="nofollow"></a></li></ul>';
                }
            }
            if (row[5]) {
                dataHTML = dataHTML + '<span class="featuredOn">Broadcasting since ' + row[5] + "</span>";
            }
            if (row[6]) {
                dataHTML = dataHTML + "<hr /><p>" + row[6].replace(/\n/g, "<br />") + "</p>";
            }
            if (row[8]) {
                var twitAcc = row[8].split("/");
                twitAcc = twitAcc[twitAcc.length - 1];
                if (twitAcc) {
                    dataHTML = dataHTML + '<hr /><div id="twitter-feed" data-account="' + twitAcc + '"><h4>Latest Tweet</h4><div id="loading-tweets"><img alt="Loading Data" title="Loading Data" src="images/loading.gif" width="32" height="32" /></div><div class="tweets"></div></div>';
                }
            }
        }
    }
    google.maps.event.addListener(marker, "mouseover", function(event) {
        createInfoBox(marker, row, currentIdx);
    });
    google.maps.event.addListener(marker, "mouseout", function(event) {
        closeInfoBox(currentIdx);
    });
    google.maps.event.addListener(marker, "click", function(event) {
        for (var i = 0, len = markerArr.length; i < len; i++) {
            if (markerArr[i][0].clickable) {
                markerArr[i][0].setIcon(inactiveMarker);
            }
            if (i != currentIdx) {
                markerArr[i][1] = false;
            }
        }
        changeData(marker, currentIdx, dataHTML);
    });
    google.maps.event.addListener(map, "zoom_changed", function() {
        if (map.getZoom() < maxZoomLevel) {
            map.setZoom(maxZoomLevel);
        }
    });
    */

    /******* My own version ***********/
    //var tableCos = (type == 0) ? row[1]: row[2];
    //tableCos = tableCos.replace(" ", "").split(",");
    var coordinate = new google.maps.LatLng(row[22], row[21]);
    var marker = addMarker(coordinate, row);
    if (type == 0) {
        var dataHTML = "<h3> " + row[1].toString() + '.  '+ row[3]  +'</h3><span class="admin">' + row[5]  + "</span>";
        
        if (row[17]) {
            dataHTML = dataHTML + '<a class="webLink" href="' + treewebsiteLink + row[0] + '" title="" target="_blank" rel="nofollow">' + "Detailed Information" + "</a>";
        }
        if (row[15]) {
            dataHTML = dataHTML + '<img class="pic" src="' + row[15] + '" alt="Smiley face">';
        }
        
        /*
        if (row[5] || row[6] || row[7]) {
            dataHTML = dataHTML + '<ul class="social">';
            if (row[5]) {
                dataHTML = dataHTML + '<li class="first facebook"><a href="' + row[5] + '" title="" target="_blank" rel="nofollow"></a></li>';
            }
            if (row[6]) {
                dataHTML = dataHTML + '<li class="twitter"><a href="' + row[6] + '" title="" target="_blank" rel="nofollow"></a></li>';
            }
            if (row[7]) {
                dataHTML = dataHTML + '<li class="last music"><a href="' + row[7] + '" title="" target="_blank" rel="nofollow"></a></li>';
            }
            dataHTML = dataHTML + "</ul>";
        }
        if (row[9]) {
            dataHTML = dataHTML + '<span class="featuredOn">Featured on Show #' + row[9] + "</span>";
        }
        */
        if (row[20]) {
            dataHTML = dataHTML + "<hr /><p>" + autolink(row[20].replace(/\n/g, "<br />"), {
                target: "_blank",
                rel: "nofollow"
            }) + "</p>";
        }
        /*
        if (row[6]) {
            var twitAcc = row[6].split("/");
            twitAcc = twitAcc[twitAcc.length - 1];
            if (twitAcc == "testing") {
                dataHTML = dataHTML + '<hr /><div id="twitter-feed" data-account="' + twitAcc + '"><h4>Latest Tweet</h4><div id="loading-tweets"><img alt="Loading Data" title="Loading Data" src="images/loading.gif" width="32" height="32" /></div><div class="tweets"></div></div>';
            }
        }
        */
    } else {
        if (type == 1) {
            var dataHTML = "<h3>" + row[0] + '</h3><span class="station location">' + row[3] + "</span>";
            if (row[4]) {
                dataHTML = dataHTML + '<a class="webLink" href="' + row[4] + '" title="" target="_blank" rel="nofollow">' + row[4] + "</a>";
            }
            if (row[5] || row[6] || row[7]) {
                dataHTML = dataHTML + '<ul class="social">';
                if (row[7]) {
                    dataHTML = dataHTML + '<li class="first facebook"><a href="' + row[7] + '" title="" target="_blank" rel="nofollow"></a></li>';
                }
                if (row[8]) {
                    dataHTML = dataHTML + '<li class="twitter"><a href="' + row[8] + '" title="" target="_blank" rel="nofollow"></a></li>';
                }
                if (row[9]) {
                    dataHTML = dataHTML + '<li class="last music"><a href="' + row[9] + '" title="" target="_blank" rel="nofollow"></a></li></ul>';
                }
            }
            if (row[5]) {
                dataHTML = dataHTML + '<span class="featuredOn">Broadcasting since ' + row[5] + "</span>";
            }
            if (row[6]) {
                dataHTML = dataHTML + "<hr /><p>" + row[6].replace(/\n/g, "<br />") + "</p>";
            }
            if (row[8]) {
                var twitAcc = row[8].split("/");
                twitAcc = twitAcc[twitAcc.length - 1];
                if (twitAcc) {
                    dataHTML = dataHTML + '<hr /><div id="twitter-feed" data-account="' + twitAcc + '"><h4>Latest Tweet</h4><div id="loading-tweets"><img alt="Loading Data" title="Loading Data" src="images/loading.gif" width="32" height="32" /></div><div class="tweets"></div></div>';
                }
            }
        }
    }
    google.maps.event.addListener(marker, "mouseover", function(event) {
        createInfoBox(marker, row, currentIdx);
    });
    google.maps.event.addListener(marker, "mouseout", function(event) {
        closeInfoBox(currentIdx);
    });
    google.maps.event.addListener(marker, "click", function(event) {
        for (var i = 0, len = markerArr.length; i < len; i++) {
            if (markerArr[i][0].clickable) {
                markerArr[i][0].setIcon(inactiveMarker);
            }
            if (i != currentIdx) {
                markerArr[i][1] = false;
            }
        }
        changeData(marker, currentIdx, dataHTML);
    });
    google.maps.event.addListener(map, "zoom_changed", function() {
        if (map.getZoom() < maxZoomLevel) {
            map.setZoom(maxZoomLevel);
        }
    });
}
function initialize() {
    var mapStyle = [
    {
        featureType: "administrative",
        stylers: [{
            visibility: "on"
        }
        ]
    }
    //, {
    //     featureType: "poi",
    //     stylers: [{
    //         visibility: "off"
    //     }
    //     ]
    // }, {
    //     featureType: "road",
    //     stylers: [{
    //         visibility: "off"
    //     }
    //     ]
    // }, {
    //     featureType: "transit",
    //     stylers: [{
    //         visibility: "off"
    //     }
    //     ]
    // }, {
    //     featureType: "water",
    //     stylers: [{
    //         visibility: "simplified"
    //     }
    //     ]
    // }, {
    //     featureType: "landscape",
    //     elementType: "labels",
    //     stylers: [{
    //         visibility: "off"
    //     }
    //     ]
    // }
    ];
    var styledMap = new google.maps.StyledMapType(mapStyle, {
        name: "Styled Map"
    });
    var mapOptions = {
        center: new google.maps.LatLng(closeLat, closeLng),
        zoom: closeZoom,
        streetViewControl: false,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        panControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        mapTypeControl: false,
        mapTypeControlOptions: {
            mapTypeId: [google.maps.MapTypeId.ROADMAP, "map_style"]
        }
    };
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    map.mapTypes.set("map_style", styledMap);
    map.setMapTypeId("map_style");
    setDataAjax(treeid);
}
$(window).on("load", this, function(e) {
    initialize();
});
jQuery(document).ready(function($) {
    var $searchForm = $("#header-search"), $searchIn = $("#header-search-input");
    $('<ul id="autoComp"></ul>').insertAfter($searchIn);
    var $autoComp = $("#autoComp"), $sortGenre = $("#sort-genre"), $sortShow = $("#sort-show"), entered = false;
    $sortGenre.add($sortShow).customSelect().each(function(i, e) {
        var v = $(this).val();
        var selectID = $(this).attr("id").split("-")[1];
        if (v == "") {
            $customInner = $(this).next(".customSelect").children(" .customSelectInner");
            if (selectID == "genre") {
                $customInner.text("種類");
            } else {
                $customInner.text("行政區");
            }
        }
    });

    /*
    $("#left-top a").on("click", this, function(e) {
        e.preventDefault();
        var thisID = $(this).attr("id").split("-")[0];
        if (!$(this).hasClass("current")) {
            $(this).addClass("current").siblings(".current").removeClass("current");
            for (var i = 0, len = markerArr.length; i < len; i++) {
                if (markerArr[i][1]) {
                    changeData(markerArr[i][0], i, "", true);
                }
            }
            if (thisID == "bands") {
                type = 0;
                map.clearMarkers();
                inactiveMarker = inactiveMarker.replace("radio", "band");
                activeMarker = activeMarker.replace("radio", "band");
                $searchForm.find(".right label").text("Sort Bands By:").siblings("input").css("margin-right", "150px");
                setData(bandid);
            } else {
                if (thisID == "radio") {
                    type = 1;
                    map.clearMarkers();
                    inactiveMarker = inactiveMarker.replace("band", "radio");
                    activeMarker = activeMarker.replace("band", "radio");
                    $searchForm.find(".right label").text("Sort Stations By:").siblings("input").css("margin-right", "144px");
                    setData(radioid);
                }
            }
            $searchIn.val("");
            updateFilters(markerArr);
            $sortGenre.add($sortShow).find("option.top").attr("selected", "selected");
            $autoComp.empty().slideUp(250);
        }
    });
    */
    /*
    $searchIn.on("keyup", this, function(e) {
        var k = e.keyCode || e.which;
        var v = $(this).val().toLowerCase();
        if (k != 13) {
            entered = false;
        }
        $autoComp.empty();
        if (v.length > 1) {
            var autoArr = markerArr;
            var j = 0;
            for (var i = 0, len = autoArr.length; i < len; i++) {
                if (autoArr[i][0]["name"].toLowerCase().indexOf(v) >= 0) {
                    var classes = ((i == 0 || j == 0) ? ' class="first"' : (i == len - 1 || j == len - 1) ? ' class="last"' : "");
                    $("<li" + classes + '><a href="" title="">' + autoArr[i][0]["name"] + "</a>").on("click", this, function(e) {
                        e.preventDefault();
                        var value = $(this).text();
                        $searchIn.val(value);
                        $autoComp.slideUp(250);
                        $searchForm.submit();
                        return false;
                    }).appendTo($autoComp);
                    j++;
                }
            }
            if (j == 0) {
                $autoComp.empty();
                $('<li class="first last none"><a href="" title="">No results found for "' + $searchIn.val() + '"</a>').on("click", this, function(e) {
                    e.preventDefault();
                    return false;
                }).appendTo($autoComp);
            }
        }
    });
    $searchIn.on("focus, keyup", this, function(e) {
        if ($autoComp.children("li").length > 0&&!entered) {
            $autoComp.slideDown(250);
        }
    }).on("blur, keyup", this, function(e) {
        if ($autoComp.children("li").length < 1) {
            $autoComp.slideUp(250);
        }
    });
    */
    $sortGenre.add($sortShow).on("change", this, function(e) {
        var v = $(this).val();
        var selectID = $(this).attr("id").split("-")[1];
        if (!$.isArray(v)) {
            var autoArr = markerArr;
            $searchIn.val("");
            map.disableMarkers();
            var j = 0;
            var foundMarker =- 1;
            if (v == "") {
                map.showMarkers();
                j = 100;
                $(this).siblings("select").find("option.top").attr("selected", "selected");
                $customInner = $(this).next(".customSelect").children(" .customSelectInner");
                if (selectID == "genre") {
                    $customInner.text("種類");
                } else {
                    $customInner.text("行政區");
                }
            } else {
                for (var i = 0, len = autoArr.length; i < len; i++) {
                    if (((typeof autoArr[i][0][selectID] == "string" && autoArr[i][0][selectID] != "") || (typeof autoArr[i][0][selectID] == "number" && autoArr[i][0][selectID] >= 0)) && autoArr[i][0][selectID] == v) {
                        map.showMarkers(i);
                        foundMarker = i;
                        j++;
                    }
                }
            }
            if (j == 1&&!autoArr[foundMarker][1]) {
                new google.maps.event.trigger(autoArr[foundMarker][0], "click");
            } else {
                if (j == 1) {
                    autoArr[foundMarker][0].setIcon(activeMarker);
                } else {
                    if (j > 1) {
                        for (var i = 0, len = autoArr.length; i < len; i++) {
                            if (autoArr[i][1]) {
                                changeData(autoArr[i][0], i, "", true);
                            }
                        }
                    }
                }
            }
        }
    });
    /*
    $searchForm.on("submit", this, function(e) {
        e.preventDefault();
        var v = $searchIn.val().toLowerCase();
        $searchIn.parents("form").find("select").val($searchIn.parents("form").find("select option.top").val()).change();
        if (v) {
            var autoArr = markerArr;
            map.disableMarkers();
            var foundMarker =- 1;
            var j = 0;
            for (var i = 0, len = autoArr.length; i < len; i++) {
                if (autoArr[i][0]["name"].toLowerCase().indexOf(v) >= 0) {
                    map.showMarkers(i);
                    foundMarker = i;
                    j++;
                }
            }
            if (j == 1&&!autoArr[foundMarker][1]) {
                new google.maps.event.trigger(autoArr[foundMarker][0], "click");
            } else {
                if (j == 1) {
                    autoArr[foundMarker][0].setIcon(activeMarker);
                } else {
                    if (j > 1) {
                        for (var i = 0, len = autoArr.length; i < len; i++) {
                            if (autoArr[i][1]) {
                                changeData(autoArr[i][0], i, "", true);
                            }
                        }
                    }
                }
            }
            updateFilters(markerArr);
        } else {
            if (v == "") {
                map.clearMarkers();
                map.showMarkers();
            }
        }
        if ($autoComp.is(":visible")) {
            $autoComp.slideUp(250);
            entered = true;
        }
        return false;
    });
    $searchForm.on("reset", this, function(e) {
        map.clearMarkers();
        map.showMarkers();
        $searchIn.val("");
        if ($autoComp.is(":visible")) {
            $autoComp.slideUp(250);
            entered = true;
        }
        updateFilters(markerArr);
        $(this).find("select").val($(this).find("select option.top").val()).change();
    });
    */
});
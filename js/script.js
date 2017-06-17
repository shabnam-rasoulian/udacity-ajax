function loadData() {
    var $body = $("body");
    var $wikiElem = $("#wikipedia-links");
    var $nytHeaderElem = $("#nytimes-header");
    var $nytElem = $("#nytimes-articles");
    var $greeting = $("#greeting");

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $("#street").val();
    var cityStr = $("#city").val();
    var address = streetStr + ", " + cityStr;
    $greeting.text("So, you want to live at " + address + "?");
    var streetViewUrl = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + address + "";
    $body.append("<img class='bgimg' src='" + streetViewUrl + "'>");

    // load New York Times articles
    var NYTimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    NYTimesUrl += '?' + $.param({
  	'api-key': "6694b66e9ed04921aff8e23aa2174387",
  	'q': cityStr
    });
    $.getJSON(NYTimesUrl, function(data) {
    	var articles = data.response.docs;
	$nytHeaderElem.text("New York Times Articles About " + cityStr);
	for (var i = 0; i < articles.length; i++) {
		var article = articles[i];
		$nytElem.append("<li class='article'><a href='" + article.web_url + "'>" + article.headline.main + "</a><p>" + article.snippet + "</p></li>");
	}
    }).error(function() {
    	$nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
    });
    // load wikipedia links
    var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + cityStr + "&format=json&callback=wikiCallback";
    var timeOutRequest = setTimeout(function(){
    	$wikiElem.text("Failed to get Wikipedia resources")
    }, 8000);
    $.ajax( {
    	url: wikiUrl,
    	dataType: "jsonp",
    	success: function(data) {
          var links = data[1];
	  for (var i = 0; i < links.length; i++) {
		var link = links[i];
		var url = "https://en.wikipedia.org/wiki/" + link;
	  	$wikiElem.append("<li><a href='" + url  + "'>" + link + "</a></li>");
	  }
	  clearTimeout(timeOutRequest);
        }
    } );
    return false;
};

$("#form-container").submit(loadData);

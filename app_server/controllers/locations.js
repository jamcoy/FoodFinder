var request = require('request');
var apiOptions = {
    server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "https://tbc.jamcoy.com";
}

var getLocationInfo = function (req, res, callback) {
    var requestOptions, path;
    path = "/api/locations/" + req.params.locationid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            if (response.statusCode === 200) {
                data.coords = {
                    lng : body.coords[0],
                    lat : body.coords[1]
                };
                callback(req, res, data);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};
module.exports.locationInfo = function(req, res){
    getLocationInfo(req, res, function(req, res, responseData) {
        renderDetailPage(req, res, responseData);
    });
};
module.exports.addReview = function(req, res){
    getLocationInfo(req, res, function(req, res, responseData) {
        renderReviewForm(req, res, responseData);
    });
};


var renderHomepage = function(req, res, responseBody){
    var message;
    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } else {
        if (!responseBody.length) {
            message = "No places found nearby";
        }
    }
    res.render('locations-list', {
        title: 'Food Finder - find something to eat nearby!',
        pageHeader: {
            title: 'Food Finder',
            strapline: 'Find something to eat nearby!'
        },
        sidebar: "Looking for something to eat, but don't know the local area? Food finder will help you find food " +
        "fast!",
        locations: responseBody,
        message: message
    });
};

module.exports.homelist = function(req, res){
    var requestOptions, path;
    path = '/api/locations';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {
            lng : -0.9650000,
            lat : 51.442222,
            maxDistance : 5000 //meters
    }
};
    request(
        requestOptions,
        function(err, response, body) {
            var i, data;
            data = body;
            if (response.statusCode === 200 && data.length) {
                for (i = 0; i < data.length; i++) {
                    console.log(data[i].distance);
                    data[i].distance = _formatDistance(data[i].distance);
                }
            }
            renderHomepage(req, res, data);
        }
    );
};

var _isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

// Version of mongo seems to be returning meters, rather than radians
// Mongo geoNear documentation not clear what format it should be returned in,
// but old bug reports suggests it's alternated at different times
var _formatDistance = function (distance) {
    var numDistance, unit;
    if (distance && _isNumeric(distance)) {
        if (distance > 1000) {
            numDistance = parseFloat(distance / 1000).toFixed(1);
            unit = 'km';
        } else {
            numDistance = parseInt(distance);
            unit = 'm';
        }
        return numDistance + unit;
    } else {
        return "?";
    }
};

var renderDetailPage = function (req, res, locDetail) {
    res.render('location-info', {
        title: locDetail.name,
        pageHeader: {title: locDetail.name},
        sidebar: {
            context: 'Context...',
            callToAction: 'Call to action...'
        },
        location: locDetail
    });
};

var _showError = function (req, res, status) {
    var title, content;
        if (status === 404) {
            title = "404: page not found";
            content = "We can't find this page. Sorry.";
        } else {
            title = status + ", something's gone wrong";
            content = "Something has gone wrong.";
        }
    res.status(status);
    res.render('generic-text', {
        title : title,
        content : content
    });
};

var renderReviewForm = function (req, res, locDetail) {
    res.render('location-review-form', {
        title: 'Review ' + locDetail.name + ' on Food Finder',
        pageHeader: { title: 'Review ' + locDetail.name }
    });
};

module.exports.doAddReview = function(req, res){
    var requestOptions, path, locationid, postdata;
    locationid = req.params.locationid;
    path = "/api/locations/" + locationid + '/reviews';
    postdata = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json : postdata
    };
    request(
    requestOptions,
        function(err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/location/' + locationid);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};


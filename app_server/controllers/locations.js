module.exports.homelist = function(req, res){
    res.render('locations-list', {
        title: 'Food Finder - find something to eat nearby!',
        pageHeader: {
            title: 'Food Finder',
            strapline: 'Find something to eat nearby!'
        },
        sidebar: "Looking for something to eat, but don't know the local area? Food finder will help you find food " +
        "fast!",
        locations: [
            {
                name: 'Clucky Fried Chicken',
                address: '123 Chook Street, Aberdeen. AB12 3CD',
                rating: 3,
                facilities: ['Hot drinks', 'Food', 'Takeaway', 'WiFi'],
                distance: '125m'
            },
            {
                name: 'Burger Me',
                address: '321 Rue du Brexit, Aberdeen. AB13 2DW',
                rating: 4,
                facilities: ['Hot drinks', 'Food', 'Takeaway'],
                distance: '150m'
            },
            {
                name: 'Nina\'s',
                address: '1 Short Street, Aberdeen. AB12 4TW',
                rating: 2,
                facilities: ['Food', 'WiFi'],
                distance: '175m'
            }
        ]
    });
};

/* GET 'Location info' page */
module.exports.locationInfo = function(req, res){
    res.render('location-info', {
        title: 'Clucky Fried Chicken',
        pageHeader: {title: 'Clucky Fried Chicken'},
        sidebar: {
            context: 'is on Food Finder because it offers quick, convenient food.',
            callToAction: 'Please leave a review to help other people just like you.'
        },
        location: {
            name: 'Clucky Fried Chicken',
            address: '123 Chook Street, Aberdeen. AB12 3CD',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Takeaway', 'WiFi'],
            coords: {lat: 57.14671, lng: -2.10580},
            openingTimes: [
                {
                    days: 'Monday - Friday',
                    opening: '7:00am',
                    closing: '7:00pm',
                    closed: false
                },
                {
                    days: 'Saturday',
                    opening: '8:00am',
                    closing: '5:00pm',
                    closed: false
                },
                {
                    days: 'Sunday',
                    closed: true
                }
            ],
            reviews: [
                {
                    author: 'Stan Laurel',
                    rating: 5,
                    timestamp: '7 January 2016',
                    reviewText: 'What a great place!  I\'m lost for words!'
                },
                {
                    author: 'Oliver Hardy',
                    rating: 3,
                    timestamp: '8 January 2016',
                    reviewText: 'I kept getting bones stuck in my teeth.'
                }
            ]
        }
    });
};


/* GET 'Add review' page */
module.exports.addReview = function(req, res){
    res.render('location-review-form', {
        title: 'Review Clucky Fried Chicken on Food Finder',
        pageHeader: { title: 'Review Clucky Fried Chicken' }
    });
};



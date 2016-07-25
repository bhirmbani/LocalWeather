$(document).ready(function() {
    var getWeather = function() {
      String.prototype.capitalize = function(){
          return this.toLowerCase().replace( /\b\w/g, function (m) {
          return m.toUpperCase();
        });
      };

        var city = $('#city').val().capitalize();

        if (city === '') {
            $('#weather').html('<h2>Error</h2>');
        } else {
          // FINISH:30 change this into font awesome spinner icon
            document.querySelector('#weather-icon').setAttribute('class', 'fa fa-refresh fa-spin fa-3x fa-fw');
            document.getElementById('title').textContent = city + ' is..';
        }


				// open weather API req
        weather = $.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' +
            city + '&units=metric' + '&APPID=e2f5c0547e82a37cc4d2cc103e32e8a9',
            function(data) {
                weather = data;
                var country = data.sys.country;
                document.getElementById('title').textContent = city + ', ' + country;
                String.prototype.capitalize = function(){
                    return this.toLowerCase().replace( /\b\w/g, function (m) {
                    return m.toUpperCase();
                  });
                };
                // configure weathericon.io
                var weatherConditionId = data.weather[0].id;
                var weatherConditionTime = data.weather[0].icon;
                function confirmEnding(str, target) {
                  if(str.substr(-target.length) === target) {
                    return true;
                  } else {
                    return false;
                  }
                  return str;
                }
                var isNight = confirmEnding(weatherConditionTime, "n");
                // check the time
                if(isNight === true) {
                  document.querySelector('#weather-icon').setAttribute('class', 'wi wi-owm-night' +
                  '-' + weatherConditionId);
                } else {
                  document.querySelector('#weather-icon').setAttribute('class', 'wi wi-owm-day' +
                  '-' + weatherConditionId);
                }
								// FINISH:0 change text content to include city name
                $('#weather').html('<h2>' + data.weather[0].description.capitalize() + '</h2>');
                $('#degree').html('<h2>' + data.main.temp + ' °C' + '</h2>');
								var weatherCondition = data.weather[0].main;
								// FINISH:40 create flickr API req
								// https://api.flickr.com/services/rest/?method=flickr.photos.search
								flickr = $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search' +
								'&api_key=60ca023377080d65b7a78f0f617957bc&tags=' + weatherCondition + '&text='+
                weatherCondition + '%2C+' + city + '&extras=url_l%2C+owner_name' +
								'&format=json&nojsoncallback=1',
								function(data) {
									function getRandom() {
								 			return Math.floor(Math.random() * data.photos.photo.length);
										}
										// FINISH:10 fix photo recommendation
                    // TODO:10 change using shutterstock API https://developers.shutterstock.com/guides/getting-started
                    // if amount of photo equal or less than 2
									if(data.photos.total <= 2) {
										flickr = $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search' +
										'&api_key=60ca023377080d65b7a78f0f617957bc&text=' + weatherCondition +
										'&extras=url_l%2C+owner_name' +
										'&format=json&nojsoncallback=1', function(data){
											flickr = data;
											function getRandom() {
										 			return Math.floor(Math.random() * data.photos.photo.length);
												}
                        var photo = data.photos.photo[getRandom()];
                        var photoUrl = photo.url_l;
                        var photoOwner = photo.ownername;
                        var photoTitle = photo.title;
                        var ownerId = photo.owner;
                        var photoId = photo.id;
                        document.querySelector('body').style.backgroundImage = 'url('+
                         "'" + photoUrl + "'" + ')';
                        document.querySelector('#photoInfo').innerHTML = '<p>' +
                        photoTitle + ' by ' + '<a href=' + '"' +
                        'https://www.flickr.com/photos/' + ownerId +
                        '/' + photoId + '">' + photoOwner + '</a>' + '</p>';
                        document.querySelector('#siteName').textContent = 'YourWeather App';
										});
									} else {
										flickr = data;
                    var photo = data.photos.photo[getRandom()];
                    var photoUrl = photo.url_l;
                    var photoOwner = photo.ownername;
                    var photoTitle = photo.title;
                    var ownerId = photo.owner;
                    var photoId = photo.id;
										document.querySelector('body').style.backgroundImage = 'url('+
                     "'" + photoUrl + "'" + ')';
                    document.querySelector('#photoInfo').innerHTML = '<p>' +
                    photoTitle + ' by ' + '<a href=' + '"' +
                    'https://www.flickr.com/photos/' + ownerId +
                    '/' + photoId + '">' + photoOwner + '</a>' + '</p>';
                    document.querySelector('#siteName').textContent = 'YourWeather App';
                    // link to flickr photo
                    // https://www.flickr.com/photos/{owner}/{id} - individual photo

									}
								});
            });




    }; //end of getWeather function
    // TODO: function to check if mouse hover to content
    $('#content').mouseenter(function(){
      console.log('hovered');
    });



    // TODO:30 create function to clear weather condition and degree if there is a string when user click the button

    // FINISH:50 write a function to clear input text value when user press enter
    function clearTextInput() {
      city.value = "";
      $('#city').blur();
      document.getElementById('city').placeholder='Look for another place..?';
    }

// TODO:60 fix celcius to farenheit conversion
    $('#degree').click(function() {

    });

    $('#city').keyup(function(event) {
        if (event.keyCode == 13) {
            getWeather();
            clearTextInput();
        }
    });
});






// open weather api keys e2f5c0547e82a37cc4d2cc103e32e8a9
// open weather api request by coordinate:
// http://api.openweathermap.org/data/2.5/weather?lat=34.97&lon=138.93&APPID=e2f5c0547e82a37cc4d2cc103e32e8a9
// by city name:
// http://api.openweathermap.org/data/2.5/weather?q=London&APPID=e2f5c0547e82a37cc4d2cc103e32e8a9

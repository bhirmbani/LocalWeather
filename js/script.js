
$(document).ready(function () {
  // // ============ THE FUNCTION ============== //
  var Func = {
    //capitalize
    capitalize: function (str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
      },

    // loading
    loading: function () {
        document.getElementById('weather-icon')
        .setAttribute('class', 'fa fa-refresh fa-spin fa-3x fa-fw');
        document.getElementById('title').textContent = Func.capitalize(Variable.city.value)
        + ' is..';
      },

    //clearTextInput
    clearTextInput: function () {
      city.value = null;
      $('#city').blur();
      document.getElementById('city').placeholder = 'Look for another place..?';
    },

    // check the time
    confirmEnding: function (str, target) {
      if (str.substr(-target.length) === target) {
        return true;
      } else {
        return false;
      }

      return str;
    },

    // getRandomPhoto
    getRandomPhoto: function (num) {
        return Math.floor(Math.random() * num);
      },

    //getUserInputWeather
    getUserInputWeather: function () {
      // store user location and capitalize it
      var userLocation = Func.capitalize(Variable.city.value);

      // get JSON from open weather API
      $.getJSON(Variable.weather + userLocation + Variable.measurement + Variable.weatherKey)
      .done(function (weatherData) {
        console.log('The user input: ' + userLocation);
        var country = weatherData.sys.country;
        var description  = Func.capitalize(weatherData.weather[0].description);
        var degree = weatherData.main.temp;
        document.getElementById('city').style.borderBottom = '3px solid #5cb85c';
        document.getElementById('title').textContent = userLocation + ', ' + country;
        Func.clearTextInput();

        // configure weathericon.io
        var weatherConditionId = weatherData.weather[0].id;
        var weatherConditionTime = weatherData.weather[0].icon;
        var isNight = Func.confirmEnding(weatherConditionTime, 'n');

        // check the time
        if (isNight === true) {
          document.querySelector('#weather-icon').setAttribute('class', 'wi wi-owm-night' +
                         '-' + weatherConditionId);
        } else {
          document.querySelector('#weather-icon').setAttribute('class', 'wi wi-owm-day' +
                         '-' + weatherConditionId);
        }

        // document.getElementById('weatherInfo').textContent = description;
        // document.getElementById('weatherInfo').textContent += ' , ' + degree + ' °C';

        var weatherCondition = weatherData.weather[0].main;
        $.getJSON(Variable.flickr + Variable.flickrKey + weatherCondition + Variable.text
          + weatherCondition + Variable.twoC + userLocation
          + Variable.extra + Variable.format).done(function (flickrData) {
            console.log(flickrData);
            console.log(weatherCondition);
            const photo = flickrData.photos.photo[Func.getRandomPhoto(flickrData.photos.photo.length)],
                  photoUrl = photo.url_l,
                  photoOwner = photo.ownername,
                  photoTitle = photo.title,
                  ownerId = photo.owner,
                  photoId = photo.id;
            document.querySelector('body').style.backgroundImage = 'url(' +
                                    "'" + photoUrl + "'" + ')';

            // if amount of photo equal or less than 2
            if (flickrData.photos.total <= 2) {
              $.getJSON(Variable.flickr + Variable.flickrKey + weatherCondition +
                Variable.extra + Variable.format).done(function (photoDataLess) {
                  console.log(flickrData.photos.photo.length);
                  console.log(weatherCondition);
                  console.log(photoDataLess);
                  const photo = photoDataLess.photos.photo[Func.getRandomPhoto(photoDataLess.photos.photo.length)],
                        photoUrl = photo.url_l,
                        photoOwner = photo.ownername,
                        photoTitle = photo.title,
                        ownerId = photo.owner,
                        photoId = photo.id;
                  document.querySelector('body').style.backgroundImage = 'url(' +
                                          "'" + photoUrl + "'" + ')';

                  //                         var photo = data.photos.photo[getRandom()];
                  //                         var photoUrl = photo.url_l;
                  //                         var photoOwner = photo.ownername;
                  //                         var photoTitle = photo.title;
                  //                         var ownerId = photo.owner;
                  //                         var photoId = photo.id;
                  //                         document.querySelector('body').style.backgroundImage = 'url('+
                  //                          "'" + photoUrl + "'" + ')';
                  //                         document.querySelector('#photoInfo').innerHTML = '<p>' +
                  //                         photoTitle + ' by ' + '<a href=' + '"' +
                  //                         'https://www.flickr.com/photos/' + ownerId +
                  //                         '/' + photoId + '">' + photoOwner + '</a>' + '</p>';
                  //                         document.querySelector('#siteName').textContent = 'YourWeather App';
              });
            }
          });
      });

    },

    // var weatherCondition = data.weather[0].main;
  };

  // ============ THE VARIABLE ============== //
  var Variable = {
        // input from user
        input: document.getElementByClassName('input'),

        // ============ OPEN WEATHER CONFIGURATION ============ //
        // =========== weather + userlocation + measurement + weatherKey ============ //
        weather: 'http://api.openweathermap.org/data/2.5/weather?q=',
        measurement: '&units=metric',
        weatherKey: '&APPID=e2f5c0547e82a37cc4d2cc103e32e8a9',

        // ============ FLICKR CONFIGURATION ============ //
        // =========== flickr + flickrKey + weatherCondition + text //
        // + weatherCondition + twoC + userlocation + extra + format ============ //
        flickr: 'https://api.flickr.com/services/rest/?method=flickr.photos.search',
        flickrKey: '&api_key=60ca023377080d65b7a78f0f617957bc&tags=',
        text: '&text=',
        twoC: '%2C+',
        extra: '&extras=url_l%2C+owner_name',
        format: '&format=json&nojsoncallback=1',

      };

				// open weather API req
//         var weather = $.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' +
//             city + '&units=metric' + '&APPID=e2f5c0547e82a37cc4d2cc103e32e8a9',
//             function(data) {
//
//                 var country = data.sys.country;
//                 document.getElementById('title').textContent = city + ', ' + country;
//                 String.prototype.capitalize = function(){
//                     return this.toLowerCase().replace( /\b\w/g, function (m) {
//                     return m.toUpperCase();
//                   });
//                 };
//                 var weatherConditionId = data.weather[0].id;
//                 var weatherConditionTime = data.weather[0].icon;
//                 function confirmEnding(str, target) {
//                   if(str.substr(-target.length) === target) {
//                     return true;
//                   } else {
//                     return false;
//                   }
//                   return str;
//                 }
//                 var isNight = confirmEnding(weatherConditionTime, "n");
//                 // check the time
//                 if(isNight === true) {
//                   document.querySelector('#weather-icon').setAttribute('class', 'wi wi-owm-night' +
//                   '-' + weatherConditionId);
//                 } else {
//                   document.querySelector('#weather-icon').setAttribute('class', 'wi wi-owm-day' +
//                   '-' + weatherConditionId);
//                 }

//                 $('#weather').html('<h2>' + data.weather[0].description.capitalize() + '</h2>');
//                 $('#degree').html('<h2>' + data.main.temp + ' °C' + '</h2>');
// 								var weatherCondition = data.weather[0].main;

// 								// https://api.flickr.com/services/rest/?method=flickr.photos.search
// 								var flickr = $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search' +
// 								'&api_key=60ca023377080d65b7a78f0f617957bc&tags=' + weatherCondition + '&text='+
//                 weatherCondition + '%2C+' + city + '&extras=url_l%2C+owner_name' +
// 								'&format=json&nojsoncallback=1',
// 								function(data) {
// 									function getRandom() {
// 								 			return Math.floor(Math.random() * data.photos.photo.length);
// 										}
//                     // TODO:20 change using shutterstock API https://developers.shutterstock.com/guides/getting-started
//                     // if amount of photo equal or less than 2
// 									if(data.photos.total <= 2) {
// 										var flickr = $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search' +
// 										'&api_key=60ca023377080d65b7a78f0f617957bc&text=' + weatherCondition +
// 										'&extras=url_l%2C+owner_name' +
// 										'&format=json&nojsoncallback=1', function(data){
//
// 											function getRandom() {
// 										 			return Math.floor(Math.random() * data.photos.photo.length);
// 												}
//                         var photo = data.photos.photo[getRandom()];
//                         var photoUrl = photo.url_l;
//                         var photoOwner = photo.ownername;
//                         var photoTitle = photo.title;
//                         var ownerId = photo.owner;
//                         var photoId = photo.id;
//                         document.querySelector('body').style.backgroundImage = 'url('+
//                          "'" + photoUrl + "'" + ')';
//                         document.querySelector('#photoInfo').innerHTML = '<p>' +
//                         photoTitle + ' by ' + '<a href=' + '"' +
//                         'https://www.flickr.com/photos/' + ownerId +
//                         '/' + photoId + '">' + photoOwner + '</a>' + '</p>';
//                         document.querySelector('#siteName').textContent = 'YourWeather App';
// 										});
// 									} else {
//
//                     var photo = data.photos.photo[getRandom()];
//                     var photoUrl = photo.url_l;
//                     var photoOwner = photo.ownername;
//                     var photoTitle = photo.title;
//                     var ownerId = photo.owner;
//                     var photoId = photo.id;
// 										document.querySelector('body').style.backgroundImage = 'url('+
//                      "'" + photoUrl + "'" + ')';
//                     document.querySelector('#photoInfo').innerHTML = '<p>' +
//                     photoTitle + ' by ' + '<a href=' + '"' +
//                     'https://www.flickr.com/photos/' + ownerId +
//                     '/' + photoId + '">' + photoOwner + '</a>' + '</p>';
//                     document.querySelector('#siteName').textContent = 'YourWeather App';
//                     // link to flickr photo
//                     // https://www.flickr.com/photos/{owner}/{id} - individual photo
//
// 									}
// 								});
//             });
//
//
//
//
//
//     // TODO:10 function to check if mouse hover to content
//     $('#content').mouseenter(function(){
//       console.log('hovered');
//     });
//
//
//
//     // TODO:50 create function to clear weather condition and degree if there is a string when user click the button
//
    // function clearTextInput() {
    //   city.value = "";
    //   $('#city').blur();
    //   document.getElementById('city').placeholder='Look for another place..?';
    // }
//
// // TODO:80 fix celcius to farenheit conversion
//     $('#degree').click(function() {
//
//     });
//
    $('.input').keyup(function(event) {
      if(Variable.input.value == '') {
        console.log('this input is required');
        document.getElementByClassName('input').placeholder = 'Please type your location first.';
        $('.input').blur();
        document.getElementByClassName('input').style.borderBottom = '3px solid #d9534f';
        // #d9534f
        // #5cb85c
        // #337ab7
        // #fff
      } else {
        if (event.keyCode == 13) {
            Func.getUserInputWeather();
            Func.loading()
            document.getElementById('city').style.borderBottom = '3px solid #337ab7';
        }
      }

    });
// }

});




// open weather api keys e2f5c0547e82a37cc4d2cc103e32e8a9
// open weather api request by coordinate:
// http://api.openweathermap.org/data/2.5/weather?lat=34.97&lon=138.93&APPID=e2f5c0547e82a37cc4d2cc103e32e8a9
// by city name:
// http://api.openweathermap.org/data/2.5/weather?q=London&APPID=e2f5c0547e82a37cc4d2cc103e32e8a9

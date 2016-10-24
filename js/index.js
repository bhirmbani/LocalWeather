$(document).ready(function (){

  // ============ THE VARIABLE ============== //
  var Variable = {
    userInput: $('#input'),
    initText: $('.cover-text-child'),
    headlineText: $('.cover-headline-text'),
    tempText: $('.cover-paragraph-text'),
    descText: $('.cover-desc-text'),
    startPos: null,
    countryCode: null,
    description: null,
    userLocation: null,
    countryFlag: 'https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/',
    shortSum: null,
    // ============ DARK SKY APIs CONFIGURATION ============ //
    // =========== url + key + lat + comma + long + languageId + measurement ============ //
    url: 'https://api.darksky.net/forecast/',
    key: 'f9f004ed4be8589d22e072ce2fc3effb/',
    lat: null,
    comma: ',',
    long: null,
    q: '?',
    languageId: 'lang=id',
    measurement: '&units=si',
    // ============ Google Geocoding APIs CONFIG ============ //
    // =========== geocodingUrl + address + userLocation + geoKey ============ //
    geocodingUrl: 'https://maps.googleapis.com/maps/api/geocode/json?&',
    address: 'address=',
    geoKey: '&key=AIzaSyAvfVxPoTtNcLydCKxvJmwqs2A-ezEeaVY',
  };

  var Func = {
    //capitalize
    capitalize: function (str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
      },
    //clearTextInput
    clearTextInput: function () {
      $('.userInput').val() = null;
      $('#city').blur();
      document.getElementById('city').placeholder = 'Look for another place..?';
    },
    // Geolocation
    toggleGeo: function () {
      var geoSuccess = function(position) {
        Variable.startPos = position;
        console.log(Variable.startPos.coords.latitude);
        console.log(Variable.startPos.coords.longitude);
        var lat = Variable.startPos.coords.latitude;
        var long = Variable.startPos.coords.longitude;
      }
      navigator.geolocation.getCurrentPosition(geoSuccess);
    },
    // loading
    loading: function () {
      console.log('input value from loading function: ' + Variable.userInput.val());
        $('.cover-text-child').html('<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>');
        $('.cover-text-child').css('font-size', '2em');
        $('.cover-text-child').css('visibility', 'visible');
        // Variable.userInput.val('');
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
    toggleHidden: function() {
      $('.cover-input-parent').css('visibility', 'hidden');
      $('.cover-input-parent').addClass('animated fadeOutUp');
    },
    toggleVisible: function(){
      $('.cover-input-parent').css('visibility', 'visible');
      $('.cover-input-parent').removeClass('animated fadeOutUp');
      $('.cover-input-parent').addClass('animated fadeInDown');      
    },
    inputNormal: function() {
      Variable.userInput.attr({placeholder:'type your location', class:'userInput'});
      Variable.userInput.val('');
    },
    inputError: function() {
      // Variable.userInput.attr({class:'userInput', id:'userInputErr'});
      Variable.userInput.attr({class:'userInputErr', placeholder:"this input can't be empty"});
    },
    // getRandomPhoto
    getRandomPhoto: function (num) {
      return Math.floor(Math.random() * num);
      },

    // google geocoding
    getUserInputWeather: function() {
      Variable.userLocation = Func.capitalize(Variable.userInput.val());
      $.getJSON(Variable.geocodingUrl + Variable.address + Variable.userLocation + Variable.geoKey, function(geoData) {
        if(geoData.status == "ZERO_RESULTS") {
          Variable.initText.html('<h1 class="cover-headline-text animated zoomIn">' + 'Your input: ' + Variable.userLocation + '</h1>');
          Variable.initText.append("<p class='cover-paragraph-text animated zoomIn'>This location doesn't exist. Please try again.</p>");
        } else {
          Variable.lat = geoData.results[0].geometry.location.lat;
        Variable.long = geoData.results[0].geometry.location.lng;
        var countryCodeInit = geoData.results[0].address_components.slice(-1)[0].short_name;
        // return true if INT (check if country code from google APIs is the last element on the array)
        if(!isNaN(countryCodeInit) === true) {
          console.log('is countryCode a number? ' + !isNaN(countryCodeInit));
          Variable.countryCode = geoData.results[0].address_components.slice(-2)[0].short_name.toLowerCase();
        } else {
          console.log('is countryCode a number? ' + !isNaN(countryCodeInit));
          Variable.countryCode = countryCodeInit.toLowerCase();
        }
        
        console.log(Variable.lat + ' ' + Variable.long);
        // dark sky API
        $.ajax({
          url: Variable.url + Variable.key + Variable.lat + Variable.comma + Variable.long + Variable.q + Variable.measurement,
          dataType: 'JSONP',
          jsonpCallback: 'callbackFnc',
          type: 'GET',
          asnyc: false,
          crossDomain: true,
          success: function (darkskyData) { 
            var temp = darkskyData.currently.temperature;
            var longSum = darkskyData.hourly.summary;
            Variable.shortSum = darkskyData.currently.summary;
            var icon = darkskyData.currently.icon;
            var skycons = new Skycons({"color": "#fff"});
            Variable.initText.html('<canvas class="animated zoomIn" id="mainWeatherIcon" width="128" height="128"></canvas>');
            skycons.add('mainWeatherIcon', icon);
            var flagInit = '<div class="flag">' + '<img src="' + Variable.countryFlag + Variable.countryCode + '.svg' + '"' + '/></div>';
            skycons.play();
            Variable.initText.append('<h1 class="cover-location-text animated zoomIn">' + Variable.userLocation + ' ' + flagInit + '</h1>');
            Variable.initText.append('<p class="cover-paragraph-text animated zoomIn">' + Variable.shortSum + '</p>');
            Variable.initText.append('<p class="cover-paragraph-text animated zoomIn">' + longSum + '</p>');
            Variable.initText.append('<p class="cover-paragraph-text animated zoomIn">' + '<span class="changeUnit">' + temp + '</span>' + ' °C' + '</p>');
            // get photo from pexels
              $.ajax({
              url: 'https://api.pexels.com/v1/search?query=' + Variable.shortSum,
              beforeSend: function (req){
                req.setRequestHeader('Authorization', '563492ad6f9170000100000143de09da7d704c1d67462c54f4d9a25e');
              },
              dataType: 'JSON',
              asnyc: false,
              crossDomain: true,
              success: function(pexelsData){
                var randomPhoto = Func.getRandomPhoto(pexelsData.photos.length);
                console.log('total photo(s) available for this weather condition: ' + pexelsData.total_results);
                var photoUrl = pexelsData.photos[randomPhoto].src.landscape;
                console.log(photoUrl);
                $('.cover-img').css({background: 'url(' + photoUrl +  ') no-repeat center fixed', backgroundSize: 'cover', height: '95vh', padding: '0'})
                console.log(this.url);
              },
            });
          
          },
          failure: function () { },
          complete: function () { }
        });
        }
      });
    },
    clearInput: function() {
      Variable.userInput.blur();
      Variable.userInput.val('');
      Variable.userInput.attr({placeholder:'type here to check another location', class:'userInputAfter'});
    },
  } // end of Func
  // set background img
  initBackground();
  function initBackground() {
    var value = ['beach', 'sunset', 'rain', 'space'];
    var random = Func.getRandomPhoto(value.length);
    var randomValue = value[random];
    $.ajax({
    url: 'https://api.pexels.com/v1/search?query=' + randomValue,
    beforeSend: function (req){
      req.setRequestHeader('Authorization', '563492ad6f9170000100000143de09da7d704c1d67462c54f4d9a25e');
    },
      dataType: 'JSON', 
      asnyc: false,
      crossDomain: true,
      success: function(data) {
        var randomPhoto = Func.getRandomPhoto(data.photos.length);
        console.log('number of photo for ' + randomValue + ' is: ' + data.photos.length);
        var photoUrl = data.photos[randomPhoto].src.landscape;
        $('.cover-img').css({background: 'url(' + photoUrl + ') no-repeat center fixed', backgroundSize: 'cover', height: '95vh', padding: '0'});
        $('.cover-img').attr('class', 'animated slideInDown cover-img container-fluid');
      },
  });
  };
  // set default to off
  $('#c1').bootstrapToggle('off');
    // check for Geolocation support
  if (navigator.geolocation) {
    console.log('Geolocation is supported!');
  }
  else {
    console.log('Geolocation is not supported for this Browser/OS.');
  }
  // user click toggle
  $('#geoToggle').click(function (){
    if($('.cover-input-parent').css('visibility') === 'visible') {
      Func.toggleHidden();
      Func.toggleGeo();
    } else if ($('.cover-input-parent').css('visibility') === 'hidden') {
      Func.toggleVisible();
      Func.inputNormal();
    }
  });
  // user press enter
  Variable.userInput.keyup(function(event) {
  if(this.value == '') {
    console.log('this input is required');
    this.blur();
    Func.inputError();
    // #d9534f
    // #5cb85c
    // #337ab7
    // #fff
  } else {
    if (event.keyCode == 13) {
      Func.loading()
      Func.getUserInputWeather();
      Func.clearInput();
      
      console.log('input value from keyup event listener: ' + Variable.userLocation);
    }
  }
});
  // user click submit
  $('.btn-input').click(function() {
    if(Variable.userInput.val() == '') {
      console.log('this input is required');
      this.blur();
      Func.inputError();
    } else {
      var userLocation =  Func.capitalize(Variable.userInput.val());
      console.log('input value from submit button: ' + userLocation);
      Func.loading();
      Func.getUserInputWeather();
      Func.clearInput();
    }
  });
  // user want to change celcius to fahrenheit
  $('.changeUnit').click(function() {
    console.log('yes');
  });
}); // document.ready
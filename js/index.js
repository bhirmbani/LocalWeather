$(document).ready(function (){

  // ============ THE VARIABLE ============== //
  var Variable = {
    userInput: $('#input'),
    initText: $('.cover-text-child'),
    headlineText: $('.cover-headline-text'),
    tempText: $('.cover-paragraph-text'),
    descText: $('.cover-desc-text'),
    startPos: null,
    country: null,
    description: null,
    degree: null,
    // ============ DARK SKY APIs CONFIGURATION ============ //
    // =========== url + key + lat + comma + long + language + measurement ============ //
    url: 'https://api.darksky.net/forecast/',
    key: 'f9f004ed4be8589d22e072ce2fc3effb/',
    lat: null,
    comma: ',',
    long: null,
    language: '?lang=id',
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
      Variable.userInput.attr({placeholder:'type your city', class:'userInput'});
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
      var userLocation = Func.capitalize(Variable.userInput.val());
      $.getJSON(Variable.geocodingUrl + Variable.address + userLocation + Variable.geoKey, function(geoData) {
        Variable.lat = geoData.results[0].geometry.location.lat;
        Variable.long = geoData.results[0].geometry.location.lng;
        console.log(Variable.lat + ' ' + Variable.long);
        $.ajax({
          url: Variable.url + Variable.key + Variable.lat + Variable.comma + Variable.long + Variable.language + Variable.measurement,
          dataType: 'JSONP',
          jsonpCallback: 'callbackFnc',
          type: 'GET',
          asnyc: false,
          crossDomain: true,
          success: function (darkskyData) { 
            console.log(darkskyData.currently.summary);
          },
          failure: function () { },
          complete: function () { }
        });
      });
    }
  } // end of Func
  
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
      var inputValue = this.value;
      console.log('input value from keyup event listener: ' + this.value);
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
      Func.processInputWeather();
    }
  });
}); // document.ready
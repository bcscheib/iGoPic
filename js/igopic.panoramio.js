iGoPic.Panoramio = {
  addToDistance: 0.0003,
  minX: null,
  minY: null,
  maxX: null,
  maxY: null,
  numberOfPhotosToGet: 70,

  init: function(lat, lng) {
    iGoPic.Panoramio.setRectangle(lat, lng);
    iGoPic.Panoramio.requestJSON();
  },

  setRectangle: function(lat, lng) {
    iGoPic.Panoramio.minX = lng - iGoPic.Panoramio.addToDistance;
    iGoPic.Panoramio.maxX = lng + iGoPic.Panoramio.addToDistance;
    iGoPic.Panoramio.minY = lat - iGoPic.Panoramio.addToDistance;
    iGoPic.Panoramio.maxY = lat + iGoPic.Panoramio.addToDistance;
  },

  requestJSON: function() {
    var url = "http://www.panoramio.com/map/get_panoramas.php?size=thumbnail&order=popularity&set=public&callback=iGoPic.Panoramio.processJSON" +
        "&from=0&to=" + parseInt(iGoPic.Panoramio.numberOfPhotosToGet) +
        "&minx=" + parseFloat(iGoPic.Panoramio.minX) +
        "&maxx=" + parseFloat(iGoPic.Panoramio.maxX) +
        "&miny=" + parseFloat(iGoPic.Panoramio.minY) +
        "&maxy=" + parseFloat(iGoPic.Panoramio.maxY);

    $.ajax({
      url: url,
      success: iGoPic.Panoramio.processJSON,
      dataType: 'jsonp'
    });
  },

  processJSON: function(panoramioResponse) {
    var wasNewPhoto = false;
    for (i = 0; i < panoramioResponse.photos.length; i++) {
      var photoData = panoramioResponse.photos[i];
      var src = photoData.photo_file_url;
      if (!iGoPic.todaysPicsContains(src) && !iGoPic.todaysFailuresContains(src)) {
        i = panoramioResponse.photos.length;  // worry about getting out this for loop early later, bad code!
        wasNewPhoto = true;
      }
    }
    if (wasNewPhoto) {
      iGoPic.setDisplay('Was this photo taken near you?');
      $('#pic').html('<img src="' + src.replace('thumbnail','medium') + '" />');
      iGoPic.resizePic();
      $('#pic img').attr('class', '');
    }
    else {
      iGoPic.setDisplay('Sorry, no new local images available.<br/><a href="javascript:void(0);" id="reset_failures_link">Click here to see far away images again.</a>');
      $('#pic').hide();
    }
  }

};
var iGoPic = {
  init: function() {
    var lookup = jQT.updateLocation(function(coords) {
      if (coords) {
        iGoPic.initLocalStorage();

        iGoPic.Panoramio.init(coords.latitude, coords.longitude);
        $('#near_me').click(iGoPic.nearMeClick);
        $('#far_from_me').click(iGoPic.farFromMeClick);
        $('#next_pic').click(iGoPic.init);
        $('#reset_failures_link').live('click', iGoPic.resetFailures);
        $('#todays_pic_list img').live('click', iGoPic.clickTodayPic);
        $('body').bind('turn', iGoPic.resizePic);
        iGoPic.resetNearFar();
      } else {
        iGoPic.setDisplay('Sorry, we could not find you.');
      }
    });

    if (lookup) {
      iGoPic.setDisplay('Finding pics near you&hellip;');
    }
  },

  initLocalStorage: function() {
    if (localStorage.getItem('todays_pics')) {
      var picList = localStorage.getItem('todays_pics');
      $('#todays_pic_list').html(picList);
    }

    if (localStorage.getItem('todays_failures')) {
      var failureList = localStorage.getItem('todays_failures');
      $('#todays_failures_list').html(failureList);
    }
  },

  setDisplay: function(text) {
    $('.info').empty().append(text);
  },

  clickTodayPic: function() {
    jQT.goBack();
    var src = $(this).attr('src').replace('thumbnail', 'medium');
    $('#pic img').attr('src', src);

    iGoPic.resetNearFar();
    $('#near_me').addClass('clicked_ok');
    $('#pic').show();
    iGoPic.setDisplay('This pic has been marked as close to you.');
  },

  nearMeClick: function() {
    var src = $('#pic img').attr('src').replace('medium', 'thumbnail');
    iGoPic.addToPics(src);
    iGoPic.removeFromFailures(src);

    iGoPic.setDisplay("This pic has been marked as close to you.");
    $('#near_me').addClass('clicked_ok');
    $('#far_from_me').removeClass('clicked_not_ok');
    jQT.goTo('#today');
  },

  farFromMeClick: function() {
    var src = $('#pic img').attr('src').replace('medium', 'thumbnail');
    iGoPic.setDisplay("This pic has been marked as far from you.");
    iGoPic.removeFromPics(src);
    iGoPic.addToFailures(src);

    $('#near_me').removeClass('clicked_ok');
    $('#far_from_me').addClass('clicked_not_ok');
  },

  addToPics: function(imageSrc) {
    if (!iGoPic.todaysPicsContains(imageSrc)) {
      $('#todays_pic_list li').prepend('<img src="' + imageSrc + '" />');
      var picsHtml = $('#todays_pic_list').html();
      localStorage.setItem('todays_pics', picsHtml);
    }
  },

  removeFromPics: function(imageSrc) {
    if (iGoPic.todaysPicsContains(imageSrc)) {
      $('#todays_pic_list img[src="' + imageSrc + '"]').remove();
      var html = $('#todays_pic_list').html();
      localStorage.setItem('todays_pics', html);
    }
  },

  addToFailures: function(imageSrc) {
    if (!iGoPic.todaysFailuresContains(imageSrc)) {
      $('#todays_failures_list li').prepend('<img src="' + imageSrc + '" />');
      var html = $('#todays_failures_list').html();
      localStorage.setItem('todays_failures', html);
    }
  },

  removeFromFailures: function(imageSrc) {
    if (iGoPic.todaysFailuresContains(imageSrc)) {
      $('#todays_failures_list img[src="' + imageSrc + '"]').remove();
      var failuresHtml = $('#todays_failures_list').html();
      localStorage.setItem('todays_failures', failuresHtml);
    }
  },

  resetFailures: function(){
    $('#todays_failures_list li').empty();
    localStorage.setItem('todays_failures', null);
    iGoPic.init();
  },

  todaysPicsContains: function(imageSrc) {
    return $('#todays_pic_list img[src="' + imageSrc + '"]').length == 1;
  },

  todaysFailuresContains: function(imageSrc) {
    return $('#todays_failures_list img[src="' + imageSrc + '"]').length == 1;
  },

  resetNearFar: function() {
    $('#near_me').removeClass('clicked_ok');
    $('#far_from_me').removeClass('clicked_not_ok');
  },

  resizePic: function() {
    var width = $('#jqt').width() - 20;
    var height = $('#jqt').outerHeight() - ($('.toolbar').outerHeight() + $('.info').outerHeight() + 50 + $('.individual').height());
    if (height <= 50) {
      height = 100;
      $('.info').hide();
    } else {
      $('.info').show();
    }
    // not working in chrome need to fix this somehow
    $('#pic img').resize({maxHeight: height, maxWidth: width});
  }
};



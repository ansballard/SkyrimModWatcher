/*
 *  Array of list names, helps shorten a few things later
 */
var array_listNames = ['plugins','modlist','ini','prefsini'];

/*
 *  These are only arrays so they can be passed by reference
 *  HTML for each file list is at array[0] as a string
 */
var string_pluginsBody = [];
var string_modlistBody = [];
var string_iniBody = [];
var string_prefsiniBody = [];

/*
 *  Current file name for keeping track of the nav
 */
var string_currentFilename = "";

/*
 *  For the "Only Show Checked" button for modlist
 */
var checkedFiltered = false;

/*
 *  For expanding rows that are cutoff
 */
var expandedItem = undefined;

$(document).ready(function() {
  for(var i = 0; i < array_listNames.length; i++) { 
    $('#'+array_listNames[i]).hide();
  }
  $('#filter-checked').hide();
  $('.row-body').css('max-width', ($('#mod-list').width() - 110)+'px');
  $('.row-body').css('max-width', ($('#plugins').width() - 110)+'px');

  /*
   *  Populate and show a file based on url hash
   */
  if(window.location.hash) {
    hash = window.location.hash.substr(1);
    $.getJSON("/api/"+username+"/"+hash, function(data) {
      if(hash == "plugins") {
        populateList('plugins', string_pluginsBody);
        $('#plugins').show();
        string_currentFilename = "plugins";
        $('#'+hash+'Nav').addClass('selected');
      } else if(hash == "modlist") {
        populateList("modlist", string_modlistBody);
        $('#filter-checked').show();
        $('#modlist').show();
        string_currentFilename = "modlist";
        $('#'+hash+'Nav').addClass('selected');
      } else if(hash == "ini") {
        populateList("ini", string_iniBody);
        $('#ini').show();
        string_currentFilename = "ini";
        $('#'+hash+'Nav').addClass('selected');
      } else if(hash == "prefsini") {
        populateList("prefsini", string_prefsiniBody);
        $('#prefsini').show();
        string_currentFilename = "prefsini";
        $('#'+hash+'Nav').addClass('selected');
      } else {
        populateList('plugins', string_pluginsBody);
        $('#plugins').show();
        string_currentFilename = "plugins";
        $('#'+hash+'Nav').addClass('selected');
        window.location.hash = "";
      }
    });
  } else {
    populateList('plugins', string_pluginsBody);
    $('#plugins').show();
    string_currentFilename = "plugins";
    $('#pluginsNav').addClass('selected');
  }

  /*
   *  Call filterMods when something is typed in filter box
   */
  $('#filter-mods').keyup(filterMods);        

  /*
   *  Resize lists on window resize
   */
  $(window).resize(function() {
    $('.row-body').css('max-width', ($('#plugins').width() - 110)+'px');
  });

  /*
   *  Filters Modlist.txt for strings that start with a +
   */
  $('#filter-checked').click(function() {
    if(checkedFiltered) {
      checkedFiltered = false;
      $(this).html('Show Only Running Mods');
      filterMods();
    } else {
      var iterator = 0;
      $('#'+string_currentFilename+' > li').each(function(){
        var text = $(this).text().toLowerCase();
        text = text.substr(text.indexOf('.')+1, text.length);
        if(text.indexOf('+') == 0 || text.indexOf('*') == 0) {
          (iterator%2 == 0) ? $(this)[0].className = 'whited' : $(this)[0].className = 'grayed';
          iterator++;
          $(this).slideDown();
        } else {
          $(this).slideUp();
        }
      });
      checkedFiltered = true;
      $(this).html('Show All Mods');
    }
  });

  /*
   *  Handle changing the ENB via AJAX
   */
  $('#enbPost').submit(function(event) {
    $.ajax({
      type: "POST",
      url: $('#enbPost').attr('action'),
      data: {enb: $('#enb').val()},
      dataType: 'text',
      success: function() {
        if($('#enb').val() != "")
          $('#enbText').html("ENB: "+$('#enb').val());
        else
          $('#enbText').empty();
      },
      error: function() {
        alert('There was an error updating your ENB');
      }
    });
    event.preventDefault();
  });

  /*
   *  Handle changing the tag via AJAX
   */
  $('#tagPost').submit(function(event) {
    $.ajax({
      type: "POST",
      url: $('#tagPost').attr('action'),
      data: {tag: $('#tag').val()},
      dataType: 'text',
      success: function() {
        if($('#tag').val() != "")
          $('#tagText').html("\""+$('#tag').val()+"\"");
        else
          $('#tagText').empty();
      },
      error: function() {
        alert('There was an error updating your tags');
      }
    });
    event.preventDefault();
  });


  /*
   *  Next 2 handle long file names, blow up on mouseover, return on mouseout
   */
  $('#plugins span.row-body').mouseover(function() {
    if ($(this)[0].scrollWidth >  $(this).innerWidth()) {
      $(this).height($(this).height()*2);
      $(this).css('white-space','normal');
      expandedItem = $(this);
    }
  });
  $('#plugins span.row-body').mouseout(function() {
    if (expandedItem != undefined && $(this).css('white-space') != 'nowrap') {
      expandedItem.height($(this).height()/2);
      expandedItem.css('white-space','nowrap');
      expandedItem = undefined;
    }
  });
});

/*
 *  Filter mods by search bar value
 */
function filterMods() {
  var filterText = $('#filter-mods').val().toLowerCase();
  var iterator = 0;
  if(string_currentFilename.length != 0) {
    $('#'+string_currentFilename+' > li').each(function(){
      var text = $(this).text().toLowerCase();
      if(checkedFiltered && string_currentFilename == 'modlist') {
        text = text.substr(text.indexOf('.')+1, text.length);
        if((text.indexOf('+') == 0 || text.indexOf('*') == 0) && text.indexOf(filterText) >= 0) {
          (iterator%2 == 0) ? $(this)[0].className = 'whited' : $(this)[0].className = 'grayed';
          iterator++;
          $(this).slideDown();
        } else {
          $(this).slideUp();
        }
      }
      else if(text.indexOf(filterText) >= 0) {
        (iterator%2 == 0) ? $(this)[0].className = 'whited' : $(this)[0].className = 'grayed';
        iterator++;
        $(this).slideDown();
      } else {
        $(this).slideUp();
      }
    });
  }
}

/*
 *  Get a file as an array via ajax and feed it into it's corresponding list
 *  _callback is for NavigateLists to switch between files
 */
function populateList(_filename, _arrayRef, _callback) {
  $.getJSON("/api/"+username+"/"+_filename, function(data) {
    _arrayRef[0] = "";
    for(var i = 0, j = data.length-1; i < data.length; i++, j--) {
      _arrayRef[0] += "<li class='";

      if(i%2 == 1) {
        _arrayRef[0] += " grayed";
      } else {
        _arrayRef[0] += " whited";
      }
      if(_filename == "plugins") {
        _arrayRef[0] += "'><span class='row-header'>"+(i+1)+".</span><span class='row-body'>"+data[i].name+"</span><span class='row-footer "+data[i].name.substr(-3,3)+"'>"+data[i].name.substr(-3,3)+"</span></li>";
      } else if(_filename == "modlist") {
        _arrayRef[0] += "'><span class='row-header'>"+(i+1)+".</span><span class='row-body'>"+data[j].name+"</span></li>";
      } else {
        _arrayRef[0] += "'><span class='row-header'>"+(i+1)+".</span><span class='row-body'>"+data[i].name+"</span></li>";
      }
    }
    $('#'+_filename).html(_arrayRef[0]);
    $('#num-mods').html(data.length + " lines");
    typeof _callback === 'function' && _callback();
  });
}

/*
 *  Calls populateList and feeds it _filename
 */
function NavigateLists(_filename) {
  if(_filename != string_currentFilename) {
    if(_filename == "plugins") {
      populateList("plugins", string_pluginsBody, SwitchFiles(_filename));
    } else if(_filename == "modlist") {
      populateList("modlist", string_modlistBody, SwitchFiles(_filename));
    } else if(_filename == "ini") {
      populateList("ini", string_iniBody, SwitchFiles(_filename));
    } else if(_filename == "prefsini") {
      populateList("prefsini", string_prefsiniBody, SwitchFiles(_filename));
    }
  } else {
    return false;
  }
}

/*
 *  Called by NavigateLists via the populateLists callback, so files are only shown once data is fetched
 */
function SwitchFiles(_filename) {
  $('.selected').removeClass('selected');
  var originalScrollPos = $(document).scrollTop();
  $('#'+string_currentFilename).hide(0, function() {
    $('#'+string_currentFilename+' > li').each(function(){ if(!$(this).is(":visible")) {$(this).show();}});
    $('#'+_filename).show(0, function() {
      $('#'+_filename+'Nav').addClass('selected');
      $('#username').html(username);
      $('#filter-mods').val("");
      location.hash = _filename;
      jQuery('html,body').animate({scrollTop:originalScrollPos},0);
    });
  });
  if(_filename == 'modlist')
  {
    $('#filter-checked').show();
  } else {
    $('#filter-checked').hide();
  }
  string_currentFilename = _filename;
}
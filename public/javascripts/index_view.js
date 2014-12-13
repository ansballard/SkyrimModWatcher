var username = "<%- username %>";
var listoflistsbodies = ["", "", "", ""];
var listoflistsdata = [<%-list%>, <%-modlist%>, <%-skyrimini%>, <%-skyrimprefsini%>];
var listoflists = ['plugins','modlist','skyrimini','skyrimprefsini'];
var listoflistnames = ['Plugins.txt', 'Modlist.txt', 'Skyrim.ini','SkyrimPrefs.ini'];
var listoflistsindex = 0;
var checkedFiltered = false;

var expandedItem = undefined;

$(document).ready(function() {
  $('#modlist').hide();
  $('#skyrimini').hide();
  $('#skyrimprefsini').hide();
  $('#filter-checked').hide();

  listoflistsdata[1] = reverseArray(listoflistsdata[1]);

  for(var i = 0; i < listoflistsdata.length; i++) {
    if(listoflistsdata[i].length == 0)
    {
      $('#'+listoflists[i]+'Nav').hide();
    } 
    else 
    {
      for(var j = 0; j < listoflistsdata[i].length; j++) {
        listoflistsbodies[i] += "<li class='";
        if(j%2 == 1) {
          listoflistsbodies[i] += " grayed";
        } else {
          listoflistsbodies[i] += " whited";
        }
        if(i == 0) {
          listoflistsbodies[i] += "'><span class='row-header'>"+(j+1)+".</span><span class='row-body'>"+listoflistsdata[i][j]+"</span><span class='row-footer "+listoflistsdata[i][j].substr(-3,3)+"'>"+listoflistsdata[i][j].substr(-3,3)+"</span></li>";
        } else {
          listoflistsbodies[i] += "'><span class='row-header'>"+(j+1)+".</span><span class='row-body'>"+listoflistsdata[i][j]+"</span></li>";
        }
      }
    }
    $('#'+listoflists[i]).html(listoflistsbodies[i]);
  }

  //$('#username').html(username + "\'s " + listoflistnames[listoflistsindex]);
  $('#username').html(username);
  $('#num-mods').html(listoflistsdata[listoflistsindex].length + " lines");

  function filterMods() {
    var filterText = $('#filter-mods').val().toLowerCase();
    var iterator = 0;
    $('#'+listoflists[listoflistsindex]+' > li').each(function(){
      var text = $(this).text().toLowerCase();
      if(checkedFiltered && listoflistnames[listoflistsindex] == 'Modlist.txt') {
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

  $('#filter-mods').keyup(filterMods);

  $('.row-body').css('max-width', ($('#mod-list').width() - 110)+'px');

  $(window).resize(function() {
    $('.row-body').css('max-width', ($('#plugins').width() - 110)+'px');
  });

  $('#filter-checked').click(function() {
    if(checkedFiltered) {
      checkedFiltered = false;
      $(this).html('Show Only Running Mods');
      filterMods();
    } else {
      var iterator = 0;
      $('#'+listoflists[listoflistsindex]+' > li').each(function(){
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

  $('.row-body').css('max-width', ($('#plugins').width() - 110)+'px');

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

  if(window.location.hash) {
    hash = window.location.hash.substr(1);
    $('#'+hash+'Nav').trigger('click');
  } else {
    //
  }
});

function NavigateLists(_index, button) {
  if(_index != listoflistsindex) {
    location.hash = listoflists[_index];
    $('.selected').removeClass('selected');
    $('#'+listoflists[listoflistsindex]).toggle('display', function() {
      $('#'+listoflists[listoflistsindex]+' > li').each(function(){ if(!$(this).is(":visible")) {$(this).show();}});
      $('#'+listoflists[_index]).toggle('display', function() {
        $(button).addClass('selected');
        listoflistsindex = _index;
        $('#username').html(username);
        $('#filter-mods').val("");
      });
    });
    if(listoflistnames[_index] == 'Modlist.txt')
    {
      $('#filter-checked').show();
    } else {
      $('#filter-checked').hide();
    }
    return listoflistsindex;
  } else {
    return false;
  }
}

function reverseArray(_array) {
  var reversedArray = [];
  for(var i = 0, j = _array.length-1; i < _array.length; i++, j--) {
    reversedArray[i] = _array[j];
  }
  return reversedArray;
}
// Favorites
// Add Favorite
$("#"+mscSchedulizer_config.html_elements.schedules_container).on("click", "a.favorite_schedule", function (event) {
      event.preventDefault();
      //Add Course
      var schedule = JSON.parse(unescape(this.getAttribute('data-value')));
      if (node_generic_functions.searchListObjects(mscSchedulizer.favorite_schedules,schedule) === -1) {
          mscSchedulizer.favorite_schedules.push(schedule);
          localStorage.setItem('favorite_schedules', JSON.stringify(mscSchedulizer.favorite_schedules));
          // Update Element so it can be unfavorited
          $(this).addClass("unfavorite_schedule");
          $(this).removeClass("favorite_schedule");
          $(this).text("Unfavorite");
      }
  });
// Remove Favorite
$("#"+mscSchedulizer_config.html_elements.schedules_container).on("click", "a.unfavorite_schedule", function (event) {
    event.preventDefault();
    //Add Course
    var schedule = JSON.parse(unescape(this.getAttribute('data-value')));
    var index = node_generic_functions.searchListObjects(mscSchedulizer.favorite_schedules,schedule);
    if (index !== -1) {
        mscSchedulizer.favorite_schedules.splice(index, 1);
        localStorage.setItem('favorite_schedules', JSON.stringify(mscSchedulizer.favorite_schedules));
        // Update Element so it can be favorited
        $(this).addClass("favorite_schedule");
        $(this).removeClass("unfavorite_schedule");
        $(this).text("Favorite");
        if(node_generic_functions.inList(location.pathname.substr(location.pathname.lastIndexOf("/")+1), ["favorites.html"])){
          $(this).parents(".schedule_combination").fadeOut(500, function(){ $(this).remove();});
          var outputSchedules = mscSchedulizer.favorite_schedules.length + " schedule";
          if(mscSchedulizer.favorite_schedules.length != 1){outputSchedules += "s";}
          $("#schedules span.notice").text(outputSchedules);
        }
    }
});
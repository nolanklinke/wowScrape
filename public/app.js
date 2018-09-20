$.getJSON("/articles", function(data) {
    
    for (var i = 0; i < data.length; i++) {
  
       $("#articles").append(
        "<div class='col-sm-12' style='margin-bottom:30px;'><div class='card'><div class='card-body'><a class='title-link' href='" + data[i].link +"'><h5>" + data[i].title + "</h5></a><hr><p class='card-text'>" + data[i].snippet + "</p><button id='btn-save' data-id='" + data[i]._id + "' class='btn btn-outline-success btn-sm'>Save Article</button></div></div></div>"
      );
  }
  
    console.log(data);
  });
  
  // When scrape articles button is clicked
  $(document).on("click", ".btn-scrape", function() {
  
    $.ajax({
      method: "GET",
      url: "/scrape"
    })
      .done(function(data) {
        location.reload();
      });
  });

  // When save articles button is clicked
$(document).on("click", "#btn-save", function() {
  $(this).addClass("disabled");
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  $.ajax({
    method: "PUT",
    url: "/saved/" + thisId,
   
  })
  
  .done(function(data) {
      console.log(data);
  });
});
$.getJSON("/saved", function(data) {
    
    for (var i = 0; i < data.length; i++) {
  
       $("#articles").append(
        "<div class='col-sm-12' style='margin-bottom:30px;'><div class='card'><div class='card-body'><a class='title-link' href='" + data[i].link +"'><h5>" + data[i].title + "</h5></a><hr><p class='card-text'>" + data[i].snippet + "</p><button data-id='" + data[i]._id + "' class='btn-note btn btn-outline-primary btn-sm' data-toggle='modal' data-target='#myModal' style='margin-right:10px;'>Note</button><button id='btn-delete' data-id='" + data[i]._id + "' class='btn btn-outline-danger btn-sm'>Delete</button></div></div></div>"
      );
}
});

// When you click the Delete button
$(document).on("click", "#btn-delete", function() {
  
    var thisId = $(this).attr("data-id");
    console.log(thisId);
  
    $.ajax({
      method: "PUT",
      url: "/delete/" + thisId,
     
    })
    
    .done(function(data) {
        console.log(data);
        location.reload();
    });
  });


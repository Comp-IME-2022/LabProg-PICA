$(function() {
  console.log("Restoring Component!");
  var file = $('#myRestorationFile');
  var retrieveBtn = $("#submitRestore");
  var modalContainer = $("#modalContainer")
    file.bind('change', function() {

      var fileData = new FormData();
      var files = file[0].files[0];
      fileData.append('file', files);
      console.log("entrou no bind");
      console.log(fileData);
      console.log(file);
      console.log(files);

      retrieveBtn.on("click", function(e){
        e.preventDefault()

        console.log("entrou no ajax!")
        $.ajax({
          type : 'POST',
          url : '/document/retrievew',
          data: fileData,
          contentType: false,
          processData: false,
          success :() =>   {
              window.alert("recuperação feita com sucesso!");
              modalContainer.modal("hide");
            },
          error: (e) => console.log(e)
        });
      });
    });
});
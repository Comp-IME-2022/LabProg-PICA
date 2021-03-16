var file = $('#myfile');

console.log(file.files)

file.bind('change', function() {
    if (this.files[0].size > 20971520){
        alert("O tamanho máximo é 20MB!")
    }
});
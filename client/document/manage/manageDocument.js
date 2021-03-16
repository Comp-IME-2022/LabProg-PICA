$(function(){
    var sendBtn = $("#sendBtn");
    
    if(!checkAuth()){
        sendBtn.hide();
    }
});
var setCookie = function setAuthCookie(option){
    if(option){
        document.cookie = "auth=SUP3Rs3cUr3T0K3N";
    }else{
        document.cookie = "auth="
    }
};

var getAuth = function getAuthCookie(cname="auth") {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
};

var checkAuth = function checkAuthCookie(){
    return getAuth()!="";
};
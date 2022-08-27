document.getElementById("init_urp_login").addEventListener("click", init_urp_login)

function init_urp_login () {
    window.indexBridge.init_urp_login()
}

function urp_login() {
    window.indexBridge.urp_login(studentID,password,captcha)
}
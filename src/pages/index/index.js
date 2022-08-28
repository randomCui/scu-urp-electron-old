document.getElementById('captcha_img').addEventListener("click", init_urp_login)
document.getElementById('login').addEventListener("click", urp_login)

function init_urp_login() {
    window.indexBridge.init_urp_login()
}

function urp_login() {
    let form = document.getElementById('login-form')
    let data = new Map(new FormData(form).entries())

    window.indexBridge.urp_login(data.get('studentID'),
        data.get('password'),
        data.get('captcha'))
}

document.addEventListener('DOMContentLoaded',(ev)=>{
    init_urp_login()
})
document.getElementById('captcha_img').addEventListener("click", init_urp_login)
document.getElementById('login').addEventListener("click", urp_login)
// document.getElementById('enter-course-scheduler').addEventListener('click',)


document.addEventListener('DOMContentLoaded', () => {
    window.indexBridge.check_login_state().then((is_login) => {
        if (!is_login) {
            document.getElementById('login-wrapper').removeAttribute('hidden')
            document.getElementById('login-indicator').innerText = "目前尚未登录"
            init_urp_login()
        } else {
            document.getElementById('login-wrapper').setAttribute('hidden', 'hidden')
            document.getElementById('login-indicator').innerText = "已经登录过了"
        }
    })
})

function init_urp_login() {
    window.indexBridge.init_urp_login().then((buffer) => {
        console.log(buffer)
        let blob = new Blob([buffer], {type: "image/jpeg"})
        let img = document.getElementById('captcha_img')
        img.setAttribute('src', URL.createObjectURL(blob))
    })
}

function urp_login() {
    let form = document.getElementById('login-form')
    let data = new Map(new FormData(form).entries())

    window.indexBridge.urp_login(data.get('studentID'),
        data.get('password'),
        data.get('captcha'))
}

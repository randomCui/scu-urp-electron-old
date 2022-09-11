document.getElementById('captcha_img').addEventListener("click", init_urp_login)
document.getElementById('login').addEventListener("click", urp_login)


function rememberPassword(studentID, password) {
    if (!(studentID && password))
        return;
    window.indexBridge.rememberPassword(studentID, password);
}

function readLoginInfo() {
    window.indexBridge.readLoginInfo().then(jsonString => {
        let data = JSON.parse(jsonString);
        console.log(data);
        if (data['status'] === 'success') {
            let input1 = document.getElementsByName('studentID')[0];
            input1.value = data['studentID'];
            let input2 = document.getElementsByName('password')[0];
            input2.value = data['password'];
        }
    })
}


function changeLoginStateOnPage(is_login) {
    if (!is_login) {
        document.getElementById('login-wrapper').removeAttribute('hidden')
        document.getElementById('login-indicator').innerText = "目前尚未登录"
        init_urp_login()
    } else {
        document.getElementById('login-wrapper').setAttribute('hidden', 'hidden')
        document.getElementById('login-indicator').innerText = "已经登录过了"
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.indexBridge.check_login_state().then((is_login) => {
        changeLoginStateOnPage(is_login);
    })
    readLoginInfo();
})

async function init_urp_login() {
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

    window.indexBridge.rememberPassword(
        data.get('studentID'),
        data.get('password'),
    );

    window.indexBridge.urp_login(data.get('studentID'),
        data.get('password'),
        data.get('captcha')).then(result => {
        if (result['status'] === 'success') {
            changeLoginStateOnPage(true);
        } else if (result['status'] === 'failed') {
            init_urp_login();
            let content = document.querySelector('.content #login-wrapper');
            let alert = document.createElement('p');
            alert.innerText = result['message'];
            content.appendChild(alert);
        }
    })
}

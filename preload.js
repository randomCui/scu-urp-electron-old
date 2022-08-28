// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})

const {contextBridge, ipcMain, ipcRenderer} = require('electron')

let indexBridge = {
    init_urp_login: async () => {
        await ipcRenderer.invoke('init_urp_login')
    },
    urp_login: async (studentID, password, captcha) => {
        const md5 = require('md5')
        password = md5(password)
        let post_data = {
            "j_username": studentID,
            "j_password": password,
            "j_captcha": captcha,
        }
        await ipcRenderer.invoke('urp_login',post_data)
    }
}

ipcRenderer.on("captcha_blob", (event, buffer) => {
    let img = document.getElementById('captcha_img')
    console.log(buffer)
    let blob = new Blob([buffer], {type: "image/jpeg"})
    console.log(blob)
    img.setAttribute('src', URL.createObjectURL(blob))
})



contextBridge.exposeInMainWorld("indexBridge", indexBridge)
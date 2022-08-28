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

const {contextBridge, ipcRenderer} = require('electron')

let indexBridge = {
    init_urp_login: async () => {
        await ipcRenderer.send('init_urp_login')
    },
    urp_login: async (studentID, password, captcha) => {
        let post_data = {
            "j_username": studentID,
            "j_password": password,
            "j_captcha": captcha,
        }
        await ipcRenderer.send('urp_login', post_data)
    },
    check_login_state: async () => {
        return await ipcRenderer.invoke('check_login_state',)
    },
    /******
     * 通过给定的字符串搜索符合条件的课程
     *
     * @param conditionMap 保存条件和值的Map对象
     */
    searchCourse: async (conditionMap)=>{
        let search_string = '';
        conditionMap.forEach((value)=>{
            search_string += value + ' '
        });
        let searchPayload = {
            "searchtj": search_string,
            "xq": 0,
            "jc": 0,
            "kclbdm": ""
        }
        let response = await ipcRenderer.invoke('search_course',searchPayload)
    }
}

ipcRenderer.on("captcha_blob", (event, buffer) => {
    let img = document.getElementById('captcha_img')
    // console.log(buffer)
    let blob = new Blob([buffer], {type: "image/jpeg"})
    // console.log(blob)
    img.setAttribute('src', URL.createObjectURL(blob))
})


contextBridge.exposeInMainWorld("indexBridge", indexBridge)
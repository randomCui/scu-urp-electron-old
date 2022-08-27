const { contextBridge, ipcMain, ipcRenderer} = require('electron')

let indexBridge = {
    init_urp_login: async () => {
        let result = await ipcRenderer.invoke('init_urp_login')
    }
}

ipcRenderer.on("captcha_blob", (event, blob)=>{
    let img = document.getElementById('captcha')
    console.log(URL.createObjectURL(blob))
    img.setAttribute('src', URL.createObjectURL(blob))
})

contextBridge.exposeInMainWorld("indexBridge", indexBridge)

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
        let buffer = await ipcRenderer.invoke('init_urp_login')
        return buffer
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
}

let autoTakerBridge = {
    /******
     * 通过给定的字符串搜索符合条件的课程
     *
     * @param conditionMap 保存条件和值的Map对象
     * @param searchMode comprehensive->综合搜索  split->分条目搜索
     */
    searchCourse: async (conditionMap, searchMode) => {
        if (searchMode === 'comprehensive') {
            let search_string = '';
            conditionMap.forEach((value) => {
                search_string += value + ' '
            });
            let searchPayload = {
                "searchtj": search_string,
                "xq": 0,
                "jc": 0,
                "kclbdm": ""
            }
            let response = await ipcRenderer.invoke('search_course', searchPayload)
            return response;
        } else if (searchMode === 'split') {
            let searchPayload = {
                'zxjxjhh': '2022-2023-1-1',
                'kch': '',
                'kcm': conditionMap.get('comprehensive-search'),
                'js': '',
                'kkxs': '',
                'skxq': '',
                'sjhc': '',
                'xq': '',
                'jxl': '',
                'jas': '',
                'pageNum': 1,
                'pageSize': 1000000,
                'kclb': '',
            }
            let response = await ipcRenderer.invoke('search_course_alt', searchPayload)
            // console.log(response)
            return response
        }
    },
    is_course_selection_time: async () => {
        return await ipcRenderer.invoke('is_course_selection_time')
    },
    addSelectedCourses: async (course) => {
        // console.log(course);
        // 传递包含课程对象的列表
        ipcRenderer.send('addSelectedCourses',course);
    }
}


contextBridge.exposeInMainWorld("indexBridge", indexBridge);
contextBridge.exposeInMainWorld('autoTakerBridge', autoTakerBridge);
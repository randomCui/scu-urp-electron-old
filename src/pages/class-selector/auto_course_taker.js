document.getElementById('launch-search').addEventListener('click', searchCourse)

const {is_course_selection_time} = require('../../js/course_taker')
let {JSESSIONID} = require('../../js/config')

document.addEventListener('DOMContentLoaded', () => {
    if (is_course_selection_time(JSESSIONID)) {
        document.getElementById('selection-state-indicator').innerText = '目前在选课时间'
    } else {
        document.getElementById('selection-state-indicator').innerText = '不在选课时间'
    }
})

function searchCourse() {
    let form = document.getElementById('class-search-form')
    let map = new Map(new FormData(form).entries())
    console.log(map)
    window.indexBridge.searchCourse(map).then((response) => {
            console.log(response)
        }
    )
}
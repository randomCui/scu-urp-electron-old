document.getElementById('launch-search').addEventListener('click', searchCourse)

document.addEventListener('DOMContentLoaded', async () => {
    // console.log(await window.autoTakerBridge.is_course_selection_time())
    if (await window.autoTakerBridge.is_course_selection_time()) {
        document.getElementById('selection-state-indicator').innerText = '目前在选课时间'
    } else {
        document.getElementById('selection-state-indicator').innerText = '不在选课时间'
    }
})

function searchCourse() {
    let form = document.getElementById('class-search-form')
    let map = new Map(new FormData(form).entries())
    console.log(map)
    window.autoTakerBridge.searchCourse(map, 'split').then((text) => {
        let totalResponse = JSON.parse(text)
        console.log(totalResponse)
        let courseList = totalResponse['list']['records']
        console.log(courseList)
        return courseList
    }).then(courseList=>{
        buildForm(courseList)
    })
}

function buildForm(json) {
    let table = document.getElementById('gable');
    json.forEach(function (object) {
        let tr = document.createElement('tr');
        tr.innerHTML = '<td>' + object.kch + '</td>' +
            '<td>' + object.kcm + '</td>' +
            '<td>' + object.skjs + '</td>' +
            '<td>' + object.jasm + '</td>';
        table.appendChild(tr);
    });
}
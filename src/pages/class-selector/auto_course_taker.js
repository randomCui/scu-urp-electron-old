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
    }).then(courseList => {
        // 先清除原来的课程表
        document.querySelector('tbody').innerHTML = ''
        buildForm(courseList)
    })
}

function buildForm(json) {
    let table = document.querySelector('#course-info tbody')
    json.forEach(function (course, index) {
        let tr = document.createElement('tr');
        tr.setAttribute('id', 'course-' + index)

        let checkbox = document.createElement('input')
        checkbox.setAttribute('type', 'checkbox')
        tr.appendChild(checkbox)

        tr.innerHTML +=
            '<td>' + course['kch'] + '</td>' +
            '<td>' + course['kxh'] + '</td>' +
            '<td>' + course['kcm'] + '</td>' +
            '<td>' + course['skjs'] + '</td>' +
            '<td>' + course['jasm'] + '</td>';
        table.appendChild(tr);
    });
}

document.querySelector('#course-info tbody').addEventListener('click', (ev) => {
    console.log('点击事件');
    console.log(ev.target.parentNode);
    let row = ev.target.parentNode
    row.setAttribute('class', 'selected')
    row.querySelector('input').setAttribute('checked', true)
})
document.getElementById('launch-search').addEventListener('click', searchCourse)

document.addEventListener('DOMContentLoaded', async () => {
    // console.log(await window.autoTakerBridge.is_course_selection_time())
    if (await window.autoTakerBridge.is_course_selection_time()) {
        document.getElementById('selection-state-indicator').innerText = '目前在选课时间'
    } else {
        document.getElementById('selection-state-indicator').innerText = '不在选课时间'
    }
})

document.addEventListener('DOMContentLoaded', async () => {
    window.autoTakerBridge.getExistingCurriculum();
})

let courseJson;

function searchCourse() {
    let form = document.getElementById('class-search-form')
    let map = new Map(new FormData(form).entries())
    console.log(map)
    window.autoTakerBridge.searchCourse(map, 'split').then((text) => {
        let totalResponse = JSON.parse(text)
        console.log(totalResponse)
        let courseList = totalResponse['list']['records']
        // console.log(courseList)
        return courseList
    }).then(courseList => {
        courseJson = courseList
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
        checkbox.setAttribute('onClick', 'return false')
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
    let row = ev.target.parentNode;
    if (row.getAttribute('class')?.includes('selected')) {
        row.setAttribute('class', '')
        row.querySelector('input').removeAttribute('checked')
    } else {
        row.setAttribute('class', 'selected')
        row.querySelector('input').setAttribute('checked', 'true')
        console.log(row)
    }
})

document.getElementById('add-course').addEventListener('click', () => {
    let form = document.querySelector('#course-info tbody');
    let courses = [];
    for (let row of form.rows) {
        if (row.getAttribute('class')?.includes('selected')) {
            let course = selectFromList(row.cells[0].innerText, row.cells[1].innerText)
            courses.push(course)
            // window.autoTakerBridge.addSelectedCourses(course);
        }
    }
    // window.autoTakerBridge.addSelectedCourses(courses);
    window.autoTakerBridge.addCourse(JSON.stringify(courses)).then((response) => {
        console.log(JSON.parse(response))
    });
})

function selectFromList(ID, subID) {
    return courseJson.find((value) => {
        if (value['kch'] === ID && value['kxh'] === subID)
            return true
    })
}
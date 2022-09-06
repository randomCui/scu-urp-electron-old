document.getElementById('launch-search').addEventListener('click', searchCourse)

document.addEventListener('DOMContentLoaded', async () => {
    // console.log(await window.autoTakerBridge.is_course_selection_time())
    if (await window.autoTakerBridge.is_course_selection_time()) {
        document.getElementById('selection-state-indicator').innerText = '目前在选课时间'
    } else {
        document.getElementById('selection-state-indicator').innerText = '不在选课时间'
    }
})

let curriculumJson;

document.addEventListener('DOMContentLoaded', async () => {
    curriculumJson = JSON.parse(await window.autoTakerBridge.getExistingCurriculum());
    buildCurriculum(curriculumJson);
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
        tr.setAttribute('class','search-row')

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
        row.setAttribute('class', 'search-row')
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

function buildCurriculum(courseList) {
    let curriculumTable = document.querySelector('#curriculum')
    // 对课程列表按照时间段进行排序
    courseList.sort((a, b) => {
        if (a.classDay - b.classDay !== 0) {
            return a.classDay - b.classDay;
        } else if (a.classSessions - b.classSessions !== 0) {
            return a.classSessions - b.classSessions;
        } else if (a.ID - b.ID !== 0) {
            return a.ID - b.ID;
        } else {
            return a.subID - b.subID;
        }
    })
    let courseByClassDay = splitCurriculumByClassDay(courseList);
    let HTMLByDayColumn = [];
    for (let day of Object.values(courseByClassDay)) {
        HTMLByDayColumn.push(arrangeCourseBlock(day));
    }
    console.log(HTMLByDayColumn);
    for(let i=0;i<coursePerDay;i++) {
        let tr = document.createElement('tr');
        tr.setAttribute('class','curriculum-row')
        for (let j = 0; j < HTMLByDayColumn.length; j++) {
            if(!HTMLByDayColumn[j]['masked'][0].shift()){
                tr.appendChild(HTMLByDayColumn[j]['filled'][0].shift())
            }
        }
        curriculumTable.appendChild(tr);
    }

}

function splitCurriculumByClassDay(courseList) {
    let containerByWeekDay = {};
    courseList.forEach(course => {
        if (!Object.hasOwn(course, course.classDay)) {
            containerByWeekDay[course.classDay] = [];
        }
    })
    courseList.forEach(course => {
        containerByWeekDay[course.classDay].push(course);
    })
    return containerByWeekDay
}

/**********
 * 返回HTML的表格数据
 *
 * @param courseList 分割出的每天的课程列表
 */

const coursePerDay = 12;

function arrangeCourseBlock(courseList) {
    let isArranged = []
    for (let i = 0; i < courseList.length; i++) {
        isArranged.push(false);
    }
    let tableFill = [];  // 每一行代表表格中的一列
    let tableMask = [];
    while (!isArranged.every(value => value === true)) {
        let courseColumn = [];
        let columnMask = [];
        let isOccupied = [];
        for (let i = 0; i < coursePerDay; i++) {
            isOccupied.push(false);
            columnMask.push(false);
            let td = document.createElement('td');
            td.setAttribute('class','curriculum-row')
            td.innerHTML = '&nbsp;';
            courseColumn.push(td);
        }
        let j = 0;
        let offset = 0;
        for (let course of courseList) {
            // 如果要覆盖的位置全部没有被占据
            if (isOccupied.slice(course.classSessions - 1, course.classSessions + course.continuingSession - 1).every(value => value === false)) {
                for (let i = 0; i < course.continuingSession; i++) {
                    isOccupied.splice(course.classSessions - 1 + i, 1, true);
                }
                for (let i=0;i<course.continuingSession-1;i++){
                    columnMask.splice(course.classSessions+i,1,true);
                }
                isArranged[j] = true;
                let courseHTML = document.createElement('td');
                courseHTML.setAttribute('rowspan', course.continuingSession);
                courseHTML.setAttribute('class','curriculum-row')
                courseHTML.innerText = course.name + '\n' + course.teacher;
                courseColumn.splice(course.classSessions - 1-offset, course.continuingSession,courseHTML);
                offset+=course.continuingSession-1;
            }
            j++
        }
        tableFill.push(courseColumn);
        tableMask.push(columnMask);
    }
    // console.log(tableFill);
    // console.log(tableMask);
    return {
        'filled': tableFill,
        'masked': tableMask,
    };
}
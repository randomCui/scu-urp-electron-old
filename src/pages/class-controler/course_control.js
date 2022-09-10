document.addEventListener('DOMContentLoaded', () => {
    window.courseControlBridge.getPendingList().then(pendingListJsonString => {
        let pendingList = JSON.parse(pendingListJsonString);
        updateList(pendingList);
    })
});

document.getElementById('launch-all').addEventListener('click', () => {
    window.courseControlBridge.startAll();
});

document.getElementById('stop-all').addEventListener('click', () => {
    window.courseControlBridge.stopAll();
});

function buildTable(pendingList) {
    document.querySelector('table tbody').innerHTML = '';
    let table = document.querySelector('#pending-list-viewer tbody')
    pendingList.forEach(function (course, index) {
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
            '<td>' + course['jasm'] + '</td>' +
            '<td>' + course['status'] + '</td>' +
            '<td>' + course['enable'] + '</td>';
        table.appendChild(tr);
    });
}

function buildList(pendingList) {
    let ul = document.querySelector('ul.pending-list-viewer');
    ul.innerHTML = '';

    pendingList.forEach((course) => {
        let li = document.createElement('li');
        let divLeft = document.createElement('div');
        divLeft.setAttribute('style', 'float: left')
        divLeft.innerHTML +=
            '<div>' +
            '<span>' + course['kcm'] + '</span>' +
            '<span>' + course['skjs'] + '</span>' +
            '</div>' +
            '<div>' +
            '<span>' + course['type'] + '</span>' +
            '<span>' + course['kch'] + '</span>' +
            '<span>' + course['kxh'] + '</span>' +
            '</div>'

        let divRight = document.createElement('div');
        divRight.setAttribute('style', 'float: right; margin-left: 4em;');
        divRight.innerHTML +=
            '<div>' + '已尝试' + course['triedTimes'] + '次' + '</div>' +
            '<div>' + '本次用时' + ((course['lastSubmitFinishTime'] - course['lastSubmitStartTime']) / 1000) + 's' + '</div>' +
            '<div>' + '总用时' + ((course['lastSubmitFinishTime'] - course['firstStartTime']) / 1000) + 's' + '</div>'

        let divClear = document.createElement('div');
        divClear.setAttribute('class', 'clear');

        li.appendChild(divLeft);
        li.appendChild(divRight);
        li.appendChild(divClear);

        ul.appendChild(li);
    });
}

function updateList(courseList) {
    let ul = document.querySelector('ul.pending-list-viewer');
    let liList = ul.children;
    courseList.forEach(course => {
        let li = undefined;
        for (let temp of liList) {
            if (temp.getAttribute('id') === course['kch'] + '-' + course['kxh'] + course['zxjxjhh']) {
                li = temp;
                break;
            }
        }
        if (li !== undefined) {
            updateInfo(li, course);
        } else {
            ul.appendChild(makeNewRow(course));
        }
    })
}

function updateInfo(li, course) {
    let temp = li.querySelectorAll('div div')
    temp[7].innerText = '已尝试' + course['triedTimes'] + '次';
    temp[5].innerText = '轮询定时' + course['interval'] / 1000 + 's';
    temp[4].innerText = '本次用时' + calcTimeDelta(course['lastSubmitFinishTime'], course['lastSubmitStartTime']) + 's';
    temp[8].innerText = '总用时' + calcTimeDelta(course['lastSubmitFinishTime'], course['firstStartTime']) + 's';
    li.querySelector('div b').innerText = translateStatus(course['status']);
}

function calcTimeDelta(endTime, startTime) {
    if (isNaN(endTime - startTime))
        return '--'
    else if (endTime >= startTime) {
        return (endTime - startTime) / 1000
    } else {
        return (Date.now() - startTime) / 1000;
    }
}

function translateStatus(status) {
    if (status === 'success')
        return '已成功'
    if (status === 'pending')
        return '等待响应'
    if (status === 'pause')
        return '暂停中'
    if (status === 'finish')
        return '等待下一次轮询'
}

function fillInfo(li, course) {
    li.innerHTML = '';
    let divLeft = document.createElement('div');
    divLeft.setAttribute('style', 'float: left')
    divLeft.innerHTML =
        '<div>' +
        '<span>' + course['kcm'].slice(0, 14) + '</span>' +
        '<span>' + course['skjs'].slice(0, 7) + '</span>' +
        '</div>' +
        '<div>' +
        '<span>' + course['type'] + '</span>' +
        '<span>' + course['kch'] + '</span>' +
        '<span>' + course['kxh'] + '</span>' +
        '</div>'

    let divCenter = document.createElement('div');
    divCenter.setAttribute('style', 'float: left; margin-left: 4em;');
    divCenter.innerHTML =
        '<div>' + '本次用时' + calcTimeDelta(course['lastSubmitFinishTime'], course['lastSubmitStartTime']) + 's' + '</div>' +
        '<div>' + '轮询定时' + course['internal'] / 1000 + 's' + '</div>';
    let input = document.createElement('input');
    input.setAttribute('style', 'display: inline; width: 6em; type:text');
    input.addEventListener('keyup', (ev) => {
        if (ev.key === 'Enter') {
            console.log(course);
            window.courseControlBridge.changeInterval(course, input.value);
        }
    })
    divCenter.appendChild(input);

    let divRight = document.createElement('div');
    divRight.setAttribute('style', 'float: left; margin-left: 4em;');
    divRight.innerHTML =
        '<b class="statu-indicator">' + translateStatus(course['status']) + '</b>' +
        '<div>' + '已尝试' + course['triedTimes'] + '次' + '</div>' +
        '<div>' + '总用时' + calcTimeDelta(course['lastSubmitFinishTime'], course['firstStartTime']) + 's' + '</div>'

    let divClear = document.createElement('div');
    divClear.setAttribute('class', 'clear');

    li.appendChild(divLeft);
    li.appendChild(divCenter);
    li.appendChild(divRight);
    li.appendChild(divClear);
}

function makeNewRow(course) {
    let li = document.createElement('li');
    li.setAttribute('id', course['kch'] + '-' + course['kxh'] + course['zxjxjhh'])
    fillInfo(li, course);
    li.addEventListener('click', () => {
        if (li.getAttribute('class')?.includes('selected')) {
            li.setAttribute('class', '')
        } else {
            li.setAttribute('class', 'selected')
            console.log(li)
        }
    });
    return li;
}

window.setInterval(() => {
    window.courseControlBridge.getPendingList().then(pendingListJsonString => {
        let pendingList = JSON.parse(pendingListJsonString);
        updateList(pendingList);
    })

}, 10)

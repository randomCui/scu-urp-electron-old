document.addEventListener('DOMContentLoaded', () => {
    window.courseControlBridge.getPendingList().then(pendingListJsonString => {
        let pendingList = JSON.parse(pendingListJsonString);
        buildList(pendingList);
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

    pendingList.forEach((course, index) => {
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
            '<div>' + '已尝试' + course['triedTimes'] + '次' +'</div>' +
            '<div>' + '上次用时' + ((course['lastSubmitFinishTime'] - course['lastSubmitStartTime']) / 1000) + 's' + '</div>' +
            '<div>' + '总用时' + ((course['lastSubmitFinishTime'] - course['firstStartTime']) / 1000) + 's' + '</div>'

        let divClear = document.createElement('div');
        divClear.setAttribute('class','clear');

        li.appendChild(divLeft);
        li.appendChild(divRight);
        li.appendChild(divClear);

        ul.appendChild(li);
    });
}


window.setInterval(() => {
    window.courseControlBridge.getPendingList().then(pendingListJsonString => {
        let pendingList = JSON.parse(pendingListJsonString);
        buildList(pendingList);
    })
}, 200)

document.querySelector('ul.pending-list-viewer li').addEventListener('click',(ev)=>{
    let row = ev.target;
    if (row.getAttribute('class')?.includes('selected')) {
        row.setAttribute('class', 'search-row')
        row.querySelector('input').removeAttribute('checked')
    } else {
        row.setAttribute('class', 'selected')
        row.querySelector('input').setAttribute('checked', 'true')
        console.log(row)
    }
})



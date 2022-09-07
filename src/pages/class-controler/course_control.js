document.addEventListener('DOMContentLoaded', () => {
    window.courseControlBridge.getPendingList().then(pendingListJsonString => {
        let pendingList = JSON.parse(pendingListJsonString);
        buildTable(pendingList);
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


window.setInterval(() => {
    window.courseControlBridge.getPendingList().then(pendingListJsonString => {
        let pendingList = JSON.parse(pendingListJsonString);
        buildTable(pendingList);
    })
}, 200)



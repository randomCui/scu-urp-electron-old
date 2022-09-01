document.addEventListener('DOMContentLoaded',()=>{
    window.courseControlBridge.getPendingList().then(pendingListJsonString=>{
        let pendingList = JSON.parse(pendingListJsonString);
        buildTable(pendingList);
    })
})

function buildTable(pendingList) {
    let table = document.querySelector('#pending-list-viewer')
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
            '<td>' + course['jasm'] + '</td>';
        table.appendChild(tr);
    });
}
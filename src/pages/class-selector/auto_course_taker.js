// document.getElementsByName()

function searchCourse(){
    let form = document.getElementById('class-search-form')
    let map = new Map(new FormData(form).entries())
    console.log(map)
    window.indexBridge.searchCourse(map).then((response)=>{
        console.log(response)
        }
    )
}
const addBtns=document.querySelectorAll('.add-btn:not(.solid)')
const saveItemBtns=document.querySelectorAll('.solid')
const addItemContainers=document.querySelectorAll('.add-container')
// item lists
const listColumns=document.querySelectorAll('.drag-item-list')
const backlogList=document.getElementById('backlog-list')
const progressList=document.getElementById('progress-list')
const completeList=document.getElementById('complete-list')
const onHoldList=document.getElementById('on-hold-list')

// items
let updatedOnLoad=false

// initialize arrays
let backlogListArray=[]
let progressListArray=[]
let completeListArray=[]
let onHoldListArray=[]
let listArrays=[]

//drag functionality
let draggedItem
let currentColumn

// get arrays from localStorage if available, set default values if not
function getSavedColumns(){
    if(localStorage.getItem('backlogItems')){
        backlogListArray=JSON.parse(localStorage.backlogItems)
        progressListArray=JSON.parse(localStorage.progressItems)
        completeListArray=JSON.parse(localStorage.completeItems)
        onHoldListArray=JSON.parse(localStorage.onHoldItems)
    }else{
        backlogListArray=['Release the course', 'Sit back and relax']
        progressListArray=['Work on projects', 'Listen to music']
        completeListArray=['Being cool', 'Getting stuff done']
        onHoldListArray=['Being uncool']
    }
}

//set localStorage arrays
function updateSavedColumns(){
    listArrays=[backlogListArray,progressListArray,completeListArray,onHoldListArray]
    const arrayNames=['backlog','progress','complete','onHold']
    arrayNames.forEach((name, index)=>{
        localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[index]))
    })
}

//create DOM elements for each list item
function createItemEl(columnEl, column, item, index){
    // console.log(`columnEl: ${columnEl}`)
    // console.log(`column: ${column}`)
    // console.log(`item: ${item}`)
    // console.log(`index: ${index}`)

    // list item
    const listEl=document.createElement('li')
    listEl.classList.add('drag-item')
    listEl.textContent=item
    listEl.draggable=true

    listEl.setAttribute('ondragstart','drag(event)')
    //append
    columnEl.appendChild(listEl)
}

//update columns in DOM - reset HTML, filter array, update localStorage
function updateDOM(){
    //check localStorage once
    if(!updatedOnLoad){
        getSavedColumns()
    }
    //backlog column
    backlogList.textContent=''
    backlogListArray.forEach((item, index)=>{
        createItemEl(backlogList, 0, item, index)
    })

    //progress column
    progressList.textContent=''
    progressListArray.forEach((item, index)=>{
        createItemEl(progressList, 1, item, index)
    })

    //complete column
    completeList.textContent=''
    completeListArray.forEach((item, index)=>{
        createItemEl(completeList, 2, item, index)
    })

    //on hold column
    onHoldList.textContent=''
    onHoldListArray.forEach((item, index)=>{
        createItemEl(onHoldList, 3, item, index)
    })

    //run getSavedColumns only once, update localStorage
    updatedOnLoad=true
    updateSavedColumns()
}

//allows arrays to reflect drag and drop items
function rebuildArrays(){
    backlogListArray=[]
    for(let i=0;i<backlogList.children.length;i++){
        backlogListArray.push(backlogList.children[i].textContent)
    }
    progressListArray=[]
    for(let i=0;i<progressList.children.length;i++){
        progressListArray.push(progressList.children[i].textContent)
    }
    completeListArray=[]
    for(let i=0;i<completeList.children.length;i++){
        completeListArray.push(completeList.children[i].textContent)
    }
    onHoldListArray=[]
    for(let i=0;i<onHoldList.children.length;i++){
        onHoldListArray.push(onHoldList.children[i].textContent)
    }
    updateDOM()
}

//when items start dragging
function drag(event){
    draggedItem=event.target;
    console.log(draggedItem)
}

//column allows for item to drop
function allowDrop(event){
    event.preventDefault()
}

//when item enters column area 
function dragEnter(column){
    currentColumn=column
    listColumns[column].classList.add('over')
}

//dropping item in column
function drop(event){
    event.preventDefault()
    //remove background color/padding
    listColumns.forEach(column=>{
        column.classList.remove('over')
    })
    //add item to column
    const parent=listColumns[currentColumn]
    parent.appendChild(draggedItem )
    //update localStorage
    rebuildArrays()
}

//on load
updateDOM()
const addBtns=document.querySelectorAll('.add-btn:not(.solid)')
const saveItemBtns=document.querySelectorAll('.solid')
const addItemContainers=document.querySelectorAll('.add-container')
const addItems=document.querySelectorAll('.add-item')
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
let dragging=false
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

//filter array to remove empty items
function filterArray(array){
    return filteredArray=array.filter(item=>item!==null)
}

//create DOM elements for each list item
function createItemEl(columnEl, column, item, index){
        // list item
        const listEl=document.createElement('li')
        listEl.classList.add('drag-item')
        listEl.textContent=item
        listEl.draggable=true
        
        listEl.setAttribute('ondragstart','drag(event)')
        listEl.contentEditable=true
        listEl.id=index
        listEl.setAttribute('onfocusout',`updateItem(${index},${column})`)
        //append
        columnEl.appendChild(listEl)
}

//update item - delete if necessary, or update array value
function updateItem(index, column){
    const selectedArray=listArrays[column]
    const selectedColumnEl=listColumns[column].children
    if(!dragging){
        if(!selectedColumnEl[index].textContent){
            delete selectedArray[index]
        }else{
            selectedArray[index]=selectedColumnEl[index].textContent
        }
        updateDOM()
    }
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
    backlogListArray=filterArray(backlogListArray)

    //progress column
    progressList.textContent=''
    progressListArray.forEach((item, index)=>{
        createItemEl(progressList, 1, item, index)
    })
    progressListArray=filterArray(progressListArray)

    //complete column
    completeList.textContent=''
    completeListArray.forEach((item, index)=>{
        createItemEl(completeList, 2, item, index)
    })
    completeListArray=filterArray(completeListArray)

    //on hold column
    onHoldList.textContent=''
    onHoldListArray.forEach((item, index)=>{
        createItemEl(onHoldList, 3, item, index)
    })
    onHoldListArray=filterArray(onHoldListArray)

    //run getSavedColumns only once, update localStorage
    updatedOnLoad=true
    updateSavedColumns()
}

//show 'add item' input box
function showInputBox(column){
    addBtns[column].style.visibility='hidden'
    saveItemBtns[column].style.display='flex'
    addItemContainers[column].style.display='flex'
}

//hide 'add item' input box
function hideInputBox(column){
    addBtns[column].style.visibility='visible'
    saveItemBtns[column].style.display='none'
    addItemContainers[column].style.display='none'
    addToColumn(column)
}

//add to column list, reset textbox
function addToColumn(column){
    const itemText=addItems[column].textContent
    const selectedArray=listArrays[column]
    if(itemText){
        selectedArray.push(itemText)
    }
    addItems[column].textContent=''
    updateDOM()
}

//allows arrays to reflect drag and drop items
function rebuildArrays(){
    backlogListArray=Array.from(backlogList.children).map(item=> item.textContent)
    progressListArray=Array.from(progressList.children).map(item=> item.textContent)
    completeListArray=Array.from(completeList.children).map(item=> item.textContent)
    onHoldListArray=Array.from(onHoldList.children).map(item=> item.textContent)
    
    updateDOM()
}

//when items start dragging
function drag(event){
    draggedItem=event.target;
    dragging=true
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
    //dragging complete
    dragging=false
    //update localStorage
    rebuildArrays()
}

//on load
updateDOM()
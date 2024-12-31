console.log("Hello world!");

let list = localStorage.getItem("list");
if (list === null) {
  list = [];
}
else {
  list = JSON.parse(list);
}

let iteminput = null;
let listdiv = null;

function save() {
  localStorage.setItem("list", JSON.stringify(list));
}

function clearall() {
  list = []
  save();
  populate_list();
}


// https://stackoverflow.com/questions/1125292/how-to-move-the-cursor-to-the-end-of-a-contenteditable-entity
function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}


function assign_elems() {
  console.log("Assigning...");
  iteminput = document.getElementById("item");
  listdiv = document.getElementById("list");

  iteminput.addEventListener("keydown", (event) => { if (event.code === "Enter") { add_item(); iteminput.value = ""; } });

  populate_list();
}
window.addEventListener("DOMContentLoaded", (event) => { assign_elems(); });

function add_item() {
  list.push({text: iteminput.value, checked: false});
  populate_list();
  save();
}

function swap(i0, i1) {
  console.log("Swapping " + i0.toString() + " with " + i1.toString());
  console.log(i1 >= list.length)
  if (i0 < 0 || i1 < 0 || i0 >= list.length || i1 >= list.length) {
    console.log("No!");
    return; 
  }
  let temp = list[i0];
  list[i0] = list[i1];
  list[i1] = temp;
}

function populate_list() {
  listdiv.innerHTML = "";
  console.log("---");
  for (let item in list) {
    console.log(list[item].text);

    let container = document.createElement("div");
    container.classList.add("row-container");


    let checkcontainer = document.createElement("label");
    checkcontainer.classList.add("custom_check_container");

    let check = document.createElement("input");
    check.type = "checkbox";
    check.checked = list[item].checked;

    let check_display = document.createElement("span");
    check_display.classList.add("checkbox");
    check_display.classList.add("row-item");

    checkcontainer.appendChild(check);
    checkcontainer.appendChild(check_display);
    
    let p = document.createElement("p")
    p.style.flex = 1;
    p.innerHTML = list[item].text;
    p.classList.add("row-item");
    p.classList.add("item-label");
    p.classList.toggle("checked", list[item].checked);
    
    check.addEventListener("input", () => {
      console.log("yep");
      list[item].checked = check.checked 
      p.classList.toggle("checked", list[item].checked);
      save();
    });
    
    p.addEventListener("input", (event) => {
      console.log(item.toString() + " I was changed!");
      console.log(event.target.innerText); 
      list[item].text = event.target.innerText;
      save();
    })

    p.addEventListener("blur", () => { p.contentEditable = false; });
    

    let edit_btn = document.createElement("button");
    edit_btn.classList.add("row-item");
    edit_btn.innerHTML = "edit";
    edit_btn.addEventListener("click", () => {
      p.contentEditable = true;
      p.focus();
      setEndOfContenteditable(p);
    });
    
    let up_btn = document.createElement("button");
    up_btn.classList.add("row-item");
    up_btn.innerHTML = "^";
    up_btn.addEventListener("click", () => {
      swap(item, parseInt(item)-1);
      populate_list();
      save();
    });
    let down_btn = document.createElement("button");
    down_btn.classList.add("row-item");
    down_btn.innerHTML = "v";
    down_btn.addEventListener("click", () => {
      swap(item, parseInt(item)+1);
      populate_list();
      save();
    });
    
    container.appendChild(checkcontainer);
    container.appendChild(p);
    container.appendChild(up_btn);
    container.appendChild(down_btn);
    container.appendChild(edit_btn);
    listdiv.appendChild(container);

  }
}


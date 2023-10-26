var clickableDiv = document.getElementById('clickableDiv');
var hiddenDiv = document.getElementById('hiddenDiv');
clickableDiv.addEventListener('click', function () {
    if (hiddenDiv.style.display = 'none') {
        hiddenDiv.style.display = 'block';
    } 
});

var closeBtn=document.getElementById('close-btn')
closeBtn.addEventListener('click',()=>{
    hiddenDiv.style.display = 'none'
})

// ADD FIELDS TO DIV
const buttons = document.querySelectorAll(".btn");

buttons.forEach(button => {
    button.addEventListener("click", clicking);
});

function clicking(event){
    const clickedButton = event.target;
    var selectedbuttonfield=clickedButton.getAttribute('data-searchfield')
	var btn = document.createElement('button');
    btn.textContent = selectedbuttonfield;
    btn.setAttribute('data-searchfield', selectedbuttonfield);
    btn.setAttribute('class','btn')
	clickableDiv.appendChild(btn);
}


// TIME-DIV
function addFromToData(b){
    var btn = document.createElement('button');
    btn.textContent = b;
    btn.setAttribute('data-searchfield', b);
    btn.setAttribute('class','btn')
	clickableDiv.appendChild(btn);
}

function addFromDate(){
    var timeButton=document.getElementById('from-date-btn')
    var fromDate=document.getElementById('from-date').value
    addFromToData(fromDate)
}

function addToDate(){
    var timeButton=document.getElementById('to-date-btn')
    var toDate=document.getElementById('to-date').value
    addFromToData(toDate)
}

// URL
function send() {
const buttons = document.querySelectorAll("#clickableDiv .btn");
var selectedData=[]
buttons.forEach(button => {
    const searchfieldValue = button.getAttribute("data-searchfield");
   selectedData.push(searchfieldValue)
});
// var url="/search/" + user_Id + "/" + model_name + "/" + selectedData.join('/')
var url=selectedData.join('/')
console.log(url)
}

// CLEAR THE FIELD
const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', clearButtons);

function clearButtons() {
    const buttons = clickableDiv.getElementsByClassName('btn');
    if (buttons.length > 0) {
       clickableDiv.removeChild(clickableDiv.lastChild);
    }
}
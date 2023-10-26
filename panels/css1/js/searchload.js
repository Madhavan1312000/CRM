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

function clicking(event){
    var selectedbuttonfield = event.target.getAttribute('data-searchfield');
	var btn = document.createElement('button');
    btn.textContent = selectedbuttonfield;
    btn.setAttribute('data-searchfield', selectedbuttonfield);
    btn.setAttribute('class','btn')
	clickableDiv.appendChild(btn);
}

document.getElementById("employee-div").addEventListener("click", clicking)
document.getElementById("leads-div").addEventListener("click", clicking)
document.getElementById("time-div").addEventListener("click", clicking)


function send() {
const buttons = document.querySelectorAll("#clickableDiv .btn");
var selectedData=[]
buttons.forEach(button => {
    const searchfieldValue = button.getAttribute("data-searchfield");
   selectedData.push(searchfieldValue)
});
// var url="/search/" + user_Id + "/" + model_name + "/" + selectedData.join('/')
// var url=selectedData.join('/')
console.log(url)
}


const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', clearButtons);

function clearButtons() {
    const buttons = clickableDiv.getElementsByClassName('btn');
    if (buttons.length > 0) {
       clickableDiv.removeChild(clickableDiv.lastChild);
    }
}
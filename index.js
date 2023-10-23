let timerBox = document.querySelector("#timerBox");
const saveDiv = document.querySelector(".saveDiv");
const start = document.querySelector("#start");
const edit = document.querySelector("#edit");
const flexRow = document.querySelector(".flexRow");
const saveEdited = document.querySelector("#saveEdited");

let timerCollection = JSON.parse(localStorage.getItem("TimerZone")) || [
  1, 5, 25, 30,
]; //predefine timer values or getting user define value from localStorage.

// initial : used to render radio button and lables.
function initial() {
  localStorage.setItem("TimerZone", JSON.stringify(timerCollection));
  timerBox.innerHTML = "";

  timerCollection.map((item) => {
    timerBox.innerHTML += `<div><input type="radio" name="time" value="${item}" /> <label>${item} mins</label></div>`;
  });
}
initial();
let interVal = null;
// start button: click event added to start the timer.
start.addEventListener("click", () => {
  let radio = document.getElementsByName("time");
  let startedDiv = document.querySelector(".started");
  let TotalTime = 0;
  let  minutes = 0;
  for (let i = 0; i < radio.length; i++) {
    if (radio[i].checked) {
      TotalTime = +radio[i].value;
      minutes = +radio[i].value;
      break;
    }
  }
  if (TotalTime !== 0) {
    TotalTime = TotalTime * 60000;
    
    let timerRun = 0;
    chrome.action.setBadgeText({ text: 'ON' });
    chrome.alarms.create({ delayInMinutes: minutes });
    chrome.storage.sync.set({ minutes: minutes });
    function RunTime(){
            timerRun += 1000;
            timerBox.innerHTML = `<progress value="${timerRun}" max="${TotalTime}"></progress>`;
      
            if (timerRun >= TotalTime) {
            timerBox.style.paddingLeft = "2rem";
              clearInterval(interVal);
            }
    }
    let interVal = setInterval(RunTime, 1000);
    setTimeout(() => {
      flexRow.style.display = "none";
      startedDiv.style.display = "flex";
      startedDiv.style.gap = "1rem";
      timerBox.style.paddingLeft = "1rem";
      let pause = document.querySelector("#pause");
      let cancel = document.querySelector("#cancel");

      pause.addEventListener("click", () => {
        if(pause.value === "pause"){
            clearInterval(interVal);
            pause.value = 'start';
            pause.innerHTML = "Start";
        }else{
            pause.value = 'pause';
            pause.innerHTML = "Pause";
            interVal = setInterval(RunTime, 1000);
        }
      });

      cancel.addEventListener("click", ()=>{
          clearInterval(interVal);
        flexRow.style.display = "flex";
        startedDiv.style.display = "none";
        initial();
      })
    }, 1000);
  }
});

//  edit button: click event to update the time value. converting labels to input[number] box for new times.
edit.addEventListener("click", () => {
  saveDiv.className += "show";
  start.style.visibility = "hidden";
  edit.style.visibility = "hidden";
  timerBox.innerHTML = "";
  timerCollection.map((item, ind) => {
    timerBox.innerHTML += `<div><input type="radio" name="time" value="${item}" /> <input type="number" id="Box${ind}" value="${item}"></input></div>`;
  });
});

//  saveEdited button: click event to save the edited time and call initial method.
saveEdited.addEventListener("click", () => {
  start.style.visibility = "visible";
  edit.style.visibility = "visible";
  saveDiv.className = saveDiv.className.replace("show", "");
  let arr = new Array(timerCollection);
  timerCollection.map((item, ind) => {
    let box = document.querySelector(`#Box${ind}`);
    arr[ind] = +box.value;
  });
  timerCollection = arr;
  initial();
});


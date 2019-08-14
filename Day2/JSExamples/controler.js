
function alertMe(){
    alert('Clicked the button');
}

function alertMe2(){
    alert('Alert me again');
}

//let button = document.querySelector('div');

//button.addEventListener("click", alertMe());
//button.addEventListener("click", alertMe2());

function logme(event){
    console.log(event.target.value);
}

//ARROW FUNCTIONS
function Counter() {
    'use strict';
    console.log(this);
    this.num = 0;
    this.timer = setInterval(function add() {
        this.num++;
        console.log(this.num);
        console.log(this);
    }, 1000);
}



let arrowfunc = (arg1, arg2, ...arguments) => {
    console.log(arg1);
    console.log(arg2);
    console.log(arguments);
}

function CounterArrow() {
    this.num = 0;
    this.timer = setInterval(() => {
        this.num++;
        console.log(this.num);
        console.log(this);
    }, 1000);
}

let user = {
    firstName: "John",
    sayHi() {
        alert(`Hello, ${this.firstName}!`);
    }
};




let myFirstPromise = new Promise((resolve, reject) => {
    // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
    // In this example, we use setTimeout(...) to simulate async code. 
    // In reality, you will probably be using something like XHR or an HTML5 API.
    setTimeout(function(){
      //resolve("Success!"); // Yay! Everything went well!
      reject("Error!");
    }, 2000);
  });
  
  myFirstPromise.then((successMessage) => {
    // successMessage is whatever we passed in the resolve(...) function above.
    // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
    console.log("Yay! " + successMessage);
    this.result = successMessage;
  })
  .catch((error) => {
        console.log("Oh No! " + error);
      this.error = error;
  });
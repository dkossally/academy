

//ARROW FUNCTIONS
function Counter() {
    this.num = 0;
    this.timer = setInterval(function add() {
        this.num++;
        console.log(this.num);
        console.log(this);
    }, 1000);
}

function CounterArrow() {
    this.num = 0;
    this.timer = setInterval(() => {
        this.num++;
        console.log(this.num);
        console.log(this);
    }, 1000);
}
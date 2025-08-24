let array = [];

function generateArray(size = 20){
    array = [];
    let container = document.querySelector("#array-container");
    container.innerHTML = "";

    for(let i=0; i<size; i++){
        let value = Math.floor(Math.random() * 40) + 7;
        array.push(value);

    let bar =  document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = value * 6 + "px";
    container.appendChild(bar);
    }
}

async function bubbleSort(){
    const bars = document.getElementsByClassName("bar");
    for(let i=0; i<array.length; i++){
        for(let j=0; j<array.length-i-1; j++){
            bars[j].style.background = "red";
            bars[j+1].style.background = "red";

            if(array[j] > array[j+1]){
                await swap(bars[j], bars[j+1]);
                let temp = array[j];
                array[j] = array[j+1];
                array[j+1] = temp;
            }
            bars[j].style.background = "#3498db";
            bars[j+1].style.background = "#3498db";
        }
        bars[array.length-i-1].style.background = "green";
    }
}

async function swap(bar1, bar2) {
    return new Promise(resolve => {
        window.requestAnimationFrame(() => {
            let tempheight = bar1.style.height;
            bar1.style.height = bar2.style.height;
            bar2.style.height = tempheight;
            setTimeout(() => resolve(), 500);
        });
    });
}


function startSort(){
    let algo = document.getElementById("algo").value;
    if(algo == "bubble") bubbleSort();
}

generateArray();
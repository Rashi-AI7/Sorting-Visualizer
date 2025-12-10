let array = [];
let arraySize = 20;
let animationSpeed = 5;
let issorting = false;
let stats = { comparisons: 0, swaps: 0, startTime: 0 };

function updateArraySize(size) {
    arraySize = parseInt(size);
    document.getElementById('size-display').textContent = size;
    if (!issorting) generateArray();
}

function updateSpeed(speed) {
    animationSpeed = parseInt(speed);
    document.getElementById('speed-display').textContent = speed + 'x';
}

function resetStats() {
    stats = { comparisons: 0, swaps: 0, startTime: Date.now() };
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('swaps').textContent = '0';
    document.getElementById('time').textContent = '0s';
}

function updateStats() {
    document.getElementById('comparisons').textContent = stats.comparisons;
    document.getElementById('swaps').textContent = stats.swaps;
    const elapsed = ((Date.now() - stats.startTime) / 1000).toFixed(1);
    document.getElementById('time').textContent = elapsed + 's';
}

function generateArray(size = arraySize) {
    if (issorting) return;
    
    array = [];
    let container = document.querySelector("#array-container");
    container.innerHTML = "";
    
    const maxHeight = 350;
    const barWidth = Math.max(8, Math.min(30, (container.clientWidth - 40) / size - 2));

    for(let i = 0; i < size; i++){
        let value = Math.floor(Math.random() * 40) + 7;
        array.push(value);

        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = (value / 47) * maxHeight + "px";
        bar.style.width = barWidth + "px";
        container.appendChild(bar);
    }
    
    resetStats();
}

async function bubbleSort(){
    const bars = document.getElementsByClassName("bar");
    const delay = Math.max(50, 600 - (animationSpeed * 50));
    
    for(let i = 0; i < array.length; i++){
        for(let j = 0; j < array.length - i - 1; j++){
            if (!issorting) return;
            
            bars[j].style.background = "#e74c3c";
            bars[j+1].style.background = "#e74c3c";
            
            stats.comparisons++;
            updateStats();
            await new Promise(resolve => setTimeout(resolve, delay));

            if(array[j] > array[j+1]){
                await swap(bars[j], bars[j+1]);
                let temp = array[j];
                array[j] = array[j+1];
                array[j+1] = temp;
                stats.swaps++;
                updateStats();
            }
            
            bars[j].style.background = "#3498db";
            bars[j+1].style.background = "#3498db";
        }
        bars[array.length - i - 1].style.background = "#27ae60";
    }
    
    finishSort();
}

async function selectionSort(){
    const bars = document.getElementsByClassName("bar");
    const delay = Math.max(50, 600 - (animationSpeed * 50));
    
    for(let i = 0; i < array.length; i++){
        if (!issorting) return;
        
        let minIndex = i;
        bars[i].style.background = "#f39c12";
        
        for(let j = i + 1; j < array.length; j++){
            if (!issorting) return;
            
            bars[j].style.background = "#e74c3c";
            stats.comparisons++;
            updateStats();
            await new Promise(resolve => setTimeout(resolve, delay));
            
            if(array[j] < array[minIndex]){
                if(minIndex !== i) bars[minIndex].style.background = "#3498db";
                minIndex = j;
                bars[minIndex].style.background = "#f1c40f";
            } else {
                bars[j].style.background = "#3498db";
            }
        }
        
        if(minIndex !== i){
            await swap(bars[i], bars[minIndex]);
            let temp = array[i];
            array[i] = array[minIndex];
            array[minIndex] = temp;
            stats.swaps++;
            updateStats();
        }
        
        bars[i].style.background = "#27ae60";
        if(minIndex !== i) bars[minIndex].style.background = "#3498db";
    }
    
    finishSort();
}

async function insertionSort(){
    const bars = document.getElementsByClassName("bar");
    const delay = Math.max(50, 600 - (animationSpeed * 50));
    const maxHeight = 350;
    
    bars[0].style.background = "#27ae60";
    
    for(let i = 1; i < array.length; i++){
        if (!issorting) return;
        
        let key = array[i];
        let keyBar = bars[i];
        keyBar.style.background = "#e74c3c";
        
        let j = i - 1;
        
        while(j >= 0 && array[j] > key){
            if (!issorting) return;
            
            bars[j].style.background = "#f39c12";
            stats.comparisons++;
            updateStats();
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Shift element
            array[j + 1] = array[j];
            bars[j + 1].style.height = (array[j] / 47) * maxHeight + "px";
            stats.swaps++;
            updateStats();
            
            bars[j].style.background = "#27ae60";
            j--;
        }
        
        array[j + 1] = key;
        bars[j + 1].style.height = (key / 47) * maxHeight + "px";
        bars[j + 1].style.background = "#27ae60";
        
        // Reset colors for sorted portion
        for(let k = 0; k <= i; k++){
            bars[k].style.background = "#27ae60";
        }
    }
    
    finishSort();
}

async function swap(bar1, bar2) {
    const swapDelay = Math.max(100, 500 - (animationSpeed * 40));
    return new Promise(resolve => {
        window.requestAnimationFrame(() => {
            let tempheight = bar1.style.height;
            bar1.style.height = bar2.style.height;
            bar2.style.height = tempheight;
            setTimeout(() => resolve(), swapDelay);
        });
    });
}

function finishSort() {
    issorting = false;
    const sortBtn = document.getElementById('sort-btn');
    sortBtn.innerHTML = '<span>▶️</span> Start Sorting';
    sortBtn.disabled = false;
    
    // Animate completion
    const bars = document.getElementsByClassName("bar");
    for(let i = 0; i < bars.length; i++) {
        setTimeout(() => {
            bars[i].style.background = "#27ae60";
            bars[i].style.transform = "scale(1.05)";
            setTimeout(() => {
                bars[i].style.transform = "scale(1)";
            }, 200);
        }, i * 50);
    }
}

function startSort(){
    if (issorting) return;
    
    issorting = true;
    resetStats();
    
    const sortBtn = document.getElementById('sort-btn');
    sortBtn.innerHTML = '<span>⏸️</span> Sorting...';
    sortBtn.disabled = true;
    
    let algo = document.getElementById("algo").value;
    if(algo == "bubble") bubbleSort();
    else if(algo == "selection") selectionSort();
    else if(algo == "insertion") insertionSort();
}

// Initialize
generateArray();

// Handle window resize
window.addEventListener('resize', () => {
    if (!issorting) generateArray();
});
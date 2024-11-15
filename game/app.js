class word{
    constructor(word,x,y,speed = 1,ctx,canvas){
        this.wordId = word.id;
        this.text = word.eng;
        this.tur = word.tur;
        this.level = word.level;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.ctx = ctx;
        this.markedForDeletion = false;
        this.wasItTrue = false;
        this.canvas = canvas;
        this.color = [0,0,0]
        this.colorConst = 255 / canvas.height;
        this.isShaking = false;
        this.defX = x;
        this.defY = y;
    }

    draw(){ 
        ctx.fillStyle = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;   
        this.ctx.fillText(this.text, this.x, this.y);  
        ctx.fillStyle = 'black';   
    }

    update(){
        this.y += this.speed;
        if(this.y > this.canvas.height + 40){
            this.markedForDeletion = true;
            heart -= 1;
            document.getElementById("heart-container").removeChild(document.getElementById("heart-container").children[0]);
        }
        else if(this.y > this.canvas.height - 75 && this.speed != 0){
            this.speed = 0.2
            this.isShaking = true
            this.x += (Math.random() - 0.5) * 2;
        }
        this.color[0] = this.y * this.colorConst 
    }

    stop(){
        this.speed = 0;
    }

    explode(){
        this.markedForDeletion = true;
    }
}

let wordsData = [];  
let heart = 5;

async function loadWords() {
    try {
        const response = await fetch('words.json');
        if (!response.ok) {
            throw new Error("JSON dosyası yüklenemedi.");
        }
        wordsData = await response.json();  
    } catch (error) {
        console.error("Veri yüklenirken hata oluştu:", error);
    }
}

function putUnknownWords(arr){
    var res = "";
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        res += `<span>${element.text} : ${element.tur}</span> <br>`
    }
    document.getElementById("unknownwords").innerHTML = res;
    document.getElementById("score-value").textContent = pointSpan.textContent
    document.getElementById("modal-gameover").style.display = 'block';
}

// Rastgele bir kelime seçme fonksiyonu
function getRandomWord(ctx,canvas) {
    console.log("posjdfoids");
    if (wordsData.length === 0) {
        console.log("Veri yüklenmedi!");
        return null;
    }
    const randomIndex = Math.floor(Math.random() * wordsData.length);

    let x = 150 + Math.random() * 650;
    let y = 50 + Math.random() * 250;
    let speed = 0.4;
    while(true){
        let isChanged = false
        for (let i = 0; i < texts.length; i++) {
            const word = texts[i];
            if( y + 55 > word.y && y - 55 < word.y && x - 200 < word.x && x + 200 > word.x){
                y = 50 + Math.random() * 250;
                isChanged = true;
                break;
            }
        }

        if(!isChanged){
            break;
        }
    }
    return new word(wordsData[randomIndex],x,y,speed,ctx,canvas);
}
let texts = [] 
let unknownwords = [];

const textInput = document.getElementById("textInput");
const pointSpan = document.getElementById("point");
const restartBtn = document.getElementById("btn-tryagain");

textInput.addEventListener("keydown",(event) => {
    if(event.key === "Enter"){
        console.log(textInput.value);
        i = 0;
        let correctIndex = null;
        texts.forEach(word => {
            word.tur.forEach(turkishWord => {
                if(turkishWord == textInput.value.toLowerCase()){
                    correctIndex = i;
                    word.wasItTrue = true;
                    word.explode();
                    pointSpan.textContent = parseInt(pointSpan.textContent) + 1;
                }
            })  
            i += 1;
        });
        textInput.value = "";
    }
})

restartBtn.addEventListener("click", () => {
    const svgMarkup = `<svg stroke="red" fill="red" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>`;
      
    for (let i = 0; i < 5; i++) {
      document.getElementById('heart-container').innerHTML += svgMarkup;
    }

    document.getElementById("point").textContent = "0";

    document.getElementById("modal-gameover").style.display = "none"
    heart = 5;
    texts = []
    texts.push(getRandomWord(ctx,canvas));
    texts.push(getRandomWord(ctx,canvas));
    texts.push(getRandomWord(ctx,canvas));
    unknownwords = []
});

async function main(ctx,canvas) {
    await loadWords();  
    const randomWord = getRandomWord(ctx,canvas);  
    console.log("Rastgele kelime:", randomWord);
    texts.push(randomWord);
    texts.push(getRandomWord(ctx,canvas));
    texts.push(getRandomWord(ctx,canvas));
}

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var heartSpan = document.getElementById("heart");
ctx.font = 'bold 45px Poppins';         
ctx.fillStyle = 'black';           
ctx.textAlign = 'center';  


main(ctx,canvas)


function loop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    i = 0;
    texts.forEach(word => {
        word.update();
        word.draw();
        if(word.markedForDeletion){
            if(!word.wasItTrue){
                unknownwords.push(word);
            }
            texts.splice(i,1);
            if(heart <= 0){
                texts.forEach(word => {
                    word.stop();
                })
                console.log(unknownwords);
                putUnknownWords(unknownwords);
            }
            else{
                texts.push(getRandomWord(ctx,canvas));
            }

        }
        i += 1;
    });

    requestAnimationFrame(loop);
}


loop();




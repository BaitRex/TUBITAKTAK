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
        this.canvas = canvas;
    }

    draw(){ 
        this.ctx.fillText(this.text, this.x, this.y);  
    }

    update(){
        this.y += this.speed;
        if(this.y > this.canvas.height){
            this.markedForDeletion = true;
        }
    }

    explode(){
        this.markedForDeletion = true;
    }
}

let wordsData = [];  

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

// Rastgele bir kelime seçme fonksiyonu
function getRandomWord(ctx,canvas) {
    if (wordsData.length === 0) {
        console.log("Veri yüklenmedi!");
        return null;
    }
    const randomIndex = Math.floor(Math.random() * wordsData.length);
    
    return new word(wordsData[randomIndex],150 + Math.random() * 650,50 + Math.random() * 250,0.1 + Math.random() * 0.6,ctx,canvas);
}
let texts = [] 

const textInput = document.getElementById("textInput");
const pointSpan = document.getElementById("point");

textInput.addEventListener("keydown",(event) => {
    if(event.key === "Enter"){
        console.log(textInput.value);
        i = 0;
        let correctIndex = null;
        texts.forEach(word => {
            word.tur.forEach(turkishWord => {
                if(turkishWord == textInput.value.toLowerCase()){
                    correctIndex = i;
                    word.explode();
                    pointSpan.textContent = parseInt(pointSpan.textContent) + 1;
                }
            })  
            i += 1;
        });
        textInput.value = "";
    }
})

async function main(ctx,canvas) {
    await loadWords();  
    const randomWord = getRandomWord(ctx,canvas);  
    console.log("Rastgele kelime:", randomWord);
    texts.push(randomWord,getRandomWord(ctx,canvas),getRandomWord(ctx,canvas));
}

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
ctx.font = '25px Dosis';         
ctx.fillStyle = 'white';           
ctx.textAlign = 'center';  


main(ctx,canvas)


function loop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    i = 0;
    texts.forEach(word => {
        word.update();
        word.draw();
        if(word.markedForDeletion){
            texts.splice(i,1);
            texts.push(getRandomWord(ctx,canvas));
        }
        i += 1;
    });

    requestAnimationFrame(loop);
}

loop();




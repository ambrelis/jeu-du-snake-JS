//------------- Fonctions utiles -------------

// Fonction générant des nombres pseudo-aléatoires entiers
// entre 0 et max (max non compris)
function getRandomInt(max)
{
	return Math.floor(Math.random()*max);
}
	
// Fonction générant une couleur aléatoire
function getRandomColor()
{
	const red   = getRandomInt(256);
	const blue  = getRandomInt(256);
	const green = getRandomInt(256);
	return "rgb("+red+","+green+","+blue+")";
}

//------------- Votre code ici -------------

const canvas = document.getElementById('terrain');
const ctx = canvas.getContext('2d');
 // Récupération des dimensions du canvas à partir de ses attributs HTML
 let canvasWidth = canvas.width;
 let canvasHeight = canvas.height;
// Taille du côté d'une cellule du terrain
const size = 20;
let score=0;


function updateScore(score) {
    const scoreAdd = document.getElementById('score');
    scoreAdd.textContent = 'Score: ' + score;
}

function gameOver() {
    stopRAF(); 
    alert('Game Over!'); 
}

class Anneau {
	constructor(i, j, color) {
		this.i = i;
		this.j = j;
		this.color = color;
	}

	draw() {
		ctx.fillStyle = this.color;
		// Dessin d'un carré
		ctx.fillRect(size*this.i, size*this.j, size, size);
	}

	move(d) {
		switch (d) {
			case 0:
				this.j -= 1;   
                if (this.j < 0) 
                this.j = (canvasHeight/size) - 1; // Retour au bord opposé 
            break;
			case 1:
				this.i += 1;
                if (this.i >= (canvasWidth/size)) 
                this.i = 0; // Retour au bord opposé 
            break;
			case 2:
				this.j += 1; 
                if (this.j >= (canvasHeight/size)) 
                this.j = 0; // Retour au bord opposé
            break;
			case 3:
				this.i -= 1; 
                if (this.i < 0) 
                this.i = (canvasWidth/size) - 1; // Retour au bord opposé
            break;
			default:
		}
        

	}

    copy(a) {
        this.i = a.i;
        this.j = a.j;
    }

    read(direction) {
        let tmp = new Anneau(this.i, this.j, this.color);
        tmp.move(direction);
        // Vérifier les limites du terrain
        if (tmp.i >= 0 && tmp.i < canvasWidth / size && tmp.j >= 0 && tmp.j < canvasHeight / size) {
            return terrain.read(tmp.i, tmp.j);
        } else {
            return -1;
        }
    }
}

class Terrain {
    constructor(largeur,hauteur){
        this.largeur=largeur;
        this.hauteur=hauteur;
        this.sol=this.initialiseTerrain(largeur,hauteur);
        this.food = null;
    }
    initialiseTerrain(largeur,hauteur){
        const tab = new Array(largeur);
        for (let i = 0; i < tab.length; i++) {
            tab[i] = new Array(hauteur);
             //cellules vides
            for(let j =0; j<tab[i].length;j++){
                tab[i][j] = 0;
            }   
        }
            
        //Ajout des rochers
        for (let k = 0; k < 10; k++) {
            let i = getRandomInt(largeur);
            let j = getRandomInt(hauteur);
            tab[i][j] = 1;
        }

        // Ajout des bordures extérieures
        for (let i = 0; i < largeur; i++) {
            tab[i][0] = 2; // Bordure supérieure
            tab[i][hauteur - 1] = 2; // Bordure inférieure
        }
        for (let j = 0; j < hauteur; j++) {
            tab[0][j] = 2; // Bordure gauche
            tab[largeur - 1][j] = 2; // Bordure droite
        }
        //Ajout food
        let i, j;
        do {
            i = getRandomInt(largeur);
            j = getRandomInt(hauteur);
        } while (tab[i][j] !== 0);
        tab[i][j] = 3;
        return tab;
    }

    draw() {
        for (let i = 0; i < this.largeur; i++) {
            for (let j = 0; j < this.hauteur; j++) {
                if (this.sol[i][j] === 0) {
                    ctx.fillStyle = "#2196F3"; // Cellule vide
                } else if (this.sol[i][j] === 1) {
                    ctx.fillStyle = "#795548"; // Rocher
                } else if (this.sol[i][j] === 2) {
                    ctx.fillStyle = "black"; // Bordure
                }
                else if (this.sol[i][j] === 3) {
                    ctx.fillStyle = "pink"; // Food
                }
                ctx.fillRect(size * i, size * j, size, size);
            }
        }
    }

    read(i, j) {
        // Vérifier les limites du terrain
        if (i >= 0 && i < this.largeur && j >= 0 && j < this.hauteur) {
            return this.sol[i][j];
        } else {
            return -1; // Retourner -1 si les coordonnées sont en dehors du terrain
        }
    }

    write(i, j, val) {
        // Vérifier les limites du terrain
        if (i >= 0 && i < this.largeur && j >= 0 && j < this.hauteur) {
            this.sol[i][j] = val;
        }
    }

}

const terrain = new Terrain(canvasWidth/size, canvasHeight/size, "green");


class Serpent {
    constructor(longueur, i,j, direction, color){
        this.anneaux = [];
        this.longueur = longueur;
        this.direction = direction;
        this.color = color;

        //tete du serpent
        const tete = new Anneau(i,j,color);
        this.anneaux.push(tete);
  
        // Ajout des autres anneaux en fonction de la longueur et de la direction initiale
        for (let k = 1; k < longueur; k++) {
            switch (direction) {
                case 0: // haut
                    j++;
                    break;
                case 1: // droite
                    i--;
                    break;
                case 2: // bas
                    j--;
                    break;
                case 3: // gauche
                    i++;
                    break;
                default:
                    break;
            }
        const body = new Anneau(i, j, 'pink');
        this.anneaux.push(body);
    }
    const queue = new Anneau(i, j, 'magenta');
    this.anneaux.push(queue);
    }
    draw(){
        for (let n = 0; n < this.anneaux.length; n++) {
            this.anneaux[n].draw();
        }
    }
    
    CollisionsAutresSerpents() {
        const head = this.anneaux[0];
        for (const serpent of serpents) {
            // Vérifier si le serpent n'est pas le serpent contrôlé (serpent1)
            if (serpent !== serpent1) {
                for (let i = 1; i < serpent.anneaux.length; i++) { // Commencer à l'indice 1 pour éviter la tête
                    const segment = serpent.anneaux[i];
                    if (head.i === segment.i && head.j === segment.j) {
                        // Collision détectée avec un segment d'un autre serpent
                        return true;
                    }
                }
            }
        }
        return false; // Aucune collision détectée avec les autres serpents
    }
    
    
    CollisionsAvecSoiMeme() {
        const head = this.anneaux[0];
        for (let i = 1; i < this.anneaux.length; i++) { // Commence à l'indice 1 pour éviter la tête
            const segment = this.anneaux[i];
            if (head.i === segment.i && head.j === segment.j) {
                return true; // Collision détectée
            }
        }
        return false; // Aucune collision détectée
    }

    move(){
        const cellule = this.anneaux[0].read(this.direction);

        // Vérifier les collisions avec les autres serpents
        if (this.CollisionsAutresSerpents()) {
            gameOver();
            return;
        }

        // Vérifier la collision avec soi-même
        if (this === serpent1 && this.CollisionsAvecSoiMeme()) {
            gameOver();
            return;
        }

        // si la cellule est libre
        if (cellule === 0 || cellule ===3) {
            // Déplacer le serpent dans la direction spécifiée
            for (let p = this.anneaux.length - 1; p > 0; p--) {
                this.anneaux[p].copy(this.anneaux[p - 1]);
            }
            this.anneaux[0].move(this.direction);

            // Si la cellule contient un item de nourriture, augmenter le score
            if (cellule === 3) {
                score += 1; 
                updateScore(score); 
                this.extend(); 

                // Supprimer l'item de nourriture du terrain
                terrain.write(this.anneaux[0].i, this.anneaux[0].j, 0);

                // Générer de nouvelles coordonnées pour l'item food
                let i, j;
                do {
                    i = getRandomInt(terrain.largeur);
                    j = getRandomInt(terrain.hauteur);
                } while (terrain.read(i, j) !== 0);

                terrain.write(i, j, 3);
            }
        }
        // si la cellule contient un rocher
        else if (cellule === 1) {
            // Augmenter la direction de 1, en remettant à 0 si elle dépasse 3
            this.direction = (this.direction + 1) % 4;
            if (this === serpent1) {
                gameOver();
            }
        }
        // si la cellule est une bordure extérieure
        else if (cellule === 2) {
            // Choisir une nouvelle direction au hasard
            this.direction = getRandomInt(4);
            if (this === serpent1) {
                gameOver();
            }
        }  

        
    }
    
    changeDirectionRandom(){
         // Générer nombre aléatoire entre 0 et 9 inclus
         const numAleatoire = Math.floor(Math.random() * 10);

         // Vérifier si le nombre aléatoire est inférieur à 2 pour changer la direction
         if (numAleatoire < 2) {
             // Générer un nombre aléatoire entre 0 et 3 pour déterminer la nouvelle direction
             let nouvDirection = Math.floor(Math.random() * 4);
 
             // Vérifier si la nouvelle direction n'est pas opposée à la direction actuelle
             if (Math.abs(nouvDirection - this.direction) !== 2) {
                 this.direction = nouvDirection;
             }
         }
    }

    changeDirection(newDirection) {
        // Vérifie si la nouvelle direction n'est pas opposée à la direction actuelle
        if (Math.abs(newDirection - this.direction) !== 2) {
            this.direction = newDirection;
        }
    }

    extend(){
        const newQueue = new Anneau(this.anneaux[this.anneaux.length - 1].i, this.anneaux[this.anneaux.length - 1].j, 'magenta');

        this.anneaux[this.anneaux.length-1].color = 'pink';
   
        // Déplacer tous les autres anneaux du serpent pour les "déplier"
        for (let n = this.anneaux.length - 1; n > 0; n--) {
            this.anneaux[n].copy(this.anneaux[n - 1]);
        }
   
        // Mettre à jour la direction du serpent pour le nouvel anneau
        newQueue.direction = this.direction;
   
        this.anneaux.push(newQueue);
   }
   anim(){
    this.move();
    this.draw();
    
   }
 
}

function clear(){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
   }

const serpents = [];
const serpent1 = new Serpent(3, 10, 10, 1,'red');
const serpent2 = new Serpent(3, 15, 5, 2,'purple');
const serpent3 = new Serpent(3, 3, 8, 2,'purple');

// serpents.push(serpent1);
serpents.push(serpent2);
serpents.push(serpent3);

//gestion touches directionnelles clavier
    document.addEventListener('keydown', function(event) {
        const key = event.keyCode;

        switch(key) {
            case 37: // Gauche
                serpent1.changeDirection(3);
                break;
            case 38: // Haut
                serpent1.changeDirection(0);
                break;
            case 39: // Droite
                serpent1.changeDirection(1);
                break;
            case 40: // Bas
                serpent1.changeDirection(2);
                break;
            default:
                break;
        }
    });

let animationTimer = 0;
let starttime = 0;
const maxfps = 60;
const interval = 10000 / maxfps;

function startRAF(timestamp = 0) {
    animationTimer = requestAnimationFrame(startRAF);
    if (starttime === 0) starttime = timestamp;
    let delta = timestamp - starttime;
    if (delta >= interval) {
        clear();
        terrain.draw();
        serpents.forEach((serpent) => {
            serpent.anim();
            serpent.changeDirectionRandom();
        });
        serpent1.anim();

        starttime = timestamp - (delta % interval);
    }
}

let fullScreen = document.getElementById("terrain");

const btn = document.getElementById("button");
btn.addEventListener('click', function(event){
    if (fullScreen.requestFullscreen) {
        fullScreen.requestFullscreen();
      }
});
startRAF();
function stopRAF(){
    cancelAnimationFrame(animationTimer); 
    animationTimer = 0;
}

let startBtn = document.getElementById("start");
let animationRunning = false;

startBtn.addEventListener("click", function(event) {
    animationRunning = !animationRunning;

    if (animationRunning == false) {
        event.target.textContent = "stop"; 
        startRAF(); 
    } else {
        event.target.textContent = "play"; 
        stopRAF();
    }
   
});



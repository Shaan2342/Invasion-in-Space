const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        };

        const image = new Image();
        image.src = './img/spaceship.png';
        image.onload = () => {
            const scale = 0.15;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            };
            
           
        };
    }
    draw() {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        
    }

    update() {
        if (this.image) {
        this.draw()
        this.position.x+=this.velocity.x
        }
    }
}

const player = new Player();

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
}

animate();

addEventListener('keydown',  ({key}) => {
        switch (key) {
            case 'a':
                console.log('left')
                player.velocity.x = -5
                break
            case 'd':
                console.log('right')
                break
            case ' ':
                console.log('space')
                break
            
        }
    });


    
    invader.update({ velocity: grid.velocity });
    invaderProjectiles.forEach(invaderProjectile => {
        invaderProjectile.update();
    })
})
})


shoot(invaderProjectiles) {
    invaderProjectiles.push(new InvaderProjectile ({
        position: {
            x: this.position.x + this.width/2,
            y: this.position.y + this.height
        },
        velocity : {
            x:0,
            y:5
        }
    }))
}

class InvaderProjectile {
    constructor({position,velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.width = 3;
        this.height = 10;
    }

    draw () {
        c.fillStyle = 'white';
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

 //spawn projectile
 if(frames%100===0 && grid.invaders.length >0) {
    grid.invaders[Math.floor([Math.random()*grid.invaders.length])].shoot(invaderProjectiles)
}
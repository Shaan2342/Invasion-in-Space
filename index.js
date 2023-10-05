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

class Projectile {
    constructor({position,velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 3;
    }

    draw () {
        c.beginPath();
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2);
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}




class Invader {
    constructor({position}) {
        this.velocity = {
            x: 0,
            y: 0
        };


        const image = new Image();
        image.src = './img/invader.png';
        image.onload = () => {
            const scale = 1;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: position.x,
                y: position.y
            };
            
           
        };
    }
    draw() {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        
    }

    update({velocity}) {
        if (this.image) {
        this.draw()
        this.position.x+=velocity.x
        this.position.y+=velocity.y
        }
    }
    
    
}

class Grid {
    constructor() {
        this.position = {
            x:0,
            y:0
        }

        this.velocity = {
            x: 3,
            y:0
        }
        this.invaders = []
        const rows = Math.floor(Math.random() *5+2);
        const columns = Math.floor(Math.random() *10+5);
        this.width = columns *30;
        for(let x=0 ; x<columns ; x++) {
            for(let y=0 ; y<rows ; y++) {

            this.invaders.push(new Invader({
                position : {
                x:x*30,
                y:y*30
            }}))
        }
    }
        console.log(this.invaders)
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y=0;
        if (this.position.x + this.width >= canvas.width || this.position.x<=0) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 30
        }
    }
}

const player = new Player();

const projectiles = []
const grids = [new Grid()]
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed:false
    }
}

let frames = 0;
let randomInterval = Math.floor(Math.random() *500+500);
const invaderProjectiles = []


function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    invaderProjectiles.forEach(invaderProjectile => {
        invaderProjectile.update();
    })
    projectiles.forEach((Projectile,index) => {
        if (Projectile.position.y + Projectile.radius <=0 ) {
            setTimeout(() => {
                projectiles.splice(index , 1);
            },0)
            
        } else {
        Projectile.update();
        }
    })

    grids.forEach((grid, i) => {
        grid.update()

       



        grid.invaders.forEach((invader,i) => {
          invader.update({ velocity: grid.velocity });

        projectiles.forEach((projectile, j) => {
            if (projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                 projectile.position.x + projectile.radius >= invader.position.x &&
                 projectile.position.x - projectile.radius <= invader.position.x +invader.width &&
                  projectile.position.y + projectile.radius >= invader.position.y) {
                setTimeout(() => {
                    const invaderFound = grid.invaders.find(invader2 => {
                        return invader2 === invader
                    })
                    const projectileFound = projectiles.find(
                        projectile2 => projectile2 === projectile);

                    if(invaderFound&&projectileFound) {
                    grid.invaders.splice(i, 1);
                    projectiles.splice(j, 1);
                    }
                });
            }
            })
        });
    });
    
    if (keys.a.pressed && player.position.x>=0) {
        player.velocity.x = -7
    } else if(keys.d.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 7;
        
    } else {
        player.velocity.x = 0;
    }

    if (frames%randomInterval===0) {
        grids.push(new Grid());
        randomInterval = Math.floor(Math.random() *500+500);
        frames = 0;
    }

    frames ++;
}

if (keys.a.pressed) {
    player.velocity.x = -5
} else {
    player.velocity.x = 0;
}
animate();

addEventListener('keydown',  ({key}) => {
        switch (key) {
            case 'a':
                keys.a.pressed = true;
                break
            case 'd':
                keys.d.pressed = true;
                break
            case ' ':
                console.log('space')
                projectiles.push(new Projectile({
                    position: {
                        x:player.position.x+ player.width/2,
                        y:player.position.y
                    },
                    velocity: {
                        x:0,
                        y:-10
                    }
                }))
                console.log(projectiles)
                break;
            }})

    addEventListener('keyup',  ({key}) => {
        switch (key) {
            case 'a':
                keys.a.pressed = false;
                player.velocity.x = 0;
                
                break
            case 'd':
                keys.d.pressed = false;
                player.velocity.x = 0
                break
            case ' ':
                console.log('space')
                break
            
        }
    });


import gsap from 'gsap'


class MeatStick {constructor(){this.proto=document.querySelector('.player-stick')}}

const stickPositions = []
const stick = new MeatStick()
const duration = 5

class Sprite {
    constructor(proto, width = 32, height = 32) {
        this.proto = proto
        // this.src = src
        this.width = width
        this.height = height

        // this.proto.style.background = `url(${this.src})`,
        this.proto.style.left = Math.random() * 100 + "%";

        this.proto.style.width = `${width}px`
        this.proto.style.height = `${height}px`

        this.fall()
    }

    fall() {
        const scope = this
        const fallAnimation = gsap.to(scope.proto, {
            duration,
            y: "95vh",
            onUpdate() {
                console.log(stick.proto.offsetTop <= scope.proto.offsetHeight + scope.proto.offsetTop)
                if(stick.proto.offsetTop <= scope.proto.offsetHeight + scope.proto.offsetTop && (
                    stick.offsetLeft <= scope.offsetLeft + scope.offsetWidth 
                ||  scope.offsetLeft <= stick.offsetLeft + stick.offsetWidth 
                ))
                {
                    console.log("Hello")
                    fallAnimation.pause(), fallAnimation.kill()
                    stickPositions.append(0)
                    if(stickPositions.length === 7)
                        success()
                }
            }
        })
    }
}
class Hero extends Sprite {
    constructor(width = 32, height = 32)
    {
        super(document.querySelector('.hero-box'), width, height)
    }

    fall() {
        const scope = this
        const fallAnimation = gsap.to(scope.proto, {
            duration,
            y: "95vh",
            onUpdate() {
                if(stick.proto.offsetHeight <= scope.proto.offsetHeight + scope.proto.offsetTop && (
                    stick.offsetLeft <= scope.offsetLeft + scope.offsetWidth 
                ||  scope.offsetLeft <= stick.offsetLeft + stick.offsetWidth 
                ))
                {
                    fallAnimation.pause(), fallAnimation.kill()
                    gameOver()
                }
            }
        })
    }
}
class Dummy extends Sprite {}
class Rat extends Dummy {
    constructor(width = 32, height = 32) {
        super(document.querySelector('.rat-box'), width, height)
    }
}
class Tomato extends Dummy {
    constructor(width = 32, height = 32) {
        super(document.querySelector('.tomato-box'), width, height)
    }
}
class Meat extends Sprite {
    constructor(width = 32, height = 32) {
        super(document.querySelector('.meat-box'), width, height)
    }

    fall() {
        const scope = this
        const fallAnimation = gsap.to(scope.proto, {
            duration,
            y: "95vh",
            onUpdate() {
                if(stick.proto.offsetHeight <= scope.proto.offsetHeight + scope.proto.offsetTop && (
                    stick.offsetLeft <= scope.offsetLeft + scope.offsetWidth 
                ||  scope.offsetLeft <= stick.offsetLeft + stick.offsetWidth 
                ))
                {
                    fallAnimation.pause(), fallAnimation.kill()
                    stickPositions.append(1)
                    if(stickPositions.length === 7)
                        success()
                }
            }
        })
    }
}

function startGame()
{
    new Meat(),
    new Tomato(),
    new Rat(),
    new Hero()
}

startGame()

const overlay = document.querySelector('.overlay')

function clean() {
    gsap.getTweensOf('.box').forEach(tween => {
        tween.kill()
    })
    overlay.style.display = "flex"
}

function success()
{
    clean()
    for(let i = 0; i < 7; i++)
        stickPositions.push(1)
    overlay.children[0].children[0].children[0].children[0].textContent = stickPositions.reduce((old, curr) => old + curr) * 1000
    overlay.children[0].style.display = overlay.children[0].children[0].style.display = "block"
}

// success()
// gameOver()

function gameOver()
{
    clean()
    overlay.children[0].style.display = overlay.children[0].children[1].style.display = "block"
}
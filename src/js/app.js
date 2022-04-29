import gsap from 'gsap'


function onKeyDown(event) {
    switch(event.key)
        {
            case "ф":
            case "Ф":
            case 'a':
            case 'A':
            case 'Left':
            case 'ArrowLeft':
                if(stick.proto.offsetLeft > 0)
                gsap.to(stick.proto, {
                    duration: .04,
                    left: stick.proto.offsetLeft-12
                })
                break
            case 'в':
            case 'В':
            case 'd':
            case 'D':
            case 'Right':
            case 'ArrowRight':    
                if(stick.proto.offsetLeft + stick.proto.offsetWidth + 12 < window.innerWidth)
                gsap.to(stick.proto, {
                    duration: .04,
                    left: stick.proto.offsetLeft+12
                })
                break
    }
}
function onTouch(event)
{
    const
        touchX = event.changedTouches[0].clientX,
        stickCenter = stick.proto.offsetWidth
    if(0 < touchX && touchX + stickCenter < window.innerWidth)
    gsap.to(stick.proto, {
        duration: .04,
        left: touchX
    })
}

class MeatStick {constructor(){
    this.proto=document.querySelector('.player-stick')
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("touchstart", onTouch)
    window.addEventListener("touchmove", onTouch)
}}

const stickPositions = []
const stick = new MeatStick()
const duration = 5

class Sprite {
    constructor(proto, src, width = 64, height = 64) {
        this.proto = proto

        this.proto.classList.remove('unclaimed')
        this.proto.style.width = `${width}px`
        this.proto.style.height = `${height}px`
        this.proto.style.left = (Math.random() * (window.innerWidth - width)) + "px"
        this.proto.style.background = `${src} center center no-repeat`
        this.proto.style.backgroundSize = 'contain'

        this.width = width,
        this.height = height
        this.fall()
    }
    ifCollides() {
        const bound = Math.abs(stick.proto.offsetLeft - 10 - this.proto.offsetLeft + (stick.proto.offsetWidth - this.proto.offsetWidth) / 2)
        return stick.proto.offsetTop === this.proto.offsetHeight + this.proto.offsetTop && bound < this.width
    }

    fall() {
        const scope = this
        const fallAnimation = gsap.to(scope.proto, {
            duration,
            top: `${window.innerHeight}px`,
            onUpdate() {
                if(scope.ifCollides())
                {
                    fallAnimation.pause(), fallAnimation.kill()
                    const proto = scope.proto, height = scope.height
                    delete this
                    proto.classList.add('unclaimed')
                    proto.style.top = `-${height}px`
                    stickPositions.push(0)
                    revealSlice(getComputedStyle(proto).getPropertyValue('background'))
                    if(stickPositions.length === 7)
                        success()
                }
            },
            onComplete() {
                fallAnimation.kill()
                const proto = scope.proto, height = scope.height
                delete this
                proto.classList.add('unclaimed')
                proto.style.top = `-${height}px`
            }
        })
    }
}
class Hero extends Sprite {
    constructor(width, height)
    {
        super(document.querySelector('.hero-box.unclaimed'), "url('/src/assets/char.png')", width, height)
    }

    fall() {
        const scope = this
        const fallAnimation = gsap.to(scope.proto, {
            duration,
            top: `${window.innerHeight}px`,
            onUpdate() {
                if(scope.ifCollides())
                {
                    fallAnimation.pause(), fallAnimation.kill()
                    stickPositions.push(null)
                    revealSlice(getComputedStyle(scope.proto).getPropertyValue('background')),
                    scope.proto.style.top = `-${scope.height}px`
                    delete this
                    gameOver()
                }
            },
            onComplete() {
                fallAnimation.kill()
                const proto = scope.proto, height = scope.height
                delete this
                proto.classList.add('unclaimed')
                proto.style.top = `-${height}px`
            }
        })
    }
}
class Dummy extends Sprite {
    constructor(src) {
        super(document.querySelector('.stuff-box.unclaimed'), src)
    }
}
class Rat extends Dummy {
    constructor() {
        super("url('/src/assets/mouse.png')")
    }
}
class Crow extends Dummy {
    constructor() {
        super("url('/src/assets/crow.png')")
    }
}
class Poo extends Dummy {
    constructor() {
        super("url('/src/assets/poo.png')")
    }
}
class Tomato extends Dummy {
    constructor() {
        super("url('/src/assets/tomato.png')")
    }
}
class Onion extends Dummy {
    constructor() {
        super("url('/src/assets/onion.png')")
    }
}
class Meat extends Sprite {
    constructor(width, height)
    {
        super(document.querySelector('.meat-box.unclaimed'), "url('/src/assets/meat.png')", width, height)
    }

    fall() {
        const scope = this
        const fallAnimation = gsap.to(scope.proto, {
            duration,
            top: `${window.innerHeight}px`,
            onUpdate() {
                if(scope.ifCollides())
                {
                    fallAnimation.pause(), fallAnimation.kill()
                    const proto = scope.proto, height = scope.height
                    delete this
                    proto.classList.add('unclaimed')
                    proto.style.top = `-${height}px`;
                    stickPositions.push(1)
                    revealSlice(getComputedStyle(proto).getPropertyValue('background'))
                    if(stickPositions.length === 7)
                        success()
                }
            },
            onComplete() {
                fallAnimation.kill()
                const proto = scope.proto, height = scope.height
                delete this
                proto.classList.add('unclaimed')
                proto.style.top = `-${height}px`;
            }
        })
    }
}


function revealSlice(background) {
    stick.proto.children[0].children[7 - stickPositions.length].style.background = background
    stick.proto.children[0].children[7 - stickPositions.length].classList.remove("hidden")
}

let summonBox = null

function startGame()
{
    stickPositions.splice(0, stickPositions.length)
    document.querySelector('.overlay').style.display = 'none'
    window.addEventListener('keydown', onKeyDown),
    window.addEventListener("touchstart", onTouch),
    window.addEventListener("touchmove", onTouch),
    [...document.querySelectorAll('.slice')].forEach(slice => {slice.classList.add('hidden')}),
    [...document.querySelectorAll('.box')].forEach(box => {
        box.classList.add('unclaimed')
        box.style.top = `-${getComputedStyle(box).getPropertyValue('height')}`
    })

    const totalBoxes = document.querySelectorAll(".box").length,
          totalStuff = document.querySelectorAll(".box.stuff-box").length,
          totalHeroes = document.querySelectorAll(".box.hero-box").length,
          totalMeat = document.querySelectorAll(".box.meat-box").length
    
    if(! summonBox)
    summonBox = setInterval(() =>
    {
        let prob = Math.random() * totalBoxes
        switch(true)
        {
            case prob > totalHeroes + totalMeat + totalStuff / 2:
                try {
                    new Hero()
                } catch(e) { console.warn(e) }
                break
            case prob > totalHeroes + totalMeat:
                try {
                    Math.random() > .5 ? new Rat() : Math.random() > .5 ? new Poo() : new Crow()
                } catch(e) { console.warn(e) }
                break
            case prob > totalHeroes:
                try {
                    Math.random() > .5 ? new Tomato() : new Onion()
                } catch(e) { console.warn(e) }
                break
            default:
                try {
                    new Meat()
                } catch(e) { console.warn(e) }
                break
        }
    }, 1000)
}

startGame()

document.querySelector('.restart').addEventListener('click', startGame)

const overlay = document.querySelector('.overlay')

function clean() {
    window.removeEventListener("keydown", onKeyDown)
    window.removeEventListener("touchstart", onTouch)
    window.removeEventListener("touchmove", onTouch)
    if(summonBox)
    {
        clearInterval(summonBox)
        summonBox = null
    }
    gsap.getTweensOf('.box').forEach(tween => {
        tween.kill()
    })
    overlay.style.display = "flex"
}

function success()
{
    clean()
    overlay.children[0].children[0].children[0].children[0].textContent = stickPositions.reduce((old, curr) => old + curr) * 1000
    overlay.children[0].children[1].style.display = "none"
    overlay.children[0].style.display = overlay.children[0].children[0].style.display = "block"
}

function gameOver()
{
    clean()
    overlay.children[0].style.display = overlay.children[0].children[1].style.display = "block"
}
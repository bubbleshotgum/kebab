import gsap from 'gsap'


function onKeyDown(event) {
    switch(event.key)
        {
            case 'a':
            case 'A':
            case 'Left':
            case 'ArrowLeft':
                gsap.to(stick.proto, {
                    duration: .04,
                    left: stick.proto.offsetLeft-12
                })
                break
            case 'd':
            case 'D':
            case 'Right':
            case 'ArrowRight':
                gsap.to(stick.proto, {
                    duration: .04,
                    left: stick.proto.offsetLeft+12
                })
                break
    }
}

class MeatStick {constructor(){
    this.proto=document.querySelector('.player-stick')

    window.addEventListener("keydown", onKeyDown)
}}

const stickPositions = []
const stick = new MeatStick()
const duration = 5

class Sprite {
    constructor(proto, width = 32, height = 32) {
        this.proto = proto
        this.proto.classList.remove('unclaimed')
        // this.src = src
        this.width = width
        this.height = height

        // this.proto.style.background = `url(${this.src})`,
        this.proto.style.left = (Math.random() * (window.innerWidth - this.width)) + "px";

        this.proto.style.width = `${width}px`
        this.proto.style.height = `${height}px`

        this.fall()
    }

    fall() {
        const scope = this
        const fallAnimation = gsap.to(scope.proto, {
            duration,
            top: "95vh",
            onUpdate() {
                if(stick.proto.offsetTop == scope.proto.offsetHeight + scope.proto.offsetTop
                && Math.abs(stick.proto.offsetLeft - scope.proto.offsetLeft) < scope.proto.offsetWidth)
                {
                    fallAnimation.pause(), fallAnimation.kill()
                    const proto = scope.proto
                    delete this
                    proto.classList.add('unclaimed')
                    proto.style.top = "-32px"
                    stickPositions.push(0)
                    revealSlice(getComputedStyle(proto).getPropertyValue('background'))
                    if(stickPositions.length === 7)
                        success()
                }
            },
            onComplete() {
                fallAnimation.kill()
                const proto = scope.proto
                delete this
                proto.classList.add('unclaimed')
                proto.style.top = "-32px"
            }
        })
    }
}
class Hero extends Sprite {
    constructor(width = 32, height = 32)
    {
        super(document.querySelector('.hero-box.unclaimed'), width, height)
    }

    fall() {
        const scope = this
        const fallAnimation = gsap.to(scope.proto, {
            duration,
            top: "95vh",
            onUpdate() {
                if(stick.proto.offsetTop == scope.proto.offsetHeight + scope.proto.offsetTop
                && Math.abs(stick.proto.offsetLeft - scope.proto.offsetLeft) < scope.proto.offsetWidth)
                {
                    fallAnimation.pause(), fallAnimation.kill()
                    stickPositions.push(null)
                    revealSlice(getComputedStyle(scope.proto).getPropertyValue('background')),
                    scope.proto.style.top = '-32px'
                    delete this
                    gameOver()
                }
            },
            onComplete() {
                fallAnimation.kill()
                const proto = scope.proto
                delete this
                proto.classList.add('unclaimed')
                proto.style.top = "-32px"
            }
        })
    }
}
class Dummy extends Sprite {}
class Rat extends Dummy {
    constructor(width = 32, height = 32) {
        super(document.querySelector('.rat-box.unclaimed'), width, height)
    }
}
class Tomato extends Dummy {
    constructor(width = 32, height = 32) {
        super(document.querySelector('.tomato-box.unclaimed'), width, height)
    }
}
class Meat extends Sprite {
    constructor(width = 32, height = 32)
    {
        super(document.querySelector('.meat-box.unclaimed'), width, height)
    }

    fall() {
        const scope = this
        const fallAnimation = gsap.to(scope.proto, {
            duration,
            top: "95vh",
            onUpdate() {
                if(stick.proto.offsetTop == scope.proto.offsetHeight + scope.proto.offsetTop
                && Math.abs(stick.proto.offsetLeft - scope.proto.offsetLeft) < scope.proto.offsetWidth)
                {
                    fallAnimation.pause(), fallAnimation.kill()
                    const proto = scope.proto
                    delete this
                    proto.classList.add('unclaimed')
                    proto.style.top = "-32px";
                    stickPositions.push(1)
                    revealSlice(getComputedStyle(proto).getPropertyValue('background'))
                    if(stickPositions.length === 7)
                        success()
                }
            },
            onComplete() {
                fallAnimation.kill()
                const proto = scope.proto
                delete this
                proto.classList.add('unclaimed')
                proto.style.top = "-32px";
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
    [...document.querySelectorAll('.slice')].forEach(slice => {slice.classList.add('hidden')}),
    [...document.querySelectorAll('.box')].forEach(box => {
        box.classList.add('unclaimed')
        box.style.top = "-32px"
    })

    const totalBoxes = document.querySelectorAll(".box").length,
          totalRats = document.querySelectorAll(".box.rat-box"),
          totalHeroes = document.querySelectorAll(".box.hero-box").length,
          totalMeat = document.querySelectorAll(".box.meat-box").length,
          totalTomatoes = document.querySelectorAll(".box.tomato-box").length
    
    if(! summonBox)
    summonBox = setInterval(() =>
    {
        let prob = Math.random() * totalBoxes
        switch(true)
        {
            case prob > totalHeroes + totalMeat + (Math.random() > .5 ? totalTomatoes : totalRats):
                try {
                    new Hero()
                } catch(e) { console.warn(e) }
                break
            case prob > totalHeroes + totalMeat:
                try {
                    new Rat()
                } catch(e) { console.warn(e) }
                break
            case prob > totalHeroes:
                try {
                    new Tomato()
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
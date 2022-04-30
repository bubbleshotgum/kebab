import gsap from 'gsap'

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});


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
        const bound = Math.abs(stick.proto.offsetLeft - this.proto.offsetLeft + (stick.proto.offsetWidth - this.proto.offsetWidth) / 2)
        return stick.proto.offsetTop === this.proto.offsetHeight + this.proto.offsetTop && bound < this.width / 2
    }

    fall() {
        const scope = this
        const fallAnimation = gsap.to(scope.proto, {
            duration,
            top: `${window.innerHeight}px`,
            onUpdate() {
                if(scope.ifCollides())
                {
                    (new Audio("/src/audio/match.mp3")).play()
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

const gameOverSound = new Audio("/src/audio/end_game.oga")

class Hero extends Sprite {
    constructor()
    {
        super(document.querySelector('.hero-box.unclaimed'), "url('/src/assets/char.png')")
    }

    fall() {
        const scope = this
        const fallAnimation = gsap.to(scope.proto, {
            duration,
            top: `${window.innerHeight}px`,
            onUpdate() {
                if(scope.ifCollides())
                {
                    (new Audio("/src/audio/match.mp3")).play()
                    gameOverSound.play()
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
    constructor()
    {
        super(document.querySelector('.meat-box.unclaimed'), "url('/src/assets/meat.png')")
    }

    fall() {
        const scope = this
        const fallAnimation = gsap.to(scope.proto, {
            duration,
            top: `${window.innerHeight}px`,
            onUpdate() {
                if(scope.ifCollides())
                {
                    (new Audio("/src/audio/match.mp3")).play()
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
    document.querySelector('.audio_btn').classList.add('hidden')
    gameOverSound.pause()
    start.pause()
    if(toggled === true)
    {
        start.removeEventListener('ended', play)
        toggled = null   
    }
    stickPositions.splice(0, stickPositions.length)
    scaleGameOver.pause(0)
    document.querySelector('.start').classList.add('hidden')
    document.querySelector('.overlay_end').classList.add('hidden')
    document.querySelector('.game').classList.remove('hidden')
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

document.querySelector('.start_btn').addEventListener('click', startGame)
document.querySelector('.game_over_btn').addEventListener('click', startGame)
document.querySelector('.form_btn').addEventListener('click', sendMail)


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
}
let discount = null
function success()
{
    clean()
    const count = stickPositions.reduce((old, curr) => old + curr)
    const output = document.querySelector('.output')
    if(count === 1)
        output.textContent = 'кусочек'
    else if(count && count < 5)    
        output.textContent = 'кусочка'
    else 
        output.textContent = 'кусочков'
    const final = new Audio('/src/audio/final.mp4')
    final.play()
    document.querySelector('.overlay_form').classList.remove('hidden'),
    document.querySelectorAll('.slice_count')[0].textContent = count,
    document.querySelectorAll('.slice_count')[1].textContent = discount = count * 1000
    console.log(discount)
    // overlay.children[0].children[0].children[0].children[0].textContent = stickPositions.reduce((old, curr) => old + curr) * 1000
    // overlay.children[0].children[1].style.display = "none"
    // overlay.children[0].style.display = overlay.children[0].children[0].style.display = "block"
}

const scaleGameOver = gsap
.from('.game_over', {
    duration: 2,
    scale: .4,
    ease: "elastic.out(1, 0.5)",
})
scaleGameOver.pause(0)

function gameOver()
{
    clean()
    document.querySelector('.overlay_end').classList.remove('hidden')
    scaleGameOver.play()
    // overlay.children[0].style.display = overlay.children[0].children[1].style.display = "block"
}


const form = document.querySelector('form')
form.addEventListener('submit', sendMail)

async function sendMail(e) {
    e.preventDefault()

    fetch('./mail.php', {
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",    
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({
            name: document.querySelector("#name").value,
            phone: document.querySelector("#phone").value,
            email: document.querySelector("#email").value,
            discount
        })
    }).then(res => res.json()).then(res => console.log(res))

    form.reset()
    document.querySelector('.overlay_form').classList.add('hidden')
    document.querySelector('.overlay_sale').classList.remove('hidden')
    // const data = [...new FormData(form)].map(input => input[1])
    // console.log(data)
    // form.submit()
    // return false
}


const start = new Audio("/src/audio/start.wav")
let toggled = false
function play() {
    start.play()
    if(! toggled)
    {
        start.addEventListener('ended', play)
        toggled = true
    }
    document.querySelector('.audio_btn').removeEventListener('click', play)
}
document.querySelector('.audio_btn').addEventListener('click', play)
const w : number = window.innerWidth, h : number = window.innerHeight
const nodes : number = 4
class SquareStepStage {
    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D
    ss : SquareStep = new SquareStep()
    animator : Animator = new Animator()

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = '#bdbdbd'
        this.context.fillRect(0, 0, w, h)
        this.ss.draw(this.context)
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.ss.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.ss.update(() => {
                        this.animator.stop()
                        this.render()
                    })
                })
            })
        }
    }

    static init() {
        const stage : SquareStepStage = new SquareStepStage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {
    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += (0.1/nodes) * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {
    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class SquareStep {
    state : State = new State()

    draw(context : CanvasRenderingContext2D) {
        const scale : number = this.state.scale
        const gap : number = h / (nodes + 1)
        context.save()
        context.translate(w/2, h/2)
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / 60
        context.strokeStyle = '#0D47A1'
        const fact = 1 / nodes
        for (var i = 0; i < nodes; i++) {
            const sc = Math.min(fact, Math.max(0, scale - fact * i)) * nodes
            context.save()
            context.rotate(Math.PI/2 * i)
            context.beginPath()
            context.moveTo(-gap/2, -gap/2)
            context.lineTo(-gap/2 + gap * sc, -gap/2)
            context.stroke()
            context.restore()
        }
        context.restore()
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }
}

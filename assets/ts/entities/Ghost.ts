import { context } from '../index'

interface GhostProps {
	position: { x: number; y: number }
	velocity: { x: number; y: number }
	color?: string
}

export class Ghost {
	static speed = 2
	position: { x: number; y: number }
	velocity: { x: number; y: number }
	radius: number
	color: string
	prevCollisions: any[]
	scared: boolean
	speed: number

	constructor({ position, velocity, color = 'red' }: GhostProps) {
		this.position = position
		this.velocity = velocity
		this.radius = 15
		this.color = color
		this.prevCollisions = new Array()
		this.speed = 2
		this.scared = false
	}

	draw() {
		context.beginPath()
		context.arc(
			this.position.x,
			this.position.y,
			this.radius,
			0,
			Math.PI * 2
		)
		context.fillStyle = this.scared ? 'blue' : this.color
		context.fill()
		context.closePath()
	}

	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}

import { context } from '../index'

interface PlayerProps {
	position: { x: number; y: number }
	velocity: { x: number; y: number }
}

export class Player {
	position: { x: number; y: number }
	velocity: { x: number; y: number }
	radius: number
	radians: number
	openRate: number
	rotation: number

	constructor({ position, velocity }: PlayerProps) {
		this.position = position
		this.velocity = velocity
		this.radius = 15
		this.radians = 0.75
		this.openRate = 0.1
		this.rotation = 0
	}

	draw() {
		context.save()
		context.translate(this.position.x, this.position.y)
		context.rotate(this.rotation)
		context.translate(-this.position.x, -this.position.y)
		context.beginPath()
		context.arc(
			this.position.x,
			this.position.y,
			this.radius,
			this.radians,
			Math.PI * 2 - this.radians
		)
		context.lineTo(this.position.x, this.position.y)
		context.fillStyle = 'yellow'
		context.fill()
		context.closePath()
		context.restore()
	}

	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		if (this.radians < 0 || this.radians > 0.75)
			this.openRate = -this.openRate

		this.radians += this.openRate
	}
}

import { context } from '../index'

interface PowerUpProps {
	position: { x: number; y: number }
}

export class PowerUp {
	position: any
	radius: number
	color: string

	constructor({ position }) {
		this.position = position
		this.radius = 7.5
		this.color = 'blue'
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
		context.fillStyle = 'white'
		context.fill()
		context.closePath()
	}
}

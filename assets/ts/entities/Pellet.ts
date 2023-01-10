import { context } from '../index'

interface PelletProps {
	position: { x: number; y: number }
}

export class Pellet {
	position: { x: number; y: number }
	radius: number

	constructor({ position }: PelletProps) {
		this.position = position
		this.radius = 3
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

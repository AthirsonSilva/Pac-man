import { context } from '../index'

interface BoundaryProps {
	position: { x: number; y: number }
	image: HTMLImageElement
}

export class Boundary {
	static width = 40
	static height = 40
	position: { x: number; y: number }
	image = new Image()

	constructor({ position, image }: BoundaryProps) {
		this.position = position
		Boundary.width = 40
		Boundary.height = 40
		this.image = image
	}

	draw() {
		context.drawImage(this.image, this.position.x, this.position.y)
	}
}

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const scoreElement = document.querySelector('#scoreElement')
const scoreSection = document.querySelector('#scoreSection')
const startBtn = document.querySelector('#startBtn')
const gameRules = document.querySelector('#gameRules')

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
	static width = 40
	static height = 40
	constructor({ position, image }) {
		this.position = position
		this.width = 40
		this.height = 40
		this.image = image
	}

	draw() {
		/* c.fillStyle = 'blue'
		c.fillRect(this.position.x, this.position.y, this.width, this.height) */

		context.drawImage(this.image, this.position.x, this.position.y)
	}
}

class Player {
	constructor({ position, velocity
	}) {
		this.position = position
		this.velocity = velocity
		this.radius = 15
		this.radians = 0.75
		this.openRate = 0.10
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

		if (this.radians < 0 || this.radians > .75) this.openRate = -this.openRate

		this.radians += this.openRate
	}
}

class Ghost {
	static speed = 2
	constructor({ position, velocity, color = 'red'
	}) {
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

class Pellet {
	constructor({
		position,
	}) {
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

class PowerUp {
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

const ghosts = new Array()
ghosts.push(new Ghost({
	position: {
		x: Boundary.width * 9 + Boundary.width / 2,
		y: Boundary.height * 1 + Boundary.height / 2
	},
	velocity: {
		x: 5,
		y: 0
	},
	color: 'red'
}))
ghosts.push(new Ghost({
	position: {
		x: Boundary.width * 8 + Boundary.width / 2,
		y: Boundary.height * 3 + Boundary.height / 2
	},
	velocity: {
		x: 5,
		y: 0
	},
	color: 'pink'
}))
ghosts.push(new Ghost({
	position: {
		x: Boundary.width * 16 + Boundary.width / 2,
		y: Boundary.height * 7 + Boundary.height / 2
	},
	velocity: {
		x: 5,
		y: 0
	},
	color: 'violet'
}))
ghosts.push(new Ghost({
	position: {
		x: Boundary.width * 12 + Boundary.width / 2,
		y: Boundary.height * 9 + Boundary.height / 2
	},
	velocity: {
		x: 5,
		y: 0
	},
	color: 'orange'
}))
const powerUps = new Array()
const pellets = new Array()
const boundaries = new Array()
const player = new Player({
	position: {
		x: Boundary.width + Boundary.width / 2,
		y: Boundary.height + Boundary.height / 2
	},
	velocity: {
		x: 0,
		y: 0
	}
})

const keys = {
	w: {
		pressed: false
	},
	a: {
		pressed: false
	},
	s: {
		pressed: false
	},
	d: {
		pressed: false
	},
}

let lastKey = ''
let score = 0

const map = [
	['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2',],
	['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|',],
	['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '^', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|',],
	['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|',],
	['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|',],
	['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|',],
	['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '_', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|',],
	['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|',],
	['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', 'b', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|',],
	['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|',],
	['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '^', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|',],
	['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|',],
	['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|',],
	['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|',],
	['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '_', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|',],
	['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|',],
	['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3',]
]

function createImage(src) {
	const image = new Image()
	image.src = src
	return image
}

map.forEach((row, i) => {
	row.forEach((symbol, j) => {
		switch (symbol) {
			case '-':
				boundaries.push(new Boundary({
					position: {
						x: Boundary.width * j,
						y: Boundary.height * i
					},
					image: createImage('./assets/img/pipeHorizontal.png')
				}))
				break
			case '|':
				boundaries.push(new Boundary({
					position: {
						x: Boundary.width * j,
						y: Boundary.height * i
					},
					image: createImage('./assets/img/pipeVertical.png')
				}))
				break
			case '1':
				boundaries.push(new Boundary({
					position: {
						x: Boundary.width * j,
						y: Boundary.height * i
					},
					image: createImage('./assets/img/pipeCorner1.png')
				}))
				break
			case '2':
				boundaries.push(new Boundary({
					position: {
						x: Boundary.width * j,
						y: Boundary.height * i
					},
					image: createImage('./assets/img/pipeCorner2.png')
				}))
				break
			case '3':
				boundaries.push(new Boundary({
					position: {
						x: Boundary.width * j,
						y: Boundary.height * i
					},
					image: createImage('./assets/img/pipeCorner3.png')
				}))
				break
			case '4':
				boundaries.push(new Boundary({
					position: {
						x: Boundary.width * j,
						y: Boundary.height * i
					},
					image: createImage('./assets/img/pipeCorner4.png')
				}))
				break
			case 'b':
				boundaries.push(new Boundary({
					position: {
						x: Boundary.width * j,
						y: Boundary.height * i
					},
					image: createImage('./assets/img/block.png')
				}))
				break
			case '[':
				boundaries.push(new Boundary({
					position: {
						x: Boundary.width * j,
						y: Boundary.height * i
					},
					image: createImage('./assets/img/capLeft.png')
				}))
				break
			case ']':
				boundaries.push(new Boundary({
					position: {
						x: Boundary.width * j,
						y: Boundary.height * i
					},
					image: createImage('./assets/img/capRight.png')
				}))
				break
			case '5':
				boundaries.push(new Boundary({
					position: {
						x: Boundary.width * j,
						y: Boundary.height * i
					},
					image: createImage('./assets/img/pipeConnectorTop.png')
				}))
				break
			case '7':
				boundaries.push(new Boundary({
					position: {
						x: Boundary.width * j,
						y: Boundary.height * i
					},
					image: createImage('./assets/img/pipeConnectorBottom.png')
				}))
				break
			case '^':
				boundaries.push(new Boundary({
					position: {
						x: Boundary.width * j,
						y: Boundary.height * i
					},
					image: createImage('./assets/img/capTop.png')
				}))
				break
			case '+':
				boundaries.push(new Boundary({
					position: {
						x: Boundary.width * j,
						y: Boundary.height * i
					},
					image: createImage('./assets/img/pipeCross.png')
				}))
				break
			case '_':
				boundaries.push(new Boundary({
					position: {
						x: Boundary.width * j,
						y: Boundary.height * i
					},
					image: createImage('./assets/img/capBottom.png')
				}))
				break
			case '.':
				pellets.push(new Pellet({
					position: {
						x: j * Boundary.width + Boundary.width / 2,
						y: i * Boundary.height + Boundary.height / 2
					},
				}))
				break
			case 'p':
				powerUps.push(new PowerUp({
					position: {
						x: j * Boundary.width + Boundary.width / 2,
						y: i * Boundary.height + Boundary.height / 2
					},
				}))
				break
		}
	})
})

function collision({ circle, rectangle }) {
	return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height &&
		circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width &&
		circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x &&
		circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y)
}

let animationID
function animate() {
	animationID = requestAnimationFrame(animate)
	context.clearRect(0, 0, canvas.width, canvas.height)

	if (keys.w.pressed && lastKey === 'w') {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (collision({
				circle: {
					...player, velocity: {
						x: 0,
						y: -5
					}
				},
				rectangle: boundary
			})
			) {
				player.velocity.y = 0
				break
			} else {
				player.velocity.y = -5
			}
		}
	}
	if (keys.a.pressed && lastKey === 'a') {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (collision({
				circle: {
					...player, velocity: {
						x: -5,
						y: 0
					}
				},
				rectangle: boundary
			})
			) {
				player.velocity.x = 0
				break
			} else {
				player.velocity.x = -5
			}
		}
	}
	if (keys.s.pressed && lastKey === 's') {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (collision({
				circle: {
					...player, velocity: {
						x: 0,
						y: 5
					}
				},
				rectangle: boundary
			})
			) {
				player.velocity.y = 0
				break
			} else {
				player.velocity.y = 5
			}
		}
	}
	if (keys.d.pressed && lastKey === 'd') {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (collision({
				circle: {
					...player, velocity: {
						x: 5,
						y: 0
					}
				},
				rectangle: boundary
			})
			) {
				player.velocity.x = 0
				break
			} else {
				player.velocity.x = 5
			}
		}
	}

	// Touch pellets
	for (let i = pellets.length - 1; 0 <= i; i--) {
		const pellet = pellets[i]
		pellet.draw()

		if (Math.hypot(
			pellet.position.x - player.position.x,
			pellet.position.y - player.position.y
		) <
			pellet.radius + player.radius
		) {
			pellets.splice(i, 1)
			score += 10
			scoreElement.innerHTML = score
		}
	}

	// Ghost x player
	for (let i = ghosts.length - 1; 0 <= i; i--) {
		const ghost = ghosts[i]

		if (Math.hypot(
			ghost.position.x - player.position.x,
			ghost.position.y - player.position.y
		) <
			ghost.radius + player.radius
		) {
			if (ghost.scared) {
				ghosts.splice(i, 1)
			} else {
				cancelAnimationFrame(animationID)
				window.location.reload()
			}
		}
	}
	// Win condition
	if (pellets.length === 0) {
		cancelAnimationFrame(animationID)
		window.open('./congratulations.html', '_self')
	}

	// Power ups
	for (let i = powerUps.length - 1; 0 <= i; i--) {
		const powerUp = powerUps[i]
		powerUp.draw()

		if (Math.hypot(
			powerUp.position.x - player.position.x,
			powerUp.position.y - player.position.y
		) <
			powerUp.radius + player.radius
		) {
			powerUps.splice(i, 1)
			score += 50
			scoreElement.innerHTML = score

			ghosts.forEach(ghost => {
				ghost.scared = true

				setTimeout(() => {
					ghost.scared = false
					console.log(ghost.scared)
				}, 10000)
			})
		}
	}

	boundaries.forEach(boundary => {
		boundary.draw()

		if (collision({
			circle: player,
			rectangle: boundary
		})) {
			player.velocity.x = 0
			player.velocity.y = 0
		}
	})

	player.update()
	ghosts.forEach(ghost => {
		ghost.update()

		const collisions = new Array()
		boundaries.forEach(boundary => {
			if (!collisions.includes('right') && collision({
				circle: {
					...ghost, velocity: {
						x: 5,
						y: 0
					}
				},
				rectangle: boundary
			})
			) {
				collisions.push('right')
			}

			if (!collisions.includes('left') && collision({
				circle: {
					...ghost, velocity: {
						x: -5,
						y: 0
					}
				},
				rectangle: boundary
			})
			) {
				collisions.push('left')
			}

			if (!collisions.includes('up') && collision({
				circle: {
					...ghost, velocity: {
						x: 0,
						y: -5
					}
				},
				rectangle: boundary
			})
			) {
				collisions.push('up')
			}

			if (!collisions.includes('down') && collision({
				circle: {
					...ghost, velocity: {
						x: 0,
						y: 5
					}
				},
				rectangle: boundary
			})
			) {
				collisions.push('down')
			}
		})
		if (collisions.length > ghost.prevCollisions.length)
			ghost.prevCollisions = collisions

		if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {

			if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
			else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
			else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
			else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

			const pathways = ghost.prevCollisions.filter(collision => {
				return !collisions.includes(collision)
			})

			const direction = pathways[Math.floor(Math.random() * pathways.length)]

			switch (direction) {
				case 'down':
					ghost.velocity.y = 5
					ghost.velocity.x = 0
					break
				case 'up':
					ghost.velocity.y = -5
					ghost.velocity.x = 0
					break
				case 'right':
					ghost.velocity.y = 0
					ghost.velocity.x = 5
					break
				case 'left':
					ghost.velocity.y = 0
					ghost.velocity.x = -5
					break
			}

			ghost.prevCollisions = []
		}
	})

	if (player.velocity.x > 0) player.rotation = 0
	else if (player.velocity.x < 0) player.rotation = Math.PI
	else if (player.velocity.y > 0) player.rotation = Math.PI / 2
	else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5

}

window.addEventListener('keydown', ({ key }) => {
	switch (key) {
		case 'w':
			keys.w.pressed = true
			lastKey = 'w'
			break
		case 'a':
			keys.a.pressed = true
			lastKey = 'a'
			break
		case 's':
			keys.s.pressed = true
			lastKey = 's'
			break
		case 'd':
			keys.d.pressed = true
			lastKey = 'd'
			break
	}

})

window.addEventListener('keyup', ({ key }) => {
	switch (key) {
		case 'w':
			keys.w.pressed = false
			break
		case 'a':
			keys.a.pressed = false
			break
		case 's':
			keys.s.pressed = false
			break
		case 'd':
			keys.d.pressed = false
			break
	}

})

window.onload = () => {
	scoreSection.style.display = 'none'
}

startBtn.addEventListener('click', () => {
	scoreElement.innerHTML = score
	scoreSection.style.display = 'block'
	startBtn.style.display = 'none'
	gameRules.style.display = 'none'
	animate()
})
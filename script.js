const heatStages = [
	{ min: 400, color: '#3b3b3b', name: 'No glow', use: 'Too cold to forge. Hammering the steel now can crack it.' },
	{ min: 550, color: '#5c1a12', name: 'Faint red', use: 'Barely visible in daylight. Good for gentle straightening.' },
	{ min: 650, color: '#8b1e14', name: 'Blood red', use: 'Used for annealing, which softens the steel so it is easier to work.' },
	{ min: 750, color: '#c62828', name: 'Cherry red', use: 'The right heat to harden most carbon steels by quenching them.' },
	{ min: 850, color: '#ef6c00', name: 'Orange', use: 'Good for bending and light shaping.' },
	{ min: 950, color: '#ffa000', name: 'Yellow', use: 'The main forging heat. The steel moves easily under the hammer.' },
	{ min: 1100, color: '#ffd54f', name: 'Light yellow', use: 'Heavy forging, like drawing out a thick bar quickly.' },
	{ min: 1250, color: '#fff8e1', name: 'White', use: 'Forge welding heat. If it starts throwing sparks, the steel is burning.' }
]

setupTheme()
setupHeatSlider()
setupCarousels()

function setupTheme() {
	const root = document.documentElement
	root.dataset.theme = localStorage.getItem('theme') ?? 'dark'

	document.querySelector('.theme-toggle').addEventListener('click', () => {
		root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'
		localStorage.setItem('theme', root.dataset.theme)
	})
}

function setupHeatSlider() {
	const slider = document.querySelector('#heat input')
	showHeat(slider)
	slider.addEventListener('input', () => showHeat(slider))
}

function showHeat(slider) {
	const temperature = slider.valueAsNumber
	const stage = heatStages.findLast(stage => temperature >= stage.min)
	const progress = (temperature - slider.min) / (slider.max - slider.min) * 100
	slider.style.setProperty('--progress', `${progress}%`)
	document.querySelector('.bar').style.setProperty('--heat', stage.color)
	document.querySelector('.temperature').textContent = `${temperature.toLocaleString('en')} °C`
	document.querySelector('.heat-name').textContent = `${stage.name}.`
	document.querySelector('.heat-use').textContent = stage.use
}

function setupCarousels() {
	for (const button of document.querySelectorAll('.carousel-controls button'))
		button.addEventListener('click', () => scrollCarousel(button))
}

function scrollCarousel(button) {
	const carousel = button.closest('section').querySelector('.carousel')
	carousel.scrollBy({ left: button.dataset.direction * carousel.clientWidth * 0.8, behavior: 'smooth' })
}

const MET_API = 'https://collectionapi.metmuseum.org/public/collection'
const ARMS_AND_ARMOR = 4
const GALLERY_SIZE = 9

loadTools()
loadGallery()

async function loadTools() {
	const response = await fetch('data/tools.json')
	const items = response.ok && await response.json()
	if (!items)
		return

	const tools = items.filter(item => item.category === 'tool')
	const techniques = items.filter(item => item.category === 'technique')
	document.querySelector('#tools .carousel').replaceChildren(...tools.map(createToolCard))
	document.querySelector('#techniques .carousel').replaceChildren(...techniques.map(createTechniqueCard))
}

function createToolCard({ name, description, image, fit }) {
	const card = document.createElement('article')
	card.className = 'tool-card'
	card.innerHTML = `
		<img src="${image}" alt="${name}" class="${fit}" loading="lazy">
		<div>
			<span class="label">Tool</span>
			<h3>${name}</h3>
			<p>${description}</p>
		</div>`
	return card
}

function createTechniqueCard({ name, description, color }, index) {
	const number = String(index + 1).padStart(2, '0')
	const card = document.createElement('article')
	card.className = 'technique-card'
	card.style.setProperty('--tint', color)
	card.innerHTML = `
		<span class="label">Technique ${number}</span>
		<h3>${name}.</h3>
		<p>${description}</p>
		<span class="number">${number}</span>`
	return card
}

async function loadGallery() {
	const container = document.querySelector('.artworks')
	const artworks = await fetchArtworks().catch(() => [])
	if (artworks.length === 0)
		container.textContent = 'The museum could not be reached. Try again later.'
	else
		container.replaceChildren(...artworks.map(createArtworkCard))
}

async function fetchArtworks() {
	const response = await fetch(`${MET_API}/v1.1/search?departmentId=${ARMS_AND_ARMOR}&hasImages=true&q=sword&limit=12`)
	const { objectIDs } = await response.json()
	const artworks = await Promise.all(objectIDs.map(fetchArtwork))
	return artworks.filter(artwork => artwork?.primaryImageSmall).slice(0, GALLERY_SIZE)
}

async function fetchArtwork(id) {
	const response = await fetch(`${MET_API}/v1/objects/${id}`)
	return response.ok && response.json()
}

function createArtworkCard({ title, culture, objectDate, primaryImageSmall, objectURL }) {
	const link = document.createElement('a')
	link.className = 'artwork'
	link.href = objectURL
	link.target = '_blank'

	const image = document.createElement('img')
	image.src = primaryImageSmall
	image.alt = title
	image.loading = 'lazy'

	const name = document.createElement('strong')
	name.textContent = title

	const caption = document.createElement('p')
	caption.append(name, `${culture || 'Unknown origin'} · ${objectDate}`)

	link.append(image, caption)
	return link
}

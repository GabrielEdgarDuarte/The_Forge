const MET_API = 'https://collectionapi.metmuseum.org/public/collection'
const ARMS_AND_ARMOR = 4

loadTools()
loadGallery()

async function loadTools() {
	const container = document.querySelector('.cards')
	const response = await fetch('data/tools.json')
	const tools = response.ok && await response.json()
	if (tools)
		container.replaceChildren(...tools.map(createToolCard))
}

function createToolCard({ name, category, icon, description }) {
	const card = document.createElement('article')
	card.className = 'card'
	card.dataset.category = category
	card.innerHTML = `
		<span class="icon">${icon}</span>
		<h3>${name}</h3>
		<p>${description}</p>`
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
	return artworks.filter(artwork => artwork?.primaryImageSmall)
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

	const caption = document.createElement('p')
	caption.textContent = `${title} · ${culture || 'Unknown origin'}, ${objectDate}`

	link.append(image, caption)
	return link
}

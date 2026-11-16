loadTools()

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

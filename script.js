setupTheme()

function setupTheme() {
	const button = document.querySelector('.theme-toggle')
	applyTheme(localStorage.getItem('theme') ?? 'light', button)

	button.addEventListener('click', () => {
		const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
		localStorage.setItem('theme', theme)
		applyTheme(theme, button)
	})
}

function applyTheme(theme, button) {
	document.documentElement.dataset.theme = theme
	button.textContent = theme === 'dark' ? '☀️' : '🌙'
}

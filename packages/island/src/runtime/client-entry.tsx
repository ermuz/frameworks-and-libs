import { createRoot } from 'react-dom/client';
import { App } from './App';

function renderInBrowser() {
	const containerEl = document.querySelector('#root');
	if (!containerEl) throw new Error('#root element not found');
	createRoot(containerEl).render(<App />);
}

renderInBrowser();

const urlInput = document.getElementById('url-input');
const browserFrame = document.getElementById('browser-frame');

// Load the search history from the main process
let searchHistory = [];

window.api.getSearchHistory().then((history) => {
  searchHistory = history; // Initialize the search history
});

// Handle "Go" button click and input enter key
const loadPage = () => {
  const query = urlInput.value.trim();
  let url = '';

  if (query) {
    if (query.startsWith('http://') || query.startsWith('https://')) {
      url = query; // If it's a direct URL, use it
    } else {
      url = `https://www.google.com/search?q=${encodeURIComponent(query)}`; // If it's a search query, format the URL
    }

    browserFrame.src = url;

    // Save the URL to history (no query, just the link)
    if (!searchHistory.includes(url)) {  // Avoid duplicates
      searchHistory.push(url);
      window.api.saveSearchHistory(searchHistory); // Save the updated history
    }
  }
};

urlInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    loadPage();
  }
});

// Update URL input when page navigates
browserFrame.addEventListener('did-navigate', () => {
  urlInput.value = browserFrame.src;
});

// Update URL input when a link is clicked inside the webview
browserFrame.addEventListener('will-navigate', (event) => {
  urlInput.value = event.url;
});

// Update search history when the page is loaded
browserFrame.addEventListener('did-stop-loading', () => {
  const currentUrl = browserFrame.src;
  if (currentUrl !== urlInput.value) {
    urlInput.value = currentUrl; // Update the URL when loading stops
  }

  // Save the current URL to history if it's not already in the history
  if (!searchHistory.includes(currentUrl)) {
    searchHistory.push(currentUrl);
    window.api.saveSearchHistory(searchHistory); // Save the updated history
  }
});

// Back button
document.getElementById('back-button').addEventListener('click', () => {
  browserFrame.goBack();
});

// Forward button
document.getElementById('forward-button').addEventListener('click', () => {
  browserFrame.goForward();
});

// Refresh button
document.getElementById('refresh-button').addEventListener('click', () => {
  browserFrame.reload();
});

document.getElementById('minimize').addEventListener('click', () => {
    window.api.minimize();
});

document.getElementById('maximize').addEventListener('click', () => {
    window.api.maximize();
});

document.getElementById('close').addEventListener('click', () => {
    window.api.close();
});

document.getElementById('devtools-button').addEventListener('click', () => {
    browserFrame.openDevTools();
})
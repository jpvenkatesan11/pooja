// Function to fetch a random Wikipedia summary using the REST API.
async function fetchRandomWikiSummary() {
  const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

// Function to create and append a Wikiscroll-style item.
async function addWikiscrollItem() {
  try {
    const data = await fetchRandomWikiSummary();
    const container = document.getElementById('container');

    // Create the card element.
    const card = document.createElement('div');
    card.className = 'wikiscroll-item';

    // Set the background image if available; otherwise, use a fallback color.
    if (data.thumbnail && data.thumbnail.source) {
      card.style.backgroundImage = `url(${data.thumbnail.source})`;
    } else {
      card.style.backgroundColor = '#333';
    }

    // Create an overlay for text content.
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    // Title element.
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = data.title;

    // Description element: use the Wikipedia 'description' field if available,
    // otherwise fall back to a truncated 'extract'.
    const description = document.createElement('div');
    description.className = 'description';
    if (data.description) {
      description.textContent = data.description;
    } else if (data.extract) {
      description.textContent = data.extract.slice(0, 150) + '...';
    } else {
      description.textContent = 'No description available.';
    }

    overlay.appendChild(title);
    overlay.appendChild(description);
    card.appendChild(overlay);

    // Clicking the card opens the full Wikipedia page in a new tab.
    card.addEventListener('click', () => {
      window.open(data.content_urls.desktop.page, '_blank');
    });

    container.appendChild(card);
  } catch (error) {
    console.error('Error fetching Wikipedia data:', error);
  }
}

// Load a set of initial items.
function initialLoad(count = 5) {
  for (let i = 0; i < count; i++) {
    addWikiscrollItem();
  }
}

// Listen to the container's scroll event and load more items when nearing the bottom.
document.getElementById('container').addEventListener('scroll', function () {
  const container = document.getElementById('container');
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 200) {
    addWikiscrollItem();
  }
});

// Start loading items once the window is loaded.
window.onload = function () {
  initialLoad();
};

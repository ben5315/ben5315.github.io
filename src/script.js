const downloadsListElement = document.getElementById('downloadsList');

let apiKey = '';
let page = 1;
let allDownloads = []; // Store all downloads
let size = 2500;

// Function to list user's downloads
async function listDownloads() {
    while (size == 2500 && apiKey != '') {
    const apiUrl = `https://api.real-debrid.com/rest/1.0/downloads?limit=2500&page=${page}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Page ${page} - User Downloads:`, data);

      // update html
      data.forEach(download => {
        const link = document.createElement('a');
            link.textContent = download.filename;
            link.href = download.download; // Assuming the URL is available in the 'link' property
            link.classList.add('download-link'); // Add a class for styling
            downloadsListElement.appendChild(link);
            allDownloads.push(link); // Store all download links
      });


      // Update pagination variables
      page++;

      size = data.length;
    } catch (error) {
      console.error(`Error fetching page ${page} of user downloads:`, error.message);
    }
    }
}

   // Function to filter downloads based on input value
   function filterDownloads(filter) {
    const sanitizedFilter = filter.replace(/\./g, ''); // Remove spaces and periods
    const filterWords = sanitizedFilter.toLowerCase().split(' ');

    const filteredDownloads = allDownloads.filter(link => {
      const filename = link.textContent.replace(/\./g, '').toLowerCase();
      return filterWords.every(word => filename.includes(word));
    });

    // Clear the current list
    document.getElementById('downloadsList').innerHTML = '';

    // Display filtered downloads as links
    filteredDownloads.forEach(link => {
      document.getElementById('downloadsList').appendChild(link);
    });
  }


// Input element for filtering
const filterInput = document.getElementById('filterInput');
filterInput.addEventListener('input', () => {
  filterDownloads(filterInput.value);
});

    // Function to handle API key submission
    function submitApiKey() {
        apiKey = document.getElementById('apiKey').value;
        if (apiKey) {
          // Clear existing downloads and pagination variables
          document.getElementById('downloadsList').innerHTML = '';
          page = 1;
          listDownloads();
        } else {
          alert('Please enter a valid API key.');
        }
      }

// Button to submit API key
const submitApiKeyButton = document.getElementById('submitApiKey');
submitApiKeyButton.addEventListener('click', submitApiKey);
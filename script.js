const API_URL = "http://localhost:5000/mappings";

let mappingDictionary = {};

function normalizeText(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

// Save mappings to the mongoDB backend
async function saveMappingsToServer() {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mappingDictionary),
    });
    if (response.ok) {
        console.log('Mappings saved to server!');
    } else {
        console.error('Failed to save mappings.');
    }
}

// Load mappings from the mongoDB backend
async function loadMappingsFromServer() {
    const response = await fetch(API_URL);
    if (response.ok) {
        const data = await response.json();
        mappingDictionary = data.reduce((acc, item) => {
            acc[item.inputName] = item.mappedName;
            return acc;
        }, {});
        updateMappingList(); 
    } else {
        console.error('Failed to load mappings.');
    }
}

// Update the UI with the mapping list
function updateMappingList() {
    const listContainer = document.getElementById('mappingList');
    listContainer.innerHTML = '';

    for (const [inputName, mappedName] of Object.entries(mappingDictionary)) {
        const listItem = document.createElement('li');
        listItem.textContent = `${inputName} → ${mappedName}`;
        listContainer.appendChild(listItem);
    }
}

// Handle form submission
document.getElementById('manualMatchForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const inputName = normalizeText(document.getElementById('inputName').value.trim());
    const mappedName = document.getElementById('mappedName').value.trim();

    if (inputName && mappedName) {
        mappingDictionary[inputName] = mappedName;
        updateMappingList(); 
        saveMappingsToServer(); // Saving to server
        document.getElementById('manualMatchForm').reset();
    }
});

loadMappingsFromServer();

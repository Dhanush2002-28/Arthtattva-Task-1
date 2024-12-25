const API_URL = "http://localhost:5000/mappings";

// Default fallback mapping dictionary
let mappingDictionary = {
    "a4 paper 500sh": "A4 Paper 500 Sheets",
    "a4 copy paper 500 sheets": "A4 Paper 500 Sheets",
    "500 sheets a4": "A4 Paper 500 Sheets",
    "sticky notes 3x3": "Sticky Notes 3x3 Yellow",
    "post-it notes 3x3 yellow": "Sticky Notes 3x3 Yellow",
    "3x3 yellow sticky notes": "Sticky Notes 3x3 Yellow"
};

function normalizeText(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

// Save mappings to the MongoDB backend
async function saveMappingsToServer() {
    try {
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
    } catch (error) {
        console.error('Error saving mappings to server:', error);
    }
}

// Load mappings from the MongoDB backend
async function loadMappingsFromServer() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json();
            mappingDictionary = data.reduce((acc, item) => {
                acc[item.inputName] = item.mappedName;
                return acc;
            }, {});
            console.log('Mappings loaded from server.');
        } else {
            console.warn('Server failed. Using fallback dictionary.');
        }
    } catch (error) {
        console.error('Error loading mappings from server:', error);
        console.warn('Using fallback dictionary.');
    }
    updateMappingList();
}

// Update the UI with the mapping list
function updateMappingList() {
    const listContainer = document.getElementById('mappingList');
    listContainer.innerHTML = '';

    for (const [inputName, mappedName] of Object.entries(mappingDictionary)) {
        const listItem = document.createElement('li');
        listItem.textContent = `${inputName} → ${mappedName}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.fontSize = '0.85rem';
        deleteButton.style.marginLeft = '20px';
        deleteButton.style.marginTop = '10px';
        deleteButton.className = 'btn btn-danger mt-2';
        deleteButton.addEventListener('click', () => deleteMapping(inputName));
        listItem.appendChild(deleteButton);
        listContainer.appendChild(listItem);
    }
}

// Delete a mapping
async function deleteMapping(inputName) {
    delete mappingDictionary[inputName];

    // Update the server
    try {
        await saveMappingsToServer();
    } catch (error) {
        console.error('Failed to update server:', error);
    }

    // Update the UI
    updateMappingList();
}

// Handle form submission
document.getElementById('manualMatchForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const inputName = normalizeText(document.getElementById('inputName').value.trim());
    const mappedName = document.getElementById('mappedName').value.trim();

    if (inputName && mappedName) {
        mappingDictionary[inputName] = mappedName;
        updateMappingList();
        saveMappingsToServer(); // Save to server
        document.getElementById('manualMatchForm').reset();
    }
});


loadMappingsFromServer();

const API_URL1 = "http://localhost:5000/mappings";

// Function to normalize and tokenize text
function normalizeText(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

// Find the best match from the mapping dictionary
async function findMatch(inputName) {
    const response = await fetch(API_URL1);
    if (response.ok) {
        const data = await response.json();
        const mappingDictionary = data.reduce((acc, item) => {
            acc[item.inputName] = item.mappedName;
            return acc;
        }, {});

        const inputTokens = normalizeText(inputName).split(/\s+/);
        let bestMatch = null;
        let highestScore = 0;

        for (const [key, value] of Object.entries(mappingDictionary)) {
            const keyTokens = normalizeText(key).split(/\s+/);
            const matchScore = calculateTokenMatchScore(inputTokens, keyTokens);
            
            if (matchScore > highestScore) {
                highestScore = matchScore;
                bestMatch = value;
            }
        }

        return highestScore >= 0.5 ? bestMatch : null;
    } else {
        console.error('Failed to load mappings.');
        return null;
    }
}

// Calculate the token match score
function calculateTokenMatchScore(tokens1, tokens2) {
    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);
    const intersection = [...set1].filter((token) => set2.has(token));
    const union = new Set([...set1, ...set2]);
    return intersection.length / union.size;
}

document.getElementById('autoMatchButton').addEventListener('click', async () => {
    const autoMatchInput = document.getElementById('autoMatchInput').value.trim();
    const result = document.getElementById('autoMatchResult');

    if (autoMatchInput) {
        const match = await findMatch(autoMatchInput);
        if (match) {
            result.textContent = `Matched Standard Name: ${match}`;
        } else {
            result.textContent = 'No match found.';
        }
    }
});

const API_URL1 = "http://localhost:5000/mappings";

// Function to normalize and tokenize text
function normalizeText(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

// Synonym and abbreviation dictionary for intelligent matching
const synonymDictionary = {
    "sh": "sheet",
    "sheets": "sheet",
    "copy": "paper",
    "post-it": "sticky"
};

// Replace synonyms in tokens
function replaceSynonyms(tokens) {
    return tokens.map(token => synonymDictionary[token] || token);
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

        const inputTokens = replaceSynonyms(normalizeText(inputName).split(/\s+/));
        let bestMatch = null;
        let highestScore = 0;

        for (const [key, value] of Object.entries(mappingDictionary)) {
            const keyTokens = replaceSynonyms(normalizeText(key).split(/\s+/));
            const matchScore = calculateTokenMatchScore(inputTokens, keyTokens);

            if (matchScore > highestScore) {
                highestScore = matchScore;
                bestMatch = value;
            }
        }

        return highestScore >= 0.5 ? bestMatch : null; // Threshold for token similarity
    } else {
        console.error('Failed to load mappings.');
        return null;
    }
}

// Calculate the token match score (Jaccard Similarity)
function calculateTokenMatchScore(tokens1, tokens2) {
    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);
    const intersection = [...set1].filter((token) => set2.has(token));
    const union = new Set([...set1, ...set2]);
    return intersection.length / union.size;
}

// Fuzzy matching (using Levenshtein distance)
function calculateLevenshteinDistance(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () =>
        Array(b.length + 1).fill(0)
    );

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // Deletion
                matrix[i][j - 1] + 1, // Insertion
                matrix[i - 1][j - 1] + cost // Substitution
            );
        }
    }

    return matrix[a.length][b.length];
}

// Combine token and fuzzy matching for intelligent mapping
async function findIntelligentMatch(inputName) {
    const response = await fetch(API_URL1);
    if (response.ok) {
        const data = await response.json();
        const mappingDictionary = data.reduce((acc, item) => {
            acc[item.inputName] = item.mappedName;
            return acc;
        }, {});

        const normalizedInput = normalizeText(inputName);
        let bestMatch = null;
        let highestScore = 0;

        for (const [key, value] of Object.entries(mappingDictionary)) {
            const normalizedKey = normalizeText(key);
            const tokenMatchScore = calculateTokenMatchScore(
                replaceSynonyms(normalizedInput.split(/\s+/)),
                replaceSynonyms(normalizedKey.split(/\s+/))
            );
            const fuzzyDistance = calculateLevenshteinDistance(normalizedInput, normalizedKey);
            const fuzzyScore = 1 - fuzzyDistance / Math.max(normalizedInput.length, normalizedKey.length);

            const finalScore = (tokenMatchScore * 0.7) + (fuzzyScore * 0.3); // Weighted scoring

            if (finalScore > highestScore) {
                highestScore = finalScore;
                bestMatch = value;
            }
        }

        return highestScore >= 0.5 ? bestMatch : null; // Threshold for combined score
    } else {
        console.error('Failed to load mappings.');
        return null;
    }
}

document.getElementById('autoMatchButton').addEventListener('click', async () => {
    const autoMatchInput = document.getElementById('autoMatchInput').value.trim();
    const result = document.getElementById('autoMatchResult');

    if (autoMatchInput) {
        const match = await findIntelligentMatch(autoMatchInput);
        if (match) {
            result.textContent = `Matched Standard Name: ${match}`;
        } else {
            result.textContent = 'No match found.';
        }
    }
});

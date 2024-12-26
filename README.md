# **Product Name Mapping System**

## **Overview**
The **Product Name Mapping System** is designed to standardize product names from different suppliers, ensuring consistent data entry and improved efficiency. It provides:
- **Manual Matching**: Add mappings for product names manually.
- **Automatic Matching**: Identify and map product names automatically using intelligent matching algorithms.
- **Fallback Mechanism**: Ensures the system works even if the backend server is unavailable.
- **CRUD Operations**: Seamlessly create, read, update, and delete mappings.

---

## **Features and Functionalities**

### 1. Manual Matching
- Manually input a supplier product name and map it to a standardized name.
- The data is dynamically updated in the UI and saved to the backend server.

### 2. Automatic Matching
- Intelligent matching using:
  - **Token Matching**: Splits product names into tokens (words) and compares them.
  - **Fuzzy Matching**: Uses Levenshtein distance to identify approximate matches.
  - **Synonym Handling**: Replaces common abbreviations and synonyms with standardized terms.

### 3. Fallback Mechanism
- Uses a predefined local dictionary if the backend server is unreachable.
- Ensures uninterrupted operation by loading and saving mappings locally.

### 4. CRUD Operations
- **Create**: Add new mappings manually.
- **Read**: Fetch mappings from the server or fallback dictionary.
- **Update**: Modify mappings dynamically.
- **Delete**: Remove mappings via a delete button in the UI.

---

## **Technical Details**

### **Frontend**
- **Languages and Libraries**:
  - HTML: Interface structure.
  - CSS: Styling and layout, including flexbox for adjustments.
  - JavaScript: Core functionality:
    - Fetch API for server communication.
    - DOM manipulation for UI updates.

### **Backend**
- **Technologies Used**:
  - Node.js and Express: Handles API requests.
  - MongoDB: Stores mappings persistently.
  - Mongoose: ORM for database interaction.

---

## **Cases Identified and Handled**
1. **Case Sensitivity**: Normalizes text to lowercase for consistent matching.
2. **Extra Spaces**: Trims leading, trailing, and multiple spaces.
3. **Abbreviations and Synonyms**: Replaces common abbreviations (e.g., `sh → sheet`).
4. **Server Downtime**: Falls back to a local dictionary stored in JavaScript.
5. **Exact and Partial Matches**: Handles both exact and approximate matches (e.g., `"a4sheet"` matches `"a4 sheet"`).

---

## **How to Use**

### **Note**:
- This version uses MongoDB Compass at a local level.
- The API routes and data storage are locally generated.
- Local mapping is implemented for a subset of product names as defined in the fallback dictionary.

### **Steps:**
1. **Adding a Mapping**
   - Enter the supplier product name and standardized name in the input fields.
   - Click **Submit**.
   - The new mapping appears in the list and is saved to the server.

2. **Deleting a Mapping**
   - Click the **Delete** button next to a mapping.
   - The mapping is removed from the list and deleted from the server.

3. **Automatic Matching**
   - Enter a product name in the search field.
   - The system uses intelligent matching algorithms to suggest a standardized name.

---

## **Future Improvements**
- Add user authentication for secure access.
- Implement a frontend interface for bulk uploads.
- Integrate machine learning models for improved matching accuracy.
- Optimize for large datasets with pagination and caching.

---

## **Author**
**Dhanush C**  
Acharya Institute of Technology, Bengaluru  
📧 [dhanushchandru28@gmail.com](mailto:dhanushchandru28@gmail.com)  
📞 9901662554

---

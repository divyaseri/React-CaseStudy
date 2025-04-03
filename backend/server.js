const express = require('express');
const cors = require('cors');
const app = express();
const items = require('./data.json');
const path = require('path');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('The backend server is running!!');
});

// Enhanced items endpoint for numeric search and pagination
app.get('/api/items', (req, res) => {
  const { page = 1, limit = 20, search = '' } = req.query; // Get search and pagination params
  const offset = (page - 1) * limit;

  // Sanitize search term
  const sanitizedSearch = search.trim().toLowerCase().replace(/\s+/g, '');
  const searchPrice = sanitizedSearch.replace(/\$/g, '').toLowerCase();

  // Filter the items based on search term
  const filteredItems = items.filter(item => {
    const itemName = item.name.toLowerCase().replace(/\s+/g, '');
    const itemDescription = item.description.toLowerCase().replace(/\s+/g, '');
    const itemPrice = item.price.toString().replace(/\$/g, '').toLowerCase();

    return (
      itemName.includes(sanitizedSearch) ||
      itemDescription.includes(sanitizedSearch) ||
      itemPrice.startsWith(searchPrice)
    );
  });

  // Paginate the filtered items
  const paginatedItems = filteredItems.slice(offset, offset + parseInt(limit));

  res.json({
    total: filteredItems.length, // Total items after filtering
    items: paginatedItems,       // Items for the current page after filtering
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

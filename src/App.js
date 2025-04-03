import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [noResult, setNoResult] = useState(false);

  // Fetch items from backend API
  const fetchItems = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/items', {
        params: { page, search },
      });
      if (res.data.items.length === 0) {
        setHasMore(false);
        setNoResult(true);
      } else {
        setItems((prev) => (page === 1 ? res.data.items : [...prev, ...res.data.items]));
        setNoResult(false);
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
    }
  }, [page, search, loading, hasMore]);

  // Fetch items on mount and when dependencies change
  useEffect(() => {
    fetchItems();
  }, [page, search]);

  // Infinite scrolling logic
  useEffect(() => {
    const handleScroll = debounce(() => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    }, 200); // Adjust debounce delay to 200ms

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, [loading, hasMore]);

  // Handle search input with debounce
  const handleSearch = debounce((e) => {
    setSearch(e.target.value);
    setPage(1);  // Reset to page 1 when search changes
    setHasMore(true); // Reset "has more" flag when search changes
  }, 300);

  return (
    <div className="container py-4">
      <header className="bg-primary text-white text-center py-3 rounded">
        <h1 className="display-4">Item Gallery</h1>
      </header>

      <main>
        <div className="my-4">
          <input
            type="text"
            placeholder="Search by name, description, or price..."
            onChange={handleSearch}
            className="form-control form-control-lg"
          />
        </div>

        <div className="row">
          {items.map((item) => (
            <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card shadow-lg">
                <img
                  src={item.image}
                  className="card-img-top"
                  style={{ height: '100px', width: '100px' }}
                  alt={item.name}
                />
                <div className="card-body">
                  <h5 className="card-title text-primary">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="text-success font-weight-bold">${item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" style={{ animationDuration: "0.75s" }}></div>
          </div>
        )}
        {!hasMore && <div className="text-center text-muted my-4">No more items!</div>}
        {noResult && <div className="text-center text-muted my-4">No results found for "{search}"</div>}
      </main>
    </div>
  );
}

export default App;
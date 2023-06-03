import './App.css';
import { useState, useEffect } from 'react';

function App() {

  const initResults = [
    { name: 'A' },
    { name: 'B' },
    { name: 'C' },
    { name: 'D' },
    { name: 'E' }
  ];

  const [relatedTracks, setRelatedTracks] = useState([]);
  const [results, setResults] = useState(initResults);
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  }

  const handleDelete = (e) => {
    if (e.keyCode === 8) {
      setQuery("");
      setResults(initResults);
    }
  }

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(`https://itunes.apple.com/search?term=${query}`);
        const result = await response.json();
        const tracks = result.results.length > 0 &&
          result.results.map(c => ({ name: c.trackName })).sort();

        setResults(initResults);
        setRelatedTracks(tracks);

      } catch (error) {
        console.error(error)
      }
    }
    if (query) {
      fetchData();
    }
  }, [query])


  useEffect(() => {

    const uniqueTracks = relatedTracks.length > 0 &&
      relatedTracks.filter(obj => !results.some(({ name }) => obj.name === name));

    const interval = setInterval(() => {
      if (uniqueTracks.length > 0) {
        results.shift();
        setResults(results.concat(relatedTracks.shift()))

      } else {
        setResults(results.concat(results.shift()))
      }
    }, 1000)
    return () => clearInterval(interval);
  }, [relatedTracks, results])

  return (
    <div className="App">
      <input
        className="searchBar"
        type="text"
        placeholder="Search brand"
        onChange={handleChange}
        onKeyDown={handleDelete}
        value={query}
      />
      <div className="resultsContainer">
        {results.length > 0 && results.map(el => (
          <div key={el.name} className="result">
            {el.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

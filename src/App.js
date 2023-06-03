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

  const [relatedCountries, setRelatedCountries] = useState([]);
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
        const response = await fetch(`https://restcountries.com/v2/name/${query}`);
        const result = await response.json();
        const countries = result.length > 0 &&
          result.map(c => ({ name: c.name })).sort();

        setResults(initResults);
        setRelatedCountries(countries);

      } catch (error) {
        console.error(error)
      }
    }
    if (query) {
      fetchData();
    }
  }, [query])


  useEffect(() => {

    const uniqueCountries = relatedCountries.length > 0 &&
      relatedCountries.filter(obj => !results.some(({ name }) => obj.name === name));

    const interval = setInterval(() => {
      if (uniqueCountries.length > 0) {
        results.shift();
        setResults(results.concat(relatedCountries.shift()))

      } else {
        setResults(results.concat(results.shift()))
      }
    }, 1000)
    return () => clearInterval(interval);
  }, [relatedCountries, results])

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
        {results.length > 0 && results.map(character => (
          <div key={character.name} className="result">
            {character.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import "./Watchlist.css";
function Watchlist() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState([]);
  const [filterData, setFilterData] = useState(null);

  const fetchData = async () => {
    await fetch("https://api.jikan.moe/v4/anime")
      .then((response) => {
        return response.json();
      })
      .then((item) => {
        const tempData = item.data;
        setData(
          tempData.map((item) => {
            return {
              id: item.mal_id,
              title: item.title,
              image: item.images.jpg.image_url,
              popularity: item.popularity,
              genre: item.genres.map((item) => {
                return item.name;
              }),
            };
          })
        );
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  //   console.log(data);

  function getUniqueGenre() {
    const genreData = [];

    data.map((item) => {
      item.genre.map((i) => {
        genreData.push(i);
      });
    });
    let uniqGenre = [];
    for (let i = 0; i < genreData.length; i++) {
      if (uniqGenre.indexOf(genreData[i]) === -1) {
        uniqGenre.push(genreData[i]);
      }
    }
    setGenre(uniqGenre);
  }

  useEffect(() => {
    getUniqueGenre();
  }, [data]);

  const handleFilter = (e) => {
    e.preventDefault();
    const tempFilterData = [];
    data.map((item) => {
      item.genre.some((i) => {
        if (i == e.target.value) {
          tempFilterData.push(item);
        }
      });
    });

    setFilterData(tempFilterData);
  };
 

  return (
    <>
      <header>
        <h1>Anime World </h1>
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="search your movie"
          />
          <button>search</button>
        </div>
        <button>WatchList</button>
      </header>
      <section className="filter-section">
        <p>Filter: </p>
        {genre.map((item) => {
          return (
            <button
              key={genre.indexOf(item)}
              value={item}
              onClick={handleFilter}
            >
              {item}
            </button>
          );
        })}
      </section>
      <section className="movie-section">
        {(filterData || data).map((item) => {
          //   if (item.title.toLowerCase() == query.toLowerCase())
          return (
            <div className="movie" key={item.id}>
              <img src={item.image} alt="img" />
              <h4> {item.title} </h4>
              <p>Popularity:{item.popularity || "No Data Found"} </p>
              <button>Add to Wishlist</button>
            </div>
          );
        })}
      </section>
    </>
  );
}

export default Watchlist;

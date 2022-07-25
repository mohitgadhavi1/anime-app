import React, { useEffect, useState } from "react";
import "./Watchlist.css";
function Watchlist() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState([]);
  const [filterData, setFilterData] = useState(null);
  const [watchList, setWatchList] = useState([]);
  const [isWatchListOpen, setIsWatchListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Fetch Data from given api
  //call the fetch func in useState for single initial render
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetch("https://api.jikan.moe/v4/anime")
        .then((response) => {
          return response.json();
        })
        .then((item) => {
          setIsLoading(false);
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
    fetchData();
  }, []);

  //   console.log(data);

  //func for filter genre data
  // func call into useState and gave dependency of data.
  useEffect(() => {
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
    getUniqueGenre();
  }, [data]);

  // click event for selected genre

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
  const localWatchList = [];

  if (watchList) {
    watchList.map((item) => {
      localWatchList.push(item);
      localStorage.setItem("watchList", JSON.stringify(localWatchList));
    });
  } else {
    setWatchList(() => {
      localStorage.getItem("watchList");
    });
  }

  const localObj = localStorage.getItem("watchList");
  console.log(localObj);
  //   console.log(watchList);

  return (
    <>
      <header>
        <h1>Anime World </h1>
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value.toLowerCase());
            }}
            placeholder="search your movie"
          />
        </div>
        <button onClick={() => setIsWatchListOpen(!isWatchListOpen)}>
          WatchList({watchList.length})
        </button>
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
        {isLoading && <p className="loading-message">Movies on the Way....</p>}
        {!isLoading &&
          ((isWatchListOpen && watchList) || filterData || data).map((item) => {
            if (item.title.toLowerCase().includes(query)) {
              return (
                <div className="movie" key={item.id}>
                  <img src={item.image} alt="img" />
                  <h4> {item.title} </h4>
                  <p>Popularity:{item.popularity || "No Data Found"} </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setWatchList((watchList) => [...watchList, item]);
                    }}
                  >
                    Add to Wishlist
                  </button>
                </div>
              );
            }
          })}
      </section>
    </>
  );
}

export default Watchlist;

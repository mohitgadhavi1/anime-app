import React, { useEffect, useState } from "react";
import "./Home.css";
const Home = () => {
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

  let items = JSON.parse(localStorage.getItem("watchList"));
  useEffect(() => {
    setWatchList(JSON.parse(localStorage.getItem("watchList")) || []);
  }, [localStorage]);

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

  console.log(watchList);

  console.log(items);

  return (
    <>
      <header>
        <h1>Anime World </h1>
        <div className="search-wrap">
          <input
            className="searchbar"
            type="text"
            value={query}
            onChange={(e) => {
              e.preventDefault();
              setQuery(e.target.value.toLowerCase());
            }}
            placeholder="   What are you looking for?"
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWatchListOpen(!isWatchListOpen);
          }}
        >
          {" "}
          {isWatchListOpen ? "Close" : `WatchList(${watchList.length})`}
        </button>
      </header>
      <section className="filter-section">
        <p style={{ color: "#A5C9CA" }}>Filter: </p>
        {!isWatchListOpen &&
          genre.map((item) => {
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
                  {isWatchListOpen ? (
                    <button
                      value={item.id}
                      onClick={(e) => {
                        e.preventDefault();
                        console.log(e.target.value);

                        for (let i = 0; i < items.length; i++) {
                          // console.log(items[i]);
                          if (items[i].id == e.target.value) {
                            console.log(items[i]);
                            items.splice(i, 1);
                            console.log(items);
                          }
                        }
                        let newItems = JSON.stringify(items);
                        localStorage.setItem("watchList", newItems);
                        setWatchList(
                          JSON.parse(localStorage.getItem("watchList")) || []
                        );
                        //Restoring object left into items again
                      }}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (!watchList.includes(item)) {
                          setWatchList((watchList) => [...watchList, item]);
                          localStorage.setItem(
                            "watchList",
                            JSON.stringify([...watchList, item])
                          );
                        }
                      }}
                    >
                      Add to Wishlist
                    </button>
                  )}
                </div>
              );
            }
          })}
      </section>
    </>
  );
};

export default Home;

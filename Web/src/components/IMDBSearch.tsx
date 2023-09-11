const axios = require("axios");
const exact = require ("prop-types-exact");
const GridEventListener = require("@mui/x-data-grid").GridEventListener;
const IimdbSearch = require("../interfaces/IimdbSearch");
const MuiIcon = require("@mui/icons-material").default;
const PropTypes = require("prop-types");
const React = require("react");
const useState = require("react").useState;

const IMDBSearch = ({ AddIcon, autoAdd, backendURL, BrokenImageIcon, setNewWatchListItemDtlID, setWatchListItemsLoadingStarted, setWatchListItemsLoadingComplete }
  :
  { AddIcon: typeof MuiIcon, autoAdd: boolean, backendURL: string, BrokenImageIcon: typeof MuiIcon, setNewWatchListItemDtlID: (arg0: number) => void, setWatchListItemsLoadingStarted: (arg0: boolean) => void, setWatchListItemsLoadingComplete: (arg0: boolean) => void }
  ) => {

  const [searchResults, setSearchResults] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const addSearchResultClickHandler = (index: number) => {
    let itemType = 0;``

    if (searchResults[index].Type === "movie") {
      itemType = 1;
    } else if (searchResults[index].Type === "series") {
      itemType = 2;
    } else {
      itemType = 3;
    }

    const confirmAdd = confirm("Add IMDB search result ?");

    if (!confirmAdd) {
      return;
    }

    let paramStr = `${backendURL}/AddWatchListItem?WatchListItemName=${searchResults[index].Title}&WatchListTypeID=${itemType}`;

    paramStr += `&IMDB_URL=https://www.imdb.com/title/${searchResults[index].imdbID}/`;

    paramStr += `&IMDB_Poster=${searchResults[index].Poster}`;

    axios
      .put(paramStr)
      .then((res: typeof IimdbSearch) => {
        if (res.data[0] === "ERROR") {
          alert(`The error ${res.data[1]} occurred while  adding the search result`);
        } else if (res.data[0] === "ERROR-ALREADY-EXISTS") {
          alert(res.data[1]);
        } else {
          setWatchListItemsLoadingStarted(false);
          setWatchListItemsLoadingComplete(false);

          if (autoAdd) {
            setNewWatchListItemDtlID(res.data[1]);
          }

          // Remove this item from the the search results since its been added
          const newSearchResults = Object.assign([], searchResults);
          newSearchResults.splice(index, 1);
          setSearchResults(newSearchResults);
        }
      })
      .catch((err: Error) => {
        alert(`The error ${err.message} occurred while adding the search result`);
      });
  };

  const onKeyUpHandler = (event: typeof GridEventListener) => {
    if (event.key === "Enter") {
      searchTermHandler();
    }
  };

  const searchTermHandler = () => {
    if (searchTerm === "") {
      alert("Please enter a search term");
      return;
    }

    axios
      .get(`${backendURL}/SearchIMDB?SearchTerm=${searchTerm}`)
      .then((res: typeof IimdbSearch) => {
        if (res.data[0] === "ERROR") {
          alert(`The error ${res.data[1]} occurred while  searching IMDB`);
        } else {
          //  Trap IMDB errors
          const imdbResponse = JSON.parse(res.data[1]);

          if (imdbResponse.Response === "False") {
            alert(imdbResponse.Error);
            return;
          } else {
            const set1 = JSON.parse(res.data[1]).Search;

            if (typeof JSON.parse(res.data[2]).Search !== "undefined") {
              const set2 = JSON.parse(res.data[2]).Search;
              set1.push(...set2);
            }

            setSearchResults(set1);
          }
        }
      })
      .catch((err: Error) => {
        alert(`The error ${err.message} occurred while searching IMDB`);
      });
  };

  return (
    <>
      <span className="imdbSearch">
        <input className="inputStyle" autoFocus={true} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} onKeyUp={(event) => onKeyUpHandler(event)} />
      </span>

      <table className="datagrid">
        <tbody className="data watchList">
          {searchResults.length > 0 &&
            searchResults.map((currentResult: typeof IimdbSearch, index: number) => {
              return (
                <tr key={index}>
                  <td className="row">
                    <span className="searchResult">
                      <span className="addSearchResultIcon" onClick={(event) => addSearchResultClickHandler(index)}>{AddIcon}</span>

                      {currentResult.Poster !== "N/A" && (
                        <>
                          <span className="textLabel">
                            {currentResult.Title} ({currentResult.Year})
                          </span>
                          <img className="searchResultPoster" src={currentResult.Poster} alt={currentResult.Title} />
                        </>
                      )}

                      {currentResult.Poster === "N/A" && (
                        <>
                          <span className="textLabel">
                            {currentResult.Title} ({currentResult.Year})
                          </span>
                          <img className="searchResultPoster" src={BrokenImageIcon} alt={currentResult.Title} />
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

IMDBSearch.propTypes = exact({
  AddIcon: PropTypes.object.isRequired,
  autoAdd: PropTypes.bool.isRequired,
  backendURL: PropTypes.string.isRequired,
  setNewWatchListItemDtlID: PropTypes.func.isRequired,
  setWatchListItemsLoadingStarted: PropTypes.func.isRequired,
  setWatchListItemsLoadingComplete: PropTypes.func.isRequired,
});

export default IMDBSearch;




/* useEffect(() => {
          setSearchResults([
               {
                 "Title": "Fubar",
                 "Year": "2002",
                 "imdbID": "tt0302585",
                 "Type": "movie",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BMTU3MzY0NzgwN15BMl5BanBnXkFtZTcwMDgxOTUyMQ@@._V1_SX300.jpg"
               },
               {
                 "Title": "Fubar: Balls to the Wall",
                 "Year": "2010",
                 "imdbID": "tt1555747",
                 "Type": "movie",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BOTM0MzM1MTYxN15BMl5BanBnXkFtZTcwMjQ2NDY4Mw@@._V1_SX300.jpg"
               },
               {
                 "Title": "Fubar",
                 "Year": "2018",
                 "imdbID": "tt6732748",
                 "Type": "movie",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BN2YyNDkyOGYtZWEyZC00NWMxLWIyOWEtNDdkY2JlZmExMWU4XkEyXkFqcGdeQXVyNjk5ODE4NjY@._V1_SX300.jpg"
               },
               {
                 "Title": "Fubar Age of Computer",
                 "Year": "2017–",
                 "imdbID": "tt7517330",
                 "Type": "series",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BMDdkZjg2NmEtN2Y4ZC00ZWY1LTlhZjctOGVmYTQ0Y2Q0ZjdjXkEyXkFqcGdeQXVyODEyNDU1OTg@._V1_SX300.jpg"
               },
               {
                 "Title": "F.U.B.A.R.",
                 "Year": "2014",
                 "imdbID": "tt2275685",
                 "Type": "movie",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BMjE4ODg3MzA2NV5BMl5BanBnXkFtZTcwMzI1NjAzOQ@@._V1_SX300.jpg"
               },
               {
                 "Title": "Fubar",
                 "Year": "2011",
                 "imdbID": "tt2015377",
                 "Type": "movie",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BMjMzMDE2MTA5MF5BMl5BanBnXkFtZTcwMDIwMjYwOA@@._V1_SX300.jpg"
               },
               {
                 "Title": "Fubar",
                 "Year": "2012",
                 "imdbID": "tt2177304",
                 "Type": "movie",
                 "Poster": "N/A"
               },
               {
                 "Title": "Fubar",
                 "Year": "2001",
                 "imdbID": "tt0404974",
                 "Type": "movie",
                 "Poster": "N/A"
               },
               {
                 "Title": "F.U.B.A.R.",
                 "Year": "2009",
                 "imdbID": "tt1340097",
                 "Type": "movie",
                 "Poster": "N/A"
               },
               {
                 "Title": "Fubar",
                 "Year": "2016",
                 "imdbID": "tt4242108",
                 "Type": "movie",
                 "Poster": "N/A"
               },
               {
                 "Title": "Fubar",
                 "Year": "2015",
                 "imdbID": "tt5728744",
                 "Type": "movie",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BMmJkMmIyMzItMWI3My00ZjhkLWI3OTMtNGFhODdmZTE5ZWNkXkEyXkFqcGdeQXVyMjQ1NTU3Nzg@._V1_SX300.jpg"
               },
               {
                 "Title": "FUBAR",
                 "Year": "2016",
                 "imdbID": "tt6391190",
                 "Type": "movie",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BMTVlZGY5YjYtNjY1OS00YTYzLWI5NTAtNDNkOWJkYThlNTMwL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNjEyMTA1NDE@._V1_SX300.jpg"
               },
               {
                 "Title": "Fubar",
                 "Year": "2019",
                 "imdbID": "tt9563336",
                 "Type": "movie",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BMTU3MWYxYzEtNDkyMi00NTM5LWExMjQtNjBjMzY0YTM2OTFiXkEyXkFqcGdeQXVyNjUyOTIxODM@._V1_SX300.jpg"
               },
               {
                 "Title": "F.U.B.A.R.: F**ked Up Beyond All Repairs",
                 "Year": "2018",
                 "imdbID": "tt10066568",
                 "Type": "movie",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BY2NmMzk4YjMtNWRlOC00NmIzLTkyOGMtODc3YjEwODJlMjFkXkEyXkFqcGdeQXVyOTU4NDgyMzk@._V1_SX300.jpg"
               },
               {
                 "Title": "FUBAR",
                 "Year": "2019",
                 "imdbID": "tt10655054",
                 "Type": "movie",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BMzMxYTIzNjYtNjNhMi00MDExLTk1NzktNmVkNDNhMzI3YjhhXkEyXkFqcGdeQXVyMjQyMDA0NTg@._V1_SX300.jpg"
               },
               {
                 "Title": "Fubar Christmas Rave",
                 "Year": "2009",
                 "imdbID": "tt12526414",
                 "Type": "movie",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BYTBhMjViNzktOTYzZC00YzNhLWIwMGQtMzFmYjVlNWJiZWEzXkEyXkFqcGdeQXVyMTM4NzY4MTA@._V1_SX300.jpg"
               },
               {
                 "Title": "FUBAR",
                 "Year": "2023–",
                 "imdbID": "tt13064902",
                 "Type": "series",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BODNiNWQxMmMtMjIwNC00NDU2LTgwYzctNTI1ZDcyODBjZTNiXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg"
               },
               {
                 "Title": "Fubar",
                 "Year": "2020",
                 "imdbID": "tt13612580",
                 "Type": "movie",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BNWMyYjAzNmItYWRlYS00NzcyLTgxMjYtZjg2MzY4Yjg0NTA5XkEyXkFqcGdeQXVyMTI3MDU2Mzcw._V1_SX300.jpg"
               },
               {
                 "Title": "TNT FUBAR",
                 "Year": "2022–",
                 "imdbID": "tt21614430",
                 "Type": "series",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BYTQyMmY2NzktMjY0ZC00MTNiLThhZTUtZTMyY2U0YTQwMmRkXkEyXkFqcGdeQXVyMjQwMDAzNDk@._V1_SX300.jpg"
               },
               {
                 "Title": "Fubar Sessions",
                 "Year": "2022–",
                 "imdbID": "tt22057494",
                 "Type": "series",
                 "Poster": "https://m.media-amazon.com/images/M/MV5BMDhmYTM2NTktMzIyZS00YmE0LWFlY2ItYjRjOTdlY2IzZmM5XkEyXkFqcGdeQXVyODQ4MjU1MDk@._V1_SX300.jpg"
               }
             ]);
     },[]);*/

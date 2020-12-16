// style
import styles from "./style/App.module.scss";
// data json
import { InitListState } from "./data/BtnData";

// components
import YearList from "./components/YearList";
import MovieInfo from "./components/MovieInfo";
import PrizeInfo from "./components/PrizeInfo";
import MovieFilter from "./components/MovieFilter";
import MemberBtn from "./components/MemberBtn";
import { MemberNav, MemberPage } from "./components/MemberPage";
import ControlSilder from "./components/ControlSlider";
import React, { useState, useEffect, useRef } from "react";
//config and firebase
import { apiKey, omdbKey, firestore } from "./config";
import { AuthProvider } from "./contexts/AuthContexts";

// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import * as firebase from "firebase";
// import "firebase/auth";
// import "firebase/firestore";

function App() {
  const [tmdbData, setData] = useState("");
  const [tmdbVideo, setVideo] = useState("");
  const [tmdbImages, setImages] = useState("");
  const [tmdbCredits, setCredits] = useState("");
  const [tmdbCrew, setCrew] = useState("");
  const [tmdbPerson, setPerson] = useState("");
  const [localData, renewData] = useState("");
  const [omdbData, setomdbData] = useState("");
  const [imdbSpan, setRating] = useState("");

  const [list, setList] = useState([]);
  const [yearListRefs, setRefs] = useState("");
  const [listState, setlistState] = useState(InitListState);
  const [filmList, setFilmList] = useState("");
  const [prize, setPrize] = useState("");

  // init control-slider
  const [vertical, setVertical] = useState(100);
  const [minYear, setMin] = useState(1928);
  const [maxYear, setMax] = useState(2020);
  const [isScroll, setScroll] = useState(true);

  // get uid
  const [userData, setUserData] = useState("");
  const [userId, setUserId] = useState();

  //  set ref of infoBox
  const movieInfoEl = useRef(null);
  const crewsEl = useRef(null);

  // switch of infoBox
  const [infoBoxState, setInfoBox] = useState(false);
  const [prizeBoxState, setprizeBox] = useState(true);

  const [memberPage, setMemberPage] = useState(false);

  const movieLiked = firestore.collection("movie_liked");
  const [likedList, setLikedList] = useState();

  //  console.log(listState);

  useEffect(() => {
    const yearList = [];
    //  根據 listState 去把 yearList 給做出來
    for (let i = 2020; i >= 1928; i--) {
      let item = { year: i, list: [[], [], []] };
      yearList.push(item);
    }

    // 設定年份欄位的參考
    const refs = yearList.reduce((acc, value) => {
      acc[value.year] = React.createRef();
      return acc;
    }, {});

    setRefs(refs);
    listState.map((list) =>
      fillYearList(yearList, list.film_list, list.prize, list.order)
    );
    setList(yearList);

    setSilderValue();

    // prevent scroll event when no film list
    for (let i = 0; i < listState.length; i++) {
      if (listState[i].film_list !== undefined) {
        // console.log("scroll");
        setScroll(true);
        return;
      }
    }

    function setSilderValue() {
      if (yearListRefs !== null) {
        if (yearListRefs[minYear] !== undefined) {
          // console.log(yearListRefs[minYear]);
          let a = maxYear - minYear + 1;
          let b = yearListRefs[minYear].current.getBoundingClientRect();
          let c = a * b.height;
          let d = Math.floor(((b.bottom - 100) / c) * 100);
          setVertical(d);
        }
      }
    }

    setScroll(false);
    console.log("can't scroll");
  }, [listState]);

  // 取得使用者收藏清單，並設訂變數 likedList
  useEffect(() => {
    if (userId) {
      movieLiked.where("user", "==", userId).onSnapshot((onSnapshot) => {
        let arr = [];
        onSnapshot.forEach((doc) => {
          arr.push(doc.data());
        });
        setLikedList(arr);
        // console.log("-------------------------");
      });
    }
  }, [userId]);

  // put movies to the correspondense year box
  function fillYearList(yearList, fes, prize, order) {
    if (fes !== undefined) {
      let data = fes.filter((obj) => obj.prize === prize);

      yearList.forEach((yearbox) => {
        let box = yearbox.list[order];

        data.forEach((item) => {
          if (item.year === yearbox.year) {
            box.push(item);
          }
        });
        if (box.length === 0) {
          box.push({ prize: null });
        }
      });
    } else {
      yearList.forEach((yearbox) => {
        yearbox.list[order].push({ prize: null });
      });
    }
  }

  function addLiked(e, obj) {
    // console.log(e.currentTarget.dataset["id"]);
    console.log(obj);

    movieLiked
      .add(obj)
      .then((res) => {
        movieLiked.doc(res.id).set({ id: res.id }, { merge: true });
      })
      .then(() => {
        console.log("add movie success!");
      });

    e.stopPropagation();
    console.log("===========");
  }

  // 取消收藏，並恢復原本 keepTag 樣式
  function cancelLiked(e, movieId) {
    // console.log(props.likedList);
    console.log(e.currentTarget);
    console.log(movieId);

    for (let i = 0; i < likedList.length; i++) {
      // let a = props.movie_id;
      if (movieId === likedList[i].movie_id) {
        // console.log(props.likedList[i].id);
        movieLiked
          .doc(likedList[i].id)
          .delete()
          .then(() => {
            console.log("delete data successful");
            e.stopPropagation();
          });
      }
    }

    e.stopPropagation();
  }
  //  get tmdb movie detail & video
  function tmdbApi(type, movie_id) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        `https://api.themoviedb.org/3/movie/${movie_id}${type}?api_key=${apiKey}`
      );

      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    })
      .then((response) => JSON.parse(response))
      .then((data) => {
        if (type === "") {
          setData(data);
        } else if (type === "/videos") {
          setVideo(data);
        } else if (type === "/images") {
          setImages(data);
        } else if (type === "/credits") {
          setCredits(data);
        }
      });
  }

  // TODO: 精簡傳輸資料的方式
  //  get tmdb crew detail
  function tmdbCrewApi(type, personId) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        `https://api.themoviedb.org/3/person/${personId}${type}?api_key=${apiKey}`
      );

      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    })
      .then((response) => JSON.parse(response))
      .then((data) => {
        if (type === "") {
          console.log(data);
          setPerson(data);
        } else if (type === "/movie_credits") {
          setCrew(data);
        }
      });
  }

  //  get get imdb rating from omdb APi
  function omdbApi(movie_id) {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `https://www.omdbApi.com/?apikey=${omdbKey}&i=${movie_id}`,
      true
    );
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        let a = JSON.parse(xhr.responseText);
        setomdbData(a);
      }
    };
    xhr.send();
  }

  //  get get imdb rating from imdb page
  function imdbRating(movie_id) {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `https://cors-anywhere.herokuapp.com/https://www.imdb.com/title/${movie_id}/?ref_=tt_sims_tt`,
      true
    );
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        let doc = new DOMParser().parseFromString(
          xhr.responseText,
          "text/html"
        );
        let elements = [...doc.getElementsByTagName("span")];
        let a = elements.filter((x) => !!x.getAttribute("itemprop"));
        setRating([a[0].innerText, a[2].innerText]);
      }
    };
    xhr.send();
  }

  function ordinalSuffix(i) {
    var j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  }

  return (
    <div className={styles.outter}>
      <aside>
        <div className={styles.logo}>LOGO</div>

        <ControlSilder
          vertical={vertical}
          setVertical={setVertical}
          yearListRefs={yearListRefs}
          minYear={minYear}
          maxYear={maxYear}
          setScroll={setScroll}
          isScroll={isScroll}
        />
        {/* {console.log("=========== [01] control slider")} */}
      </aside>
      <main>
        <div className={styles.container}>
          <div className={styles.navbar}>
            {memberPage ? (
              <MemberNav />
            ) : (
              <MovieFilter
                filmList={filmList}
                setFilmList={setFilmList}
                prize={prize}
                setPrize={setPrize}
                yearlist={list}
                yearListRefs={yearListRefs}
                listState={listState}
                setlistState={setlistState}
                setVertical={setVertical}
                setScroll={setScroll}
              />
            )}
            {/* <Router> */}
            <AuthProvider>
              <MemberBtn
                setUserData={setUserData}
                userData={userData}
                setUserId={setUserId}
                memberPage={memberPage}
                setMemberPage={setMemberPage}
              />
            </AuthProvider>
            {/* <Switch>
                  <Route path="./signup" component={MemberBtn} />
                     </Switch> */}

            {/* </Router> */}
          </div>

          {memberPage ? (
            <MemberPage
              userId={userId}
              userData={userData}
              memberPage={memberPage}
              likedList={likedList}
              cancelLiked={cancelLiked}
            />
          ) : (
            <>
              <div className={styles.subContainer}>
                <YearList
                  prize={prize}
                  tmdbApi={tmdbApi}
                  omdbApi={omdbApi}
                  imdbRating={imdbRating}
                  renewData={renewData}
                  yearlist={list}
                  yearListRefs={yearListRefs}
                  listState={listState}
                  setlistState={setlistState}
                  setMin={setMin}
                  minYear={minYear}
                  setMax={setMax}
                  maxYear={maxYear}
                  setVertical={setVertical}
                  vertical={vertical}
                  isScroll={isScroll}
                  userId={userId}
                  movieInfoEl={movieInfoEl}
                  setInfoBox={setInfoBox}
                  likedList={likedList}
                  addLiked={addLiked}
                  cancelLiked={cancelLiked}

                  // memberPage={memberPage}
                />
                <PrizeInfo
                  listState={listState}
                  minYear={minYear}
                  maxYear={maxYear}
                  vertical={vertical}
                  prizeBoxState={prizeBoxState}
                  setprizeBox={setprizeBox}
                  ordinalSuffix={ordinalSuffix}
                />
              </div>
            </>
          )}
          <MovieInfo
            movieInfoEl={movieInfoEl}
            crewsEl={crewsEl}
            tmdbData={tmdbData}
            tmdbVideo={tmdbVideo}
            tmdbImages={tmdbImages}
            tmdbCredits={tmdbCredits}
            localData={localData}
            omdbData={omdbData}
            imdbSpan={imdbSpan}
            tmdbCrewApi={tmdbCrewApi}
            setCrew={setCrew}
            tmdbCrew={tmdbCrew}
            tmdbPerson={tmdbPerson}
            ordinalSuffix={ordinalSuffix}
            infoBoxState={infoBoxState}
            setInfoBox={setInfoBox}
            userId={userId}
            likedList={likedList}
            addLiked={addLiked}
            cancelLiked={cancelLiked}
          />
        </div>
      </main>
    </div>
  );
}

export default App;

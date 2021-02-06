import styles from "../../style/MovieInfo.module.scss";
import { ReactComponent as Bookmark } from "../../image/icon/add.svg";
import { ordinalSuffix, addLiked, cancelLiked } from "../../utils";
import { BtnData } from "../../data/LocalSource";
import { useSelector } from "react-redux";

export default function UpperTitle(props) {
  const movieData = useSelector((state) => state.setMovieData);
  const userLike = useSelector((state) => state.userLike);
  const isLiked = Boolean(
    userLike.movieList &&
      userLike.movieList.find(
        (item) => item.tmdb_id === movieData.localData.tmdb_id
      )
  );

  const obj = {
    user: userLike.user.uid,
    movie_id: movieData.localData.movie_id,
    tmdb_id: movieData.localData.tmdb_id,
    data_id: movieData.localData.data_id,
    poster_path: movieData.localData.poster_path,
    film_name_en: movieData.localData.film_name_en,
    film_name_zh: movieData.localData.film_name_zh,
    time: new Date(),
    year: movieData.localData.year,
  };

  const prizeTitle = () => {
    const dataId = movieData.localData.data_id;
    if (dataId) {
      const filmFes = dataId.slice(0, dataId.lastIndexOf("_"));
      const prizeId = dataId.substring(dataId.length - 1);

      for (let i = 0; i < BtnData.length; i++) {
        if (BtnData[i].list_name === filmFes) {
          return (
            <>
              {BtnData[i].official_name}
              {BtnData[i].arr[prizeId - 1].subBtnText}
            </>
          );
        }
      }
    }
  };

  return (
    <div className={styles.upper}>
      <div>
        <span className={styles.subtitle}>
          {movieData.localData.th && ordinalSuffix(movieData.localData.th)}
          {movieData.localData.year}
          {prizeTitle()}
        </span>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>
          <p>{movieData.detail.title}</p>
          <p>{movieData.localData.film_name_zh}</p>
        </div>

        <div className={isLiked ? styles.addBtn : styles.cancelBtn}>
          <Bookmark
            onClick={(e) => {
              if (userLike.user.uid) {
                isLiked
                  ? cancelLiked(
                      e,
                      userLike.movieList,
                      "movie_liked",
                      movieData.localData.tmdb_id
                    )
                  : addLiked(e, "movie_liked", obj);
              } else {
                alert("登入會員才能加入收藏喔！");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

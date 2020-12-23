import React, { useState, useEffect } from "react";
import styles from "../style/Crew.module.scss";
import { ReactComponent as Bookmark } from "../image/icon/add.svg";

export default function CrewCard(props) {
  let obj = {
    user: props.userId,
    movie_id: "",
    tmdb_id: props.data.id,
    data_id: "",
    poster_path: props.data.poster_path,
    film_name_en: props.data.title,
    film_name_zh: "",
    year: props.data.release_date.split("-")[0],
  };

  const isLiked = Boolean(
    props.likedList &&
      props.likedList.find((item) => item.tmdb_id === props.data.id)
  );

  return (
    <div
      className={styles.movieCard}
      key={props.data.credit_id}
      value={props.data.id}
      onClick={() => {
        // console.log(props);
        let data = [props.data];
        props.tmdbApi("/translations", props.data.id).then((res) => {
          data.push(res);
        });
        console.log(data);
        props.setCrewMovieData(data);
        props.setInfoOpen(true);
      }}
    >
      {/* ------- keetTag --------*/}
      {props.userId ? (
        <Bookmark
          className={isLiked ? styles.addBtn : styles.cancelBtn}
          //    data-id={props.movie_id}
          onClick={(e) =>
            isLiked
              ? props.cancelLiked(e, props.data.id)
              : props.addLiked(e, obj)
          }
        />
      ) : (
        ""
      )}
      {/* ------- keetTag --------*/}

      <div className={styles.poster}>
        {/* {console.log(props.data)} */}
        {props.data.poster_path !== null ? (
          <img
            alt="poster"
            src={`https://image.tmdb.org/t/p/w154${props.data.poster_path}`}
          />
        ) : (
          <div className={styles.noPic}></div>
        )}
      </div>
      <div>
        {props.data.release_date !== undefined
          ? props.data.release_date.split("-")[0]
          : ""}
      </div>
      <div>{props.data.title}</div>
    </div>
  );
}

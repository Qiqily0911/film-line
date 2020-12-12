import React, { useState } from "react";
import styles from "../style/MovieFilter.module.scss";
import { BtnData } from "../data/BtnData";

function MovieFilter(props) {
  // const [subBtnVal, setSubBtnVal] = useState({
  //    "index-1": "",
  //    "index-2": "",
  //    "index-3": "",
  // });

  // const [isSubOpen, setSubOpen] = useState({
  //    "order-0": "",
  //    "order-1": "",
  //    "order-2": "",
  // });

  const selection = (
    <div className={styles.option}>
      {BtnData.map((data, i) => (
        <div key={i} name={"index-" + i}>
          <button type="button" onClick={selectFilmList}>
            {data.btnText}
          </button>

          <div className={styles.subBtn} data-order={i}>
            {data.arr.map((subBtn, j) => (
              <button
                key={j}
                type="button"
                onClick={selectPrize}
                data-order={j}
              >
                {subBtn.subBtnText}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // TODO: 選擇影展，展開subBtn選項
  function selectFilmList(e) {
    let btnValue = e.target;
    console.log(btnValue);
  }

  // 設定影展和獎項
  function selectPrize(e) {
    let num1 = Number(e.target.parentNode.dataset.order);
    let num2 = Number(e.target.dataset.order);
    let order = Number(e.nativeEvent.path[4].dataset.order);

    let btnSelect = {
      title: BtnData[num1].btnText,
      prize_name: BtnData[num1].arr[num2].subBtnText,
      film_list: BtnData[num1].value,
      prize: BtnData[num1].arr[num2].subBtnValue,
      order: order,
    };

    let arr = [...props.listState];

    // 選不同獎項
    for (let i = 0; i < props.listState.length; i++) {
      if (props.listState[i].film_list !== undefined) {
        if (btnSelect.title === props.listState[i].title) {
          if (btnSelect.prize === props.listState[i].prize) {
            alert("選過囉");
            return;
          }
        }
      }
    }

    arr[order] = btnSelect;
    props.setlistState(arr);
    props.setVertical(100);
  }

  function close(e) {
    let order = Number(e.target.dataset.order);
    let arr = [...props.listState];

    arr[order] = { film_list: undefined, order: order };

    props.setlistState(arr);
    props.setVertical(100);
  }

  const title = props.listState.map((data, i) => (
    <div className={styles.fesTitle} key={i}>
      {data.film_list !== undefined ? (
        <div>
          <div
            className={styles.closeBtn}
            onClick={close}
            data-order={data.order}
          >
            ×
          </div>
          <span>{data.title}</span>
          <span>{data.prize_name}</span>
        </div>
      ) : (
        <div data-order={data.order}>
          <div className={styles.closeBtn}>×</div>
          <span>選擇影展及獎項</span>
          {selection}
        </div>
      )}
    </div>
  ));

  return (
    <div className={styles.movieFilter}>
      <div className={styles.titleBox}>{title}</div>
    </div>
  );
}

export default MovieFilter;

//  let name = subBtnBox.getAttribute("name");

//  switch (btnValue) {
//    case "cannes":
//      setSubBtnVal({
//        ...subBtnVal,
//        [name]: "cannes",
//      });
//      break;

//    case "oscar":
//      setSubBtnVal({
//        ...subBtnVal,
//        [name]: "oscar",
//      });
//      break;

//    case "goldenHorse":
//      setSubBtnVal({
//        ...subBtnVal,
//        [name]: "goldenHorse",
//      });
//      break;

//    default:
//      setSubBtnVal({
//        ...subBtnVal,
//        [name]: "",
//      });
//  }

//  props.setFilmList(subBtnData[btnValue].source);

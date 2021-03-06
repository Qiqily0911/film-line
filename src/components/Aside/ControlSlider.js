import React from "react";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import styles from "../../style/App.module.scss";
import { yearConvert } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import { setPercentValue } from "../../globalState/actions";

function ControlSilder(props) {
  const percentValue = useSelector((state) => state.setPercentYear);
  const yearRange = percentValue.yearRange;
  const dispatch = useDispatch();

  function handleChangeStart() {
    props.setScroll(false);
  }

  function handleChangeVertical(value) {
    if (value !== percentValue.percent.percent) {
      dispatch(setPercentValue(value));
    }
    const num = percentValue.percent.currentYear;
    if (props.yearListRefs[num] !== null) {
      props.yearListRefs[num].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  function handleScroll() {
    props.setScroll(true);
  }

  const verticalLabels = {
    25: "•",
    50: "•",
    75: "•",
  };

  const formatPc = (p) => `${yearConvert(p, yearRange.max, yearRange.min)}`;

  return (
    <div className={styles.slider} ref={props.sliderRef}>
      <div className={styles.inner}>
        <div className={styles.yearText}>{yearRange.max}</div>
        <Slider
          value={percentValue.percent.percent}
          orientation="vertical"
          labels={verticalLabels}
          handleLabel={percentValue.percent.currentYear.toString()}
          format={formatPc}
          onChangeStart={handleChangeStart}
          onChange={handleChangeVertical}
          onChangeComplete={handleScroll}
        />
        <div className={styles.yearText}>{yearRange.min}</div>
      </div>
    </div>
  );
}

export default ControlSilder;

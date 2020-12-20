import React, { useState, useEffect } from "react";
import styles from "../style/MemberBtn.module.scss";
import Login from "./Login";
import { useAuth } from "../contexts/AuthContexts";
import { firestore } from "../config";
import { ReactComponent as LoginIcon } from "../image/icon/login.svg";
import { ReactComponent as LogoutIcon } from "../image/icon/logout.svg";

function MemberBtn(props) {
  const { logout, currentUser } = useAuth();
  const [isOpen, setOpen] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [error, setError] = useState("");
  // const [userName, setUserName] = useState("");
  const users = firestore.collection("users");

  async function handleLogout() {
    setError("");
    try {
      await logout();
      props.setMemberPage(false);
      props.setUserId("");
    } catch {
      setError("Failed to log out");
    }
  }

  useEffect(() => {
    if (currentUser) {
      setLogin(true);
      setOpen(false);
    } else {
      setLogin(false);
    }
  }, [currentUser, props]);

  //  show user data
  useEffect(() => {
    if (currentUser) {
      currentUser && props.setUserId(currentUser.uid);
      //  console.log(currentUser.uid);
      users.get().then((data) => {
        data.forEach((user) => {
          props.setUserData(user.data());
        });
      });
    }
  }, [currentUser]);

  const logedIn = (
    <div className={styles.signInDiv}>
      <div
        className={styles.switchBtn}
        onClick={() => {
          props.setMemberPage(true);
        }}
      >
        會員專區
      </div>
      <div
        className={styles.switchBtn}
        onClick={() => {
          props.setMemberPage(false);
          props.setInfoBox(false);
          props.setprizeBox(false);
        }}
      >
        找電影
      </div>
      {/* {currentUser && <div>{currentUser.email}</div>} */}
      <div className={styles.userName}>
        <p>Hi, {props.userData.name ? props.userData.name : "小明"}</p>
      </div>
      {error && <div>{error}</div>}

      <div className={styles.loginIcon} onClick={handleLogout}>
        <LogoutIcon />
      </div>
      {/* <button onClick={handleLogout}>Log Out</button> */}
    </div>
  );

  const loginDiv = (
    <div className={styles.loginDiv}>
      <div className={styles.loginBox}>
        <div className={styles.loginClose} onClick={() => setOpen(false)}>
          ×
        </div>
        {/* index.js:1 Warning: Cannot update a component (`App`) while rendering a different component 
            (`MemberBtn`). To locate the bad setState() call inside `MemberBtn`, follow the stack trace 
            as described in https://reactjs.org/link/setstate-in-render */}

        <Login
          googleSignIn={props.googleSignIn}
          faceBookSignIn={props.faceBookSignIn}
        />
      </div>
    </div>
  );

  const loginIcon = (
    <div className={styles.loginIcon} onClick={() => setOpen(true)}>
      <LoginIcon />
    </div>
  );

  return (
    <div className={styles.loginOutter}>
      {isLogin ? logedIn : loginIcon}

      {isOpen ? loginDiv : ""}
    </div>
  );
}

export default MemberBtn;

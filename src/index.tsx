import { Amy } from "@amy-app/js-sdk";
import { AppPage, createAmyTheme } from "@amy-app/react-components";
import { Button, CssBaseline, TextField } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import firebase from "firebase";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    height: '118px',
    justifyContent: 'space-around',
  },
}));

Amy.initialize();

const firebaseConfig = {
  apiKey: "AIzaSyAZ1chyFHO2_yCc4ESXA4vjUuM_66KfMlg",
  authDomain: "pathways-amy.firebaseapp.com",
  projectId: "pathways-amy",
  storageBucket: "pathways-amy.appspot.com",
  messagingSenderId: "595540530021",
  appId: "1:595540530021:web:8d999fa24b3235e058078c",
  measurementId: "G-JWGE4WX1QN"
};


const pathwaysAmyApp = firebase.initializeApp(firebaseConfig, 'pathways-amy');
const auth = firebase.auth(pathwaysAmyApp);
const provider = new firebase.auth.GoogleAuthProvider();

async function signInAndGetToken(signInPromise) {
  let token;
  try {
    await signInPromise;
    const { data } = await pathwaysAmyApp
      .functions('northamerica-northeast1')
      .httpsCallable('getAmyToken')();
    token = data.token;
  }
  catch (error) {
    alert(error.message);
    return;
  }
  try {
    await Amy.get().signInViaToken({ token });
    console.log("Amy is logged in. Wait for the magic to happen!");
  }
  catch(error) {
    alert(`Amy sign in error: ${error.message}`);
  }
}

if (window.location.hostname === 'localhost') {
  pathwaysAmyApp
    .functions('northamerica-northeast1')
    .useEmulator('localhost', 5001)
  auth.useEmulator('http://localhost:9099/')
}

const theme = createAmyTheme({
    palette: {
        primary: {
            main: "#002566",
        },
        secondary: {
            main: "#808080",
        },
    },
    shape: {
        borderRadius: 5,
    },
    row: {
        border: "2px solid",
        borderLeft: "8px solid",
        padding: "0px 15px",
    },
    instructionRow: {
        color: "#59A6FF",
    },
    feedbackRow: {
        neutralColor: "#59A6FF",
        positiveColor: "#59A6FF",
        negativeColor: "#59A6FF",
    },
    optionRow: {
        marginLeft: 10,
        correctColor: "#FC9854",
        incorrectColor: "#B3B3B3",
    },
    stickyInstruction: true,
    stickyOption: true,

    props: {
        MuiGrid: {
            spacing: 1,
        },
    },
});

ReactDOM.render(
    <React.StrictMode>
        <CssBaseline />
        <AppPage
            logoSrc={"/logo.png"}
            login={<AuthSpace/>}
            theme={theme}
        />
    </React.StrictMode>,
    document.getElementById("root"),
);



function AuthSpace() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const classes = useStyles();

    return (
        <div className={classes.paper}>
            <TextField
                value={email}
                placeholder="email"
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
            />
            <TextField
                value={password}
                placeholder="password"
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />
            <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!email || !password}
                onClick={async () => {
                  let token;
                  try {
                    await auth.signInWithEmailAndPassword(email, password);
                    const { data } = await pathwaysAmyApp
                      .functions('northamerica-northeast1')
                      .httpsCallable('getAmyToken')();
                    token = data.token;
                  }
                  catch (error) {
                    alert(error.message);
                    return;
                  }
                  try {
                    await Amy.get().signInViaToken({ token });
                    console.log("Amy is logged in. Wait for the magic to happen!");
                  }
                  catch(error) {
                    alert(`Amy sign in error: ${error.message}`);
                  }
                }}
            >
                Login
            </Button>

            <Button
                variant="contained"
                color="secondary"
                type="button"
                onClick={async () => {
                  try {
                    const { user } = await auth.signInWithPopup(provider)
                    // The signed-in user info.
                    console.log(user);
                    debugger;
                  }
                  catch (error) {
                    console.error(error);
                    alert('Something went wrong, please try again.')
                  }
                }}
            >
                Google Sign In
            </Button>
        </div>
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

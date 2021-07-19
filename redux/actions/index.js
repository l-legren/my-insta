import firebase from "firebase";
import {
    USER_STATE_CHANGE,
    USER_POSTS_STATE_CHANGE,
    USER_FOLLOWING_STATE_CHANGE,
    USERS_DATA_STATE_CHANGE,
    USERS_POSTS_STATE_CHANGE,
    CLEAR_DATA
} from "../constants";

export function clearData() {
    return ((dispatch) => {
        dispatch({
            type: CLEAR_DATA,
        })
    })
}

export function fetchUser() {
    return (dispatch) => {
        firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                // console.log("This is the snapshot", snapshot.data())
                if (snapshot.exists) {
                    dispatch({
                        type: USER_STATE_CHANGE,
                        currentUser: snapshot.data(),
                    });
                } else {
                    console.log("does not exist");
                }
            });
    };
}

export function fetchUserPosts() {
    return (dispatch) => {
        firebase
            .firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    const id = doc.id;

                    return {
                        id,
                        ...data,
                    };
                });
                // console.log("This is the snapshot", posts);
                dispatch({
                    type: USER_POSTS_STATE_CHANGE,
                    posts,
                });
            });
    };
}

export function fetchUserFollowing() {
    return (dispatch) => {
        firebase
            .firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((snapshot) => {
                const following = snapshot.docs.map((doc) => {
                    const id = doc.id;
                    return id;
                });
                // console.log("This is the snapshot following", following);
                dispatch({
                    type: USER_FOLLOWING_STATE_CHANGE,
                    following,
                });
                for (let i = 0; i < following.length; i++) {
                    dispatch(fetchUsersData(following[i]));
                }
            });
    };
}

export function fetchUsersData(uid) {
    return (dispatch, getState) => {
        const found = getState().usersState.users.some((el) => el.uid === uid);

        if (!found) {
            firebase
                .firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        let user = snapshot.data();
                        user.uid = snapshot.id;
                        // console.log("User from action", user);
                        dispatch({
                            type: USERS_DATA_STATE_CHANGE,
                            user,
                        });
                        dispatch(fetchUsersFollowingPosts(user.uid));
                    }
                });
        }
    };
}

export function fetchUsersFollowingPosts(uid) {
    return (dispatch, getState) => {
        // console.log("UID!!!!", uid)
        firebase
            .firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                const uid = snapshot.docs[0].ref.path.split("/")[1];
                // console.log(
                //     "This is the snapshot with id from fetchUsersFollowingPosts",
                //     { query: snapshot.docs[0].ref.path.split("/")[1] }
                // );
                const user = getState().usersState.users.find(
                    (el) => el.uid === uid
                );

                let posts = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    const id = doc.id;

                    return {
                        id,
                        user,
                        ...data,
                    };
                });
                dispatch({
                    type: USERS_POSTS_STATE_CHANGE,
                    posts,
                    uid,
                });
                console.log("Posts from users", posts)
            });
    };
}

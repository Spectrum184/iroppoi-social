import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { POST_TYPES } from "./redux/actions/postAction";
import { GLOBAL_TYPES } from "./redux/actions/globalTypes";
import { NOTIFY_TYPES } from "./redux/actions/notifyAction";
import { MESS_TYPES } from "./redux/actions/messageAction";
import audioBell from "./audio/tone.mp3";

const spawnNotification = (body, icon, url, title) => {
  let options = {
    body,
    icon,
  };

  let n = new Notification(title, options);

  n.onclick = (e) => {
    e.preventDefault();
    window.open(url, "_blank");
  };
};

const SocketClient = () => {
  const { auth, socket, online, notify, call } = useSelector((state) => state);
  const dispatch = useDispatch();

  const audioRef = useRef();

  //connect
  useEffect(() => {
    socket.emit("joinUser", auth.user);
  }, [socket, auth.user]);

  //like post
  useEffect(() => {
    socket.on("likeToClient", (newPost) => {
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    });

    return () => socket.off("likeToClient");
  }, [socket, dispatch]);

  //unlike post
  useEffect(() => {
    socket.on("unlikeToClient", (newPost) => {
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    });

    return () => socket.off("unlikeToClient");
  }, [socket, dispatch]);

  //create comment
  useEffect(() => {
    socket.on("createCommentToClient", (newPost) => {
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    });

    return () => socket.off("createCommentToClient");
  }, [socket, dispatch]);

  //delete comment
  useEffect(() => {
    socket.on("deleteCommentToClient", (newPost) => {
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    });

    return () => socket.off("deleteCommentToClient");
  }, [socket, dispatch]);

  //follow
  useEffect(() => {
    socket.on("followToClient", (newUser) => {
      dispatch({
        type: GLOBAL_TYPES.AUTH,
        payload: { ...auth, user: newUser },
      });
    });

    return () => socket.off("followToClient");
  }, [socket, dispatch, auth]);

  //unFollow
  useEffect(() => {
    socket.on("unFollowToClient", (newUser) => {
      dispatch({
        type: GLOBAL_TYPES.AUTH,
        payload: { ...auth, user: newUser },
      });
    });

    return () => socket.off("unFollowToClient");
  }, [socket, dispatch, auth]);

  //Notification
  useEffect(() => {
    socket.on("createNotifyToClient", (msg) => {
      dispatch({
        type: NOTIFY_TYPES.CREAT_NOTIFY,
        payload: msg,
      });

      if (notify.sound) audioRef.current.play();

      spawnNotification(
        msg.user.username + " " + msg.text,
        msg.user.avatar,
        msg.url,
        "Iroppoi"
      );
    });

    return () => socket.off("createNotifyToClient");
  }, [socket, dispatch, notify.sound]);

  useEffect(() => {
    socket.on("removeNotifyToClient", (msg) => {
      dispatch({
        type: NOTIFY_TYPES.REMOVE_NOTIFY,
        payload: msg,
      });
    });

    return () => socket.off("removeNotifyToClient");
  }, [socket, dispatch]);

  //Message
  useEffect(() => {
    socket.on("addMessageToClient", (msg) => {
      dispatch({
        type: MESS_TYPES.ADD_USER,
        payload: { ...msg.user, text: msg.text, media: msg.media },
      });
      dispatch({ type: MESS_TYPES.ADD_MESSAGE, payload: msg });
    });

    return () => socket.off("addMessageToClient");
  }, [socket, dispatch]);

  //check user online/offline
  useEffect(() => {
    socket.emit("checkUserOnline", auth.user);
  }, [socket, auth.user]);

  useEffect(() => {
    socket.on("checkUserOnlineToMe", (data) => {
      data.forEach((item) => {
        if (!online.includes(item.id)) {
          dispatch({ type: GLOBAL_TYPES.ONLINE, payload: item.id });
        }
      });
    });

    return () => socket.off("checkUserOnlineToMe");
  }, [socket, dispatch, online]);

  useEffect(() => {
    socket.on("checkUserOnlineToClient", (id) => {
      if (online.includes(id)) {
        dispatch({ type: GLOBAL_TYPES.ONLINE, payload: id });
      }
    });

    return () => socket.off("checkUserOnlineToClient");
  }, [socket, dispatch, online]);

  //Check user offline
  useEffect(() => {
    socket.on("CheckUserOffline", (id) => {
      dispatch({
        type: GLOBAL_TYPES.OFFLINE,
        payload: id,
      });
    });

    return () => socket.off("CheckUserOffline");
  }, [socket, dispatch, online]);

  //call

  useEffect(() => {
    socket.on("callUserToClient", (data) => {
      dispatch({
        type: GLOBAL_TYPES.CALL,
        payload: data,
      });
    });

    return () => socket.off("callUserToClient");
  }, [socket, dispatch, online]);

  useEffect(() => {
    socket.on("userBusy", (data) => {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: `${call.username} is busy!` },
      });
    });

    return () => socket.off("userBusy");
  }, [socket, dispatch, call]);

  return (
    <>
      <audio controls ref={audioRef} style={{ display: "none" }}>
        <source src={audioBell} type="audio/mp3" />
      </audio>
    </>
  );
};

export default SocketClient;

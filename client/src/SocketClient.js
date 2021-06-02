import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { POST_TYPES } from "./redux/actions/postAction";
import { GLOBAL_TYPES } from "./redux/actions/globalTypes";

const SocketClient = () => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  //connect
  useEffect(() => {
    socket.emit("joinUser", auth.user._id);
  }, [socket, auth.user._id]);

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

  return <></>;
};

export default SocketClient;

import { GLOBAL_TYPES, editData, deleteData } from "./globalTypes";
import { POST_TYPES } from "./postAction";
import {
  postDataAPI,
  patchDataAPI,
  deleteDataAPI,
} from "../../utils/fetchData";
import { createNotify, removeNotify } from "../actions/notifyAction";

export const createComment =
  ({ post, newComment, auth, socket }) =>
  async (dispatch) => {
    const newPost = { ...post, comments: [...post.comments, newComment] };

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    try {
      const data = {
        ...newComment,
        postId: post._id,
        postUserId: post.user._id,
      };

      const res = await postDataAPI("comment", data, auth.token);

      const newData = { ...res.data.newComment, user: auth.user };

      const newPost = { ...post, comments: [...post.comments, newData] };

      dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

      socket.emit("createComment", newPost);

      //Notify
      const msg = {
        id: res.data.newComment._id,
        text: newComment.reply
          ? "mentioned you in a comment"
          : "has commented on your post",
        recipients: newComment.reply ? [newComment.tag._id] : [post.user._id],
        url: `/post/${post._id}`,
        content: post.content,
        image: post.images[0].url,
      };
      dispatch(createNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const updateComment =
  ({ comment, post, content, auth }) =>
  async (dispatch) => {
    const newComments = editData(post.comments, comment._id, {
      ...comment,
      content,
    });
    const newPost = { ...post, comments: newComments };

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    try {
      patchDataAPI(`comment/${comment._id}`, { content }, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const likeComment =
  ({ comment, post, auth }) =>
  async (dispatch) => {
    const newComment = { ...comment, likes: [...comment.likes, auth.user] };

    const newComments = editData(post.comments, comment._id, newComment);

    const newPost = { ...post, comments: newComments };

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    try {
      await patchDataAPI(`comment/${comment._id}/like`, null, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const unlikeComment =
  ({ comment, post, auth }) =>
  async (dispatch) => {
    const newComment = {
      ...comment,
      likes: deleteData(comment.likes, auth.user._id),
    };

    const newComments = editData(post.comments, comment._id, newComment);

    const newPost = { ...post, comments: newComments };

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    try {
      await patchDataAPI(`comment/${comment._id}/unlike`, null, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const deleteComment =
  ({ post, auth, comment, socket }) =>
  async (dispatch) => {
    const deleteArr = [
      ...post.comments.filter((cm) => cm.reply === comment._id),
      comment,
    ];

    const newPost = {
      ...post,
      comments: post.comments.filter(
        (cm) => !deleteArr.find((data) => cm._id === data._id)
      ),
    };

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    socket.emit("deleteComment", newPost);

    try {
      deleteArr.forEach((item) => {
        deleteDataAPI(`comment/${item._id}`, auth.token);
        //Notify
        const msg = {
          id: item._id,
          text: comment.reply
            ? "mentioned you in a comment"
            : "has commented on your post",
          recipients: comment.reply ? [comment.tag._id] : [post.user._id],
          url: `/post/${post._id}`,
        };
        dispatch(removeNotify({ msg, auth, socket }));
      });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

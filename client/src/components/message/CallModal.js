import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../Avatar";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";

const CallModal = () => {
  const { call, auth, peer, socket } = useSelector((state) => state);
  const [mins, setMins] = useState(0);
  const [second, setSecond] = useState(0);
  const [total, setTotal] = useState(0);
  const [answer, setAnswer] = useState(false);
  const [hours, setHours] = useState(0);
  const dispatch = useDispatch();
  const otherVideo = useRef();
  const yourVideo = useRef();
  const [tracks, setTracks] = useState(null);

  //set timer
  useEffect(() => {
    const setTime = () => {
      setTotal((t) => t + 1);
      setTimeout(setTime, 1000);
    };

    setTime();

    return () => setTotal(0);
  }, []);

  useEffect(() => {
    setSecond(total % 60);
    setHours(parseInt(total / 3600));
  }, [total]);

  //end call
  const handleEndCall = () => {
    if (tracks) {
      tracks.forEach((track) => track.stop());
    }
    socket.emit("endCall", call);
    dispatch({ type: GLOBAL_TYPES.CALL, payload: null });
  };

  useEffect(() => {
    socket.on("endCallToClient", (data) => {
      if (tracks) {
        tracks.forEach((track) => track.stop());
      }
      dispatch({ type: GLOBAL_TYPES.CALL, payload: null });
    });

    return () => socket.off("endCallToClient");
  }, [socket, dispatch, tracks]);

  useEffect(() => {
    if (answer) {
      setTotal(0);
    } else {
      const timer = setTimeout(() => {
        socket.emit("endCall", call);
        dispatch({ type: GLOBAL_TYPES.CALL, payload: null });
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [dispatch, answer, call, socket]);

  //stream media
  const openStream = (video) => {
    const config = { audio: true, video };

    return navigator.mediaDevices.getUserMedia(config);
  };

  const playStream = (tag, stream) => {
    let video = tag;
    video.srcObject = stream;
    video.play();
  };

  //answer call
  const handleAnswer = () => {
    openStream(call.video).then((stream) => {
      playStream(yourVideo.current, stream);
      const track = stream.getTracks();
      setTracks(track);

      const newCall = peer.call(call.peerId, stream);
      newCall.on("stream", function (remoteStream) {
        playStream(otherVideo.current, remoteStream);
      });
      setAnswer(true);
    });
  };

  useEffect(() => {
    peer.on("call", (newCall) => {
      openStream(call.video).then((stream) => {
        if (yourVideo.current) {
          playStream(yourVideo.current, stream);
        }
        const track = stream.getTracks();
        setTracks(track);

        newCall.answer(stream);

        newCall.on("stream", function (remoteStream) {
          if (yourVideo.current) {
            playStream(otherVideo.current, remoteStream);
          }
        });
        setAnswer(true);
      });
    });

    return () => peer.removeListener("call");
  }, [peer, call.video]);

  // disconnect
  useEffect(() => {
    socket.on("callDisconnect", () => {
      if (tracks) {
        tracks.forEach((track) => track.stop());
      }
      socket.emit("endCall", call);
      dispatch({ type: GLOBAL_TYPES.CALL, payload: null });
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: "User disconnect!" },
      });
    });

    return () => socket.off("callDisconnect");
  }, [socket, tracks, dispatch, call]);

  return (
    <div className="call-modal">
      <div
        className="call-box"
        style={{
          display: answer && call.video ? "none" : "flex",
        }}
      >
        <div className="text-center" style={{ padding: "40px 0" }}>
          <Avatar src={call.avatar} size="great-avatar" />
          <h4>{call.username}</h4>
          <h6>{call.fullname}</h6>
          {answer ? (
            <div>
              <span>{mins.toString().length < 2 ? "0" + mins : mins}</span>
              <span>:</span>
              <span>
                {second.toString().length < 2 ? "0" + second : second}
              </span>
            </div>
          ) : (
            <div>
              {call.video ? (
                <span>calling video ...</span>
              ) : (
                <span>calling audio ...</span>
              )}
            </div>
          )}
        </div>
        {!answer && (
          <div className="timer">
            <small>{mins.toString().length < 2 ? "0" + mins : mins}</small>
            <small>:</small>
            <small>
              {second.toString().length < 2 ? "0" + second : second}
            </small>
          </div>
        )}

        <div className="call-menu">
          <span className="material-icons text-danger" onClick={handleEndCall}>
            call_end
          </span>
          {call.recipient === auth.user._id && !answer && (
            <>
              {call.video ? (
                <span
                  className="material-icons text-danger"
                  onClick={handleAnswer}
                >
                  videocam
                </span>
              ) : (
                <span
                  className="material-icons text-success"
                  onClick={handleAnswer}
                >
                  call
                </span>
              )}
            </>
          )}
        </div>
        <div
          className="show-video"
          style={{ opacity: answer && call.video ? "1" : "0" }}
        >
          <video ref={yourVideo} className="your-video" />
          <video ref={otherVideo} className="other-video" />
          <div className="time-video">
            <span>{hours.toString().length < 2 ? "0" + hours : hours}</span>
            <span>:</span>
            <span>{mins.toString().length < 2 ? "0" + mins : mins}</span>
            <span>:</span>
            <span>{second.toString().length < 2 ? "0" + second : second}</span>
          </div>
          <span className="material-icons end-call" onClick={handleEndCall}>
            call_end
          </span>
        </div>
      </div>
    </div>
  );
};

export default CallModal;

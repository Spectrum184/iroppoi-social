import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";
import { createPost, updatePost } from "../redux/actions/postAction";
import Icons from "./Icons";

const StatusModal = () => {
  const { auth, theme, status, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [stream, setStream] = useState(false);
  const videosRef = useRef();
  const refCanvas = useRef();
  const [tracks, setTracks] = useState("");

  const handleChangeImage = (e) => {
    const files = [...e.target.files];
    let err = "";
    let newImages = [];

    files.forEach((file) => {
      if (!file) return (err = "File does not exist");

      if (file.size > 1024 * 1024 * 5)
        return (err = "The image largest is 5mb");

      return newImages.push(file);
    });

    if (err) dispatch({ type: GLOBAL_TYPES.ALERT, payload: { error: err } });

    setImages([...images, ...newImages]);
  };

  const deleteImages = (index) => {
    const newArr = [...images];

    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleStream = () => {
    setStream(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          videosRef.current.srcObject = mediaStream;
          videosRef.current.play();
          const track = mediaStream.getTracks();

          setTracks(track[0]);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleCapture = () => {
    const width = videosRef.current.clientWidth;
    const height = videosRef.current.clientHeight;

    refCanvas.current.setAttribute("width", width);
    refCanvas.current.setAttribute("height", height);

    const ctx = refCanvas.current.getContext("2d");
    ctx.drawImage(videosRef.current, 0, 0, width, height);

    let URL = refCanvas.current.toDataURL();

    setImages([...images, { camera: URL }]);
  };

  const handleStopStream = () => {
    tracks.stop();
    setStream(false);
  };

  const imageShow = (src) => {
    return (
      <img
        src={src}
        alt="images"
        style={{ filter: theme ? "invert(1)" : "invert(0)" }}
        className="img-thumbnail"
      />
    );
  };

  const videoShow = (src) => {
    return (
      <video
        controls
        src={src}
        alt="images"
        style={{ filter: theme ? "invert(1)" : "invert(0)" }}
        className="img-thumbnail"
      />
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (images.length === 0)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: "Please add your photo!" },
      });

    if (status.onEdit) {
      dispatch(updatePost({ content, images, auth, status }));
    } else {
      dispatch(createPost({ content, images, auth, socket }));
    }

    setContent("");
    setImages([]);
    if (tracks) tracks.stop();
    dispatch({ type: GLOBAL_TYPES.STATUS, payload: false });
  };

  useEffect(() => {
    if (status.onEdit) {
      setContent(status.content);
      setImages(status.images);
    }
  }, [status]);

  return (
    <div className="status-modal">
      <form onSubmit={handleSubmit}>
        <div className="status-header">
          <h5 className="m-0">Creat Status</h5>
          <span
            onClick={() =>
              dispatch({ type: GLOBAL_TYPES.STATUS, payload: false })
            }
          >
            &times;
          </span>
        </div>
        <div className="status-body">
          <textarea
            name="content"
            placeholder={`${auth.user.username}, what are you thinking? `}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              filter: theme ? "invert(1)" : "invert(0)",
              color: theme ? "white" : "#111",
              background: theme ? "rgba(0,0,0,.03)" : "",
            }}
          />
          <div className="d-flex">
            <div className="flex-fill"></div>
            <Icons setContent={setContent} content={content} theme={theme} />
          </div>
          <div className="show_images">
            {images.map((img, index) => (
              <div key={index} id="file-img">
                {img.camera ? (
                  imageShow(img.camera)
                ) : img.url ? (
                  <>
                    {img.url.match(/video/i)
                      ? videoShow(img.url)
                      : imageShow(img.url)}
                  </>
                ) : (
                  <>
                    {img.type.match(/video/i)
                      ? videoShow(URL.createObjectURL(img))
                      : imageShow(URL.createObjectURL(img))}
                  </>
                )}
                <span onClick={() => deleteImages(index)}>&times;</span>
              </div>
            ))}
          </div>

          {stream && (
            <div className="stream position-relative">
              <video
                autoPlay
                ref={videosRef}
                muted
                style={{ filter: theme ? "invert(1)" : "invert(0)" }}
                width="100%"
                height="100%"
              />
              <span onClick={handleStopStream}>&times;</span>
              <canvas ref={refCanvas} style={{ display: "none" }} />
            </div>
          )}

          <div className="input-image">
            {stream ? (
              <i className="fas fa-camera" onClick={handleCapture} />
            ) : (
              <>
                <i className="fas fa-camera" onClick={handleStream} />
                <div className="file-upload">
                  <i className="fas fa-image" />
                  <input
                    type="file"
                    name="file"
                    id="file"
                    multiple
                    accept="image/*,video/"
                    onChange={handleChangeImage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="status-footer my-2">
          <button className="btn btn-info w-100" type="submit">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatusModal;

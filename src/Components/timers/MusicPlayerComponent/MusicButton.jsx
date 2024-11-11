import { useState, useEffect, useRef } from "react";
import MusicPlayer from "./MusicPlayer";

const MusicButton = ({ status }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState("");
  const [timerStatus, setTimerStatus] = useState("stop");
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  const trackId = ["River", "Rain", "Library", "Bonfire", "Binaural", "Mute"];

  useEffect(() => {
    status != timerStatus && setTimerStatus(status);
  }, [status]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isPopupOpen &&
        popupRef.current &&
        buttonRef.current &&
        !popupRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  const handleMusic = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleTrackName = (selectedTrackId) => {
    if (selectedTrack === "none") {
      setSelectedTrack("");
    } else setSelectedTrack(selectedTrackId);
  };
  // console.log(selectedTrack);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => handleMusic()}
        className="hover:scale-110 w-[40px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="45"
          height="45"
          fill="currentColor"
          className={`bi bi-soundwave mt-2 ${
            isPopupOpen && "bg-pastelYellow bg-opacity-80 rounded-full"
          }`}
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5m-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5m-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5m12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5"
          />
        </svg>
      </button>

      <div
        ref={popupRef}
        className={`${
          isPopupOpen ? "scale-100 -translate-y-3 z-50" : "scale-0"
        } transition-all ease-in-out duration-200 absolute bg-pastelYellow rounded-lg shadow-lg ps-4 pe-4 pt-2 w-[220px] right-0 bottom-[100%] mb-2`}
      >
        <h3 className="text-lg font-semibold mb-2 text-center bg-buttonColor text-white rounded-xl w-full">
          Ambient Sounds
        </h3>
        <ul className="">
          {trackId.map((trackId, index) => {
            return (
              <li
                key={index}
                className={`cursor-pointer flex justify-between ${
                  trackId === selectedTrack
                    ? "bg-gray-100 rounded"
                    : "border-b border-buttonColor"
                } hover:bg-gray-100 w-full text-left last:border-b-0 last:mb-1`}
                onClick={() => handleTrackName(trackId)}
              >
                <div className="ps-1">{trackId}</div>{" "}
                <div className="p e-1">
                  {trackId === selectedTrack && trackId !== "Mute" ? "🔊" : ""}
                  {trackId === selectedTrack && trackId === "Mute" ? "🔇" : ""}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <MusicPlayer selectedTrack={selectedTrack} timerStatus={timerStatus} />
    </div>
  );
};

export default MusicButton;

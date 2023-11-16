import axios from "axios";
import { useState } from "react";

function Podcast({
  track,
  setCurrPlaying,
  currPlaying,
  trackIndex,
  setTrackIndex,
  setIsPlaying,
  userFavourites,
  setUserFavourites,
}) {
  const [addQueue, setAddQueue] = useState(false);
  const [addFront, setAddFront] = useState(false);
  const [addFavourite, setAddFavourite] = useState(
    userFavourites?.filter((data) => data._id === track._id).length === 0
      ? false
      : true
  );
  const [favouriteAnimation, setFavouriteAnimation] = useState(false);

  function handleQueueAdd() {
    setAddQueue(addQueue ? false : true);
    if (!addQueue) {
      setCurrPlaying([...currPlaying, track]);
    }
    if (addQueue) {
      setCurrPlaying(currPlaying.filter((t) => t !== track));
    }
  }

  function handleFrontAdd() {
    setAddFront(addFront ? false : true);
    if (!addFront) {
      if (currPlaying.length > 0 && currPlaying[0] !== track) {
        setCurrPlaying([track, ...currPlaying]);
      }
      if (currPlaying.length === 0) {
        setCurrPlaying([track]);
      }
      setTimeout(() => {
        setTrackIndex(0);
        setIsPlaying(true);
      }, 100);
    }
  }

  function handleFavouriteAdd(track) {
    setAddFavourite((prev) => !prev);

    // Add animation class on click
    setFavouriteAnimation(true);

    axios
      .put(`http://localhost:8080/api/podcast/like/${track._id}`)
      .then(() => {
        !addFavourite
          ? setUserFavourites([...userFavourites, track])
          : setUserFavourites(
              userFavourites?.filter((data) => data._id !== track._id)
            );
      });

    // Reset animation class after a short delay (adjust duration as needed)
    setTimeout(() => {
      setFavouriteAnimation(false);
    }, 1000);
  }

  return (
    <>
      <div className="p-4 flex-shrink-0 font-bold text-lg border border-gray-800 rounded-3xl text-left m-3 h-full w-full bg-gradient-to-tr from-black to-transparent">
        <img
          className="rounded-3xl border-2 m-3 min-w-[150px] min-h-[150px] max-h-[150px]"
          width="150px"
          height="150px"
          src={track?.img ? track.img : "./images/3.jpeg"}
          alt=""
        />

        <div className="flex justify-center text-slate-100">
          {track?.name
            ? track.name
                .slice(0, Math.min(track.name.length, 20))
                .padEnd(20, " ")
            : "Title"}
        </div>
        <div className="flex justify-center text-slate-300">
          {track?.artist
            ? track.artist
                .slice(0, Math.min(track.artist.length, 15))
                .padEnd(15, " ")
            : "Artist"}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleFrontAdd}
            className="px-2"
          >
            {addFront ? (
              <img width="50px" src="./images/play/3.svg" alt="" />
            ) : (
              <img width="50px" src="./images/play/1.svg" alt="" />
            )}
          </button>
          <button
            onClick={handleQueueAdd}
          >
            {addQueue ? (
              <img width="50px" src="./images/queue/4.svg" alt="" />
            ) : (
              <img width="50px" src="./images/queue/1.svg" alt="" />
            )}
          </button>
          <button
            onClick={() => handleFavouriteAdd(track)}
            className={`px-2 ${favouriteAnimation ? 'animate-ping' : ''}`}
          >
            {addFavourite ? (
              <img width="50px" src="./images/favourite/2.svg" alt="" />
            ) : (
              <img width="50px" src="./images/favourite/4.svg" alt="" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default Podcast;

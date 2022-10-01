import { useState, useEffect } from "react";
import { gameData, fullGameData, fullIndividualGameData } from "libs/types";

function Categories() {
  const [gameDataRaw, setGameDataRaw] = useState<fullGameData>();
  const [pageNumber, setPageNumber] = useState({ start: 0, end: 20 });

  useEffect(() => {
    const getCategoryData = async () => {
      let gameData: fullIndividualGameData[] = [];
      const res = await fetch(
        "https://api.twitch.tv/helix/games/top?first=100",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
            "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
          },
        }
      );

      const data: gameData = await res.json();

      data.data.forEach((game) => {
        gameData.push({ ...game, viewers: 0 });
      });

      setGameDataRaw({ data: gameData, pagination: data.pagination });
    };

    getCategoryData();
  }, []);

  const nextGamePage = async () => {
    if (
      gameDataRaw &&
      pageNumber.start + 20 === gameDataRaw?.data?.length - 20
    ) {
      const res = await fetch(
        `https://api.twitch.tv/helix/games/top?first=100&after=${gameDataRaw?.pagination.cursor}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
            "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
          },
        }
      );

      const data: fullGameData = await res.json();

      setGameDataRaw({
        data: [...gameDataRaw.data, ...data.data],
        pagination: data.pagination,
      });
    }
    setPageNumber({ start: pageNumber.start + 20, end: pageNumber.end + 20 });
  };

  const prevGamePage = async () => {
    setPageNumber({ start: pageNumber.start - 20, end: pageNumber.end - 20 });
  };

  return (
    <div>
      {gameDataRaw?.data
        ?.slice(pageNumber.start, pageNumber.end)
        .map((game, index) => {
          return (
            <div key={index}>
              <img
                src={game.box_art_url
                  .replace("{width}", "285")
                  .replace("{height}", "380")}
                alt={game.name}
                style={{ width: 187, height: 250 }}
              />
              <div>{game.name}</div>
            </div>
          );
        })}
      {gameDataRaw && (
        <button
          onClick={() => {
            nextGamePage();
            window.scrollTo(0, 0);
          }}
        >
          Next page
        </button>
      )}
      {pageNumber.start > 0 && (
        <button
          onClick={() => {
            prevGamePage();
            window.scrollTo(0, 0);
          }}
        >
          Prev page
        </button>
      )}
    </div>
  );
}

export default Categories;

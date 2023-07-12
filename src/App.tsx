import React, { useEffect, useState, useCallback, memo } from "react";
import "./App.css";
import SensorData from "./sensor.json";

export const Rolette = memo((props: { tags: any; kakutei: boolean }) => {
  const [start, setStart] = useState(false);
  const [index, setIndex] = useState(0);

  let random_data: string[] = new Array(0);

  const [ran, setRan] = useState(random_data);

  const sensro_tags = props.tags;

  const startRoulette = useCallback(() => {
    setStart(!start);
  }, [start]);

  //ルーレットを回す処理
  useEffect(() => {
    if (!start) {
      return; // startがfalseの場合は処理を終了
    }

    const sensorTags = new Set(sensro_tags);
    const filteredData = SensorData.filter((item) => sensorTags.has(item.id));
    const randomData = filteredData.map((item) => item.url);
    setRan(randomData);

    const interval = setInterval(() => {
      setIndex((oldIndex) =>
        oldIndex < randomData.length - 1 ? oldIndex + 1 : 0
      );
    }, 200);

    return () => clearInterval(interval);
  }, [start]);

  return (
    <>
      <div>
        {ran.length > 0 ? (
          <div className="box has-background-info">
            <img
              style={{ height: "430px", width: "280px" }}
              src={ran[index]}
            ></img>
          </div>
        ) : (
          <div className="box has-background-info">
            <img
              style={{ height: "430px", width: "280px" }}
              src="https://pics.prcm.jp/87c6b6fc41d13/79654551/png/79654551_220x220.png"
            ></img>
          </div>
        )}
      </div>
      <button
        className="button is-fullwidth btn btn--orange btn--cubic btn--shadow mt-3"
        type="button"
        onClick={startRoulette}
      >
        {start ? "ストップ" : "スタート"}
      </button>
    </>
  );
});

function App() {
  const [kakutei, setKakutei] = useState(false);
  const [checkedTags, setCheckedTags] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ]);

  const handleCheckTag = useCallback((tagId: number) => {
    setCheckedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((val) => val !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  }, []);

  useEffect(() => {
    const images = SensorData.map((item) => {
      const image = new Image();
      image.src = item.url;
      return image;
    });
    const preloadImages = () => {
      return Promise.all(
        images.map(
          (image) =>
            new Promise((resolve) => {
              image.onload = resolve;
            })
        )
      );
    };

    preloadImages().then(() => {
      // すべての画像がプリロードされました
      console.log("すべての画像がプリロードされました");
    });
  }, []);

  return (
    <div className="container m-5">
      <div className="columns">
        <div className="column is-one-quarter">
          <div className="card">
            <header className="card-header">
              <p className="card-header-title has-background-info has-text-white">
                Iot Sensor
              </p>
            </header>
            <div className="card-content iotscroll">
              <div className="content">
                <ol>
                  {SensorData.map((item, idx) => (
                    <li>
                      <label className="checkbox" key={idx}>
                        <input
                          type="checkbox"
                          value={item.name}
                          // onChange={handleChangeA}
                          onChange={() => handleCheckTag(item.id)}
                          checked={checkedTags.includes(item.id)}
                        />
                        {item.name}
                      </label>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="column">
          <div className="card">
            <header className="card-header">
              <p className="card-header-title has-text-centered has-background-info has-text-white">
                IoT Sensor スロット
              </p>
            </header>
            <div className="card-content">
              <div className="content display_center">
                <div className="columns">
                  <div className="column">
                    <Rolette tags={checkedTags} kakutei={kakutei} />
                  </div>
                  <div className="column">
                    <Rolette tags={checkedTags} kakutei={kakutei} />
                  </div>
                  <div className="column">
                    <Rolette tags={checkedTags} kakutei={kakutei} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

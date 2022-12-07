import React, { useEffect, useRef, useState } from "react";
import { mergeSort } from "../algorithms";
import { Selector } from "./Selector";

interface Card {
  name: string;
  image_src: string;
}

const IMG_A = "https://artfiles.alphacoders.com/105/105432.jpg";
const IMG_B =
  "https://m.media-amazon.com/images/M/MV5BOTY5NWJkMTMtZTcwMC00NzQyLWJiMzEtZTcwMzI3MTZkNjIwXkEyXkFqcGdeQXVyMzExMzk5MTQ@._V1_.jpg";

const MOCK_ANIMES = [
  { name: "3", image_src: IMG_A },
  { name: "2", image_src: IMG_B },
  { name: "12", image_src: IMG_A },
  { name: "1", image_src: IMG_B },
  { name: "8", image_src: IMG_A },
  { name: "0", image_src: IMG_B },
];

function App() {
  const sorter_ref = useRef<Generator<[Card, Card], Card[], boolean>>(
    mergeSort([])
  );
  const [cards, set_cards] = useState<null | [Card, Card]>();
  const [sorted_list, set_sorted_list] = useState<Card[]>([]);

  useEffect(() => {
    (async () => {
      let top_animes: Card[] = [];
      const ls_animes = localStorage.getItem("animes");

      if (ls_animes !== null) {
        top_animes = JSON.parse(ls_animes);
      } else {
        const top_anime_pages: Card[] = [];
        for (let i = 1; i <= 3; i += 1) {
          const animes = await fetch(
            "https://api.jikan.moe/v4/top/anime?page=" + i
          )
            .then((res) => res.json())
            .then((res) =>
              res.data
                ? res.data.map((anime: any) => ({
                    name: anime.title as string,
                    image_src: anime.images.jpg.large_image_url as string,
                  }))
                : {
                    name: "undefined",
                    image_src: "https://fauux.neocities.org/LainDressSlow.gif",
                  }
            );
          top_anime_pages.push(animes);
          await new Promise((res) => setTimeout(res, 1000 / 3));
        }
        top_animes = top_anime_pages.flat();
        localStorage.setItem("animes", JSON.stringify(top_animes));
      }

      sorter_ref.current = mergeSort(top_animes);
      const cards_iter = sorter_ref.current.next();

      if (!cards_iter.done) {
        set_cards(cards_iter.value);
      }
    })();
  }, []);

  const handleClickLeft = () => {
    const sorter = sorter_ref.current;
    const cards_iter = sorter.next(true);
    if (cards_iter.done) {
      set_sorted_list(cards_iter.value);
    } else {
      set_cards(cards_iter.value);
    }
  };

  const handleClickRight = () => {
    const sorter = sorter_ref.current;
    const cards_iter = sorter.next(false);
    if (cards_iter.done) {
      set_sorted_list(cards_iter.value);
    } else {
      set_cards(cards_iter.value);
    }
  };

  if (sorted_list.length !== 0) {
    return (
      <ul>
        {sorted_list.map(({ name }) => (
          <li>{name}</li>
        ))}
      </ul>
    );
  }

  return cards ? (
    <Selector
      left={cards[0]}
      right={cards[1]}
      onClickLeft={handleClickLeft}
      onClickRight={handleClickRight}
    />
  ) : null;
}

export default App;

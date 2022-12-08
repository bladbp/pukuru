import React, { useEffect, useRef, useState } from "react";
import { mergeSort } from "../algorithms";
import { Selector } from "./Selector";

interface Card {
  name: string;
  image_src: string;
}

type State = {
  sorted: Card[];
  size: number;
  leftStart: number;
  buffer: Card[];
};

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
  const sorter_ref = useRef<Generator<[Card, Card, State], Card[], boolean>>(
    mergeSort([])
  );
  const [cards, set_cards] = useState<null | [Card, Card]>();
  const [sorted_list, set_sorted_list] = useState<Card[]>([]);

  useEffect(() => {
    (async () => {
      let sorted: Card[] | undefined;
      let size: number | undefined;
      let leftStart: number | undefined;
      let buffer: Card[] | undefined;

      const sort_state = localStorage.getItem("sort_state");

      if (sort_state !== null) {
        const state: State = JSON.parse(sort_state);
        console.log(state);
        sorted = state.sorted;
        size = state.size;
        leftStart = state.leftStart;
        buffer = state.buffer;
      } else {
        const top_anime_pages: Card[] = [];
        for (let i = 1; i <= 4; i += 1) {
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
          if (i % 3 == 0) {
            await new Promise((res) => setTimeout(res, 1000));
          }
        }
        sorted = top_anime_pages
          .flat()
          .filter((str) => !str.name.toLocaleLowerCase().includes("gintama"));
      }
      sorter_ref.current = mergeSort(sorted, size, leftStart, buffer);
      const cards_iter = sorter_ref.current.next();

      if (!cards_iter.done) {
        setCards(cards_iter.value);
      }
    })();
  }, []);

  const handleClickLeft = () => {
    const sorter = sorter_ref.current;
    const cards_iter = sorter.next(true);
    if (cards_iter.done) {
      set_sorted_list(cards_iter.value);
    } else {
      setCards(cards_iter.value);
    }
  };

  const setCards = (cards: [Card, Card, State]) => {
    localStorage.setItem("sort_state", JSON.stringify(cards[2]));
    set_cards([cards[0], cards[1]]);
  };

  const handleClickRight = () => {
    const sorter = sorter_ref.current;
    const cards_iter = sorter.next(false);
    if (cards_iter.done) {
      set_sorted_list(cards_iter.value);
    } else {
      setCards(cards_iter.value);
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

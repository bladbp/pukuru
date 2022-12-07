import React from "react";

interface LayoutProps {
  left: {
    name: string;
    image_src: string;
  };
  right: {
    name: string;
    image_src: string;
  };
  onClickLeft: () => void;
  onClickRight: () => void;
}

export function Selector({ left, right, ...props }: LayoutProps) {
  return (
    <div className="root">
      <div className="choices">
        <div className="choiceContainer">
          <div className="cardTitle">
            <p>{left.name}</p>
          </div>
          <div onClick={props.onClickLeft} className="cardImageRoot">
            <img className="cardImage" src={left.image_src} />
          </div>
          <img className="cardImageBackground" src={left.image_src} />
        </div>
        <div className="choiceContainer">
          <div className="cardTitle">
            <p>{right.name}</p>
          </div>
          <div onClick={props.onClickRight} className="cardImageRoot">
            <img className="cardImage" src={right.image_src} />
          </div>
          <img className="cardImageBackground" src={right.image_src} />
        </div>
      </div>
    </div>
  );
}

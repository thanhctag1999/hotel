import React from "react";
import "./hero.css";
import SearchBox from "../Search_Box/search_box";
import { FormattedMessage } from "react-intl";

const HeroCover = (props) => {
  return (
    <div className="hero_cover">
      <div className="hero-title">
        <h1>
          <FormattedMessage id={props.title} defaultMessage={props.title} />
        </h1>
        <h4>{props.desc}</h4>
      </div>
      <SearchBox />
    </div>
  );
};

export default HeroCover;

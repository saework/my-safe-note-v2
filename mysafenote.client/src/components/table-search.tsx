import React, { useState } from "react";

interface IProps {
  onSearch: (value: string) => void;
}

export default (props: IProps) => {
  const [value, setValue] = useState("");
  const valueChangeHandler = (event: any) => {
    setValue(event.target.value);
  };
  const valueClearHandler = () => {
    props.onSearch("");
    setValue("");
  };

  return (
    <div className="notes-info-find input-group">
      <button
        className="btn btn-success"
        type="button"
        id="findText"
        onClick={() => props.onSearch(value)}
      >
        Поиск
      </button>
      <input
        type="text"
        className="form-control"
        placeholder=""
        aria-describedby="findText"
        value={value}
        onChange={valueChangeHandler}
      />
      <button
        className="btn btn-info clear-text__button"
        type="button"
        id="clearText"
        onClick={valueClearHandler}
      >
        X
      </button>
    </div>
  );
};

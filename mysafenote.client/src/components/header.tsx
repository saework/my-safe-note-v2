import React from "react";
import { Button } from "react-bootstrap";

interface IProps {
  handleExitButtonClick: () => void;
}

function Header(props: IProps) {
  const { handleExitButtonClick } = props;

  return (
    <>
      <div className="main-info__page-capt">Мои заметки</div>
      <div>
        <Button
          id="buttonExit"
          type="button"
          variant="danger"
          onClick={handleExitButtonClick}
          className="exit__button"
        >
          Выйти
        </Button>
      </div>
    </>
  );
}

export default Header;

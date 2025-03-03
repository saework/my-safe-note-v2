import React from "react";
import { Button } from "react-bootstrap";

interface IProps {
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleMenuButtonClick: () => void;
  handlerExportNotesFromServer: () => void;
  handlerImportNotes: () => void;
  menuVisible: boolean;
}

const Menu = React.memo((props: IProps) => {
  const {
    handleMouseEnter,
    handleMouseLeave,
    handleMenuButtonClick,
    handlerExportNotesFromServer,
    handlerImportNotes,
    menuVisible,
  } = props;

  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Button
          id="buttonMenu"
          type="button"
          variant="info"
          onClick={handleMenuButtonClick}
          className="menu__button"
        >
          Меню
        </Button>
      </div>
      <div
        className="menu-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {menuVisible && (
          <div className="main-menu-dropdown">
            <Button
              onClick={handlerExportNotesFromServer}
              id="buttonExportNotes"
              type="button"
              variant="info"
              size="lg"
              className="main-menu-export__button"
            >
              Сохранить заметки
            </Button>
            <Button
              onClick={handlerImportNotes}
              id="buttonImportNotes"
              type="button"
              variant="info"
              size="lg"
              className="main-menu-import__button"
            >
              Загрузить заметки
            </Button>
          </div>
        )}
      </div>
    </>
  );
});

export default Menu;

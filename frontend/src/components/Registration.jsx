import React from "react";
/*import { Button } from "./Button";
import { DefaultAccount } from "./DefaultAccount";
import { PlayerStop } from "./PlayerStop";
import { Vector } from "./Vector";*/
import "../styles/Divwr.css";

export const DivWrapper = () => {
  return (
    <div className="div-wrapper">
      <div className="content-wrapper">
        <div className="content">
          <div className="field">
            <div className="headline-sign-in">
              {/*<Vector image="image-tmpk-logo.png" />*/}
              <div className="hello">
                <p className="p">С возвращением к команде ТМПК!</p>
              </div>
            </div>

            <div className="form-sign-in">
              <div className="inputs">
                {/*<DefaultAccount
                  className="default-account-input"
                  hasImage={false}
                  property1="default"
                  text="Email"
  />*/}
                {/*<DefaultAccount
                  className="default-account-input"
                  divClassName="password-input-empty"
                  image="eye.png"
                  property1="variant-2"
                  text="Пароль"
                  text1="Введите пароль"
  />*/}
                <div className="additionally">
                  <div className="remember-me">
                    {/*<PlayerStop className="player-stop" />*/}
                    <div className="text-wrapper-2">Запомнить меня</div>
                  </div>

                  <div className="text-wrapper-3">Забыли пароль?</div>
                </div>
              </div>

              <div className="buttons">
                {/*<Button
                  button="primary"
                  className="button-sign-in"
                  darkMode="off"
                  divClassName="button-instance"
                  showIconsLeft={false}
                  showIconsRight={false}
                  text="Войти"
                />*/}
              </div>
            </div>
          </div>

          <div className="sign-up">
            <div className="text-wrapper-4">Нет аккаунта?</div>

            <div className="text-wrapper-5">Создать аккаунт</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DivWrapper;
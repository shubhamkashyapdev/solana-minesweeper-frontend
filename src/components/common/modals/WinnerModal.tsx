import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import winnerGif from "../../../assets/animations/winner.gif";
import {
  resetTime,
  setBetAmount,
  setDifficultyLevel,
  updateScore,
} from "../../../redux/Game/GameAction";

export type gameStatus = "win" | "lose" | "tie";

interface WinnerProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  show: boolean;
  modelType: gameStatus;
}
const WinnerModal: React.FunctionComponent<WinnerProps> = ({
  setShow,
  show,
  modelType,
}) => {
  const dispatch: any = useDispatch();

  const [modelimage, setModelImage] = useState("#");

  const handlePlay = () => {
    dispatch(setBetAmount(0));
    dispatch(setDifficultyLevel(5));
    dispatch(updateScore(0));
    dispatch(resetTime());
    setShow(false);
  };

  useEffect(() => {
    console.warn(modelType);

    if (modelType == "lose") {
      setModelImage("/assets/lose_game.jpg");
    } else if (modelType == "win") {
      setModelImage("/assets/winner_model.gif");
    } else {
      setModelImage("/assets/tie_game.png");
    }
  }, [modelType]);

  return (
    <>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full justify-center items-end text-center sm:items-center sm:p-0 m-auto">
          {/* lottie animation */}
          <div className="absolute z-20 pointer-events-none">
            <img height={500} width={500} src={winnerGif} alt="winner" />
          </div>
          {/* lottie animation ends */}
          <div className="relative transform rounded-lg bg-[#170605ea]  shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            {/* <div className="bg-[#170605ea] px-4 pb-4 sm:p-6 sm:pb-4"> */}
            <div className="sm:flex sm:items-start  justify-center">
              {/* <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"></div> */}
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <div className="pt-4 justify-center">
                  <div className="text-sm text-darkBG  justify-center">
                    <img
                      // src="/assets/lose_game.jpg"
                      // src="/assets/winner_model.gif"
                      // src="/assets/tie_game.png"
                      src={modelimage}
                      className="w-[100%] h-[300px] m-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
            <div className="bg-gray-50 px-4 justify-center py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                onClick={() => handlePlay()}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-primary
           bg-white px-4 py-2 text-base font-medium text-primary shadow-sm hover:bg-gray-50 focus:outline-none 
           focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default WinnerModal;

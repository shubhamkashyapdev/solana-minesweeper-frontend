import React, { useState } from "react"
import { useDispatch } from "react-redux";
import winnerGif from "../../../assets/animations/winner.gif"
import { setBetAmount, setDifficultyLevel, updateScore } from "../../../redux/Game/GameAction";
interface WinnerProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
  show: boolean;
  handleResetInterval: () => void;
}
const WinnerModal: React.FunctionComponent<WinnerProps> = ({ setShow, show, handleResetInterval }) => {
  const dispatch: any = useDispatch();

  const handlePlay = () => {
    dispatch(setBetAmount(0))
    dispatch(setDifficultyLevel(5))
    dispatch(updateScore(0))
    handleResetInterval();
    setShow(false)
  }
  return (
    <>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          {/* lottie animation */}
          <div className="absolute z-20 pointer-events-none">
            <img height={500} width={500} src={winnerGif} alt="winner" />
          </div>
          {/* lottie animation ends */}
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">

            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">

                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">

                  <div className="mt-2">
                    <p className="text-sm text-darkBG">
                      Are you sure you want to deactivate your account? All of
                      your data will be permanently removed. This action cannot
                      be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 justify-center py-3 sm:flex sm:flex-row-reverse sm:px-6">

              <button
                onClick={() => handlePlay()}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-primary bg-white px-4 py-2 text-base font-medium text-primary shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default WinnerModal
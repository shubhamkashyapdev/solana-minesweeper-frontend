import { Sprite } from "@pixi/sprite"
import { connect } from "react-redux"
import { updateScore } from "../../redux/Game/GameAction"
import { RotateCard, ShowMultiplierPopup } from "./animate"
import { board } from "./board-generator"
import { Card, CardsList, CARD_TYPES } from "./cards"
import { session } from "./game"
import { game_form } from "./form/game-form"
import { Component } from "react"
import { showNotification } from "@mantine/notifications"
export interface ICardSlot {
  ShowHideCard(isHidden: boolean): void
  ChangeCard(card: Card): void
  GetCard(): Card
  sprite: Sprite
}

export class CardSlot extends Component implements ICardSlot {
  private card: Card
  private isHidden: boolean
  sprite: Sprite

  constructor(
    props: any,
    card: Card,
    isHidden: boolean,
    sprite: Sprite,
  ) {
    super(props)
    this.card = card
    this.isHidden = isHidden
    this.sprite = sprite ?? new Sprite()
  }

  ShowHideCard(isHidden: boolean): void {
    if (isHidden && !this.isHidden) {
      this.isHidden = true
      this.sprite.texture = CardsList[0].texture
      return
    }

    if (!isHidden && this.isHidden) {
      this.isHidden = false
      RotateCard(this, this.GetCard().texture)
      //this.sprite.texture = this.card.texture;
      if (this.card.type == CARD_TYPES.BOMB) {
        clearInterval(game_form.getInterval())
        const props = game_form.gameProps;
        if (!props.winner) {
          showNotification({
            title: 'Game Ended!',
            message: 'Waiting for opponent!',
            autoClose: 3000,
            styles: (theme) => ({
                root: {
                    backgroundColor: theme.colors.dark[8],
                    '&::before': { backgroundColor: theme.colors.gray[4] },
                },
                title: { color: theme.colors.gray[4] },
                description: { color: theme.colors.gray[5] },
                closeButton: {
                  color: theme.colors.dark,
                  "&:hover": { backgroundColor: "#F7C901", color: "#000000" },
                },
            })
        })
          console.log('game ended')
          props.socket.emit('updateScore', props.opponent.roomId, props.opponent.transactionId, props.score)
   
        }
   
        session.KillSession()
        return
      }
      if (this.card.type == CARD_TYPES.GEM && board.isActive) {
        board.AddMultiplier(this.card)
        ShowMultiplierPopup(this)
      }
      return
    }
  }

  GetCard(): Card {
    return this.card
  }

  ChangeCard(card: Card): void {
    this.card = card
  }
}

const mapDispatchToProps = {
  updateScore: updateScore,
}

//@ts-ignore
export default connect(null, mapDispatchToProps)(CardSlot)
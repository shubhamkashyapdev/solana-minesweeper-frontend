import { Sprite } from "@pixi/sprite"
import { connect } from "react-redux"
import { updateScore } from "../../redux/Game/GameAction"
import { RotateCard, ShowMultiplierPopup } from "./animate"
import { board } from "./board-generator"
import { Card, CardsList, CARD_TYPES } from "./cards"
import { session } from "./game"
import { game_form } from "./form/game-form"

export interface ICardSlot {
  ShowHideCard(isHidden: boolean): void
  ChangeCard(card: Card): void
  GetCard(): Card
  sprite: Sprite
}

export class CardSlot implements ICardSlot {
  private card: Card
  private isHidden: boolean
  sprite: Sprite

  constructor(
    card: Card,
    isHidden: boolean,
    sprite: Sprite,
    private form: game_form
  ) {
    this.card = card
    this.isHidden = isHidden
    this.sprite = sprite ?? new Sprite()
    this.form = form
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

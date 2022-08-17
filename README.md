# Project commands

- Install dependencies
  `yarn install`

- there are two different canvas rendering in development mode but only one shows up in production, if i hide one of the canvas in development mode then nothing shows up in production mode. To avoid this bug comment out the css rule hiding the canvas in production mode under _game-view.scss_ file.

![Alt text](/assets/canvas.png?raw=true "Canvas Bug Fix")

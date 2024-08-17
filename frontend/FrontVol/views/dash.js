

export default class Dash extends HTMLElement {
    constructor() {super()}
    connectedCallback() {
        this.innerHTML = `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <link rel="stylesheet" href="../style/dash.css">
        </head>
        <body>
            <div class="parent">
                <div class="div1"> 
        
                </div>
                <div class="game-picker">
                    <div class="picker-1"></div>
                    <div class="picker-2"></div>                                
                    <div class="picker-3"></div>
                </div>
                <div class="div3"> 
        
                </div>
                <div class="div4">
        
                </div>
                <div class="leader-board">
                    <div class="leader-board_div">
                        <div class="triangle-1"></div>
                        <div class="triangle-2"></div>
                        <div class="leader-board-0"></div>
                        <div class="leader-board-1"></div>
                        <div class="leader-board-2"></div>
                        <div class="leader-board-3"></div>
                        <div class="leader-board-4"></div>
        
                    </div>
                </div>
                <div class="best-match"> 
                    <div class="best-match-div">
        
                    </div>
                </div>
                </div>
        </body>
        </html>
        `;
    }
}

customElements.define("dash-page", Dash);

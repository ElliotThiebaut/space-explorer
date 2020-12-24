let playing = true

const gameOver = () => {
    playing = false
    gameOverScreen.style.display = "flex";
    timeline_1.pause()
    timeline_2.pause()
}

const movePlayer = (e) => {
    if (playing) {
        switch (e.keyCode) {
            case 38:
                gsap.to("#player", {
                    y: "-=100",
                    rotate: "0_short",
                })
                break;
                
            case 40:
                gsap.to("#player", {
                    y: "+=100",
                    rotate: "180_short",
                })
                break;
    
            case 37:
                gsap.to("#player", {
                    x: "-=100",
                    rotate: "-90_short",
                })
                break;
    
            case 39:
                gsap.to("#player", {
                    x: "+=100",
                    rotate: "90_short"
                })
                break;
        
            default:
                break;
        }
    }
}

document.addEventListener('keydown', movePlayer);

const checkCollision = (div1, div2) => {
    let threshold = 12;
    let rect1 = div1.getBoundingClientRect();
    let rect2 = div2.getBoundingClientRect();
    return !(
      rect1.right < rect2.left + threshold ||
      rect1.left > rect2.right - threshold ||
      rect1.bottom < rect2.top + threshold ||
      rect1.top > rect2.bottom - threshold
    );
  }

function checkEnnemies() {
    let bots = document.querySelectorAll(".bot")

    bots.forEach((e) => {
        if(checkCollision(player, e)) {
        gameOver();
        }
    })
}

let checkWin = () => {
    if (checkCollision(player, treasure)) {
        let gameOverDiv = document.getElementById("game-over");
        gameOverDiv.innerHTML = "Bravo";
        gameOverScreen.style.backgroundColor = "rgba(52, 165, 29, 0.582)";
        gameOverDiv.style.backgroundColor = "rgb(13, 153, 43)"
        
        gameOver();
    }
}

setInterval(checkEnnemies, 500)
setInterval(checkWin, 500)

let timeline_1 = gsap.timeline({ repeat: -1 })

timeline_1.to("#bot_1", {
    duration: 2,
    y: -300,
  });
timeline_1.to("#bot_1", {
    rotate: 180
  });
timeline_1.to("#bot_1", {
    duration: 5,
    y: 275,
  });
timeline_1.to("#bot_1", {
    rotate: 0
  });
timeline_1.to("#bot_1", {
    duration: 2,
    y: 0,
  });

let timeline_2 = gsap.timeline({ repeat: -1 })

timeline_2.to("#bot_2", {
    rotate: "250_short"
  });
timeline_2.to("#bot_2", {
    duration: 3,
    y: 170,
    x: -600
  });
timeline_2.to("#bot_2", {
    rotate: "70_short"
  });
timeline_2.to("#bot_2", {
    duration: 3,
    y: 0,
    x: 0
  });
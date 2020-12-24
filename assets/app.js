let playing = true

const gameOver = () => {
    playing = false
    gameOverScreen.style.display = "flex";
    chrono.style.display = "none"
    timeline_1.pause()
    timeline_2.pause()
    bot3_anim.pause()
    bot4_anim.pause()
}

const movePlayer = (e) => {
    if (playing) {
        switch (e.keyCode) {
            case 38:
                gsap.to("#player", {
                    y: "-=50",
                    rotate: "0_short",
                })
                break;
                
            case 40:
                gsap.to("#player", {
                    y: "+=50",
                    rotate: "180_short",
                })
                break;
    
            case 37:
                gsap.to("#player", {
                    x: "-=50",
                    rotate: "-90_short",
                })
                break;
    
            case 39:
                gsap.to("#player", {
                    x: "+=50",
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

let checkEnnemies = () => {
    let bots = document.querySelectorAll(".bot")

    bots.forEach((e) => {
        if(checkCollision(player, e)) {
        gameOver();
        }
    })

    if (checkCollision(player, treasure)) {
      let gameOverDiv = document.getElementById("game-over");
      gameOverDiv.innerHTML = "YOU ESCAPED !";
      gameOverScreen.style.backgroundColor = "rgba(52, 165, 29, 0.582)";
      gameOverDiv.style.backgroundColor = "rgb(13, 153, 43)"
      
      gameOver();
  }

  if (checkCollision(player, fake_treasure)) {
    gameOver()
  }

  if (checkCollision(player, gem)) {
    countdown += 10
    gem.style.display = "none"
  }
}

setInterval(checkEnnemies, 500)

let countdown = Math.floor(Math.random() * 19) + 6;
chrono.innerHTML = countdown;

let counter = () => {
  countdown -= 1;
  chrono.innerHTML = countdown;
  if (countdown == 0) {
    gameOver()
  }
}
setInterval(counter, 1000)



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
    y: 250,
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

let bot3_anim = gsap.to("#bot_3", {
  duration: 10,
  rotate: -270,
  motionPath: {
    path: "#path_3",
    align: "#path_3",
    autoRotate: 90,
    alignOrigin: [0.5, 0.5],
  },
  ease: Linear.easeNone,
  repeat: -1
});

let bot4_anim = gsap.to("#bot_4", {
  duration: 8,
  
  motionPath: {
    path: "#path_4",
    align: "#path_4",
    autoRotate: 90,
    alignOrigin: [0.5, 0.5],
    start: 2,
  },
  ease: Linear.easeNone,
  repeat: -1
});


gem.style.top = Math.floor(Math.random() * 90) + 1 + "%";
gem.style.left = Math.floor(Math.random() * 90) + 1 + "%";
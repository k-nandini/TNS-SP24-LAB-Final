function rectangularCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}


function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex';
    if (player.health === enemy.health) {
        // player.health=-100
        // enemy.health=-100
        document.querySelector('#displayText').innerHTML = 'Tie';
    }
    else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Won';
    }
    else if (player.health < enemy.health) {
        document.querySelector("#displayText").innerHTML = 'Player 2 Won';
    }
}

let timer = 45;
let timerId
function decreaseTimer() {


    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer;
    }
    if (timer == 0) { //when timer ends kill both players
    
        player.health-=100
        enemy.health-=100
             gsap.to('#playerHealth', {
                width: player.health + '%'
            })
            gsap.to('#enemyHealth', {
                width: enemy.health + '%'
            })
        player.switchSprite('death')
        enemy.switchSprite('death');


        determineWinner({ player, enemy, timerId });
    }

}
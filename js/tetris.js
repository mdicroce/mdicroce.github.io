document.addEventListener('DOMContentLoaded', () => {
    setHTML()
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('.score')
    const StartBtn = document.querySelector('.start-button')
    let timerId = null
    const width = 10
    let score = 0
    const lTetronimo = 
    [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]
    const zTetronimo = 
    [
        [width, width+1, 1,2],
        [0, width, width+1,width*2+1],
        [width, width+1, 1,2],
        [0, width, width+1,width*2+1]
    ]
    const tTetronimo = [
        [width,1,width+1, width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [width,1,width+1,width*2+1]
    ]
    const squareTetronimo=[
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]
    const lineTetronimo = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]

    ]
    
    let currentPosition = 4;
    let currentRotation = 0;
    const theTetrominoes = [lTetronimo,zTetronimo,tTetronimo,squareTetronimo,lineTetronimo]
    let nextRandom = Math.floor(Math.random()*theTetrominoes.length)
    let random = nextRandom
    let current = theTetrominoes[random][currentRotation]
    function draw() {
        
        current.forEach(index => {
            squares[currentPosition+index].classList.add('tetronimo')
        })
    }
    function undraw(){
        current.forEach(index => {
            squares[currentPosition+index].classList.remove('tetronimo')
        })

    }
    let timer = 1000
    

    //asign functions to keyCodes
    function control(e)
    {
        if(e.keyCode === 37)
        {
            moveLeft()
        }
        else if(e.keyCode === 38)
        {
            rotate()
        }
        else if(e.keyCode === 39)
        {
            moveRight()
        }
        else if(e.keyCode === 40)
        {
            down()
        }
    }
    document.addEventListener('keydown',control)

    //move down function
    function moveDown()
    {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //freeze if a square is taken
    function freeze()
    {
        
        if(current.some(index => squares[currentPosition+index + width].classList.contains('taken')))
        {
            
            timer = timer - timer /100
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            current = theTetrominoes[nextRandom][currentRotation]
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            clearInterval(timerId)
            timerId = null
            timerId = setInterval(moveDown,timer)
            currentPosition = 4
            displayShape()
            draw()
            
            addScore()
            gameOver()
        }
    }
    function moveLeft(){
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge)
        {
            currentPosition -= 1
        }
        if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
        {
            currentPosition += 1
        }
        draw()
    }
    function moveRight(){
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index+1) % width === 0)
        
        if(!isAtRightEdge)
        {
            currentPosition += 1
        }
        if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
        {
            currentPosition -= 1
        }
        draw()
    }
    function down()
    {
        undraw()
        currentPosition += width
        draw()
        freeze()
        
    }

      function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
  }

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [displayWidth, displayWidth+1, 1,2],
        [displayWidth,1,displayWidth+1, displayWidth+2],
        [0,1,displayWidth,displayWidth+1],
        [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1],
    ]
    

    function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetronimo')
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetronimo')
    })
  }

    StartBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId)
            timerId = null
        }
        else{
            draw()
            timerId = setInterval(moveDown, timer)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })
    function addScore() {
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetronimo')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }
  function gameOver()
  {
      if(current.some(index => squares[ currentPosition + index].classList.contains('taken')))
      {
          scoreDisplay.innerHTML = 'end'
          clearInterval(timerId)
          
      }
  }
})

function setHTML()
{
    var node = document.createElement('DIV')
    node.classList.add('tetris-container')
        var h3 = document.createElement('h3')
        h3.classList.add('score-title')
        h3.appendChild(document.createTextNode('Score '))
            var span = document.createElement('span')
            span.classList.add('score')
            span.appendChild(document.createTextNode('0'))
        h3.appendChild(span)
    node.appendChild(h3)
        var button = document.createElement('button')
            button.classList.add('start-button')
            button.appendChild(document.createTextNode('start/pause'))
    node.appendChild(button)
        var container = document.createElement('DIV')
        container.classList.add('part-container')
            var tetrisSquares = document.createElement('DIV')
            tetrisSquares.classList.add('grid')
                for(let i = 0; i < 200; i++)
                {
                   
                    tetrisSquares.appendChild(document.createElement('div'))
                }
                for(let i = 0; i < 10; i++)
                {
                    let prefixed = document.createElement('div')
                    prefixed.classList.add('taken')
                    tetrisSquares.appendChild(prefixed)
                }
        container.appendChild(tetrisSquares)
            var miniTetrisSquares = document.createElement('div')
            miniTetrisSquares.classList.add('mini-grid')
                for(let i = 0; i < 16; i++)
                {
                    miniTetrisSquares.appendChild(document.createElement('div'))
                }
        container.appendChild(miniTetrisSquares)
    node.appendChild(container)
    document.querySelector('body').appendChild(node)
}

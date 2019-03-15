class Game {
    constructor (options) {
        this.options = options
    }

    dumpPuzzle(field) {
        var res = []
        console.log('dump puzzle:')
        for (var x = 0; x < field.length; x++) {
            var s = ''
            for (var y = 0; y < field[x].length; y++) {
                s += field[x][y] + ' '
                res.push(field[x][y])
            }
            console.log(s)
        }
        console.log('puzzle.field', JSON.stringify(res))
        return res
    }

    initPuzzle (options) {
        var maxX = options.maxX
        var maxY = options.maxY

        var field = []
        for (var i = 0; i < maxY; i++) {
            field[i] = []
            for (var j = 0; j < maxX; j++) {
                var n = i * maxX + j
                field[i].push(n)
            }
        }

        return field
    }

    generatePuzzle (puzzleType, initString) {
        var maxX = 3
        var maxY = 3

        if (puzzleType == '15') {

            var field = this.initPuzzle({
                maxX,
                maxY
            })

            this.dumpPuzzle(field)

            var moves = []
            var movesCount = 50

            var emptyPosition = {
                x: 0,
                y: 0
            }

//            var 
            function getMoves(p, reverse) {
                var m = {
                    'L': {x:-1, y:0},
                    'R': {x:1, y:0},
                    'T': {x:0, y:-1},
                    'B': {x:0, y:1}
                }
                if (p.x == 0) delete m['L']
                if (p.x == maxX - 1) delete m['R']
                if (p.y == 0) delete m['T']
                if (p.y == maxY - 1) delete m['B']

                if (reverse) delete m[reverse]

                var a = []

                for (var k in m)
                    a.push({vec: k, dir: m[k]})
                return a
            }

            var reverseMove = {
                'L': 'R',
                'R': 'L',
                'T': 'B',
                'B': 'T'
            }

            var reverse

            for (var i = 0; i < movesCount; i++) {
                var p = emptyPosition

                var m = getMoves(p, reverse)

                console.log('p', p)
                console.log('m', m)

                var index = Math.round(Math.random() * (m.length - 1))

                console.log('index', index)

                var dir = m[index].dir
                reverse = reverseMove[m[index].vec]

                console.log('dir', m[index].vec, dir)

                var p1 = {x: p.x + dir.x, y: p.y + dir.y}

//                player = p1

                console.log(p1)

                // swap
                var a = field[p.y][p.x]
                var b = field[p1.y][p1.x]
                field[p.y][p.x] = b
                field[p1.y][p1.x] = a

//                moves.push([b, p1])
                moves.push(p.x + p.y * maxX)

                emptyPosition = p1
            }

            console.log('moves', JSON.stringify(moves))
            
            var puzzleField = this.dumpPuzzle(field)
        }

        return puzzleField
    }

    // check
    // moves

    verifyPuzzle (puzzleField, moves, score) {
        var maxX = 3
        var maxY = 3

        function checkPlayer(p, o) {
            if (p.x < 0 || p.x > o.maxX) return false
            if (p.y < 0 || p.y > o.maxY) return false
            return true
        }

        var indexPos = [[]]
        var indexPos1 = []
        var x = 0, y = 0

        for (var i = 0; i < 10; i++) {
            if (x == 3) {
                x = 0
                if (y++ == 2)
                    continue;
                indexPos.push([])
            }
            indexPos[y].push({x: x, y})
            indexPos1.push({x: x, y})
            x++
        }

        this.dumpPuzzle(indexPos)

        function makePuzzle(puzzleField, emptyPosition, options) {
            var maxX = options.maxX
            var maxY = options.maxY
    
            var field = []
            for (var i = 0; i < maxY; i++) {
                field[i] = []
                for (var j = 0; j < maxX; j++) {
                    var n = puzzleField[i * maxX + j]
                    field[i].push(n)
                    if (n == 0) {
                        emptyPosition.x = j
                        emptyPosition.y = i
                    }
                }
            }
    
            return field
        }

        var emptyPosition = {
            x: 0,
            y: 0
        }

        var field = makePuzzle(puzzleField, emptyPosition, {maxX, maxY})

        this.dumpPuzzle(field)

        // check score [

        var seconds = 0.5 * moves.length
        var score1 = 1000000 / ((moves.length * 1.3) + (seconds * 0.8))

        if (score1 < score)
            return false

        // check score ]

        // simulate moves [

        for (var u in moves) {
            var pNew = moves[u]

            var p = emptyPosition

//            var pNew = indexPos1[move]

            var dir = {x: p.x - pNew.x, y: p.y - pNew.y}

            if (dir.x < -1 || dir.x > 1 || 
                dir.y < -1 || dir.y > 1) {
                return false
            }

            var p1 = pNew // {x: p.x + dir.x, y: p.y + dir.y}

            var a = field[p.y][p.x]
            var b = field[p1.y][p1.x]
            field[p.y][p.x] = b
            field[p1.y][p1.x] = a

            if (!checkPlayer(p1, {maxX, maxY}))
                return false

            emptyPosition = p1
        }

        this.dumpPuzzle(field)

        // simulate moves ]

        // verify [

        for (var i = 0; i < maxY; i++) {
            for (var j = 0; j < maxX; j++) {
                var n = i * maxX + j
                if (field[i][j] != n)
                    return false
            }
        }
        
        // verify ]

        return true
    }
}

module.exports = Game

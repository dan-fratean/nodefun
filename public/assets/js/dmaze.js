/*
    dMaze - a maze generator using jQuery
    Copyright (C)2013 Dan Fratean
    All rights reserved
*/
var dMaze = function (x, y) {
    return {
        settings: {
            maxX: x,
            maxY: y,
            east: 1,
            west: 2,
            south: 4,
            north: 8,
            visitedCell: 16,
            visitedCells: 0,
            currentCell: 0,
            back: {
                1: 2,
                2: 1,
                4: 8,
                8: 4
            },
        },
        stack: [],
        maze: [],
        maxCells: function () {
            return this.settings.maxX * this.settings.maxY
        },
        decodeX: function (x) {
            return Math.floor(x / this.settings.maxY)
        },
        decodeY: function (y) {
            return y % this.settings.maxY
        },
        encodeXY: function (x, y) {
            return x * this.settings.maxY + y
        },
        visited: function (c) {
            return (this.maze[this.decodeX(c)][this.decodeY(c)] & this.settings.visitedCell) == this.settings.visitedCell
        },
        visit: function (c) {
            this.maze[this.decodeX(c)][this.decodeY(c)] += this.settings.visitedCell
            this.settings.visitedCells++
        },
        findNeighbor: function (c) {
            x = this.decodeX(c)
            y = this.decodeY(c)
            possibleCells = []
            if (x + 1 < this.settings.maxX && !this.visited(this.encodeXY(x + 1, y)))
                possibleCells.push([this.encodeXY(x + 1, y), this.settings.east])
            if (x - 1 >= 0 && !this.visited(this.encodeXY(x - 1, y)))
                possibleCells.push([this.encodeXY(x - 1, y), this.settings.west])
            if (y + 1 < this.settings.maxY && !this.visited(this.encodeXY(x, y + 1)))
                possibleCells.push([this.encodeXY(x, y + 1), this.settings.south])
            if (y - 1 >= 0 && !this.visited(this.encodeXY(x, y - 1)))
                possibleCells.push([this.encodeXY(x, y - 1), this.settings.north])
            if (possibleCells.length) {
                return possibleCells[Math.floor(Math.random() * possibleCells.length)]
            }
            return 0
        },
        initMaze: function () {
            var line
            for (var i = 0; i < this.settings.maxX; i++) {
                line = []
                for (var j = 0; j < this.settings.maxY; j++) {
                    line.push(this.settings.east + this.settings.west + this.settings.south + this.settings.north)
                }
                this.maze.push(line)
            }
            this.visit(this.settings.currentCell)
        },
        generateMaze: function () {
            var neighbor
            this.initMaze()
            while (this.settings.visitedCells < this.maxCells()) {
                neighbor = this.findNeighbor(this.settings.currentCell)
                if (neighbor) {
                    this.knockDownWall(this.settings.currentCell, neighbor[0], neighbor[1])
                    this.stack.push(this.settings.currentCell)
                    this.settings.currentCell = neighbor[0]
                    this.visit(this.settings.currentCell)
                } else {
                    this.settings.currentCell = this.stack.pop()
                }
            }
        },
        knockDownWall: function (a, b, d) {
            this.maze[this.decodeX(a)][this.decodeY(a)] -= d
            this.maze[this.decodeX(b)][this.decodeY(b)] -= this.settings.back[d]
        },
        showMazeASCII: function () {
            var out = ''
            for (var j = 0; j < this.settings.maxY; j++)
                for (k = 0; k < 2; k++) {
                    if (k)
                        out += '|'
                    else
                        out += '+'
                    for (i = 0; i < this.settings.maxX; i++)
                        if (k) {
                            out += '  '
                            if ((this.maze[i][j] & this.settings.east) == this.settings.east)
                                out += '|'
                            else
                                out += ' '
                        } else
                    if ((this.maze[i][j] & this.settings.north) == this.settings.north)
                        out += '--+'
                    else
                        out += '  +'
                    out += '\n'
                }
            for (i = 0; i < this.settings.maxX; i++)
                out += '+--'
            out += '+\n'
            return out
        }
    }
}

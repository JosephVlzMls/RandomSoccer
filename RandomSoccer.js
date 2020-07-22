class Constants {

    static field = document.getElementById("field").getContext("2d");
    static scoreboard = document.getElementById("scoreboard").getContext("2d");
    static matchDuration = 2;
    static milliseconds = Math.round(1000 / (90 / Constants.matchDuration));
    static playerRadius = 16;
    static playerQuarter = Math.floor(Constants.playerRadius / 2);
    static playerDiameter = Constants.playerRadius * 2;
    static ballRadius = 8;
    static ballQuarter = Math.floor(Constants.ballRadius / 2) - 1;
    static ballDiameter = Constants.ballRadius * 2;

}

class Colors {

    static grass = "#319142";
    static line = "#ECF0F1";
    static ball = "white";
    static scoreboardTime = "black";
    static scoreboardTimeFont = "white";
    static scoreboardGoals = "white";
    static scoreboardGoalsFont = "black";

}

class Utilities {

    static movements = [2, -2, 1, -1, 0];

    static random(limit) {
        return Math.floor(Math.random() * limit);
    }

    static distance(position1, position2) {
        return Math.floor(Math.sqrt(Math.pow(position2.x - position1.x, 2) + Math.pow(position2.y - position1.y, 2)));
    }

    static mcd(a, b) {
        while(b > 0) {
            var c = a;
            a = b;
            b = c % b;
        }
        return a;
    }

}

class Paint {

    static rectangle(context, x, y, width, height, color) {
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    }

    static circle(context, x, y, radius, color) {
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
    }

    static text(context, x, y, font, text, color) {
        context.fillStyle = color;
        context.font = font;
        context.fillText(text, x, y);
    }

}

class Uniform {

    constructor(primary, border) {
        this.primary = primary;
        this.border = border;
    }

    static black() {
        return new Uniform("#0A0A0A", "#000000");
    }

    static white() {
        return new Uniform("#FFFFFF", "#EAEAEA");
    }

    static red() {
        return new Uniform("#FF0000", "#DD0000");
    }

    static blue() {
        return new Uniform("#0000FF", "#0000DD");
    }

    static green() {
        return new Uniform("#00FF00", "#00DD00");
    }

    static yellow() {
        return new Uniform("#FFFF00", "#E0E000");
    }

    static pink() {
        return new Uniform("#FF00FF", "#F000F0");
    }

    static cyan() {
        return new Uniform("#00FFFF", "#00E0E0");
    }

    static gray() {
        return new Uniform("#606060", "#575757");
    }

    static purple() {
        return new Uniform("#800080", "#750075");
    }

    static orange() {
        return new Uniform("#FF5800", "#FF4B00");
    }

    static navy() {
        return new Uniform("#000070", "#00005C");
    }

    static olive() {
        return new Uniform("#7B7B00", "#727200");
    }

    static forest() {
        return new Uniform("#006000", "#005500");
    }

    static beige() {
        return new Uniform("#E6D690", "#CCBC76");
    }

    static brown() {
        return new Uniform("#8B4513", "#813B09");
    }

    static wine() {
        return new Uniform("#800000", "#700000");
    }

    static pistachio() {
        return new Uniform("#93C572", "#81B360");
    }

    static coral() {
        return new Uniform("#FFADBB", "#EA98A6");
    }

    static sky() {
        return new Uniform("#8AD2EE", "#77BEDB");
    }

}

class Displacement {

    constructor(x, y) {
        this.position = {x, y};
        this.vector = {x: 0, y: 0};
        this.unitary = {x: 0, y: 0};
        this.recurrence = {x: 0, y: 0};
        this.iteration = 0;
    }

    invertX() {
        this.vector.x = -this.vector.x;
        this.unitary.x = -this.unitary.x;
    }

    invertY() {
        this.vector.y = -this.vector.y;
        this.unitary.y = -this.unitary.y;
    }

}

class Player extends Displacement {

    constructor(x, y, uniform, top, bottom, left, right) {
        super(x, y);
        this.delimiter = {top, bottom, left, right};
        this.limit = 0;
        this.uniform = uniform;
    }

    update() {
        if(this.iteration == this.limit) {
            var i = Utilities.random(5);
            var j = Utilities.random(i > 1 ? 2 : 5);
            this.vector.x = Utilities.movements[i];
            this.vector.y = Utilities.movements[j];
            var absoluteVector = {x: Math.abs(this.vector.x), y: Math.abs(this.vector.y)};
            var maximun = Math.max(absoluteVector.x, absoluteVector.y);
            this.recurrence.x = absoluteVector.x == 0 ? 0 : Math.floor(maximun / absoluteVector.x);
            this.recurrence.y = absoluteVector.y == 0 ? 0 : Math.floor(maximun / absoluteVector.y);
            this.unitary.x = this.vector.x == 0 ? 0 : (this.vector.x > 0 ? 1 : -1);
            this.unitary.y = this.vector.y == 0 ? 0 : (this.vector.y > 0 ? 1 : -1);
            this.limit = Utilities.random(301) + 200;
            this.iteration = 0;
        }
        ++this.iteration;
        if(this.recurrence.x > 0 && this.iteration % this.recurrence.x == 0) this.position.x += this.unitary.x;
        if(this.recurrence.y > 0 && this.iteration % this.recurrence.y == 0) this.position.y += this.unitary.y;
        if(this.position.x - Constants.playerRadius < this.delimiter.left) {
            this.position.x = this.delimiter.left + Constants.playerRadius;
            this.invertX();
        }
        else if(this.position.x + Constants.playerRadius > this.delimiter.right) {
            this.position.x = this.delimiter.right - Constants.playerRadius;
            this.invertX();
        }
        if(this.position.y - Constants.playerRadius < this.delimiter.top) {
            this.position.y = this.delimiter.top + Constants.playerRadius;
            this.invertY();
        }
        else if(this.position.y + Constants.playerRadius > this.delimiter.bottom) {
            this.position.y = this.delimiter.bottom - Constants.playerRadius;
            this.invertY();
        }
    }

    paint() {
        Paint.circle(Constants.field, this.position.x, this.position.y, Constants.playerRadius, this.uniform.border);
        Paint.circle(Constants.field, this.position.x, this.position.y, Constants.playerRadius - 4, this.uniform.primary);
    }

}

class Ball extends Displacement {

    constructor(x, y) {
        super(x, y);
        this.speed = 0;
        this.lastPlayer = null;
        this.lastPlayerIteration = 0;
    }

    update() {
        var currentPlayer = null;
        for(var i = 0; i < 11; ++i) {
            if(this.lastPlayer == null || this.lastPlayer != team1[i]) {
                if(Utilities.distance(this.position, team1[i].position) <= Constants.ballRadius + Constants.playerRadius) {
                    currentPlayer = team1[i];
                    break;
                }
            }
            if(this.lastPlayer == null || this.lastPlayer != team2[i]) {
                if(Utilities.distance(this.position, team2[i].position) <= Constants.ballRadius + Constants.playerRadius) {
                    currentPlayer = team2[i];
                    break;
                }
            }
        }
        if(currentPlayer != null) {
            this.lastPlayer = currentPlayer;
            this.lastPlayerIteration = 0;
            this.vector.x = this.lastPlayer.vector.x - this.vector.x;
            this.vector.y = this.lastPlayer.vector.y - this.vector.y;
            var absoluteVector = {x: Math.abs(this.vector.x), y: Math.abs(this.vector.y)};
            if(absoluteVector.x > 2) this.vector.x = this.vector.x > 0 ? 2 : -2;
            if(absoluteVector.y > 2) this.vector.y = this.vector.y > 0 ? 2 : -2;
            if(this.vector.x == 0 && this.vector.y == 0) this.vector = {x: -this.lastPlayer.vector.x, y: -this.lastPlayer.vector.y};
            var maximun = Math.max(absoluteVector.x, absoluteVector.y);
            this.unitary.x = this.vector.x == 0 ? 0 : (this.vector.x > 0 ? 1 : -1);
            this.unitary.y = this.vector.y == 0 ? 0 : (this.vector.y > 0 ? 1 : -1);
            this.recurrence.x = absoluteVector.x == 0 ? 1 : Math.round(maximun / absoluteVector.x);
            this.recurrence.y = absoluteVector.y == 0 ? 1 : Math.round(maximun / absoluteVector.y);
            this.iteration = 0;
            if(this.speed < 5) this.speed += this.speed < 2 ? 2 : 1;
        }
        else if(this.lastPlayer != null) {
            ++this.lastPlayerIteration;
            if(this.lastPlayerIteration == Constants.playerDiameter + Constants.ballDiameter) this.lastPlayer = null;
        }
        if(this.iteration == 150) {
            if(this.speed > 1) --this.speed;
            else {
                this.vector = {x: 0, y: 0};
                this.recurrence = {x: this.recurrence.x * 2, y: this.recurrence.y * 2}
                if(this.recurrence.x > 9 && this.recurrence.x > 9) this.stop();
            }
            this.iteration = 0;
        }
        ++this.iteration;
        if(this.iteration % this.recurrence.x == 0) this.position.x += this.unitary.x * this.speed;
        if(this.iteration % this.recurrence.y == 0) this.position.y += this.unitary.y * this.speed;
        if(this.position.y <= 244 && (this.position.x - Constants.ballQuarter < 60 || this.position.x + Constants.ballQuarter > 1060)) {
            this.position.y = 244 + Constants.ballRadius;
            this.invertY();
        }
        else if(this.position.y >= 364 && (this.position.x - Constants.ballQuarter < 60 || this.position.x + Constants.ballQuarter > 1060)) {
            this.position.y = 364 - Constants.ballRadius;
            this.invertY();
        }
        else if(this.position.y - Constants.ballRadius < 4) {
            this.position.y = 4 + Constants.ballRadius;
            this.invertY();
        }
        else if(this.position.y + Constants.ballRadius > 604) {
            this.position.y = 604 - Constants.ballRadius;
            this.invertY();
        }
        if(this.position.y < 244 || this.position.y > 364) {
            if(this.position.x - Constants.ballRadius < 60) {
                this.position.x = 60 + Constants.ballRadius;
                this.invertX();
            }
            else if(this.position.x + Constants.ballRadius > 1060) {
                this.position.x = 1060 - Constants.ballRadius;
                this.invertX();
            }
        }
        else if(goal == false && this.position.x < 60) {
            if(lapse == 1) scoreTeam2 += 1;
            else scoreTeam1 += 1;
            Functions.goal();
        }
        else if(goal == false && this.position.x > 1060) {
            if(lapse == 1) scoreTeam1 += 1;
            else scoreTeam2 += 1;
            Functions.goal();
        }
        if(this.position.x - Constants.ballRadius <= 4) {
            this.position.x = Constants.ballRadius;
            this.stop();
        }
        else if(this.position.x + Constants.ballRadius >= 1116) {
            this.position.x = 1120 - Constants.ballRadius;
            this.stop();
        }

    }

    stop() {
        this.vector = {x: 0, y: 0};
        this.unitary = {x: 0, y: 0};
        this.recurrence = {x: 0, y: 0};
        this.iteration = {x: 0, y: 0, total: 0};
        this.limit = {x: 0, y: 0};
        this.speed = 0;
    }

    paint() {
        Paint.circle(Constants.field, this.position.x, this.position.y, Constants.ballRadius, Colors.ball);
    }

}

class Functions {

    static start() {
        if(minutes < 90) playing = !playing;
    }

    static loadTeamLeft(uniform) {
        return [
            new Player(95, 304, uniform, 205, 402, 60, 130),
            new Player(200, 76, uniform, 4, 604, 60, 1060),
            new Player(200, 228, uniform, 4, 604, 60, 1060),
            new Player(200, 380, uniform, 4, 604, 60, 1060),
            new Player(200, 532, uniform, 4, 604, 60, 1060),
            new Player(342, 76, uniform, 4, 604, 60, 1060),
            new Player(342, 228, uniform, 4, 604, 60, 1060),
            new Player(342, 380, uniform, 4, 604, 60, 1060),
            new Player(342, 532, uniform, 4, 604, 60, 1060),
            new Player(484, 228, uniform, 4, 604, 60, 1060),
            new Player(484, 380, uniform, 4, 604, 60, 1060)
        ];
    }

    static loadTeamRight(uniform) {
        return [
            new Player(1025, 304, uniform, 205, 402, 990, 1060),
            new Player(920, 76, uniform, 4, 604, 60, 1060),
            new Player(920, 228, uniform, 4, 604, 60, 1060),
            new Player(920, 380, uniform, 4, 604, 60, 1060),
            new Player(920, 532, uniform, 4, 604, 60, 1060),
            new Player(778, 76, uniform, 4, 604, 60, 1060),
            new Player(778, 228, uniform, 4, 604, 60, 1060),
            new Player(778, 380, uniform, 4, 604, 60, 1060),
            new Player(778, 532, uniform, 4, 604, 60, 1060),
            new Player(636, 228, uniform, 4, 604, 60, 1060),
            new Player(636, 380, uniform, 4, 604, 60, 1060)
        ];
    }

    static goal() {
        goal = true;
    }
    
    static relocate() {
        ball = new Ball(560, 304);
        team1 = lapse == 1 ? Functions.loadTeamLeft(uniform1) : Functions.loadTeamRight(uniform1);
        team2 = lapse == 1 ? Functions.loadTeamRight(uniform2) : Functions.loadTeamLeft(uniform2);
    }

    static changeLapse() {
        playing = false;
        lapse = 2;
        Functions.relocate();
        Functions.paintScoreboard();
        Functions.paintMatch();
    }

    static finishMatch() {
        Functions.paintScoreboard();
        Paint.rectangle(Constants.scoreboard, 135, 0, 120, 40, Colors.scoreboardTime);
        Paint.text(Constants.scoreboard, 150, 30, "30px Monospace", " FIN ", "white");
        Functions.paintField();
        playing = false;
    }

    static paintScoreboard() {
        var time = (minutes > 9 ? "" : "0") + minutes + ":" + (seconds > 9 ? "" : "0") + seconds;
        var score1 = (scoreTeam1 > 9 ? "" : "0") + scoreTeam1;
        var score2 = (scoreTeam2 > 9 ? "" : "0") + scoreTeam2;
        Paint.rectangle(Constants.scoreboard, 0, 0, 80, 40, uniform1.primary);
        Paint.rectangle(Constants.scoreboard, 80, 0, 55, 40, Colors.scoreboardGoals);
        Paint.text(Constants.scoreboard, 90, 30, "30px Monospace", score1, Colors.scoreboardGoalsFont);
        Paint.rectangle(Constants.scoreboard, 135, 0, 120, 40, Colors.scoreboardTime);
        Paint.text(Constants.scoreboard, 150, 30, "30px Monospace", time, Colors.scoreboardTimeFont);
        Paint.rectangle(Constants.scoreboard, 255, 0, 55, 40, Colors.scoreboardGoals);
        Paint.text(Constants.scoreboard, 265, 30, "30px Monospace", score2, Colors.scoreboardGoalsFont);
        Paint.rectangle(Constants.scoreboard, 310, 0, 80, 40, uniform2.primary);
    }

    static paintField() {
        Paint.rectangle(Constants.field, 0, 0, 1120, 608, Colors.grass);
        Paint.rectangle(Constants.field, 56, 0, 1008, 4, Colors.line);
        Paint.rectangle(Constants.field, 56, 604, 1008, 4, Colors.line);
        Paint.rectangle(Constants.field, 56, 0, 4, 608, Colors.line);
        Paint.rectangle(Constants.field, 1060, 0, 4, 608, Colors.line);
        Paint.circle(Constants.field, 560, 304, 84, Colors.line);
        Paint.circle(Constants.field, 560, 304, 80, Colors.grass);
        Paint.rectangle(Constants.field, 558, 4, 4, 600, Colors.line);

        Paint.rectangle(Constants.field, 0, 244, 60, 120, lapse == 1 ? uniform1.primary : uniform2.primary);
        Paint.rectangle(Constants.field, 1060, 244, 60, 120, lapse == 1 ? uniform2.primary : uniform1.primary);

        Paint.rectangle(Constants.field, 60, 120, 180, 4, Colors.line); 
        Paint.rectangle(Constants.field, 60, 484, 180, 4, Colors.line);
        Paint.rectangle(Constants.field, 240, 120, 4, 368, Colors.line);
        
        Paint.rectangle(Constants.field, 60, 202, 70, 4, Colors.line);
        Paint.rectangle(Constants.field, 60, 402, 70, 4, Colors.line);
        Paint.rectangle(Constants.field, 130, 202, 4, 204, Colors.line);

        Paint.rectangle(Constants.field, 880, 120, 180, 4, Colors.line);
        Paint.rectangle(Constants.field, 880, 484, 180, 4, Colors.line);
        Paint.rectangle(Constants.field, 876, 120, 4, 368, Colors.line);
        
        Paint.rectangle(Constants.field, 990, 202, 70, 4, Colors.line);
        Paint.rectangle(Constants.field, 990, 402, 70, 4, Colors.line);
        Paint.rectangle(Constants.field, 986, 202, 4, 204, Colors.line);
    }

    static paintMatch() {
        Functions.paintField();
        for(var i = 0; i < 11; ++i) {
            team1[i].paint();
            team2[i].paint();
        }
        ball.paint();
    }

    static updateTime() {
        if(goal == false) {
            seconds += 1;
            if(seconds == 60) {
                minutes += 1;
                seconds = 0;
                if(minutes == 45 && lapse == 1) Functions.changeLapse();
                if(minutes == 90) Functions.finishMatch();
            }
        }
    }

    static updateMatch() {
        ball.update();
        for(var i = 0; i < 11; ++i) {
            team1[i].update();
            team2[i].update();
        }
        if(goal == true) {
            goalIteration += 1;
            if(goalIteration == 150) {
                goal = false;
                goalIteration = 0;
                Functions.relocate();
            }
        }
    }

    static renderScoreboard() {
        if(playing == true) {
            Functions.paintScoreboard();
            Functions.updateTime();
        }
    }

    static rederMatch() {
        if(playing == true) {
            Functions.paintMatch();
            Functions.updateMatch();
        }
    }

}

var playing = false;
var goal = false;
var goalIteration = 0;

var uniform1 = Uniform.red();
var uniform2 = Uniform.blue();

var lapse = 1;
var minutes = 0;
var seconds = 0;
var scoreTeam1 = 0;
var scoreTeam2 = 0;

var ball = new Ball(560, 304); 
var team1 = Functions.loadTeamLeft(uniform1);
var team2 = Functions.loadTeamRight(uniform2);

setInterval(Functions.rederMatch, 10);
setInterval(Functions.renderScoreboard, Constants.milliseconds);

Functions.paintScoreboard();
Functions.paintField();
Functions.paintMatch();
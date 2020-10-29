IGME-330 Project 2  Audio visualizer game
Title: Audio Dodger
Author: Lucas Veldman
Known bugs: none
last update: 10/28/20

This game was made for Rich Media Web App Dev 1's project 2.  In it I use web audio API and javascript to create an expierence
for the player.  This program has the following:

-index.html                 To host the html elements for the web
-styles:
    -default-styles.css     To add css styles to my program
-src:
    -audio.js               To create audio and link nodes together so the player can hear chosen songs/ sounds. Uses web audio API
    -canvas.js              To create a canvas and to host the game logic.  This uses the canvas API
    -classes.js             To set up sprite classes for the game inside the program.
    -loader.js              To load in the main.js and keep the code more secure by being the only linked one in the index.html.
    -main.js                Hosts the core javascript as well as links all the other .js's files together.
    -utils.js               Has functions that can be used across files as non-dependant functions.

WHAT WENT RIGHT:
I had little to no trouble working on the actual game aspect of this project.  I was able to figure out collisions and game logic realativly fast and painless. This only 
took time to make.  What also went well was setting everything up and organizing the program.  I had a lot of fun simply making the UI(html/ css) for this project.  

WHAT WENT WRONG:
I have no prior experience with audio in games/ programs until now. Due to this I was not able to impliment some higher end features I would have liked to.  However, I
feel I did a good job with the audio and I definetly learned a lot in terms of this.  I still need to work on however, how the web audio API actually works and all the different
nodes and methods you can use.

WHAT I WOULD LIKE TO ADD:
If I had more time I would have liked to improve the waves that are in the background and make them more smoothe or change color over time.  As well as this I wanted to add
powerups in the game but due to time constraints I had to scope down from this.  

HOW TO PLAY:
In this web audio game you will be playing as a small box trying to avoid incoming projectiles. These projectiles are spawned by an unkown source in the middle of the
map.  It seams when the audio goes higher up in hz the projectiles come out faster but smaller in size. Opposite to this when the audio goes below a certain hz it seams the
projectiles come out slower and larger.  Can you survive a whole song? Play audio dodger to find out! 

CONTROLS: 
Use WASD to move around the map.  But be warned, once you move you can not stop. Aside from moving the box you have a selection of game options below the map.  The first row 
are: the play/ pause button, reset game button, enter fullscreen button, and the tracks available. Below this is two checkboxes to either boost the treble or the bass (warning 
this may increase volume).  And finally below that are the sliders to adjust the volume, speed of projectiles and the spawn rate of them.

CITATION:
In this program there are methods and functions that were inspired by/ used from IGM's Rich Media and Web Dev 1 class taught by Prof Jefferson.  These methods can be found across
all the .js files.  These files, for the most part, have been changed or manipulated in a way that makes them more unique to my program.  With these functions the songs given 
were also from this source.  I also used tutorial from this class to help aid my progress.

MY GRADE/ self critique:
I would realisticly grade myself an 85% for this project.  I thought I did a great job of using web audio in a game format.  But, I feel I neglected some controls in the 
process of optimizing my game and I wish I had more time to figure out some of the web audio nodes that I did not use. 

Thank you for reading and enjoy my game.
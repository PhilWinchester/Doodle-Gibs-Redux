Game:
Doodle based plant vs zombie replica. Enemies spawn on the left side of
the screen and march endlessly till your castle is destroyed. Drop straws
and matches to defend your base.

Implementation:
Landing Page - html and css
Game Page - html, css, jquery, and javascript.

Landing Page is a simple landing page, designed to mirror the colorful
and goofy feel of the game.

Game Page. Almost all of this page is generated using jquery. The grid
system that the user can place units on is created with jquery and then
using jquery-ui I manage the drag and drop features of the game. All
units in the game have their own class to help manage the various methods
that they need. All game systems are run using the grid to detect collisions.

Implementation Problems:
The game is designed with heavy OOP usage and as such became very complicated
as the design process finished up. The changes to one unit had knock on effects
that I couldn't always track down and as such could not bring in a full working
beta of the game for delivery. Instead there is a almost fully functioning Alpha
that is playable.

Future Work:
Finishing up the wave generation system, so that the user has a more clear
understanding of the level of difficulty they are on and that there is a
gradual increase to the difficulty.
Implementing a resource system so the user has to determine what to build when.
Tied into this, a feature going forward could be "mills" which would allow
the user to increase their resource gathering.
Using Local Storage have the users high score be saved.
 

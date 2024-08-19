# Battle Bubble Game

Implement the game "Duel".

1. There is a rectangular Canvas field, on the rectangular field there are figures - two circles. The circles represent heroes who fight each other.

2. Heroes move in a straight line up and down on opposite sides of the screen (like bats in Arkanoid). Upon reaching the edge of the field, the hero pushes off and changes the direction of movement.

3. Heroes use spells - they shoot smaller balls at each other.

4. If the hero meets the mouse cursor on his way, he pushes off from it as from the border of the field
   When in contact with the enemy, the spell disappears, and one hit is counted on the scoreboard.

5. The field is rectangular, you can't go beyond the boundaries.

6. If you click on the hero, a menu appears, made using React, with which you can change the color of the spells he throws

7. For each hero, there are two sliders that adjust the frequency of his shooting and the speed of movement.

8. The implementation should be done on pure canvas and react, without using third-party graphics or game libraries.

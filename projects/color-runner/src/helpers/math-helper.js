(function(ColorRunner) {

    ColorRunner.mathHelper = (function() {

            function getZeroBasedX (relativeToX, xPos) {
                return xPos - relativeToX;
            }
            
            function getZeroBasedY (relativeToY, yPos) {
                return yPos - relativeToY;
            }

            function getNormalizedVector(vector) {
                var multiplier = 1/
                    (Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2)));

                return {
                    x: multiplier * vector.x,
                    y: multiplier * vector.y
                }
            }

            function getRelativeVector(zeroBasedVector, relativeTo) {
                return {
                    x: zeroBasedVector.x + relativeTo.x,
                    y: zeroBasedVector.y + relativeTo.y
                }
            }

            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }

            return {
                getZeroBasedX: getZeroBasedX,
                getZeroBasedY: getZeroBasedY,
                getNormalizedVector: getNormalizedVector,
                getRelativeVector: getRelativeVector,
                getRandomInt: getRandomInt
            }
        })();
        
})(ColorRunner = window.ColorRunner || {});
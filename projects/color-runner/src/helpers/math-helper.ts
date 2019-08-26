export default class MathHelper {

    static getZeroBasedX(relativeToX, xPos) {
        return xPos - relativeToX;
    }

    static getZeroBasedY(relativeToY, yPos) {
        return yPos - relativeToY;
    }

    static getNormalizedVector(vector) {
        var multiplier = 1 /
            (Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2)));

        return {
            x: multiplier * vector.x,
            y: multiplier * vector.y
        }
    }

    static getRelativeVector(zeroBasedVector, relativeTo) {
        return {
            x: zeroBasedVector.x + relativeTo.x,
            y: zeroBasedVector.y + relativeTo.y
        }
    }

    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
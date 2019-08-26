define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MathHelper = /** @class */ (function () {
        function MathHelper() {
        }
        MathHelper.getZeroBasedX = function (relativeToX, xPos) {
            return xPos - relativeToX;
        };
        MathHelper.getZeroBasedY = function (relativeToY, yPos) {
            return yPos - relativeToY;
        };
        MathHelper.getNormalizedVector = function (vector) {
            var multiplier = 1 /
                (Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2)));
            return {
                x: multiplier * vector.x,
                y: multiplier * vector.y
            };
        };
        MathHelper.getRelativeVector = function (zeroBasedVector, relativeTo) {
            return {
                x: zeroBasedVector.x + relativeTo.x,
                y: zeroBasedVector.y + relativeTo.y
            };
        };
        MathHelper.getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        };
        return MathHelper;
    }());
    exports.default = MathHelper;
});
//# sourceMappingURL=math-helper.js.map
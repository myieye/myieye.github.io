define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScreenUtils = /** @class */ (function () {
        function ScreenUtils() {
        }
        ScreenUtils.width = function () {
            return ScreenUtils.w.innerWidth || ScreenUtils.e.clientWidth || ScreenUtils.b.clientWidth;
        };
        ScreenUtils.height = function () {
            return ScreenUtils.w.innerHeight || ScreenUtils.e.clientHeight || ScreenUtils.b.clientHeight;
        };
        ScreenUtils.w = window;
        ScreenUtils.e = document.documentElement;
        ScreenUtils.b = document.getElementsByTagName('body')[0];
        return ScreenUtils;
    }());
    exports.default = ScreenUtils;
});
//# sourceMappingURL=utils.js.map
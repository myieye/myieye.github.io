var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define(["require", "exports", "phaser-ce", "../helpers/const"], function (require, exports, phaser_ce_1, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CreditStyle = {
        Header: {
            font: "tricolor-bw",
            fontSize: 35,
            fill: "#FFF"
        },
        Body: {
            font: "arial",
            fontSize: 20,
            fill: "#FFF"
        }
    };
    var CreditGroup = /** @class */ (function () {
        function CreditGroup(title, items) {
            this.title = title;
            this.items = items;
        }
        return CreditGroup;
    }());
    var CreditTextItem = /** @class */ (function () {
        function CreditTextItem(text, style, link) {
            this.text = text;
            this.style = style;
            this.link = link;
            this.style = __assign({}, CreditStyle.Body, style);
        }
        CreditTextItem.Normal = function (text, style) {
            return new CreditTextItem(text, style);
        };
        CreditTextItem.Bold = function (text) {
            return new CreditTextItem(text, { fontWeight: "bold" });
        };
        CreditTextItem.Link = function (text, link) {
            return new CreditTextItem(text, { fill: "#22E" }, link || text);
        };
        return CreditTextItem;
    }());
    var CreditText = [
        new CreditGroup("Design and development", [
            [
                CreditTextItem.Bold("Timothy Haasdyk"),
                CreditTextItem.Normal("from"),
                CreditTextItem.Link("timhaasdyk.com")
            ]
        ]),
        new CreditGroup("Images", [
            [
                CreditTextItem.Bold("Character/Jet pack man"),
                CreditTextItem.Normal("by"),
                CreditTextItem.Link("Robert Brooks", "https://www.gamedeveloperstudio.com")
            ],
            [
                CreditTextItem.Bold("Backgrounds"),
                CreditTextItem.Normal("by"),
                CreditTextItem.Link("brgfx on Freepik", "https://www.freepik.com/brgfx")
            ],
        ]),
        new CreditGroup("Audio", [
            [
                CreditTextItem.Bold("Music"),
                CreditTextItem.Normal("from"),
                CreditTextItem.Link("bensound.com")
            ],
            [
                CreditTextItem.Bold("Sound effects"),
                CreditTextItem.Normal("from"),
                CreditTextItem.Link("zapsplat.com", "https://www.zapsplat.com")
            ],
        ]),
        new CreditGroup("Font", [
            [
                CreditTextItem.Bold("Tricolor"),
                CreditTextItem.Normal("from"),
                CreditTextItem.Link("Ivan Filipov", "https://www.behance.net/gallery/23750263/TriColore-FREE-Font")
            ],
        ]),
        new CreditGroup("Frameworks", [
            [
                CreditTextItem.Bold("Phaser 2 (CE)"),
                CreditTextItem.Normal("from"),
                CreditTextItem.Link("phaser.io")
            ],
            [
                CreditTextItem.Bold("Adobe PhoneGap"),
                CreditTextItem.Normal("from"),
                CreditTextItem.Link("phonegap.com")
            ],
        ])
    ];
    var Credits = /** @class */ (function (_super) {
        __extends(Credits, _super);
        function Credits(game) {
            var _this = _super.call(this, game) || this;
            _this.bg = _this.add(game.add.graphics());
            _this.bg.inputEnabled = true;
            _this.bg
                .beginFill(phaser_ce_1.Color.BLACK, .97)
                .lineStyle(game.height * .02, const_1.Const.Color.FutureColors[0])
                .drawRoundedRect(0, 0, game.width * .6, game.height * .8, 10);
            _this.text = _this.add(game.add.group());
            var y = 0;
            for (var _i = 0, CreditText_1 = CreditText; _i < CreditText_1.length; _i++) {
                var group = CreditText_1[_i];
                var currLine = _this.text.add(game.add.group());
                currLine.position.setTo(0, y);
                currLine.add(game.add.text(0, 0, group.title, CreditStyle.Header));
                y += 50;
                for (var _a = 0, _b = group.items; _a < _b.length; _a++) {
                    var line = _b[_a];
                    currLine = _this.text.add(game.add.group());
                    currLine.y = y;
                    var x = 0;
                    var currText;
                    var _loop_1 = function (item) {
                        currText = currLine.add(game.add.text(x, 0, item.text, item.style));
                        if (item.link) {
                            currText.inputEnabled = true;
                            currText.events.onInputDown.add(function () { return window.open(item.link, "_blank"); });
                        }
                        x = currText.right + 5;
                    };
                    for (var _c = 0, line_1 = line; _c < line_1.length; _c++) {
                        var item = line_1[_c];
                        _loop_1(item);
                    }
                    currLine.add(game.add.text(x - 5, 0, ".", CreditStyle.Body));
                    y += 25;
                }
                y += 10;
            }
            for (var _d = 0, _e = _this.text.children; _d < _e.length; _d++) {
                var l = _e[_d];
                l.x = (_this.bg.width - l.width) / 2;
            }
            _this.resize();
            return _this;
        }
        Credits.prototype.resize = function () {
            this.game.scale.scaleSprite(this.bg, this.game.width * .9, this.game.height * .9, true);
            this.game.scale.scaleSprite(this.text, this.bg.width * .9, this.bg.height * .8, true);
            this.bg.width = Math.min(this.bg.width, this.text.width * 2);
            this.alignIn(this.game.camera.bounds, Phaser.CENTER);
            this.text.alignIn(this.bg, Phaser.CENTER);
            this.text.y *= .75;
        };
        return Credits;
    }(phaser_ce_1.Group));
    exports.default = Credits;
});
//# sourceMappingURL=credits.js.map
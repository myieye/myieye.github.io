export default class ScreenUtils {
    static readonly w = window;
    static readonly e = document.documentElement;
    static readonly b = document.getElementsByTagName('body')[0];

    static width():number {
        return ScreenUtils.w.innerWidth || ScreenUtils.e.clientWidth || ScreenUtils.b.clientWidth;
    }

    static height():number {
        return ScreenUtils.w.innerHeight || ScreenUtils.e.clientHeight || ScreenUtils.b.clientHeight;
    }
}
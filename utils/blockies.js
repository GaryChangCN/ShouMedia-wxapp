function l() {
    var a = (Math.sin(m++) + 1) / 2,
        a = 1E4 * a;
    return a -= Math.floor(a)
}
var m = 0;
module.exports = function(context, a = {
    size: 10,
    scale: 5,
    seed: Math.random().toString(36).substr(2),
    color: "#fff"
}) {
    for (var c = a.size, k = a.scale, e = a.seed, g = a.bgcolor, b = m = 0; b < e.length; b += 2) {
        var f = e.charCodeAt(b) << 8 | e.charCodeAt(b + 1);
        m ^= f
    }(a = a.color) || (a = Math.floor, e = 50 * l() + 50 + "%", b = 60 * l() + 20 + "%", a = "hsl(" + a + "," + e + "," + b + ")");
    e = a;
    b = Math.ceil(c / 2);
    f = c - b;
    a = [];
    for (var n = 0; n < c; n++) {
        for (var h = [], d = 0; d < b; d++) h[d] = .5 <= l();
        d = h.slice(0,
            f);
        d.reverse();
        h = h.concat(d);
        for (d = 0; d < h.length; d++) a.push(h[d])
    }
    c = {
        width: null,
        height: null
    }
    b = Math.sqrt(a.length);
    c.width = c.height = b * k;
    f = context;
    f.setFillStyle(e);
    for (g = 0; g < a.length; g++) e = Math.floor(g / b), n = g % b, a[g] && f.fillRect(n * k, e * k, k, k);
    return f;

}

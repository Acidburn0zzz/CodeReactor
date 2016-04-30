/**
 *
 * @author      Alex Mourtziapis <alex.mourtziapis@gmail.com>
 * @license     {@link http://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Append canvas to DOM
 * @medhod #AppendCanvas
 *
 * @param {Array<object>} attributes - canvas's attributes
 * @attribute {string} name - attribute's name
 * @attribute {string} value - attribute's value
 * @param {number} width - canvas's width
 * @param {number} height - canvas's height
 * @param {string} parent - canvas's parent
 * @param {object} Frag - Fragment Shader
 * @attribute {string} isPath - indicates if string is a path to the shader or the shader itself
 * @attribute {string} src - source
 * @param {object} Vert - Vertex Shader
 * @attribute {string} isPath - indicates if string is a path to the shader or the shader itself
 * @attribute {string} src - source
 */
function AppendCanvas(attributes, width, height, parent, Frag, Vert) {
    var canvas0 = document.createElement('canvas');
    canvas0.width = width;
    canvas0.height = height;

    if (Frag !== undefined) {
        if (Frag.isPath) {
            canvas0.setAttribute("data-fragment-url", Frag.src);
        } else {
            canvas0.setAttribute("data-fragment", Frag.src);
        }
    }


    if (Vert !== undefined) {
        if (Vert.isPath) {
            canvas0.setAttribute("data-fragment-url", Vert.src);
        } else {
            canvas0.setAttribute("data-fragment", Vert.src);
        }
    }

    if (attributes !== undefined) {
        var i = 0;
        for (; i < attributes.length; i++) {
            canvas0.setAttribute(attributes[i].name, attributes[i].value);
        }
    }

    document.getElementById(parent).appendChild(canvas0);
}

var mouse = {
    x: 0,
    y: 0
};

document.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX || e.pageX;
    mouse.y = e.clientY || e.pageY
}, false);

// Provides requestAnimationFrame in a cross browser way.
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback, element) {
            return window.setTimeout(callback, 1000 / 60);
        };
})();

function makeid(x, name) {
    if (x === undefined) {
        x = 5;
    }

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    if (name === undefined || name === false) {
        possible += "`~!@#$%^&*({<[]}>)";
    }

    for (var i = 0; i < x; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// Created by: BennyYasuo, 2019.03.17

/**
 * @author: BennyYasuo
 * @returns: A random number within the set boundaries.
 * @param {Number} min Minimum
 * @param {Number} max Maximum
 * @param {String} method "ceil" for Math.ceil, "floor" for Math.floor, setting to anything different defaults to Math.floor.
 */
function RNG(min, max, method) {
    if(method === "ceil") {
        return Math.ceil(Math.random() * (max - min) + min);
    } else if(method === "floor") {
        return Math.floor(Math.random() * (max - min) + min);
    } else {
        return Math.floor(Math.random() * (max - min) + min);
    } 
}

/**
 * @author: BennyYasuo
 * @returns The difference between 2 numbers
 * @param {Number} num1 Number 1
 * @param {Number} num2 Number 2
 */
function difference(num1, num2) {
    return Math.abs(num1-num2);
}

function min2ms(min) {
    return min * 60000;
}

module.exports = { RNG, difference, min2ms };
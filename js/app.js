/* jshint esversion:6 */
/* globals jQuery, window, console, document */

/*
   Calculator using shunting yard concepts
   
   Operator Precedence based on table here:
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence

*/

(function ($) {
    
    'use strict';
    
    
    var 
        // placeholder for cached DOM elements
        DOM = {},
        
        // temporary strings for I/O
        output    = '',
        tempInput = '',
        
        // Operator Precedence        
        //  sym, weight    description     associative      syntax
        // ----------------------------------------------------------
        operatorPrecedence = [
            ['(', 20],  // Grouping                         ( ... )
            [')', 20],  // Grouping                         ( ... )
            ['^', 15],  // Exponentiation  right-to-left   ... ^ ...
            ['*', 14],  // Multiplication  left-to-right   ... * ...
            ['/', 14],  // Division        left-to-right   ... / ...
            ['+', 13],  // Addition        left-to-right   ... + ...
            ['-', 13]   // Subtraction     left-to-right   ... - ...
        ],
        
        // separate stacks numbers and operators
        numbers   = [],
        operators = [];


    // cache DOM elements
    function cacheDom() {
        DOM.$calculator = $('#calculator');
        DOM.$display    = DOM.$calculator.find('.calc-display');
        DOM.$clearBtn   = DOM.$calculator.find('.btn-clear');
        DOM.$buttons    = DOM.$calculator.find('.btn-container');
    }

    
    // bind events
    function bindEvents() {
        DOM.$buttons.on('click', handleInput);
        DOM.$clearBtn.on('click', clearClicked);
    }
    
    
    // determine what type of input the event received 
    function handleInput(e) {
        
        var val = e.target.dataset.value;
        
        if (e.target !== e.currentTarget) {

            if (/[0-9]/.test(val)) {
                // input is a number, add to temp variable
                tempInput += val;
                onClickNum(val);
            } else if (val === '.') {
                // input is decimal point, add to temp variable
                tempInput += val;
                onClickNum(val);
            } else if (val === 'eval') {
                // input is eval, handle math!
                onClickEval();
            } else {
                // input is an operator.
                // convert temp variable to number & push to numbers stack,
                // clear temp variable,
                // and evaluate operator precedence.
                numbers.push(parseFloat(tempInput));
                tempInput = '';
                onClickOper(val);
                console.log('numbers', numbers);
            }
        }

        e.stopPropagation();

    }
    
    
    // bind clear button click events
    function clearClicked() {
        console.log('Clear!');
        tempInput = '';
        output = '';
        render();
    }


    // prepare and render number inputs
    function onClickNum(num) {

        // convert numbers to strings
        if (typeof num === 'number') {
            num = num.toString();
        }
        
        output += num;
        render();
    }


    // operator button click handler
    function onClickOper(oper) {
                
        // determine oper's precedence value
        var operPrecVal = operatorPrecedence
            .filter( subArr => (subArr[0] === oper) )
            .map( arr => arr[1] );
        
        // show me
        console.log(`'${oper}' has precedence value ${operPrecVal}`);
                
        
        output += ' ' + oper + ' ';
        render();
    }


    function onClickEval() {
        
        var regA = 0,
            regB = 0,
            opr,
            expressionArr = output.split(' '),
            floatMapArr = expressionArr.map(function (elem) {
                return (/[0-9]/.test(elem)) ? parseFloat(elem) : elem;
            });
        
        console.log(floatMapArr);
        
        for (var i = 0; i < floatMapArr.length; i += 2) {
            
            if (regA === 0) {
                opr = floatMapArr[i + 1];
            
                switch (opr) {
                    case '*':
                        regA += floatMapArr[i] * floatMapArr[i + 2];
                        break;
                    case '/':
                        regA += floatMapArr[i] / floatMapArr[i + 2];
                        break;
                    case '+':
                        regA += floatMapArr[i] + floatMapArr[i + 2];
                        break;
                    case '-':
                        regA += floatMapArr[i] - floatMapArr[i + 2];
                        break;
                }
            } else {
            opr = floatMapArr[i + 1];
            
                switch (opr) {
                    case '*':
                        regA += floatMapArr[i] * floatMapArr[i + 2];
                        break;
                    case '/':
                        regA += floatMapArr[i] / floatMapArr[i + 2];
                        break;
                    case '+':
                        regA += floatMapArr[i] + floatMapArr[i + 2];
                        break;
                    case '-':
                        regA += floatMapArr[i] - floatMapArr[i + 2];
                        break;
                }
            }
        } 
        
        console.log(regA);
        
    }
    
        
    // render DOM
    function render() {

        if (output === undefined || output === '') {
            DOM.$display.html(0);
        } else {
            DOM.$display.html(output);
        }        
    }
    
    
    // count number of decimals in output
    function countDecimals(num) {
        if (Math.floor(num) === num) {
            return 0;
        }
        
        return num.toString().split(".")[1].length || 0;
    }
    

    // IIFE auto-fires on app load
    (function init() {
        cacheDom();
        bindEvents();
    }());
    
}(jQuery));

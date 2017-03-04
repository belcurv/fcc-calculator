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
            ['x', 14],  // Multiplication  left-to-right   ... * ...
            ['/', 14],  // Division        left-to-right   ... / ...
            ['+', 13],  // Addition        left-to-right   ... + ...
            ['-', 13]   // Subtraction     left-to-right   ... - ...
        ],
        
        // infix and postfix arrays because why not
        infix     = [],
        postfix   = [],
        
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
    
    
    // diagnostics
    function showDiag() {
        console.log('  infix array', infix);
        // console.log('postfix array', postfix);
        // console.log('numbers stack', numbers);
    }
    
    
    // determine what type of input the event received 
    function handleInput(e) {
        
        var val = e.target.dataset.value;
        
        if (e.target !== e.currentTarget) {

            if (/[\d]|[\.]/.test(val)) {
                // input is NUMBER or DECIMAL
                onClickNum(val);

            } else if (val === 'eval') {
                // input is EVAL
                onClickEval();
                
            } else {
                // input is an OPERATOR
                onClickOper(val);
            }
        }

        e.stopPropagation();

    }
    
    
    // bind clear button click events
    function clearClicked() {
        console.log('Clear!');
        tempInput = '';
        numbers.length = 0;
        infix.length = 0;
        postfix.length = 0;
        output = '';
        render();
    }


    // number button click handler.
    // prepares each number or decimal input value,
    // appends val to tempInput and output strings
    // before rendering to screen
    function onClickNum(val) {
        
        // make sure any numbers are strings
        if (typeof val === 'number') {
            val = val.toString();
        }
        
        // concat val to temp variable
        tempInput += val;
        
        output += val;
        render();
    }
    
    
    // checks state of infix array,
    // pushes tempInput value if it exists
    function checkInfixState() {

        // if tempInput has value, convert to number, push to infix,
        // and clear the tempInput variable
        if (tempInput.length) {
            infix.push(parseFloat(tempInput));
            tempInput = '';
        }
        
        // return false if infix has no values
        if (!infix.length) {
            return false;
        }
        
        // return false if last infix value is NOT a number
        if (typeof infix[infix.length - 1] !== "number") {
            return false;
        }
        
        // otherwise, return true
        return true;
    }


    // operator button click handler
    function onClickOper(val) {
        
        // only push operator to infix array if it satisfies conditions:
        // infix must have lenth, and last element must be type = number
        if (!checkInfixState()) {
            return;
        }
        
        // push operator to infix array
        infix.push(val);                

        showDiag();
        
        // concat operator to display output and render
        output += ' ' + val + ' ';
        render();
    }


    function onClickEval() {
        
        // check state of infix array before continuing
        if (!checkInfixState()) {
            return;
        }
        
        // assuming the above succeed, celebrate
        console.log('Eval fired!');
        
        // convert infix > postfix
        
        
        
//                
//        // determine oper's precedence value
//        var operPrecVal = operatorPrecedence
//            .filter( subArr => (subArr[0] === val) )
//            .map( arr => arr[1] );
//        
//        // show me
//        console.log(`'${val}' has precedence value ${operPrecVal}`);
//        
//        
        
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
    
        
    // render calculator display
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
    

    // auto-init on page load
    (function init() {
        cacheDom();
        bindEvents();
    }());
    
}(jQuery));

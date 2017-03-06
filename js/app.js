/* jshint esversion:6 */
/* globals jQuery, console, RPN */

/*
   Simple javascrit calculator
   Uses 'shunting yard' / reverse polish notation for evaluation.

*/

(function ($) {
    
    'use strict';
    
    var DOM       = {},   // cached DOM elements
        infix     = [],   // infix exp array
        output    = '',   // calculator's display
        tempInput = '',   // number input as string
        postfix,          // postfix exp array
        exprStr   = '',   // expression for 2ndary display 
        result;           // result of postfix evaluation


    // cache DOM elements
    function cacheDom() {
        DOM.$calculator = $('#calculator');
        DOM.$primaryDisplay   = DOM.$calculator.find('.primary-display');
        DOM.$secondaryDisplay = DOM.$calculator.find('.secondary-display');
        DOM.$buttons    = DOM.$calculator.find('.btn-container');
    }

    
    // bind events
    function bindEvents() {
        DOM.$buttons.on('click', handleInput);
    }
    
    
    // handle events depending on type of input received 
    function handleInput(e) {
        
        var val = e.target.dataset.value;
        
        if (e.target !== e.currentTarget) {

            if (/[\d]|[\.]/.test(val)) {
                // input is NUMBER or DECIMAL
                onClickNum(val);

            } else if (val === 'eval') {
                // input is EVAL
                onClickEval();
                
            } else if (val === 'clear') {
                // input is CLEAR
                onClickClear();
                
            } else if (/[\(\)]/.test(val)) {
                // input is PARENTHESIS
                onClickParens(val);
            
            } else {
                // input is an OPERATOR
                onClickOper(val);
            }
        }

        e.stopPropagation();

    }
    
    
    // bind clear button click events
    function onClickClear() {
        console.log('Clear!');
        tempInput = '';
        infix.length = 0;
        output = '';
        exprStr = '';
        render();
    }
    
    
    // parenthesis buttons click handler
    function onClickParens(val) {
        
        // reject parens conditionally
        if (val === '(' && tempInput.length > 0 || 
            val === ')' && tempInput.length === 0) {
            
            return;
            
        }
        
        // infix arr needs to either have 0 length or end with an operator
        // to receive '('
        if (val === '(' &&
            ( /[\+x\/\-\^]/.test(infix[infix.length - 1]) ||
              infix.length === 0 )) {
            
            infix.push(val);
            output += ' ' + val + ' ';
        }
        
        if (val === ')') {
            
            // infix arr needs to end with a number to receive ')', so
            // push whatever is in tempInput before pushing ')'.
            infix.push(parseFloat(tempInput));
            tempInput = '';
            
            // push the parens
            infix.push(val);
            output += ' ' + val + ' ';
            
        }
        
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
        
        // return false if last infix value is NOT a number and right parense
        if (typeof infix[infix.length - 1] !== 'number' &&
            infix[infix.length - 1] !== ')') {
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
        
        // concat operator to display output and render
        output += ' ' + val + ' ';
        render();
    }


    function onClickEval() {
        
        // check state of infix array before continuing
        if (!checkInfixState()) {
            return;
        }
        
        postfix = RPN.infixToPostfix(infix);
        result  = RPN.evalPostfix(postfix);
        
        // assuming the above succeed, celebrate
        console.log('=== initial infix array:', infix);
        console.log('===       postfix array:', postfix);
        console.log('===              result:', result);
        
        exprStr = output;
        output = result;
        render();
        
    }
    
        
    // render calculator display
    function render() {

        if (output === undefined || output === '') {
            DOM.$primaryDisplay.html(0);
            DOM.$secondaryDisplay.html('');
        } else {
            DOM.$primaryDisplay.html(output);
            DOM.$secondaryDisplay.html(exprStr);
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
        onClickClear();
    }());
    
}(jQuery));

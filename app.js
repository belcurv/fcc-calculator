/* jshint esversion:6 */
/* globals jQuery, window, console, document */


(function ($) {
    
    'use strict';

    var output = '',
        
        // cache DOM elements
        $calculator = $('#calculator'),
        $display    = $calculator.find('.calc-display'),
        $clearBtn   = $calculator.find('.btn-clear'),
        $buttons    = $calculator.find('.btn-container');

    
    // bind main button click events
    $buttons.on('click', function (event) {
        
        var val = event.target.dataset.value;
        
        if (event.target !== event.currentTarget) {

            if (/[0-9]/.test(val)) {
                onClickNum( parseFloat(val) );
            } else if (val === '.') {
                onClickNum(val);
            } else if (val === 'eval') {
                onClickEval();
            } else {
                onClickOper(val);
            }
        }

        event.stopPropagation();

    });
    
    
    // bind clear button click events
    $clearBtn.on('click', function () {
        console.log('Clear!');
        output = '';
        render();
    });


    // number button click handler
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
            $display.html(0);
        } else {
            $display.html(output);
        }        
    }
    
    
    // count number of decimals in output
    function countDecimals(num) {
        if (Math.floor(num) === num) {
            return 0;
        }
        
        return num.toString().split(".")[1].length || 0;
    }
    

    // render on 1st hit
    render();

}(jQuery));

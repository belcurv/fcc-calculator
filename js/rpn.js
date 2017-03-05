/* jshint esversion:6 */
/* globals console */

/* 
   Operator Precedence from MDN:
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
   
   ** Multiplication string uses 'x' instead of '*' !!!

   Public methods infixToPostfix() & evalPostfix() NEED param expression
   as an ARRAY, where the operands are NUMBERS and the operators are STRINGS:
     infix:   [1, '+', 2, 'x', 3, '-', 4]
     postfix: [1, 2, 3, 'x', '+', 4, '-']
   
*/

var RPN = (function () {
    
    'use strict';
    
    // PUBLIC METHODS =========================================================
    
    
    /* Convert Infix expression STRING to ARRAY.
     * Handles strings with and without whitespace between tokens
     * 
     * @params    [string]   infix   [string of infix operands & operators]
     * @returns   [array]            [array of infix operands & operators]
    */
    function infixStrToArr(infix) {
        
        // '1 + 2 x 3 - 4'
        
        var infixArr = [],
            operands = [],
            operators = [],
            i;
        
        if (typeof infix === 'string') {
            
            // get operands as trimmed numbers
            operands = infix
                .split(/[\+x\/\-\^]/)
                .map( operand => parseFloat(operand.trim()) );
            
            // get operators as trimmed strings
            operators = infix
                .split(/\d/)
                .filter( el => (/[\+x\/\-\^]/.test(el)) )
                .map( operator => operator.trim() );
            
            // merge operands and operators arrays
            infixArr = operands
                .map( (el, ind) => [el, operators[ind]] )
                .reduce( (acc, el) => acc.concat(el) )
                .filter( (el) => el !== undefined );
            
        }
        
        return infixArr;
        
    }
    
    
    /* Convert Infix expression to Postfix expression
     * Operands must be NUMBERS, operators must be STRINGS.
     * 
     * @params    [array]   infix   [infix notation operands & operators]
     * @returns   [array]           [postfix notation operands & operators]
    */
    function infixToPostfix(infix) {

        var postfix   = [],
            opStack = [],
            i, op1, op2,
            
            // Operator Precedence                 desc              assoc        
            // ----------------------------------------------------------------
            opPrec = {
                '(' : {prec: 20, assoc: null},  // Grouping
                ')' : {prec: 20, assoc: null},  // Grouping
                '^' : {prec: 15, assoc: 'r'},   // Exponentiation    right
                'x' : {prec: 14, assoc: 'l'},   // Multiplication    left
                '/' : {prec: 14, assoc: 'l'},   // Division          left
                '+' : {prec: 13, assoc: 'l'},   // Addition          left
                '-' : {prec: 13, assoc: 'l'}    // Subtraction       left
            };
        
        
        // loop over infix array
        for (i = 0; i < infix.length; i += 1) {
            
            if (typeof infix[i] === 'number') {
                
                // push numbers directly to postfix array
                postfix.push(infix[i]);
                
            } else if (/[\+x\/\-\^]/.test(infix[i])) {
                
                op1 = infix[i];
                op2 = opStack[opStack.length - 1];
                
                // check operator prec and assoc before continuing
                while ('^x/+-'.indexOf(op2) !== -1 &&
                       ((opPrec[op1].assoc  === 'l' &&
                         opPrec[op1].prec    <= opPrec[op2].prec) ||
                        (opPrec[op1].assoc  === 'r' && 
                         opPrec[op1].prec    <  opPrec[op2].prec))) {

                    // given above conditions, pop last op & push to postfix
                    postfix.push(opStack.pop());
                    // set op2 as the new last operator
                    op2 = opStack[opStack.length - 1];
                    
                }
                
                // otherwise, push op to the ops stack
                opStack.push(infix[i]);
                
            } else if (infix[i] === '(') {
                
                // push left parens directly to ops stack
                opStack.push(infix[i]);
                
            } else if (infix[i] === ')') {
                
                // loop over ops stack until left parens is found
                while (opStack[opStack.length - 1] !== '(') {
                    
                    // pop ops off, push them to postfix array
                    postfix.push(opStack.pop());

                }
                
                // then pop and ignore the left parens 
                opStack.pop();
                
            }
            
        }
        
        // finally, push any remaining operators on to the postfix array
        while (opStack.length) {
            postfix.push(opStack.pop());
        }
        
        return postfix;
        
    }
    
    
    /* Evaluate Postfix expression.
     * Note: Postfix expression should always (?) begin with 2 numbers.
     * Operands must be NUMBERS, operators must be STRINGS.
     * 
     * @params    [array]    postfix   [postfix notation operands & operators]
     * @returns   [number]             [result of postfix evaluation]
    */
    function evalPostfix(postfix) {
        
        var result = [],
            num1, num2,
            i;
        
        for (i = 0; i < postfix.length; i += 1) {
            
            if (typeof postfix[i] === 'number') {
                
                // push numbers directly to result stack
                result.push(postfix[i]);
                
            } else {
                
                // pop 2 numbers from result stack
                num1 = result.pop();
                num2 = result.pop();
                
                // branch depending on operator
                if (postfix[i] === '^') {
                    result.push(Math.pow(num2, num1));
                } else if (postfix[i] === 'x') {
                    result.push(num1 * num2);
                } else if (postfix[i] === '/') {
                    result.push(num2 / num1);
                } else if (postfix[i] === '+') {
                    result.push(num1 + num2);
                } else if (postfix[i] === '-') {
                    result.push(num2 - num1);
                }
            }
            
        }
        
        // console.log(result);  // by now result arr should have only 1 elem
        return result[0];
        
    }
    
    
    // RETURN API =============================================================
        
    return {
        infixStrToArr  : infixStrToArr,
        infixToPostfix : infixToPostfix,
        evalPostfix    : evalPostfix
    };
    
    
}());
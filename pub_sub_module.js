/*
This is an API using a publish/subscribe pattern, a revealing module pattern 
wrapped in a self-invoking anonymous function 
with public functions accessible using wildcard syntax.
*/

//Main App Module
var sApp = sApp || {};

sApp = (function(){
    //Our main sub modules.
    var CALC = CALC || {},
    GlobalObserver = GlobalObserver || {},
    anotherCalc = anotherCalc || {};

    //Utility function for creating a hierarchy of namespaces
    //On the fly.
    function extend( ns, ns_string ) {  
        var parts = ns_string.split('.'),  
        parent = ns,  
        pl, i;  
        if (parts[0] == "CALC") {  
            parts = parts.slice(1);  
        }  
        pl = parts.length;  
        for (i = 0; i < pl; i++) {  
            //create a property if it doesnt exist  
            if (typeof parent[parts[i]] == 'undefined') {  
                parent[parts[i]] = {};  
            }  
            parent = parent[parts[i]];  
        }  
        return parent;  
    }

    //Our Main Observer Class
    //This guy sees everything.
    GlobalObserver = function() {
        var Observable = function() {
            this.subscribers = [];
        };

        Observable.prototype.subscribe = function(callback) {
            this.subscribers.push(callback);
        };

        Observable.prototype.unsubscribe = function(callback) {
            var i = 0,
            len = this.subscribers.length;

            for (i; i < len; i+=1) {
                if (this.subscribers[i] === callback) {
                    this.subscribers.splice(i, 1);
                    return;

                }
            }
        };
        
        Observable.prototype.publish = function(n, z) {
            var i = 0,
            len = this.subscribers.length;
            for (i; i < len; i+=1) {
                this.subscribers[i](n, z);

            }
        };

        return {
            Observable : Observable
        };

    };

    //Extends Any Class with the specified parameters.
    function extendAPI(namespace, publicAPIName , arrOperations){
        var nme = namespace.name + '.' + publicAPIName;

        extend(namespace, nme);

        var operations = arrOperations;
        var conc = [];

        for(var k = 0; k < arrOperations.length; k++){
            conc.push(nme + '.' + arrOperations[k]);
            extend(namespace, conc[k]);
        }
    };

    //Constructor for our simple math.
    CALC = (function(){
        return {
            name: 'CALC'
        };
    }());

    //Initialize the namespace we'll need.
    extendAPI(CALC, 'simpleMath', ['add', 'subtract', 'multiply', 'divide']);

    //Our public functions.
    CALC.simpleMath = { 
            add: function(n1, n2){
                console.log(n1 + n2);
                return n1 + n2;
            },

            subtract: function(n1, n2){
                console.log(n1 - n2);
                return n1 - n2;
            },

            multiply: function(n1, n2){
                console.log(n1 * n2);
                return n1 * n2;
            },
            divide: function(n1, n2){
                console.log(n1 / n2);
                return n1 / n2;
            }
    };

    //The constructor for our slightly more complicated math.
    exSum = (function(){
        return {
            name: 'anotherCalc'
        };
    }());

    extendAPI(exSum, 'notSoSimpleMath', ['exponent', 'summation']);

    exSum.notSoSimpleMath = {
            exponent: function(num1, num2){
                console.log(Math.pow(num1, num2));
                return Math.pow(num1, num2);
            },
            summation: function(F, L){
                var lSquared = exSum.notSoSimpleMath.exponent(L,2),
                fSquared = exSum.notSoSimpleMath.exponent(F,2),
                g = lSquared - fSquared,
                h = CALC.simpleMath.add(g,F),

                z = CALC.simpleMath.add(h, L),
                summ = CALC.simpleMath.divide(z, 2);

                console.log(summ);
                return summ;
            }
    };

    //Here, we publish to an observable function
    //Which does the calculations and prints it them
    //Out in the console.
    function executeAPI(namespace, publicFunctions, observable){
        //access and execute our public API via wildcard syntax
        //observe the entire public API
        subscribeAll(namespace, publicFunctions, observable);

        //let's test out our functions
        console.log(observable);
        console.log("Test 1.");
        observable.publish(1, 10);

        console.log("Test 2.");
        observable.publish(123, 130); 

    };

    //Subscribe to all functions within a namespace.
    function subscribeAll(namespace, publicFunctions, observable){
        var arr, x;
        for(x in publicFunctions){
            //wildcard syntax
            arr = x.match(/(.*)/);
            if (arr != null) { 
                observable.subscribe(publicFunctions[arr[0]]);
            }
        }

    };

    //Unsubscribe to all functions within a namespace.
    function unsubscribeAll(namespace, publicFunctions, observable){
        var arr2, y;
        for(y in publicFunctions){
            //wildcard syntax
            arr2 = y.match(/(.*)/);
            if (arr2 != null) {
                observable.unsubscribe(publicFunctions[arr2[0]]);
            }
        }
    };

    //Global Observer Initialization and execution of public APIs
    var GLOBAL_OBSERVER = new GlobalObserver();
    var bigBrother = new GLOBAL_OBSERVER.Observable();

    executeAPI(CALC, CALC.simpleMath, bigBrother);
    executeAPI(anotherCalc, exSum.notSoSimpleMath, bigBrother);

    //Unsubscribe when we're done.
    unsubscribeAll(CALC, CALC.simpleMath, bigBrother);
    unsubscribeAll(anotherCalc, CALC.simpleMath, bigBrother);

    //public functions available to anyone outside the app, 
    //just for fun
    return{
        extendClass : extend,
        executeAPI: executeAPI,
        add: CALC.simpleMath.add,
        subtract: CALC.simpleMath.subtract,
        multiply: CALC.simpleMath.multiply,
        divide: CALC.simpleMath.divide,
        exponenent: exSum.notSoSimpleMath.exponent,
        summation: exSum.notSoSimpleMath.summation
    }
}());

/* The cummulative Normal distribution function: */
function N(x){

var a1, a2, a3, a4 ,a5, k ;

a1 = 0.31938153, a2 =-0.356563782, a3 = 1.781477937, a4= -1.821255978 , a5= 1.330274429;

if(x<0.0)
	return 1-N(-x);
else
	k = 1.0 / (1.0 + 0.2316419 * x);
	return 1.0 - Math.exp(-x * x / 2.0)/ Math.sqrt(2*Math.PI) * k * (a1 + k * (-0.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) ;

}

//Our Inputs. Can be gleaned from a form or any other place.
//S = Stock Price = 60
//X = Strike Price = 65
//T = Time in years
//r = risk-free interest rate
//v = volatility

//sample inputs
var bSInputs = {
	S :	 60,
 	X : 65,
	T :	 0.25,
	r :	 .08,
	v : .3,
	"PutCallFlag": "c"
};

//the actual formula calculation itself, wrapped in an anonymous self-invoking function
var blackScholesCalc = (function() {
	var stockStrikeDivided = function (){
		return bSInputs.S / bSInputs.X;
	},

	s = stockStrikeDivided(),
	
	iRV = function() {
		return bSInputs.r + Math.pow(bSInputs.v, 2) / 2;
	},

	i = iRV(),

	timeVolatilityCalculation = function(){
		return (bSInputs.v * Math.sqrt(bSInputs.T));
	},

	d1PartialOne = (Math.log(s) + (i) * bSInputs.T),
	d1PartialTwo = timeVolatilityCalculation(),

	
	d1 =  d1PartialOne/ d1PartialTwo,

	d2 = d1 - bSInputs.v * Math.sqrt(bSInputs.T);

	if (bSInputs.PutCallFlag== "c"){
		var call = bSInputs.S * N(d1) - bSInputs.X * Math.exp(-bSInputs.r * bSInputs.T) * N(d2);
		console.log("Call: " + call);
		return call;
	}
	else
	{	
		var put = bSInputs.X * Math.exp(-bSInputs.r * bSInputs.T) * N(-d2) - bSInputs.S * N(-1 * d1);
		console.log("Put: " + put);
		return put
	}

})();

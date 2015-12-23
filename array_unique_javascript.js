Array.prototype.unique = function() {
    var a = {},
    z = [],
    x,
    i = this.length;

    while(--i){
        a[this[i]] = this[i];

        if(i === 1){
            for(x in a){
                 if('undefined' !== typeof a[this[i]]){
                    z.push(a[x]);
                }
            }
        }
    };

    return z;
}
ray = [1,1,1,3,6,9];
var b = ray.unique();

console.log(b);

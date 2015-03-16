var foo = 1;

function check() {
    var foo = 2;

    function doer() {
        var foo = 3;
    }

    doer();

    foo = function () {
        var foo = "yes";
        return this.foo;
    };

    console.log(foo);
}

check();
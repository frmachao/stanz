(async () => {
    const tester = expect(3, "method test");

    let a = stanz({
        0: {
            val: "i am 0"
        },
        1: {
            val: "i am 1"
        },
        b: {
            val: "i am b"
        }
    });

    // window.a = a;

    let i = 0;
    let wid = a.watchTick(e => {
        switch (i) {
            case 0:
                tester.ok(e.length == 4, "collect ok 1");
                break;
            case 1:
                tester.ok(e.length == 2, "collect ok 2");
                break;
            default:
                tester.ok(false, "can not emit this");
        }
        i++;
    });

    a[0].val = "change 0 val";
    a[1].val = "change 1 val";
    a.b.val = "change 1 val";
    a.push({
        val: "new val 1"
    });

    nexter(() => {
        a.push({
            val: "new val 2"
        });

        a[0].val = "change 0 val 2";

        a.unwatch(wid)

    }).nexter(() => {
        a.push({
            val: "new val 3"
        });
    })

    const b = stanz({
        val: "1"
    });

    let b_count = 0;
    b.watchUntil("val == 3").then(e => {
        if (b_count === 0) {
            tester.ok(e === true, "watchUntil succeed");
        } else {
            tester.ok(false, "can not run this");
        }
        b_count++;
    })

    b.val = 2;
    b.val = 3;
    nexter(() => {
        b.val = 1;
        b.val = 3;
        // 在触发会无效
    })

})();
extend(XData.prototype, {
    seek(expr) {
        let arr = [];

        if (!isFunction(expr)) {
            let f = new Function(`with(this){return ${expr}}`)
            expr = _this => {
                try {
                    return f.call(_this, _this);
                } catch (e) { }
            };
        }

        if (expr.call(this, this)) {
            arr.push(this);
        }

        Object.values(this).forEach(e => {
            if (isxdata(e)) {
                arr.push(...e.seek(expr));
            }
        });

        return arr;
    },
    // watch异步收集版本
    watchTick(func) {
        return this.watch(collect(func));
    },
    // 监听直到表达式成功
    watchUntil(expr) {
        if (/[^=]=[^=]/.test(expr)) {
            throw 'cannot use single =';
        }

        return new Promise(resolve => {
            // 忽略错误
            let exprFun = new Function(`
        try{with(this){
            return ${expr}
        }}catch(e){}`).bind(this);

            const wid = this.watch(() => {
                let reVal = exprFun();
                if (reVal) {
                    this.unwatch(wid);
                    resolve(reVal);
                }
            });
        });
    },
    // 转换为json数据
    toJSON() {
        let obj = {};

        let isPureArray = true;
        let maxId = 0;

        Object.keys(this).forEach(k => {
            let val = this[k];

            if (!/\D/.test(k)) {
                k = parseInt(k);
                if (k > maxId) {
                    maxId = k;
                }
            } else {
                isPureArray = false;
            }

            if (isxdata(val)) {
                val = val.toJSON();
            }

            obj[k] = val;
        });

        if (isPureArray) {
            obj.length = maxId + 1;
            obj = Array.from(obj);
        }

        const xid = this.xid;
        defineProperties(obj, {
            xid: {
                get: () => xid
            }
        });

        return obj;
    },
    // 转为字符串
    toString() {
        return JSON.stringify(this.toJSON());
    }
});
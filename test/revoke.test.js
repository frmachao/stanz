const { default: stanz } = require("../dist/stanz");

test("revoke test", () => {
  const d = stanz({
    val: "I am d",
    obj: {
      val: "I am obj",
      sub: {
        val: "I am sub",
      },
    },
  });

  const obj = d.obj;
  d.push(obj);
  const sub = d.obj.sub;

  expect(obj.sub).toBe(sub);
  expect(sub.owner.size).toBe(1);
  expect(d.obj).toBe(obj);
  expect(d[0]).toBe(obj);

  obj.revoke();

  expect(sub.owner.size).toBe(0);
  expect(d.obj).toBe(null);
  expect(d[0]).toBe(null);
});

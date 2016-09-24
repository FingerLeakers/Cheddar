import sysEqual from "./sysEqual";
import fit from "./fit.es6";

let importInstance;
export default function(cheddar){
    if(importInstance) return importInstance;
    let Modular = _Modular(cheddar);

    class Modular extends cheddar.class {
        init(value, system){
            let min = system.accessor("min"),
                max = system.accessor("max");

            this.setter("value", cheddar.var(
                cheddar.init(cheddar.number, 10, 0,
                    fit(min, max, value))
                )
            );
            this.accessor("value");
            this.setter("system", cheddar.var(system));
            this.accessor("system");
        }

        // Operator = new Map([
        //     ...cheddar.class.Operator,
        //     ["+", (LHS, RHS) => {
        //         let l = LHS.accessor("value").Value,
        //             r = RHS.accessor("value").Value;
        //         let lsys = l.scope.Scope.get("system").Value;
        //         let rsys = r.scope.Scope.get("system").Value;
        //         if(!sysEqual(
        //             lsys,
        //             rsys
        //         ))
        //             return "two different systems cannot be added.";
        //
        //         let left = l.value;
        //         let right = r.value;
        //
        //         let r = new Modular(null);
        //         r.init(cheddar.init(chedar.number, 10, 0, left + right), lsys);
        //         return r;
        //     }]
        // ])

    }

    importInstance = Modular

    return Modular;
};

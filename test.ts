/** -----------------------------------------------------------------------
 * @module [apg-dxf]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/09/24] Github Beta
 * @version 0.9.7 [APG 2023/04/06] Moved to its own module + separation of concers lib/srv
 * -----------------------------------------------------------------------
 */


import { Uts } from "./deps.ts"
import { ApgDxfSpec } from "./test/specs/ApgDxfSpec.ts";

async function ApgDxfTests(arun: Uts.eApgUtsSpecRun) {

    if (arun != Uts.eApgUtsSpecRun.yes) return;

    const URI = "https://apg-tst.deno.dev/store";
    // const URI = "http://localhost:49609/store";

    const dxfSpec = new ApgDxfSpec("./test/output");

    dxfSpec.specRunSync(Uts.eApgUtsSpecRun.yes);

    const _r2 = await dxfSpec.sendToTestService(URI, "Dxf", "ApgDxfSpec");
}

await ApgDxfTests(Uts.eApgUtsSpecRun.yes);

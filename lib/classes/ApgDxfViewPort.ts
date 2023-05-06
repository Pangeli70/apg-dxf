/** -----------------------------------------------------------------------
 * @module [apg-dxf]
 * @author [APG] ANGELI Paolo Giusto
 * @credits https://github.com/ognjen-petrovic/js-dxf#readme
 * @version 0.5.1 [APG 2019/01/66]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * -----------------------------------------------------------------------
 */

/**
 * Set viewport
 */
export class ApgDxfViewport {

    name: string;
    description: string;


    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        // @todo_9 implement this mockup to fill the dxf header

    }


    /**
     * https://www.autodesk.com/techpubs/autocad/acadr14/dxf/ltype_al_u05_c.htm
     */
    toDxfString() {
        let s = '0\n??\n';
        s += '';
        return s;
    }


}

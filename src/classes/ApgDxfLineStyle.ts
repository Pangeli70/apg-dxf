/** -----------------------------------------------------------------------
 * @module [DXF]
 * @author [APG] ANGELI Paolo Giusto
 * @credits https://github.com/ognjen-petrovic/js-dxf#readme
 * @version 0.5.1 [APG 2019/01/16]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * -----------------------------------------------------------------------
 */

/**
 * Line Style
 */
export class ApgDxfLineStyle {

    name: string;
    description: string;
    elements: number[];

    /**
     * @param {string} name
     * @param {string} description
     * @param {array} elements - if elem > 0 it is a line, if elem < 0 it is gap, if elem == 0.0 it is a
     */
    constructor(name: string, description: string, elements: number[]) {
        this.name = name;
        this.description = description;
        this.elements = elements;
    }

    /**
     * @link https://www.autodesk.com/techpubs/autocad/acadr14/dxf/ltype_al_u05_c.htm
     */
    toDxfString() {
        let s = '0\nLTYPE\n';
        s += '72\n65\n';
        s += '70\n64\n';
        s += `2\n${this.name}\n`;
        s += `3\n${this.description}\n`;
        s += `73\n${this.elements.length}\n`;
        s += `40\n${this.getElementsSum()}\n`;

        for (let i = 0; i < this.elements.length; ++i) {
            s += `49\n${this.elements[i]}\n`;
        }

        return s;
    }

    getElementsSum() {
        let sum = 0;
        for (let i = 0; i < this.elements.length; ++i) {
            sum += Math.abs(this.elements[i]);
        }

        return sum;
    }
}

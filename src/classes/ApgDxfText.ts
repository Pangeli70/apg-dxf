/** -----------------------------------------------------------------------
 * @module [DXF]
 * @author [APG] ANGELI Paolo Giusto
 * @credits https://github.com/ognjen-petrovic/js-dxf#readme
 * @version 0.5.1 [APG 2019/01/16]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * -----------------------------------------------------------------------
 */
import { IApgDxfLayer } from '../interfaces/IApgDxfLayer.ts';

/**
 * Text
 */
export class ApgDxfText {

    layer: IApgDxfLayer;
    x1: number;
    y1: number;
    height: number;
    rotation: number;
    value: string;


    /**
     * @param {number} x1 - x
     * @param {number} y1 - y
     * @param {number} height - Text height
     * @param {number} rotation - Text rotation
     * @param {string} value - the string itself
     */
    constructor(
        layer: IApgDxfLayer,
        x1: number,
        y1: number,
        height: number,
        rotation: number,
        value: string
    ) {
        this.layer = layer;
        this.x1 = x1;
        this.y1 = y1;
        this.height = height;
        this.rotation = rotation;
        this.value = value;
    }

    toDxfString() {
        // https://www.autodesk.com/techpubs/autocad/acadr14/dxf/text_al_u05_c.htm
        let s = `0\nTEXT\n`;
        s += `8\n${this.layer.name}\n`;
        s += `1\n${this.value}\n`;
        s += `10\n${this.x1}\n20\n${this.y1}\n30\n0\n`;
        s += `40\n${this.height}\n50\n${this.rotation}\n`;
        return s;
    }
}

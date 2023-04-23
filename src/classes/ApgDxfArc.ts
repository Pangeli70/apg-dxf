/** -----------------------------------------------------------------------
 * @module [DXF]
 * @author [APG] ANGELI Paolo Giusto
 * @credits https://github.com/ognjen-petrovic/js-dxf#readme
 * @version 0.5.1 [APG 2019/01/16]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * -----------------------------------------------------------------------
 */
import { IApgDxfLayer } from '../interfaces/IApgDxfLayer.ts';
import { IApgDxfShape } from '../interfaces/IApgDxfShape.ts';

/** 
 * Apg Dxf Arc
 */
export class ApgDxfArc implements IApgDxfShape {
    layer: IApgDxfLayer;
    x1: number;
    y1: number;
    r: number;
    startAngle: number;
    endAngle: number;

    /**
     * @param {IApgDxfLayer} layer
     * @param {number} x1 - Center x
     * @param {number} y1 - Center y
     * @param {number} r - radius
     * @param {number} startAngle - degrees
     * @param {number} endAngle - degrees
     */
    constructor(
        layer: IApgDxfLayer,
        x1: number,
        y1: number,
        r: number,
        startAngle: number,
        endAngle: number
    ) {
        this.layer = layer;
        this.x1 = x1;
        this.y1 = y1;
        this.r = r;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }

    toDxfString() {
        // https://www.autodesk.com/techpubs/autocad/acadr14/dxf/line_al_u05_c.htm
        let s = `0\nARC\n`;
        s += `8\n${this.layer.name}\n`;
        s += `10\n${this.x1}\n20\n${this.y1}\n30\n0\n`;
        s += `40\n${this.r}\n50\n${this.startAngle}\n51\n${this.endAngle}\n`;
        return s;
    }
}

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
 * Dxf Line
 */
export class ApgDxfLine implements IApgDxfShape {

    layer: IApgDxfLayer;
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    constructor(
        layer: IApgDxfLayer,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ) {
        this.layer = layer;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    toDxfString() {
        // https://www.autodesk.com/techpubs/autocad/acadr14/dxf/line_al_u05_c.htm
        let s = `0\nLINE\n`;
        s += `8\n${this.layer.name}\n`;
        s += `10\n${this.x1}\n20\n${this.y1}\n30\n0\n`;
        s += `11\n${this.x2}\n21\n${this.y2}\n31\n0\n`;
        return s;
    }
}

/** -----------------------------------------------------------------------
 * @module [apg-dxf]
 * @author [APG] ANGELI Paolo Giusto
 * @credits https://github.com/ognjen-petrovic/js-dxf#readme
 * @version 0.5.1 [APG 2019/01/16]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * -----------------------------------------------------------------------
 */
import { IApgDxfLayer } from '../interfaces/IApgDxfLayer.ts';


/**
 * Point
 */
export class ApgDxfPoint {

    layer: IApgDxfLayer;
    x: number;
    y: number;



    constructor(layer: IApgDxfLayer, ax: number, ay: number) {
        this.layer = layer;
        this.x = ax;
        this.y = ay;
    }

    toDxfString() {
        // https://www.autodesk.com/techpubs/autocad/acadr14/dxf/point_al_u05_c.htm
        let s = `0\nPOINT\n`;
        s += `8\n${this.layer.name}\n`;
        s += `10\n${this.x}\n20\n${this.y}\n30\n0\n`;
        return s;
    }
}

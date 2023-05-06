/** -----------------------------------------------------------------------
 * @module [apg-dxf]
 * @author [APG] ANGELI Paolo Giusto
 * @credits https://github.com/ognjen-petrovic/js-dxf#readme
 * @version 0.5.1 [APG 2019/01/16]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * -----------------------------------------------------------------------
 */
import { IApgDxfLayer } from '../interfaces/IApgDxfLayer.ts';
import { IApgDxfShape } from '../interfaces/IApgDxfShape.ts';
import { eApgDxfDimensionTypes } from '../enums/eApgDxfDimensionTypes.ts';

/**
 * Arc Dimension
 */
export class ApgDxfArcDim implements IApgDxfShape {
    
    layer: IApgDxfLayer;
    points: number[][];
    type: eApgDxfDimensionTypes = eApgDxfDimensionTypes.RADIOUS;
    value = '<>';

    /**
     * @param points Array of points [ [x1, y1], [x2, y2]... ]
     */
    constructor(
        layer: IApgDxfLayer,
        points: number[][],
        type: eApgDxfDimensionTypes,
        value?: string
    ) {
        this.layer = layer,
            this.points = points;
        if (type === eApgDxfDimensionTypes.RADIOUS || type === eApgDxfDimensionTypes.DIAMETER) {
            this.type = type;
        }
        if (value) {
            this.value = value;
        }
    }

    toDxfString() {
        // https://www.autodesk.com/techpubs/autocad/acad2000/dxf/linear_and_rotated_dimension_group_codes_dxf_06.htm

        let d = '';
        // begin
        d += '0\nDIMENSION\n';
        // Dimension type
        d += ` 70\n${this.type}\n`;
        // Dimension style name
        d += '  3\nSTANDARD\n';
        // Layer's name
        d += `  8\n${this.layer.name}\n`;
        // Line type
        d += '  6\nBYLAYER\n';
        // text value
        d += `  1\n${this.value}\n`;
        // First point of the dimension or center in WCS
        d += ` 10\n${this.points[0][0]}\n 20\n${this.points[0][1]}\n`;
        // Second point on the arc in WCS
        d += ` 15\n${this.points[1][0]}\n25\n${this.points[1][1]}\n`;
        // Text point in OCS
        d += ` 11\n${this.points[2][0]}\n 21\n${this.points[2][1]}\n`;

        return d;
    }
}

export const generateRangeSteps =({start, end, step, length}:{
    start: number;
    end: number;
    step: number;
    length: number;
})=>{
    const range = [];
    let direction = 1;
    let i;
    while (range.length < length) {
        for (direction === 1 ? i = start : i = end ; direction === 1 ? i <= end : i >= start; i += step * direction) {
            if (range.length < length) {
                range.push(i);
            } else {
                break;
            }
        }
        direction *= -1;
    }
    return range;
};

const getCommaAndSeperatedArray = (arr) => {
    let text = "";
    const arrayLength = arr.length;
    for(let i = 0; i <= (arrayLength - 3); i++){
        text = text + arr[i] + ", ";
    }
    text = text + arr[arrayLength - 2] + " and " + arr[arrayLength - 1];
    return text;
}

const isAllElementsUniqueInArray = (arr) => {
    const uniqueArr = [...new Set(arr)];
    return uniqueArr.length == arr.length;
}

const getSubarraysOfTwoElements = (originalArray) => {
    const subarrays = [];
    for (let i = 0; i < originalArray.length; i += 2) {
        subarrays.push([originalArray[i], originalArray[i + 1]]);
    }
    return subarrays;
}

const getAllElementsInArrayFormatFromStartToEndOfNumber = (number) => {
    const arr = Array.from( { length: number }, function(_, i){
        return i + 1;
    } )
    return arr;
}

export { getCommaAndSeperatedArray, isAllElementsUniqueInArray, getSubarraysOfTwoElements };
export { getAllElementsInArrayFormatFromStartToEndOfNumber }
export const getNode = (obj, label) => {
    for (var key in obj) {
        if (key===label) { return obj[key] }
    }
}

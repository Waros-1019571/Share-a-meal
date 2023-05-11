module.exports = (query,count) => {
    if (count === 0) {
        return ' WHERE ' + query
    } else {
        return ' AND ' + query
    }
}
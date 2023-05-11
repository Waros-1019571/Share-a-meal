module.exports = (query,count) => {
    if (count === 0) {
        return ' SET ' + query
    } else {
        return ', ' + query
    }
}
module.exports = function(key, kvlist) {
        let maybe = kvlist[kvlist.findIndex(kv => {
                return kv.key == key;
        })];

        return maybe ? parseInt(maybe.value) : undefined;
}
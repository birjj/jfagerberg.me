const removeKeys = (obj, keys) => {
    const outp = { ...obj };
    keys.forEach((k) => delete outp[k]);
    return outp;
};

module.exports = {
    removeKeys,
};

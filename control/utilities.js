module.exports.url_for = url_for;
module.exports.shuffle = shuffle;

function url_for(root, path) {
	return '/' + root + '/' + path.filename;
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
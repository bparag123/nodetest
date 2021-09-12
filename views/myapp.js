async function getAllData(req, res, next) {
    return res.json({
        "received" : req.body.access_token
    })
}


module.exports = {getAllData}
/*
 * helper.js is the home for any helper functions, like calculating offset
 * for pagination.
 */

function example_helper()
{
    return "Example helper!";
}

function getTuples(rows) {
    if (!rows) {
      return [];
    }
    return rows;
}

function std_err(code, err=undefined) {
    code = String(code);
    const msg_idx = {
        "400": "RTFM",
        "403": "You Shall Not Pass",
        "404": "Look Harder",
        "409": "I'm So Conflicted",
        "418": "I'm a Teapot",
        "500": "Oopsy Daisy",
        "nonexistent": "Critical Existence Failure",
    };
    const err_idx = {
        "400": "All or part of your request is bad and you should feel bad.",
        "403": "You lack authorization for this endpoint, balrog.",
        "404": "A record or endpoint you requested is not available.",
        "409": "A data conflict exists that prohibited the completion of your request.",
        "418": "Requested endpoint is short and stout",
        "500": "Unhandled internal error. Your request might be bad, but we don't know how.",
        "nonexistent": "All or a portion of a record you attempted to modify doesn't exist.",
    }
    if (!err) {
        return {statusMsg: msg_idx[code], error: err_idx[code]};
    } else {
        return {statusMsg: msg_idx[code], error: err};
    }
}

module.exports = {
    example_helper,
    getTuples,
    std_err,
}
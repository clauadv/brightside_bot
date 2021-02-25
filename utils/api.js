/*
*
* Title: Onetap API
* Author: april#0001
* Description: A library to easily use Onetap's API system.
*
*/

//region Dependencies
const https = require("https");
const query = require("querystring");
//endregion

//region Constants
const METHOD = {
    GET: 0,
    POST: 1,
    DELETE: 2,
    DELETE_PARAM: 3
};
//endregion

//region Classes
class OnetapAPI {
    constructor(client_id, client_secret, api_key) {
        this.clientID = client_id;
        this.clientSecret = client_secret;
        this.apiKey = api_key;
    }

    SetClientID(data) {
        this.clientID = data;
    }

    SetClientSecret(data) {
        this.clientSecret = data;
    }

    SetAPIKey(data) {
        this.apiKey = data;
    }

    IsSetup() {
        return this.clientID && this.clientSecret && this.apiKey;
    }

    GenerateOptions(method, path, query) {
        switch (method) {
            case METHOD.GET:
                return {
                    'hostname': "api.onetap.com",
                    'path': path,
                    'method': "GET",
                    'headers': {
                        "X-Api-Id": this.clientID,
                        "X-Api-Secret": this.clientSecret,
                        "X-Api-Key": this.apiKey
                    }
                };

            case METHOD.POST:
                return {
                    'hostname': "api.onetap.com",
                    'path': path,
                    'method': "POST",
                    'headers': {
                        "X-Api-Id": this.clientID,
                        "X-Api-Secret": this.clientSecret,
                        "X-Api-Key": this.apiKey,
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Content-Length": Buffer.byteLength(query)
                    }
                };

            case METHOD.DELETE:
                return {
                    'hostname': "api.onetap.com",
                    'path': path,
                    'method': "DELETE",
                    'headers': {
                        "X-Api-Id": this.clientID,
                        "X-Api-Secret": this.clientSecret,
                        "X-Api-Key": this.apiKey,
                        "Content-Type": "application/x-www-form-urlencoded",
                    }
                }

            case METHOD.DELETE_PARAM:
                return {
                    'hostname': "api.onetap.com",
                    'path': path,
                    'method': "DELETE",
                    'headers': {
                        "X-Api-Id": this.clientID,
                        "X-Api-Secret": this.clientSecret,
                        "X-Api-Key": this.apiKey,
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Content-Length": Buffer.byteLength(query)
                    }
                }

            default:
                return console.log("[ONETAP] Invalid method type.");
        }
    }

    HandleErrors(data) {
        var obj = JSON.parse(data);

        obj.failed = false;

        if (!obj.errors)
            return obj;

        try {
            switch (obj.errors[0].code) {
                case "endpoint_not_found":
                    throw ("[ONETAP] [API] Invalid endpoint.");

                case "invalid_request_header_content_type":
                    throw ("[ONETAP] [API] Invalid header content type.");

                case "requested_user_not_found":
                    throw ("[ONETAP] [API] The requested user could not be found.");

                case "requested_script_not_found":
                    throw ("[ONETAP] [API] The requested script could not be found.");

                case "requested_script_not_found":
                    throw ("[ONETAP] [API] The requested script could not be found.");

                case "script_name_cannot_be_empty":
                    throw ("[ONETAP] [API] The scripts's name cannot be empty.");

                case "script_name_exceeds_max_length":
                    throw ("[ONETAP] [API] The scripts's name is too big.");

                case "script_name_only_alphanumeric_underscore":
                    throw ("[ONETAP] [API] The scripts's name has invalid characters.");

                case "script_data_cannot_be_empty":
                    throw ("[ONETAP] [API] The scripts's data cannot be empty.");

                case "script_data_contains_unexpected_contents":
                    throw ("[ONETAP] [API] The scripts's data has invalid contents.");

                case "script_subscription_already_exists":
                    throw ("[ONETAP] [API] This user already has the specified script.");

                case "requested_script_subscription_not_found":
                    throw ("[ONETAP] [API] This script's subscriptions could not be found.");

                case "rate_limit":
                    throw ("[ONETAP] [API] You're sending too many requests!")

                default:
                    throw ("[ONETAP] [API] Unexpected error occured.")
            }
        }

        catch (e) {
            return {
                failed: true,
                error: e
            };
        }
    }

    async GetScripts(callback) {
        if (!this.IsSetup())
            return console.log("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions(METHOD.GET, "/cloud/scripts/");

        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if (obj.failed)
                    return callback.apply(null, [true, obj]);

                if (callback)
                    callback.apply(null, [false, obj.scripts]);
            });

            res.on("error", (err) => {
                return console.log(`[ONETAP] [GET] ${err.message}`);
            })
        })
            .on("error", (err) => {
                return console.log(`[ONETAP] [GET] ${err.message}`);
            })
            .end();
    }

    async GetScript(callback, id) {
        if (!this.IsSetup())
            return console.log("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions(METHOD.GET, `/cloud/scripts/${id}/`);

        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if (obj.failed)
                    return callback.apply(null, [true, obj]);

                if (callback)
                    callback.apply(null, [false, obj.scripts]);
            });

            res.on("error", (err) => {
                return console.log(`[ONETAP] [GET] ${err.message}`);
            })
        })
            .on("error", (err) => {
                return console.log(`[ONETAP] [GET] ${err.message}`);
            })
            .end();
    }

    async GetScriptSubscriptions(callback) {
        if (!this.IsSetup())
            return console.log("[ONETAP] Invalid header keys.");

        this.GetScripts((failed, list) => {
            if (failed)
                return callback.apply(null, [true, { error: "[ONETAP] [API] Couldn't get scripts." }]);

            var subs = {};

            for (let cfg of list) {
                if (cfg.subscriptions.length > 0)
                    subs[cfg.name] = cfg.subscriptions
            }

            if (callback)
                callback.apply(null, [false, subs]);
        })
    }

    async GetScriptSubscriptionsByID(callback, script_id) {
        if (!this.IsSetup())
            return console.log("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions(METHOD.GET, `/cloud/scripts/${script_id}/subscriptions/`);

        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if (obj.failed)
                    return callback.apply(null, [true, obj]);

                if (callback)
                    callback.apply(null, [false, obj.subscription]);
            });

            res.on("error", (err) => {
                return console.log(`[ONETAP] [GET] ${err.message}`);
            });
        })
            .on("error", (err) => {
                return console.log(`[ONETAP] [GET] ${err.message}`);
            })
            .end();
    }

    async GetScriptSubscriptionsByName(callback, name) {
        if (!this.IsSetup())
            return console.log("[ONETAP] Invalid header keys.");

        this.GetScriptSubscriptions((failed, list) => {
            if (failed)
                return callback.apply(null, [true, { error: "[ONETAP] [API] There are no subscriptions for this script." }]);

            callback.apply(null, [false, list[name]]);
        });
    }

    async AddScriptSubscription(callback, script_id, user_id) {
        if (!this.IsSetup())
            return console.log("[ONETAP] Invalid header keys.");

        const q = query.stringify({
            'user_id': user_id
        });

        const options = this.GenerateOptions(METHOD.POST, `/cloud/scripts/${script_id}/subscriptions`, q);

        const req = https.request(options, (res) => {
            var data = '';

            res.setEncoding("utf8");

            res.on("data", (chunk) => {
                data += chunk;
            })

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if (obj.failed)
                    return callback.error(obj.error);

                /*if (callback)
                    callback.log("new user ");*/
            })
        })

        req.on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        req.write(q);
        req.end();
    }

    async DeleteScriptSubscription(callback, script_id, user_id) {
        if (!this.IsSetup())
            return console.log("[ONETAP] Invalid header keys.");

        const q = query.stringify({
            'user_id': user_id
        });

        const options = this.GenerateOptions(METHOD.DELETE_PARAM, `/cloud/scripts/${script_id}/subscriptions/`, q);

        const req = https.request(options, (res) => {
            var data = '';

            res.setEncoding("utf8");

            res.on("data", (chunk) => {
                data += chunk;
            })

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if (obj.failed)
                    return callback.apply(null, [true, obj]);

                if (callback)
                    callback.apply(null, [false]);
            })
        })

        req.on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        req.write(q);
        req.end();
    }

    async AddScriptSubscriptionByName(callback, name, user_id) {
        if (!this.IsSetup())
            return console.log("[ONETAP] Invalid header keys.");

        this.GetScriptByName((failed, scr) => {
            if (failed)
                return callback.apply(null, [true, { error: "[ONETAP] [API] Couldn't find a script with such name." }]);

            this.AddScriptSubscription(callback, scr.script_id, user_id)
        }, name);
    }

    async CreateScriptInviteByName(callback, name, max_age, max_uses) {
        if (!this.IsSetup())
            return console.log("[ONETAP] Invalid header keys.");

        this.GetScriptByName((failed, scr) => {
            if (failed)
                return callback.apply(null, [true, { error: "[ONETAP] [API] Couldn't find a script with such name." }]);

            this.CreateScriptInvite(callback, scr.script_id, max_age, max_uses);
        }, name);
    }

    async DeleteScriptSubscriptionByName(callback, name, user_id) {
        if (!this.IsSetup())
            return console.log("[ONETAP] Invalid header keys.");

        this.GetScriptSubscriptionsByName((failed, list) => {
            if (failed)
                return callback.apply(null, [true, { error: "[ONETAP] [API] Couldn't get subscriptions for this script." }]);

            var scr_id = -1;
            var user_has_item = false;

            for (let sub of list) {
                if (sub.user_id == user_id) {
                    scr_id = sub.script_id;
                    user_has_item = true;
                    break;
                }
            }

            if (!user_has_item)
                return callback.apply(null, [true, { error: "[ONETAP] [API] This user does not have an active subscription for this item." }]);

            this.DeleteScriptSubscription(callback, scr_id, user_id);
        }, name);
    }

    async DeleteScriptInviteByName(callback, name, invite_id) {
        if (!this.IsSetup())
            return console.log("[ONETAP] Invalid header keys.");

        this.GetScriptByName((failed, scr) => {
            if (failed)
                return callback.apply(null, [true, { error: "[ONETAP] [API] Couldn't find a script with such name." }]);

            this.DeleteScriptInvite(callback, scr.script_id, invite_id);
        }, name);
    }

    async UpdateScript(callback, id, name) {
        if (!this.IsSetup())
            return console.log("[ONETAP] Invalid header keys.");

        const q = query.stringify({
            'name': name
        });

        const options = this.GenerateOptions(METHOD.POST, `/cloud/scripts/${id}`, q);

        const req = https.request(options, (res) => {
            var data = '';

            res.setEncoding("utf8");

            res.on("data", (chunk) => {
                data += chunk;
            })

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if (obj.failed)
                    return callback.apply(null, [true, obj]);

                if (callback)
                    callback.apply(null, [false]);
            })
        })

        req.on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        req.write(q);
        req.end();
    }

    async DeleteScript(callback, id) {
        if (!this.IsSetup())
            return console.log("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions(METHOD.DELETE, `/cloud/scripts/${id}`);

        const req = https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            })

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if (obj.failed)
                    return callback.apply(null, [true, obj]);

                if (callback)
                    callback.apply(null, [false]);
            })
        })

        req.on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        req.end();
    }

    async GetScriptByName(callback, name) {
        if (!this.IsSetup())
            return console.log("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions(METHOD.GET, "/cloud/scripts/");

        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var script;
                var obj = this.HandleErrors(data)

                if (obj.failed)
                    return callback.apply(null, [true, obj]);

                for (let scr of obj.scripts) {
                    if (scr.name == name) {
                        script = scr;
                        break;
                    }
                }

                if (!script)
                    return callback.apply(null, [true, { error: "[ONETAP] [API] Couldn't find a script with such name." }]);

                if (callback)
                    callback.apply(null, [false, script]);
            });

        })
            .on("error", (err) => {
                return console.log(`[ONETAP] [GET] ${err.message}`);
            })
            .end();
    }
}
//endregion

//region Exports
module.exports = OnetapAPI;
//endregion
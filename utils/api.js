/*
*
* Title: Onetap API
* Author: april#0001
* Description: A library to easily use Onetap's API system.
*
*/

import https from "https";
import query from "querystring";

const METHOD = {
    GET: 0,
    POST: 1,
    DELETE: 2,
    DELETE_PARAM: 3
};

export default class onetap {
    constructor(api_key) {
        this.apiKey = api_key;
    }

    SetAPIKey(data) {
        this.apiKey = data;
    }

    IsSetup() {
        return this.apiKey;
    }

    GenerateOptions(method, path, query) {
        switch (method) {
            case METHOD.GET:
                return {
                    'hostname': "api.onetap.com",
                    'path': path,
                    'method': "GET",
                    'headers': {
                        "X-Api-Key": this.apiKey
                    }
                };

            case METHOD.POST:
                return {
                    'hostname': "api.onetap.com",
                    'path': path,
                    'method': "POST",
                    'headers': {
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
                        "X-Api-Key": this.apiKey,
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Content-Length": Buffer.byteLength(query)
                    }
                }

            default:
                return console.log("invalid method type.");
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
                    throw ("invalid endpoint");

                case "invalid_request_header_content_type":
                    throw ("invalid header content type");

                case "requested_user_not_found":
                    throw ("the requested user could not be found");

                case "requested_script_not_found":
                    throw ("the requested script could not be found");

                case "requested_script_not_found":
                    throw ("the requested script could not be found");

                case "script_name_cannot_be_empty":
                    throw ("the scripts's name cannot be empty");

                case "script_name_exceeds_max_length":
                    throw ("the scripts's name is too big");

                case "script_name_only_alphanumeric_underscore":
                    throw ("the scripts's name has invalid characters");

                case "script_data_cannot_be_empty":
                    throw ("the scripts's data cannot be empty");

                case "script_data_contains_unexpected_contents":
                    throw ("the scripts's data has invalid contents");

                case "script_subscription_already_exists":
                    throw ("this user already has the specified script");

                case "requested_script_subscription_not_found":
                    throw ("this script's subscriptions could not be found");

                case "rate_limit":
                    throw ("you're sending too many requests")

                default:
                    throw ("unexpected error occured")
            }
        }

        catch (e) {
            return {
                failed: true,
                error: e
            };
        }
    }

    async AddScriptSubscription(callback, script_id, user_id) {
        if (!this.IsSetup())
            return console.log("invalid header keys");

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
            })
        })

        req.on("error", (err) => {
            return console.log(`${err.message}`);
        })
        req.write(q);
        req.end();
    }

    async DeleteScriptSubscription(callback, script_id, user_id) {
        if (!this.IsSetup())
            return console.log("invalid header keys");

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
                var obj = this.HandleErrors(data);

                if (obj.failed)
                    return callback.error(obj.error);
            })
        })

        req.on("error", (err) => {
            return console.log(`${err.message}`);
        })

        req.write(q);
        req.end();
    }

    async UpdateScript(callback, id, name) {
        if (!this.IsSetup())
            return console.log("invalid header keys");

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
            return console.log(`${err.message}`);
        })
        req.write(q);
        req.end();
    }
}
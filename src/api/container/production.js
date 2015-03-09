module.exports = function Production() {
    var express = require('express'),
        models = require('../../models/index'),
        ContainerManager = require('../../container-manager/index'),
        LogCenter = require('../../log-center/index'),
        app = express(),
        TYPE = "production";

    app.post('/create', function (req, res) {
        req.body['type'] = TYPE;

        ContainerManager
            .runContainer(req.body)
            .then(function(info) {
                res.json({
                    success: true,
                    info: info
                });
            }, function (error) {
                res.json({
                    success: false,
                    error: error
                });
            });
    });

    app.get('/list', function (req, res) {
        models
            .Container
            .findAll({
                where: {
                    type: TYPE,
                    state: 'running'
                }
            })
            .complete(function (err, result) {
                var message = "";
                if (!!err) {
                    message = "An error occurred while select on containers ";
                    LogCenter.error(message + err);

                    res
                        .status(500)
                        .json({
                            "result": [],
                            "error": message
                        });

                } else {

                    if (!result) {
                        LogCenter.info("No container found");
                    } else {
                        LogCenter.info("production container found");
                    }

                    LogCenter.debug(result);

                    res
                        .status(200)
                        .json({
                            "result": result,
                            "error": ''
                        });

                }
            })
        ;
    });

    return app;
};
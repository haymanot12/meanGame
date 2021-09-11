var express = require("express");
var router = express.Router();
const controllerGames = require("../controllers/games.controller");
const controllerPublisher = require("../controllers/publisher-controller");
const controllerReview = require("../controllers/reviews-controller");
const controllerUser = require("../controllers/user-controller");

router.route("/games")
    .get(controllerGames.gamesGetAll)
   // .post(controllerGames.gamesAddOne);
   .post(controllerUser.authenticate, controllerGames.gamesAddOne);


router.route("/games/:gameId")
    .get(controllerGames.gamesGetOne)
    .put(controllerGames.gamesUpdateOne)
    .delete(controllerGames.gamesDeleteOne);

router.route("/games/:gameId/publishers")
    .get(controllerPublisher.publisherGetOne)
    .post(controllerPublisher.publisherAddOne)
    .put(controllerPublisher.publisherUpdateOne)
    .delete(controllerPublisher.publisherDeleteOne);

router.route("/games/:gameId/reviews")
    .get(controllerReview.reviewsGetAll)
    .post(controllerReview.reviewsAddOne);

router.route("/games/:gameId/reviews/:reviewId")
    .get(controllerReview.reviewsGetOne)
    .put(controllerReview.reviewsUpdateOne)
    .delete(controllerReview.reviewsDeleteOne);

router.route("/users/register")
    .post(controllerUser.register);

router.route("/users/login").post(controllerUser.login);

module.exports = router
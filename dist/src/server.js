"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var legacy_1 = require("./legacy");
var axios_1 = __importDefault(require("axios"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get('/v1', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var firstName, lastName, _a, success, nickname;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                firstName = req.query.firstName;
                lastName = req.query.lastName;
                if (!(typeof firstName === 'string' && typeof lastName === 'string')) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, legacy_1.getT3PlayerData)({ firstName: firstName, lastName: lastName })];
            case 1:
                _a = _b.sent(), success = _a.success, nickname = _a.nickname;
                if (success) {
                    res.send(nickname);
                    return [2 /*return*/];
                }
                _b.label = 2;
            case 2:
                res.send('Not found!');
                return [2 /*return*/];
        }
    });
}); });
app.get('/v1/event', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var eventUrl, bcpData, withNicknames, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                eventUrl = req.query.link;
                if (!(typeof eventUrl === 'string')) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, legacy_1.getBCPData)(eventUrl)];
            case 2:
                bcpData = _a.sent();
                return [4 /*yield*/, Promise.all(bcpData.map(function (name) { return __awaiter(void 0, void 0, void 0, function () {
                        var nickname;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, legacy_1.getT3PlayerData)(name)];
                                case 1:
                                    nickname = (_a.sent()).nickname;
                                    return [2 /*return*/, __assign(__assign({}, name), { nickname: nickname || 'unknown' })];
                            }
                        });
                    }); }))];
            case 3:
                withNicknames = _a.sent();
                res.send({ success: true, names: withNicknames });
                return [2 /*return*/];
            case 4:
                error_1 = _a.sent();
                res.send({ success: false });
                return [2 /*return*/];
            case 5:
                res.send({ success: false });
                return [2 /*return*/];
        }
    });
}); });
var BCP_API_URL = 'https://pnnct8s9sk.execute-api.us-east-1.amazonaws.com/prod';
var getBcpEventInformation = function (eventId) { return __awaiter(void 0, void 0, void 0, function () {
    var url, eventResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(BCP_API_URL, "/events/").concat(eventId);
                return [4 /*yield*/, axios_1.default.get(url, { headers: { 'Client-Id': 'test' } })];
            case 1:
                eventResponse = _a.sent();
                return [2 /*return*/, eventResponse.data];
        }
    });
}); };
var buildBcpEventPlacingsUrl = function (eventId, nextKey) {
    return "".concat(BCP_API_URL, "/players?limit=100&eventId=").concat(eventId, "&placings=true&expand%5B%5D=team&expand%5B%5D=army").concat(nextKey ? "&nextKey=".concat(nextKey) : '');
};
var parsePlacingsData = function (placingsData) {
    return placingsData.map(function (placing) { return ({
        first_name: placing.firstName,
        last_name: placing.lastName,
        placing: placing.placing,
        team: placing.teamName || placing.team.name,
        faction: placing.armyName || placing.army.name,
        subFaction: placing.subFactionName || '',
        wins: placing.numWins,
        path_to_victory: placing.pathToVictory,
        bcp_user_id: placing.userId,
    }); });
};
var getBcpEventPlacings = function (eventId) { return __awaiter(void 0, void 0, void 0, function () {
    var allPlacings, nextKey, i, url, placingsResponse, placingsData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                allPlacings = [];
                nextKey = undefined;
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < 15)) return [3 /*break*/, 3];
                i++;
                url = buildBcpEventPlacingsUrl(eventId, nextKey);
                return [4 /*yield*/, axios_1.default.get(url, { headers: { 'Client-Id': 'test' } })];
            case 2:
                placingsResponse = _a.sent();
                placingsData = placingsResponse.data.data;
                if (placingsData.length === 0) {
                    return [3 /*break*/, 3];
                }
                allPlacings.push.apply(allPlacings, parsePlacingsData(placingsData));
                nextKey = placingsResponse.data.nextKey;
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/, allPlacings];
        }
    });
}); };
app.get('/v2/bcp-event', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var eventId, eventInformation, parsedEventInformation_1, eventPlacings, finalEventData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                eventId = req.query.eventId;
                if (!eventId) {
                    res.status(400).send('Current password does not match');
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, getBcpEventInformation(eventId)];
            case 2:
                eventInformation = _a.sent();
                parsedEventInformation_1 = {
                    number_players: eventInformation.totalPlayers,
                    number_rounds: eventInformation.numberOfRounds,
                    tournament_name: eventInformation.name,
                    tournament_date: eventInformation === null || eventInformation === void 0 ? void 0 : eventInformation.eventDate.substring(0, 10),
                    game_size: eventInformation.pointsValue,
                };
                return [4 /*yield*/, getBcpEventPlacings(eventId)];
            case 3:
                eventPlacings = _a.sent();
                finalEventData = eventPlacings.map(function (placing) { return ({
                    first_name: placing.first_name,
                    last_name: placing.last_name,
                    t3_nickname: '',
                    placing: placing.placing,
                    wins: String(placing.wins || 0),
                    path_to_victory: String(placing.path_to_victory || 0),
                    bcp_user_id: placing.bcp_user_id,
                    city: '',
                    team: placing.team,
                    faction: placing.faction,
                    sub_faction: placing.subFaction,
                    number_players: parsedEventInformation_1.number_players,
                    number_rounds: parsedEventInformation_1.number_rounds,
                    tournament_name: parsedEventInformation_1.tournament_name,
                    tournament_id: eventId,
                    tournament_date: parsedEventInformation_1.tournament_date,
                    game_size: parsedEventInformation_1.game_size || 'N/A',
                }); });
                res.send({ success: true, data: finalEventData });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                res.status(500).send("Error fetching BCP data: ".concat(error_2.toString()));
                return [2 /*return*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.listen(3000, function () {
    console.log('Application started on port 3000!');
});

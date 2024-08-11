// Pokemon to be extracted
var EXTRACTED_POKEMON = [];

// Default Datas
var DEFAULT_ATTACKER_LEVEL = 40;
var DEFAULT_ATTACKER_CPM = 0.7903;
var DEFAULT_ATTACKER_IVs = [15, 15, 15];
var DEFAULT_ENEMY_DPS1 = 900;
var DEFAULT_ENEMY_LEVEL = 40;
var DEFAULT_ENEMY_CPM = 0.7903;
var DEFAULT_ENEMY_IVs = [15, 15, 15];
var DEFAULT_ENEMY_CURRENT_DEFENSE = 160;
var DEFAULT_ENEMY_POKETYPE1 = 'none';
var DEFAULT_ENEMY_POKETYPE2 = 'none';
var DEFAULT_WEATHER = 'EXTREME';
var DEFAULT_TOTAL_ENERGY_GAINED = 400;
var DEFAULT_STAB = 1.2;
var GM = {};
var list = [];

// Actual pkm datas
var Data = {
    BattleSettings: {
        'dodgeDurationMs': 500,
        'dodgeWindowMs': 700,
        'swapDurationMs': 1000,
        'quickSwapCooldownDurationMs': 60000,
        'arenaEntryLagMs': 3000,
        'arenaEarlyTerminationMs': 3000,
        'fastMoveLagMs': 25,
        'chargedMoveLagMs': 100,
        'rejoinDurationMs': 10000,
        'itemMenuAnimationTimeMs': 2000,
        'maxReviveTimePerPokemonMs': 1000,
        'timelimitGymMs': 100000,
        'timelimitRaidMs': 180000,
        'timelimitLegendaryRaidMs': 300000,
        'timelimitPvPMs': 240000,
        'shadowPokemonAttackBonusMultiplier': 1.2,
        'shadowPokemonDefenseBonusMultiplier': 0.8333333,
        'purifiedPokemonAttackMultiplierVsShadow': 1.0,
        'sameTypeAttackBonusMultiplierMega': 1.3,
        'megaPokemonStatMultiplier': 1.1,
        'sameTypeAttackBonusMultiplier': 1.2,
        'weatherAttackBonusMultiplier': 1.2,
        'fastAttackBonusMultiplier': 1.3,
        'chargeAttackBonusMultiplier': 1.3,
        'attackBuffMultiplier': [0.5, 0.5714286, 0.6666667, 0.8, 1.0, 1.25, 1.5, 1.75, 2.0],
        'defenseBuffMultiplier': [0.5, 0.5714286, 0.6666667, 0.8, 1.0, 1.25, 1.5, 1.75, 2.0],
        'minimumStatStage': -4,
        'maximumStatStage': 4,
        'maxEnergy': 100,
        'energyDeltaPerHealthLost': 0.5,
        'dodgeDamageReductionPercent': 0.75,
        TypeEffectiveness: {
            "bug": {
                "bug": 1,
                "dark": 1.6,
                "dragon": 1,
                "electric": 1,
                "fairy": 0.625,
                "fighting": 0.625,
                "fire": 0.625,
                "flying": 0.625,
                "ghost": 0.625,
                "grass": 1.6,
                "ground": 1,
                "ice": 1,
                "normal": 1,
                "poison": 0.625,
                "psychic": 1.6,
                "rock": 1,
                "steel": 0.625,
                "water": 1
            },
            "dark": {
                "bug": 1,
                "dark": 0.625,
                "dragon": 1,
                "electric": 1,
                "fairy": 0.625,
                "fighting": 0.625,
                "fire": 1,
                "flying": 1,
                "ghost": 1.6,
                "grass": 1,
                "ground": 1,
                "ice": 1,
                "normal": 1,
                "poison": 1,
                "psychic": 1.6,
                "rock": 1,
                "steel": 1,
                "water": 1
            },
            "dragon": {
                "bug": 1,
                "dark": 1,
                "dragon": 1.6,
                "electric": 1,
                "fairy": 0.390625,
                "fighting": 1,
                "fire": 1,
                "flying": 1,
                "ghost": 1,
                "grass": 1,
                "ground": 1,
                "ice": 1,
                "normal": 1,
                "poison": 1,
                "psychic": 1,
                "rock": 1,
                "steel": 0.625,
                "water": 1
            },
            "electric": {
                "bug": 1,
                "dark": 1,
                "dragon": 0.625,
                "electric": 0.625,
                "fairy": 1,
                "fighting": 1,
                "fire": 1,
                "flying": 1.6,
                "ghost": 1,
                "grass": 0.625,
                "ground": 0.390625,
                "ice": 1,
                "normal": 1,
                "poison": 1,
                "psychic": 1,
                "rock": 1,
                "steel": 1,
                "water": 1.6
            },
            "fairy": {
                "bug": 1,
                "dark": 1.6,
                "dragon": 1.6,
                "electric": 1,
                "fairy": 1,
                "fighting": 1.6,
                "fire": 0.625,
                "flying": 1,
                "ghost": 1,
                "grass": 1,
                "ground": 1,
                "ice": 1,
                "normal": 1,
                "poison": 0.625,
                "psychic": 1,
                "rock": 1,
                "steel": 0.625,
                "water": 1
            },
            "fighting": {
                "bug": 0.625,
                "dark": 1.6,
                "dragon": 1,
                "electric": 1,
                "fairy": 0.625,
                "fighting": 1,
                "fire": 1,
                "flying": 0.625,
                "ghost": 0.390625,
                "grass": 1,
                "ground": 1,
                "ice": 1.6,
                "normal": 1.6,
                "poison": 0.625,
                "psychic": 0.625,
                "rock": 1.6,
                "steel": 1.6,
                "water": 1
            },
            "fire": {
                "bug": 1.6,
                "dark": 1,
                "dragon": 0.625,
                "electric": 1,
                "fairy": 1,
                "fighting": 1,
                "fire": 0.625,
                "flying": 1,
                "ghost": 1,
                "grass": 1.6,
                "ground": 1,
                "ice": 1.6,
                "normal": 1,
                "poison": 1,
                "psychic": 1,
                "rock": 0.625,
                "steel": 1.6,
                "water": 0.625
            },
            "flying": {
                "bug": 1.6,
                "dark": 1,
                "dragon": 1,
                "electric": 0.625,
                "fairy": 1,
                "fighting": 1.6,
                "fire": 1,
                "flying": 1,
                "ghost": 1,
                "grass": 1.6,
                "ground": 1,
                "ice": 1,
                "normal": 1,
                "poison": 1,
                "psychic": 1,
                "rock": 0.625,
                "steel": 0.625,
                "water": 1
            },
            "ghost": {
                "bug": 1,
                "dark": 0.625,
                "dragon": 1,
                "electric": 1,
                "fairy": 1,
                "fighting": 1,
                "fire": 1,
                "flying": 1,
                "ghost": 1.6,
                "grass": 1,
                "ground": 1,
                "ice": 1,
                "normal": 0.390625,
                "poison": 1,
                "psychic": 1.6,
                "rock": 1,
                "steel": 1,
                "water": 1
            },
            "grass": {
                "bug": 0.625,
                "dark": 1,
                "dragon": 0.625,
                "electric": 1,
                "fairy": 1,
                "fighting": 1,
                "fire": 0.625,
                "flying": 0.625,
                "ghost": 1,
                "grass": 0.625,
                "ground": 1.6,
                "ice": 1,
                "normal": 1,
                "poison": 0.625,
                "psychic": 1,
                "rock": 1.6,
                "steel": 0.625,
                "water": 1.6
            },
            "ground": {
                "bug": 0.625,
                "dark": 1,
                "dragon": 1,
                "electric": 1.6,
                "fairy": 1,
                "fighting": 1,
                "fire": 1.6,
                "flying": 0.390625,
                "ghost": 1,
                "grass": 0.625,
                "ground": 1,
                "ice": 1,
                "normal": 1,
                "poison": 1.6,
                "psychic": 1,
                "rock": 1.6,
                "steel": 1.6,
                "water": 1
            },
            "ice": {
                "bug": 1,
                "dark": 1,
                "dragon": 1.6,
                "electric": 1,
                "fairy": 1,
                "fighting": 1,
                "fire": 0.625,
                "flying": 1.6,
                "ghost": 1,
                "grass": 1.6,
                "ground": 1.6,
                "ice": 0.625,
                "normal": 1,
                "poison": 1,
                "psychic": 1,
                "rock": 1,
                "steel": 0.625,
                "water": 0.625
            },
            "normal": {
                "bug": 1,
                "dark": 1,
                "dragon": 1,
                "electric": 1,
                "fairy": 1,
                "fighting": 1,
                "fire": 1,
                "flying": 1,
                "ghost": 0.390625,
                "grass": 1,
                "ground": 1,
                "ice": 1,
                "normal": 1,
                "poison": 1,
                "psychic": 1,
                "rock": 0.625,
                "steel": 0.625,
                "water": 1
            },
            "poison": {
                "bug": 1,
                "dark": 1,
                "dragon": 1,
                "electric": 1,
                "fairy": 1.6,
                "fighting": 1,
                "fire": 1,
                "flying": 1,
                "ghost": 0.625,
                "grass": 1.6,
                "ground": 0.625,
                "ice": 1,
                "normal": 1,
                "poison": 0.625,
                "psychic": 1,
                "rock": 0.625,
                "steel": 0.390625,
                "water": 1
            },
            "psychic": {
                "bug": 1,
                "dark": 0.390625,
                "dragon": 1,
                "electric": 1,
                "fairy": 1,
                "fighting": 1.6,
                "fire": 1,
                "flying": 1,
                "ghost": 1,
                "grass": 1,
                "ground": 1,
                "ice": 1,
                "normal": 1,
                "poison": 1.6,
                "psychic": 0.625,
                "rock": 1,
                "steel": 0.625,
                "water": 1
            },
            "rock": {
                "bug": 1.6,
                "dark": 1,
                "dragon": 1,
                "electric": 1,
                "fairy": 1,
                "fighting": 0.625,
                "fire": 1.6,
                "flying": 1.6,
                "ghost": 1,
                "grass": 1,
                "ground": 0.625,
                "ice": 1.6,
                "normal": 1,
                "poison": 1,
                "psychic": 1,
                "rock": 1,
                "steel": 0.625,
                "water": 1
            },
            "steel": {
                "bug": 1,
                "dark": 1,
                "dragon": 1,
                "electric": 0.625,
                "fairy": 1.6,
                "fighting": 1,
                "fire": 0.625,
                "flying": 1,
                "ghost": 1,
                "grass": 1,
                "ground": 1,
                "ice": 1.6,
                "normal": 1,
                "poison": 1,
                "psychic": 1,
                "rock": 1.6,
                "steel": 0.625,
                "water": 0.625
            },
            "water": {
                "bug": 1,
                "dark": 1,
                "dragon": 0.625,
                "electric": 1,
                "fairy": 1,
                "fighting": 1,
                "fire": 1.6,
                "flying": 1,
                "ghost": 1,
                "grass": 0.625,
                "ground": 1.6,
                "ice": 1,
                "normal": 1,
                "poison": 1,
                "psychic": 1,
                "rock": 1.6,
                "steel": 1,
                "water": 0.625
            }
        },
        TypeBoostedWeather: {
            "grass": "CLEAR",
            "ground": "CLEAR",
            "fire": "CLEAR",
            "dark": "FOG",
            "ghost": "FOG",
            "fairy": "CLOUDY",
            "fighting": "CLOUDY",
            "poison": "CLOUDY",
            "normal": "PARTLY_CLOUDY",
            "rock": "PARTLY_CLOUDY",
            "water": "RAINY",
            "electric": "RAINY",
            "bug": "RAINY",
            "ice": "SNOW",
            "steel": "SNOW",
            "dragon": "WINDY",
            "flying": "WINDY",
            "psychic": "WINDY"
        },
        TypeTranslation: {
            "grass": "풀",
            "ground": "땅",
            "fire": "불꽃",
            "dark": "악",
            "ghost": "고스트",
            "fairy": "페어리",
            "fighting": "격투",
            "poison": "독",
            "normal": "노말",
            "rock": "바위",
            "water": "물",
            "electric": "전기",
            "bug": "벌레",
            "ice": "얼음",
            "steel": "강철",
            "dragon": "드래곤",
            "flying": "비행",
            "psychic": "에스퍼",
            "풀": "grass",
            "땅": "ground",
            "불꽃": "fire",
            "악": "dark",
            "고스트": "ghost",
            "페어리": "fairy",
            "격투": "fighting",
            "독": "poison",
            "노말": "normal",
            "바위": "rock",
            "물": "water",
            "전기": "electric",
            "벌레": "bug",
            "얼음": "ice",
            "강철": "steel",
            "드래곤": "dragon",
            "비행": "flying",
            "에스퍼": "psychic"
        },
        FriendSettings: [{
            'name': "none",
            'label': "Lv.0 Non-Friend",
            'multiplier': 1.0
        }, {
            'name': "good",
            'label': "Lv.1 Good Friend",
            'multiplier': 1.03
        }, {
            'name': "great",
            'label': "Lv.2 Great Friend",
            'multiplier': 1.05
        }, {
            'name': "ultra",
            'label': "Lv.3 Ultra Friend",
            'multiplier': 1.07
        }, {
            'name': "best",
            'label': "Lv.4 Best Friend",
            'multiplier': 1.10
        }, ],
    },
    Weathers: [{
        'name': 'EXTREME',
        'label': "Extreme"
    }, {
        'name': 'CLEAR',
        'label': "Clear"
    }, {
        'name': 'FOG',
        'label': "Fog"
    }, {
        'name': 'CLOUDY',
        'label': "Cloudy"
    }, {
        'name': 'PARTLY_CLOUDY',
        'label': "Partly Cloudy"
    }, {
        'name': 'RAINY',
        'label': "Rainy"
    }, {
        'name': 'SNOW',
        'label': "Snow"
    }, {
        'name': 'WINDY',
        'label': "Windy"
    }],
    RaidTierSettings: [{
        "name": "1",
        "label": "Tier 1",
        "cpm": 0.6,
        "maxHP": 600,
        "timelimit": 180000
    }, {
        "name": "2",
        "label": "Tier 2",
        "cpm": 0.67,
        "maxHP": 1800,
        "timelimit": 180000
    }, {
        "name": "3",
        "label": "Tier 3",
        "cpm": 0.7300000190734863,
        "maxHP": 3600,
        "timelimit": 180000
    }, {
        "name": "4",
        "label": "Tier 4",
        "cpm": 0.7900000214576721,
        "maxHP": 9000,
        "timelimit": 180000
    }, {
        "name": "5",
        "label": "Tier 5",
        "cpm": 0.7900000214576721,
        "maxHP": 15000,
        "timelimit": 300000
    }, {
        "name": "6",
        "label": "Tier 6",
        "cpm": 0.7900000214576721,
        "maxHP": 18750,
        "timelimit": 300000
    }],
    RaidBosses: [],
    Pokemon: [],
    PokemonForms: [],
    FastMoves: [],
    ChargedMoves: [],
    LevelSettings: [],
    IndividualValues: [{
        "name": "0",
        "value": 0
    }, {
        "name": "1",
        "value": 1
    }, {
        "name": "2",
        "value": 2
    }, {
        "name": "3",
        "value": 3
    }, {
        "name": "4",
        "value": 4
    }, {
        "name": "5",
        "value": 5
    }, {
        "name": "6",
        "value": 6
    }, {
        "name": "7",
        "value": 7
    }, {
        "name": "8",
        "value": 8
    }, {
        "name": "9",
        "value": 9
    }, {
        "name": "10",
        "value": 10
    }, {
        "name": "11",
        "value": 11
    }, {
        "name": "12",
        "value": 12
    }, {
        "name": "13",
        "value": 13
    }, {
        "name": "14",
        "value": 14
    }, {
        "name": "15",
        "value": 15
    }],
    Users: []
};

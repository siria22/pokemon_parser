function fetchTableColumns(){
    return [{
        title: "CP",
        data: "cp",
        width: "10%",
        searchable: false
    }, {
        title: "포켓몬",
        data: "name",
        width: "20%"
    }, {
        title: "일반공격",
        data: "fmove.name_kor",
        type: "string",
        width: "20%"
    }, {
        title: "차징공격",
        data: "cmove.name_kor",
        type: "string",
        width: "20%"
    }, {
        title: "DPS",
        data: "dps",
        type: "num",
        width: "10%",
        orderSequence: ["desc", "asc"],
        searchable: false
    }, {
        title: "TDO",
        data: "tdo",
        type: "num",
        width: "10%",
        orderSequence: ["desc", "asc"],
        searchable: false
    }, {
        title: "ER",
        data: "overall",
        type: "num",
        width: "10%",
        orderSequence: ["desc", "asc"],
        searchable: false
    }, {
        title: "포켓몬속성1",
        data: "pokeType1_kor",
        visible: false
    }, {
        title: "포켓몬속성2",
        data: "pokeType2_kor",
        visible: false
    }, {
        title: "일반공격속성",
        data: "fmove.type_kor",
        visible: false
    }, {
        title: "차징공격속성",
        data: "cmove.type_kor",
        visible: false
    }]; 
}

// Filters

function filterRow(str, filterString) {
    const conditions = filterString.split(/([&,])/).map(cond=>cond.trim()).filter(Boolean);
    var result = null;
    var currentOp = null;
    for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i];
        if (condition === "&" || condition === ",") {
            currentOp = condition;
        } else {
            var conditionResult = null;
            if (condition.startsWith("!")) {
                conditionResult = !applyStringCondition(str, condition.substring(1));
            } else {
                conditionResult = applyStringCondition(str, condition);
            }
            if (currentOp === "&") {
                result = result && conditionResult;
            } else if (currentOp === ",") {
                result = result || conditionResult;
            } else {
                result = conditionResult;
            }
        }
    }
    return result;
}

function isEmptyString(str, offset) {
    if (str.length <= offset) {
        return true;
    }
    return false;
}

function applyStringCondition(data, condition) {
    if (condition.startsWith("@1")) {
        if (isEmptyString(condition, 2)) {
            return true;
        } else {
            return (data[9].normalize("NFC").includes(condition.substring(2)));
        }
    } else if (condition.startsWith("@2")) {
        if (isEmptyString(condition, 2)) {
            return true;
        } else {
            return (data[10].normalize("NFC").includes(condition.substring(2)));
        }
    } else if (condition.startsWith("@@")) {
        if (isEmptyString(condition, 2)) {
            return true;
        } else {
            return (data[9].normalize("NFC").includes(condition.substring(2))) && (data[10].normalize("NFC").includes(condition.substring(2)));
        }
    } else if (condition.startsWith("@")) {
        if (isEmptyString(condition, 1)) {
            return true;
        } else {
            return (data[9].normalize("NFC").includes(condition.substring(1)) || data[10].normalize("NFC").includes(condition.substring(1)) || data[2].normalize("NFC").includes(condition.substring(1)) || data[3].normalize("NFC").includes(condition.substring(1)));
        }
    } else if (condition.startsWith(">>")) {
        if (isEmptyString(condition, 2)) {
            return true;
        } else {
            var Effectiveness = Data.BattleSettings.TypeEffectiveness;
            var Translation = Data.BattleSettings.TypeTranslation;
            var dualType = condition.substring(2).split("+").map(cond=>cond.trim()).filter(Boolean);
            var result1 = 1;
            var result2 = 1;
            var length = dualType.length > 1 ? 2 : 1;
            var fmoveTypeEng = Translation[data[9].normalize("NFC")];
            var cmoveTypeEng = Translation[data[10].normalize("NFC")];
            var opponentTypeEng = Translation[condition.substring(2).normalize("NFC")];
            for (let i = 0; i < length; i++) {
                var opponentTypeEng = Translation[dualType[i].normalize("NFC")];
                result1 = result1 * (Effectiveness[fmoveTypeEng][opponentTypeEng] || 1);
                result2 = result2 * (Effectiveness[cmoveTypeEng][opponentTypeEng] || 1);
            }
            return (result1 > 1) && (result2 > 1);
        }
    } else if (condition.startsWith(">")) {
        if (isEmptyString(condition, 1)) {
            return true;
        } else {
            var Effectiveness = Data.BattleSettings.TypeEffectiveness;
            var Translation = Data.BattleSettings.TypeTranslation;
            var dualType = condition.substring(1).split("+").map(cond=>cond.trim()).filter(Boolean);
            var result = 1;
            var cmoveTypeEng = Translation[data[10].normalize("NFC")];
            var length = dualType.length > 1 ? 2 : 1;
            for (let i = 0; i < length; i++) {
                var opponentTypeEng = Translation[dualType[i].normalize("NFC")];
                result = result * (Effectiveness[cmoveTypeEng][opponentTypeEng] || 1);
            }
            return result > 1;
        }
    } else if (condition.startsWith("<")) {
        if (isEmptyString(condition, 1)) {
            return true;
        } else {
            var Effectiveness = Data.BattleSettings.TypeEffectiveness;
            var Translation = Data.BattleSettings.TypeTranslation;
            var opponentTypeEng1 = Translation[data[7].normalize("NFC")];
            var opponentTypeEng2 = Translation[data[8].normalize("NFC")];
            var cmoveTypeEng = Translation[condition.substring(1).normalize("NFC")];
            var multi1 = Effectiveness[cmoveTypeEng][opponentTypeEng1] || 1;
            var multi2 = Effectiveness[cmoveTypeEng][opponentTypeEng2] || 1;
            return (multi1 * multi2) > 1;
        }
    } else if (condition.startsWith("^")) {
        if (isEmptyString(condition, 1)) {
            return true;
        } else {
            var Effectiveness = Data.BattleSettings.TypeEffectiveness;
            var Translation = Data.BattleSettings.TypeTranslation;
            var opponentTypeEng1 = Translation[data[7].normalize("NFC")];
            var opponentTypeEng2 = Translation[data[8].normalize("NFC")];
            var cmoveTypeEng = Translation[condition.substring(1).normalize("NFC")];
            var multi1 = Effectiveness[cmoveTypeEng][opponentTypeEng1] || 1;
            var multi2 = Effectiveness[cmoveTypeEng][opponentTypeEng2] || 1;
            return (multi1 * multi2) < 1;
        }
    } else {
        return data[1].normalize("NFC").includes(condition) || data[7].normalize("NFC").includes(condition) || data[8].normalize("NFC").includes(condition);
    }
}

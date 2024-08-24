var table;

function fetchTableColumns(){
    return [{
        title: "포켓몬",
        data: "name",
        width: "2fr",
        searchable: true
    }, {
        title: "타입 1",
        data: "pokeType1_kor",
        width: "2fr"
    }, {
        title: "타입 2",
        data: "pokeType2_kor",
        type: "string",
        width: "2fr"
    }, {
        title: "일반공격",
        data: "fmove_kor",
        type: "string",
        width: "2fr"
    }, {
        title: "차징공격",
        data: "cmove_kor",
        type: "string",
        width: "2fr"
    }, {
        title: "DPS",
        data: "dps",
        type: "num",
        width: "1fr",
        orderSequence: ["desc", "asc"],
        searchable: false
    }, {
        title: "TDO",
        data: "tdo",
        type: "num",
        width: "1fr",
        orderSequence: ["desc", "asc"],
        searchable: false
    }, {
        title: "ER",
        data: "overall",
        type: "num",
        width: "1fr",
        orderSequence: ["desc", "asc"],
        searchable: false
    }, {
        title: "CP",
        data: "cp",
        type: "num",
        width: "1fr",
        orderSequence: ["desc", "asc"],
        searchable: false
    }, {
        title: "일반공격속성", //9
        data: "fmove.type_kor",
        visible: false 
    }, {
        title: "차징공격속성", //10
        data: "cmove.type_kor",
        visible: false
    }]; 
}

// Filters
function filterRow(data, filterString) {
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
                conditionResult = !applyStringCondition(data, condition.substring(1));
            } else {
                conditionResult = applyStringCondition(data, condition);
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
    } 

    else if (condition.startsWith("@2")) {
        if (isEmptyString(condition, 2)) {
            return true;
        } else {
            return (data[10].normalize("NFC").includes(condition.substring(2)));
        }
    } 

    else if (condition.startsWith("@@")) {
        if (isEmptyString(condition, 2)) {
            return true;
        } else {
            return (data[9].normalize("NFC").includes(condition.substring(2))) && (data[10].normalize("NFC").includes(condition.substring(2)));
        }
    } 

    else if (condition.startsWith("@")) {
        if (isEmptyString(condition, 1)) {
            return true;
        } else {
            return (data[3].normalize("NFC").includes(condition.substring(1)) 
                || data[4].normalize("NFC").includes(condition.substring(1)) 
                || data[9].normalize("NFC").includes(condition.substring(1)) 
                || data[10].normalize("NFC").includes(condition.substring(1)));
        }
    } 

    else if (condition.startsWith(">>")) {
        if (isEmptyString(condition, 2)) {
            return true;
        } else {
            var Effectiveness = Data.BattleSettings.TypeEffectiveness;
            var Translation = Data.BattleSettings.TypeTranslation;
            var dualType = condition.substring(2).split("+").map(cond=>cond.trim()).filter(Boolean);
            var result1 = 1;
            var result2 = 1;
            var length = dualType.length > 1 ? 2 : 1;
            var fmoveTypeEng = Translation[data[921].normalize("NFC")];
            var cmoveTypeEng = Translation[data[10].normalize("NFC")];
            var opponentTypeEng = Translation[condition.substring(2).normalize("NFC")];
            for (let i = 0; i < length; i++) {
                var opponentTypeEng = Translation[dualType[i].normalize("NFC")];
                result1 = result1 * (Effectiveness[fmoveTypeEng][opponentTypeEng] || 1);
                result2 = result2 * (Effectiveness[cmoveTypeEng][opponentTypeEng] || 1);
            }
            return (result1 > 1) && (result2 > 1);
        }
    } 
    
    else if (condition.startsWith(">")) {
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
    } 
    
    else if (condition.startsWith("<")) {
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
    } 
    
    else if (condition.startsWith("^")) {
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
    } 
    
    else {
        return data[0].normalize("NFC").includes(condition) || data[1].normalize("NFC").includes(condition) || data[2].normalize("NFC").includes(condition) || data[7].normalize("NFC").includes(condition) || data[8].normalize("NFC").includes(condition);
    }
}

function drawTable(){
    fetchFastMove();
    fetchChargedMove();
    fetchPokemon();
    fetchMegaPokemon();
    fetchShadowPokemon();
    constructPkmCollection();
    initFilteredCollection();
    var tableColumns = fetchTableColumns();

    console.log("Init table");

    //Table Definition
    table = $("#pkm_table").DataTable({
        lengthChange: false,
        autoWidth: false,
        deferRender: true,
        responsive: true,
        sDom: 'lrtip',
        pageLength: 20,
        columns: tableColumns,
        scrollX: true
    });

    console.log("add rows");
    pkmCollection.forEach(
        pkm => {
            table.row.add(pkm);
            filteredPkmCollection.push(pkmDTO(pkm));
        }
    );
    
    table.order([4, 'desc']).draw();
    
    console.log("Table Loaded...");
}


function applyFilter(){
    console.log("====Apply Filters...====");

    // init. Filter
    $.fn.dataTable.ext.search = []; //기존 필터 초기화
    initFilteredCollection(); //엑셀
    topErList = {};

    // filtering conditions
    var filterString = document.getElementById('Filter').value;
    var allowDup = document.getElementById('AllowDup');
    var tableLength = parseInt($('#LengthOfTb').val());

    if (isNaN(tableLength) || tableLength <= 0) {
        alert('행 개수 = 0 이상의 정수\n(기본값 : 20으로 설정됨)');
        tableLength = 20;
    }
    console.log("search : "+filterString);
    console.log("allowDup : "+allowDup.checked);
    console.log("tableLength : "+tableLength);


    // Filter : String filter
    $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
            if(filterString == '' || filterRow(data, filterString)){
                if(allowDup.checked){
                    let rawData = table.row(dataIndex).data();
                    filteredPkmCollection.push(pkmDTO(rawData));
                }
                return true;
            };
            return false;
        }
    );

    // Filter : Dup not alowed
    if(!allowDup.checked){
        table.page.len(tableLength).draw();
        //construct ErTable
        table.rows({ filter: 'applied' }).every(function(rowIdx, tableLoop, rowLoop) {
            let rawData = this.data();
            updateErTable(rawData);
        });
        
        // Filter : Duplication filter
        $.fn.dataTable.ext.search.push(
            function(settings, data, dataIndex) {
                let rawData = table.row(dataIndex).data();
                if(rawData.overall == topErList[rawData.name]){
                    filteredPkmCollection.push(pkmDTO(rawData));
                    return true;
                };
                return false;
            }
        );
    }

    table.page.len(tableLength).draw();
    console.log("Filtering complete");
}

function updateErTable(pkm){

    var trgEr = parseFloat(pkm.overall);
    if (!topErList[pkm.name]) {
        topErList[pkm.name] = trgEr;
    } else { 
        let existingEr = parseFloat(topErList[pkm.name]);
        if (existingEr <= trgEr) {
            topErList[pkm.name] = trgEr;
            //console.log(`er table updated : ${pkm.name}`);
        } 
    }
}

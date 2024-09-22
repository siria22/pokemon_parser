var pkmCollection = [];
var topErList = {};
var tierList = {};
var cnt = 0;

function debugTest(pokemon){
    var FILTERING_OPTION = "개무소(Normal)";
    return (pokemon.name.includes(FILTERING_OPTION));
}


function calculateDPS(pokemon, kwargs) {
    //Not working
    var x = kwargs.x
        , y = kwargs.y;

    //x, y is defined here
    if (x == undefined || y == undefined) {
        var intakeProfile = calculateDPSIntake(pokemon, kwargs);
        x = (x == undefined ? intakeProfile.x : x);
        y = (y == undefined ? intakeProfile.y : y);
    }

    var FDmg = damage(pokemon, kwargs.enemy, pokemon.fmove, kwargs.weather);
    var CDmg = damage(pokemon, kwargs.enemy, pokemon.cmove, kwargs.weather);
    var FE = pokemon.fmove.energyDelta;
    var CE = -pokemon.cmove.energyDelta;
    var FDur = pokemon.fmove.duration / 1000;
    var CDur = pokemon.cmove.duration / 1000;
    var CDWS = pokemon.cmove.dws / 1000;

    if (CE >= 100) {
        CE = CE + 0.5 * FE + 0.5 * y * CDWS;
    }
    var FDPS = FDmg / FDur;
    var FEPS = FE / FDur;
    var CDPS = CDmg / CDur;
    var CEPS = CE / CDur;

    if(debugTest(pokemon)){
        console.log(pokemon);
    }

    pokemon.st = pokemon.stm / y;
    pokemon.dps = (FDPS * CEPS + CDPS * FEPS) / (CEPS + FEPS) + (CDPS - FDPS) / (CEPS + FEPS) * (1 / 2 - x / pokemon.stm) * y;
    pokemon.tdo = pokemon.dps * pokemon.st;


    if(debugTest(pokemon)){
        console.log(`pokemon.st = pokemon.stm / y = calculatedValue`);
        console.log(`${pokemon.st} = ${pokemon.stm} / ${y} = ${pokemon.stm / y}`);

        console.log(`pokemon.dps = (FDPS * CEPS + CDPS * FEPS) / (CEPS + FEPS) + (CDPS - FDPS) / (CEPS + FEPS) * (1 / 2 - x / pokemon.stm) * y`);
        console.log(`${pokemon.dps} = (${FDPS} * ${CEPS} + ${CDPS} * ${FEPS}) / (${CEPS} + ${FEPS}) + (${CDPS} - ${FDPS}) / (${CEPS} + ${FEPS}) * (1 / 2 - ${x} / ${pokemon.stm}) * ${y}`);

        console.log(`pokemon.tdo = pokemon.dps * pokemon.st`);
        console.log(`${pokemon.tdo} = ${pokemon.dps} * ${pokemon.st}`);
    }

    if (pokemon.dps > CDPS) {
        if(debugTest(pokemon)){
            console.log(`${cnt++} ${pokemon.name} : [has other] dps > CDPS`);
            console.log(`${pokemon.fmove_kor}, ${pokemon.cmove_kor}`);
        }
        pokemon.dps = CDPS;
        pokemon.tdo = pokemon.dps * pokemon.st;
    } else if (pokemon.dps < FDPS) {
        if(debugTest(pokemon)){
            console.log(`${cnt++} ${pokemon.name} : [has other] dps < FDPS`);
            console.log(`${pokemon.fmove_kor}, ${pokemon.cmove_kor}`);
        }
        pokemon.dps = FDPS;
        pokemon.tdo = pokemon.dps * pokemon.st;
    }

    if(debugTest(pokemon)){
        console.log(`decided dps : ${pokemon.dps}\n`);
    }

    return pokemon.dps;
}

function calculateDPSIntake(pokemon, kwargs) {

    if (kwargs.genericEnemy) {
        if (kwargs.battleMode == "pvp") {
            return {
                x: -pokemon.cmove.energyDelta * 0.5,
                y: DEFAULT_ENEMY_DPS1 * 1.5 / pokemon.def
            };
        } else {

            if(debugTest(pokemon)){
                console.log(`x = * -${pokemon.cmove.energyDelta} * 0.5 + ${pokemon.fmove.energyDelta} * 0.5`);
            }
            return {
                x: -pokemon.cmove.energyDelta * 0.5 + pokemon.fmove.energyDelta * 0.5,
                y: DEFAULT_ENEMY_DPS1 / pokemon.def
            };
        }
    }
}

function damage(attacker, defender, move, weather) {

    var multipliers = 1;
    if (attacker.pokeType.some(function(x) {
        return x == move.type;
    })) {
        multipliers *= DEFAULT_STAB;
    }
    var Effectiveness = Data.BattleSettings.TypeEffectiveness;
    for (let pokeType in defender.pokeType) {
        multipliers *= Effectiveness[move.type][pokeType] || 1;
    }

    if(debugTest(attacker)){
        console.log(`Return Value = 0.5 * ${attacker.atk} / ${defender.def} * ${move.power} * ${multipliers} + 0.5 = ${0.5 * attacker.atk / defender.def * move.power * multipliers + 0.5}`);
    }

    return (0.5 * attacker.atk / defender.def * move.power * multipliers + 0.5);
}

function round(value, numDigits) {
    var multiplier = Math.pow(10, parseInt(numDigits) || 0);
    
    //Edited
    //return (Math.round((value + 0.5) * multiplier) / multiplier).toFixed(numDigits);

    //Legacy
    return (Math.round(value * multiplier) / multiplier).toFixed(numDigits);
}

function calculateCP(pkm) {
    var cpm = parseFloat(pkm.cpm);
    var atk = pkm.atk || (pkm.baseAtk + DEFAULT_ATTACKER_IVs[0]) * cpm;
    var def = pkm.def || (pkm.baseDef + DEFAULT_ATTACKER_IVs[1]) * cpm;
    var stm = pkm.stm || (pkm.baseStm + DEFAULT_ATTACKER_IVs[2]) * cpm;
    return Math.max(10, Math.floor(atk * Math.sqrt(def * stm) / 10));
}


// 만들어지고, 보여줄 때 보여줄 항목
function constructPkmCollection(){
    console.log("construct pkmCollection");
    for (let pkm of Data.Pokemon){
        if (pkm.baseAtk < 1 || pkm.baseDef < 1 || pkm.baseStm < 1) {
            continue;
        }
        // cpm, cp, atk, def 추가
        pkm.cpm = DEFAULT_ATTACKER_CPM;
        pkm.cp = calculateCP(pkm);
        pkm.atk = (pkm.baseAtk + DEFAULT_ATTACKER_IVs[0]) * pkm.cpm * (pkm.isShadow ? Data.BattleSettings.shadowPokemonAttackBonusMultiplier : 1);
        pkm.def = (pkm.baseDef + DEFAULT_ATTACKER_IVs[1]) * pkm.cpm * (pkm.isShadow ? Data.BattleSettings.shadowPokemonDefenseBonusMultiplier : 1);
        pkm.stm = (pkm.baseStm + DEFAULT_ATTACKER_IVs[2]) * pkm.cpm;

        pkm.pokeType1_kor = Data.BattleSettings.TypeTranslation[pkm.pokeType[0]];
        pkm.pokeType2_kor = Data.BattleSettings.TypeTranslation[pkm.pokeType[1]] == undefined ? "단일" : Data.BattleSettings.TypeTranslation[pkm.pokeType[1]];
        

        if(pkm.fastMove.includes("Hidden Power")){
            //console.log(`${pkm.name} has Hidden Power`);
            if (!Data.FastMovesHiddenPower.some(move => pkm.fastMove.includes(move))) {
                pkm.fastMove.push(...Data.FastMovesHiddenPower);
            }
            pkm.fastMove = pkm.fastMove.filter(elem => elem !== "Hidden Power");
        }

        if(pkm.fastMove.includes("Hidden Power *")){
            //console.log(`${pkm.name} has Hidden Power *`);
            pkm.fastMove.push(...Data.FastMovesHiddenPower.map(mv => mv + " *"));
            pkm.fastMove = pkm.fastMove.filter(elem => elem !== "Hidden Power *");
        }

        //모든 case를 고려해야 함
        for (let fmove of pkm.fastMove) {
            for (let cmove of pkm.chargedMove) {

                let pkmCopy = { ...pkm };

                if(fmove == undefined || cmove == undefined){
                    continue;
                }
                
                try{
                    pkmCopy.fmove = Data.FastMoves.find(trg => trg.name.toLowerCase() === fmove.replace(" *", "").toLowerCase());
                    pkmCopy.cmove = Data.ChargedMoves.find(trg => trg.name.toLowerCase() === cmove.replace(" *", "").toLowerCase());
                } catch(e){
                    console.log("ERROR : current = "+pkmCopy.fmove + "\n"+pkmCopy.cmove);
                }

                // fmove
                try{

                    if(fmove.includes(" *")){
                        pkmCopy.fmove_kor = pkmCopy.fmove.name_kor + " *";
                    }
                    else{
                        pkmCopy.fmove_kor = pkmCopy.fmove.name_kor;
                    }


                }catch (e){
                    console.warn("undefined fmove : "+fmove);
                    pkmCopy.fmove = Data.FastMoves.find(trg => trg.name === "Dummy_FastMove");
                    pkmCopy.fmove_kor = pkmCopy.fmove.name_kor;
                }

                // cmove
                try{
                    if(cmove.includes(" *")){
                        pkmCopy.cmove_kor = pkmCopy.cmove.name_kor + " *";
                    }
                    else{
                        pkmCopy.cmove_kor = pkmCopy.cmove.name_kor;
                    }
                  
                }catch (e){
                    console.warn("undefined cmove : "+cmove);
                    pkmCopy.cmove = Data.ChargedMoves.find(trg => trg.name === "Dummy_ChargedMove");
                    pkmCopy.cmove_kor = pkmCopy.cmove.name_kor;
                }

                pkmCopy.dps = calculateDPS(pkmCopy, Context);
                pkmCopy.dps = round(pkmCopy.dps, 3);
                pkmCopy.tdo = round(pkmCopy.tdo, 1);
                pkmCopy.overall = round((pkmCopy.dps ** 3 * pkmCopy.tdo) ** 0.25, 2);

                updateErTable(pkmCopy);
                updateTierTable(pkmCopy);

                pkmCopy.tier = calcTier(pkmCopy);
                pkmCollection.push(pkmCopy);
            }
        }
        
    }
    console.log(tierList);
    console.log("construct pkmCollection..end");

}


// 각 type별로, 가장 높은 ER값 저장
function updateTierTable(pkm){

    var trgEr = parseFloat(pkm.overall);
    //type1
    if(!tierList[pkm.pokeType1_kor]){
        tierList[pkm.pokeType1_kor] = trgEr;
    }else{
        let existingTopTier = parseFloat(tierList[pkm.pokeType1_kor]);

        if(existingTopTier < trgEr){
            tierList[pkm.pokeType1_kor] = trgEr;
            //console.log(`${pkm.name} : ${pkm.pokeType1_kor}/${pkm.pokeType2_kor}, ${pkm.overall}\n`+
            //    `${existingTopTier} < ${pkm.overall} : update ${pkm.pokeType1_kor} : ${pkm.overall}`);
        }
    }
    //type2
    if(!tierList[pkm.pokeType2_kor]){
        tierList[pkm.pokeType2_kor] = trgEr;
    }else{
        let existingTopTier = parseFloat(tierList[pkm.pokeType2_kor]);
        if(existingTopTier < trgEr){
            tierList[pkm.pokeType2_kor] = trgEr;
            // console.log(`${pkm.name} : ${pkm.pokeType1_kor}/${pkm.pokeType2_kor}, ${pkm.overall}\n`+
            //     `${existingTopTier} < ${pkm.overall} : update ${pkm.pokeType2_kor} : ${pkm.overall}`);
        }
    }
}

function calcTier(pkm){
    
    var trgEr = parseFloat(pkm.overall);
}
var filteredPkmCollection = [];

document.getElementById('btn_extractAsXlsx')
    .addEventListener('click', function () {
        var filterString = document.getElementById('Filter').value;
        var fileName = (filterString == null || filterString === "") ? 'Default.xlsx' : filterString + '.xlsx';

        var ws_data = filteredPkmCollection.map(pkm => pkm.split(',')); // CSV 문자열을 배열로 변환
        var ws = XLSX.utils.aoa_to_sheet(ws_data); // 배열을 워크시트로 변환
        var wb = XLSX.utils.book_new(); // 새 워크북 생성
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); // 워크북에 워크시트 추가
        XLSX.writeFile(wb, fileName); // 파일 저장
        console.log("Exported as .xlsx");
        alert("파일이 `" + fileName + "`으로 저장됨!");
    }
);

function pkmDTO(pkm) {
    return `${pkm.isNewPkm},${pkm.name},${pkm.pokeType1_kor},${pkm.pokeType2_kor},${pkm.fmove_kor},${pkm.cmove_kor},${pkm.dps},${pkm.tdo},${pkm.overall},${pkm.cp}`;
}

function initFilteredCollection(){
    filteredPkmCollection = [];
    filteredPkmCollection.push("신규,포켓몬,포켓몬 타입1,포켓몬 타입2,일반 공격,차징 공격,DPS,TDO,ER,CP");
}
var filteredPkmCollection = [];
var downloadAllowed = false;

function downloadCSV(csvData, filename = 'data.csv') {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("Exported as .csv");
    alert("파일이 \`"+filename+"\`으로 저장됨!");
}

document.getElementById('btn_extractAsCsv')
    .addEventListener('click', function () {
        const csvData = filteredPkmCollection;
        var filterString = document.getElementById('Filter').value;
        var fileName = (filterString == null) ? 'Default' : filterString;
        
        downloadCSV(csvData, fileName);
    }
);

function pkmDTO(pkm) {
    return `${pkm.name},${pkm.pokeType1_kor},${pkm.pokeType2_kor},${pkm.fmove_kor},${pkm.cmove_kor},${pkm.dps},${pkm.tdo},${pkm.overall},${pkm.cp}\n`;
}

function initFilteredCollection(){
    filteredPkmCollection = [];
    filteredPkmCollection.push(",포켓몬,포켓몬 타입1,포켓몬 타입2,일반 공격,차징 공격,DPS,TDO,ER,CP\n");
}
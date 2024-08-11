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
}

document.getElementById('btn_extractAsCsv')
        .addEventListener('click', function() {
                const csvData = EXTRACTED_POKEMON;
                downloadCSV(csvData);
            }
        );


function pkmDTO(pkmInstance){
    let data = `${pkmInstance.name},${pkmInstance.pokeType1_kor},${pkmInstance.pokeType2_kor},${pkmInstance.fmove.name_kor},${pkmInstance.cmove.name_kor},${pkmInstance.dps},${pkmInstance.tdo},${pkmInstance.overall},${pkmInstance.cp},\n`;
    return data;
}
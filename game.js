async function getData() {
    // const response = await fetch('https://prog2700.onrender.com/threeinarow/sample')
    // const response = await fetch('https://prog2700.onrender.com/threeinarow/random')
    // const response = await fetch('https://prog2700.onrender.com/threeinarow/6x6')
    // const response = await fetch('https://prog2700.onrender.com/threeinarow/8x8')
    // const response = await fetch('https://prog2700.onrender.com/threeinarow/10x10')
    // const response = await fetch('https://prog2700.onrender.com/threeinarow/12x12')
    const response = await fetch('https://prog2700.onrender.com/threeinarow/14x14')
    const json = await response.json()
    return json;
}

function gridClicked(td, data) {
    if (td.dataset.canToggle != "true") {
        return
    } else if (data.rows[td.dataset.row][td.dataset.col].currentState == 0) {
        data.rows[td.dataset.row][td.dataset.col].currentState++
        td.classList.remove('grey')
        td.classList.add('blue')
    } else if (data.rows[td.dataset.row][td.dataset.col].currentState == 1) {
        data.rows[td.dataset.row][td.dataset.col].currentState++
        td.classList.remove('blue')
        td.classList.add('white')
    } else if (data.rows[td.dataset.row][td.dataset.col].currentState == 2) {
        data.rows[td.dataset.row][td.dataset.col].currentState = 0
        td.classList.remove('white')
        td.classList.add('grey')
    }
    if (document.getElementById('errors').checked && (data.rows[td.dataset.row][td.dataset.col].currentState != data.rows[td.dataset.row][td.dataset.col].correctState)) {
        td.classList.add('error')
    } else {
        td.classList.remove('error')
    }
    document.getElementsByTagName('span')[0].innerHTML = ""
}

function checkBtnClicked(data) {
    let table = document.getElementsByTagName('table')[0];
    for (let i = 0; i < data.rows.length; i++) {
        let row = table.getElementsByTagName('tr')[i]
        for (let j = 0; j < data.rows[i].length; j++) {
            let square = row.getElementsByTagName('td')[j]
            if (data.rows[square.dataset.row][square.dataset.col].currentState != data.rows[square.dataset.row][square.dataset.col].correctState) {
                document.getElementsByTagName('span')[0].innerHTML = "Incorrect"  
            }        
        }
    }
    if (document.getElementsByTagName('span')[0].innerHTML == "") {
        document.getElementsByTagName('span')[0].innerHTML = "CORRECT!"
    }
}

function errorBoxChecked(checkbox, data) {
    if (checkbox.checked) {
        let table = document.getElementsByTagName('table')[0];
        for (let i = 0; i < data.rows.length; i++) {
            let row = table.getElementsByTagName('tr')[i]
            for (let j = 0; j < data.rows[i].length; j++) {
                let square = row.getElementsByTagName('td')[j]
                if (data.rows[square.dataset.row][square.dataset.col].currentState != data.rows[square.dataset.row][square.dataset.col].correctState) {
                    square.classList.add('error')
                }
            }
        }
    } else {
        let cells = document.getElementsByTagName('td');
        for (let i = 0; i < cells.length; i++) {
            cells[i].classList.remove('error')
        }
    }
}

function helpBtnClicked(data) {
    let goodHint = false;
    let grids = document.getElementsByTagName('td')
    let i = 0;
    while (!goodHint && i < grids.length * 10) {
        let num = Math.floor(Math.random() * grids.length)
        let correctState = data.rows[grids[num].dataset.row][grids[num].dataset.col].correctState
        while (data.rows[grids[num].dataset.row][grids[num].dataset.col].currentState != correctState) {
            gridClicked(grids[num], data)
            goodHint = true;
        }
        i++
    }
}

(async function (){
    const data = await getData();
    console.log(data)
    document.getElementById("theGame").appendChild(document.createElement('table'))
    document.getElementById("theGame").appendChild(document.createElement('span'))
    data.rows.forEach(row => {
        document.getElementsByTagName('table')[0].appendChild(document.createElement('tr'))
    });
    let rows = document.getElementsByTagName('tr')
    for (let i = 0; i < rows.length; i++){
        data.rows[i].forEach ((col, j) => {
            let td = document.createElement('td')
            td.innerHTML = "!"
            td.classList.add('grid')
            td.dataset.row = i
            td.dataset.col = j
            td.dataset.canToggle = col.canToggle
            switch (col.currentState) {
                case 0:
                    td.classList.add('grey')
                    break;
                case 1:
                    td.classList.add('blue')
                    break;
                case 2:
                    td.classList.add('white')
                    break;
            }
            td.addEventListener('click', function() {
                gridClicked(this, data)
            });
            rows[i].appendChild(td)
        })
    }

    let checkBtn = document.createElement('a')
    checkBtn.innerHTML = "Check"
    checkBtn.classList.add('button')
    checkBtn.addEventListener('click', function() {
        checkBtnClicked(data)
    })
    document.getElementById("theGame").appendChild(checkBtn)

    let showErrorsCheckBox = document.createElement('input')
    showErrorsCheckBox.type = "Checkbox"
    showErrorsCheckBox.id = "errors"
    showErrorsCheckBox.addEventListener('click', function() {
        errorBoxChecked(this, data)
    })
    
    let showErrorsLabel = document.createElement('label')
    showErrorsLabel.htmlFor = "errors"
    showErrorsLabel.innerHTML = "Show mistakes when checked."
    document.getElementById("theGame").appendChild(showErrorsCheckBox)
    document.getElementById("theGame").appendChild(showErrorsLabel)

    let helpBtn = document.createElement('a')
    helpBtn.innerHTML = "Get Help"
    helpBtn.classList.add('button')
    helpBtn.addEventListener('click', function() {
        helpBtnClicked(data)
    })
    document.getElementById("theGame").appendChild(helpBtn)
})();
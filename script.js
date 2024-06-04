document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        readFile(file);
    }
});

const dropArea = document.getElementById('dropArea');

dropArea.addEventListener('dragover', function(event) {
    event.preventDefault(); 
    dropArea.style.backgroundColor = '#e6f5e6';
});

dropArea.addEventListener('dragleave', function() {
    dropArea.style.backgroundColor = '#fff';
});

dropArea.addEventListener('drop', function(event) {
    event.preventDefault();
    dropArea.style.backgroundColor = '#fff';
    const file = event.dataTransfer.files[0];
    if (file) {
        readFile(file);
    }
});

function readFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        document.getElementById('fileContent').textContent = content;

        const grammar = parseGrammar(content);
        displayGrammar(grammar);
    }
    reader.readAsText(file);
}

function parseGrammar(content) {
    const grammar = [];
    const lines = content.split('\n');

    lines.forEach(line => {
        const [lhs, rhs] = line.split('=').map(s => s.trim());
        if (lhs && rhs) {
            const terminals = rhs.match(/\b[eba]\b/g) || [];
            const productions = rhs.split('|').map(s => s.trim().replace('e', 'ε'));

            grammar.push({
                variable: lhs,
                productions,
                terminals
            });
        }
    });

    return grammar;
}

function displayGrammar(grammar) {
    const table = document.createElement('table');
    table.style.width = '100%';
    table.setAttribute('border', '1');
    
    const headerRow = table.insertRow();
    const headers = ['Variables', 'Terminales', 'Producciones'];
    headers.forEach(header => {
        const cell = document.createElement('th');
        cell.appendChild(document.createTextNode(header));
        headerRow.appendChild(cell);
    });

    grammar.forEach(rule => {
        rule.productions.forEach((production, index) => {
            const row = table.insertRow();
            row.insertCell().appendChild(document.createTextNode(rule.variable));
            
            if (index < rule.terminals.length) {
                row.insertCell().appendChild(document.createTextNode(rule.terminals[index]));
            } else {
                row.insertCell().appendChild(document.createTextNode(''));
            }

            row.insertCell().appendChild(document.createTextNode(production));
        });
    });

    const fileContent = document.getElementById('fileContent');
    fileContent.innerHTML = '';
    fileContent.appendChild(table);
}

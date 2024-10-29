class Matrix {
    constructor(containerSelector, cols, rows, cellSize, offset) {
        this.container = document.querySelector(containerSelector);
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        this.offset = offset;

        // Initialiser le tableau 2D pour stocker les valeurs des cellules
        this.cellValues = Array.from({ length: rows }, () => Array(cols).fill(""));
        this.expansionLevel = 1;

        this.init();
    }

    init() {
        this.createGrid();
        this.addExpandCollapseButtons();
        this.addEventListeners();
    }

    createGrid() {
        this.container.innerHTML = ''; // Réinitialiser le conteneur
        this.container.style.gridTemplateColumns = `repeat(${this.cols + 1}, ${this.cellSize}px)`; // Ajuste pour inclure l'en-tête
        this.container.style.gridTemplateRows = `repeat(${this.rows + 1}, ${this.cellSize}px)`; // Ajuste pour inclure l'en-tête

        // Créer les en-têtes de colonne
        for (let colIndex = 0; colIndex <= this.cols; colIndex++) {
            const header = document.createElement("div");
            header.classList.add("grid-cell", "header");
            header.textContent = colIndex > 0 ? colIndex : ''; // Ne pas afficher de texte pour la première case
            this.container.appendChild(header);
        }

        // Créer les cellules de la grille
        for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            const rowHeader = document.createElement("div");
            rowHeader.classList.add("grid-cell", "header");
            rowHeader.textContent = rowIndex + 1; // Afficher le numéro de la ligne
            this.container.appendChild(rowHeader);

            for (let colIndex = 0; colIndex < this.cols; colIndex++) {
                const cell = document.createElement("div");
                cell.classList.add("grid-cell");
                cell.dataset.row = rowIndex;
                cell.dataset.col = colIndex;
                cell.textContent = this.cellValues[rowIndex][colIndex];
                this.container.appendChild(cell);
            }
        }
    }

    addEventListeners() {
        this.container.addEventListener("mousemove", (event) => this.handleMouseMove(event));
        this.container.addEventListener("dblclick", (event) => this.handleDoubleClick(event));
    }

    handleMouseMove(event) {
        const cell = event.target;
        if (cell.classList.contains("grid-cell") && !cell.classList.contains("header")) {
            const row = cell.dataset.row;
            const col = cell.dataset.col;
            this.highlightCells(row, col);
            this.showTooltip(row, col, cell); // Affiche le tooltip en utilisant la cellule
        } else {
            this.clearHighlights();
            this.hideTooltip(); // Cache le tooltip
        }
    }

    handleDoubleClick(event) {
        const cell = event.target;
        if (cell.classList.contains("grid-cell") && !cell.classList.contains("header")) {
            const row = cell.dataset.row;
            const col = cell.dataset.col;
            this.showInputBox(row, col);
        }
    }

    highlightCells(row, col) {
        this.clearHighlights();
        const cells = this.container.querySelectorAll(".grid-cell");
        cells.forEach(cell => {
            const cellRow = cell.dataset.row;
            const cellCol = cell.dataset.col;
            if (cellRow === row || cellCol === col) {
                cell.classList.add("highlight");
            }
            if (cellRow === row && cellCol === col) {
                cell.style.border = "1px solid white";
            }
        });
    }

    clearHighlights() {
        const cells = this.container.querySelectorAll(".grid-cell");
        cells.forEach(cell => {
            cell.classList.remove("highlight");
            cell.style.border = ""; // Reset border style
        });
    }

    showInputBox(row, col) {
        const input = document.createElement("input");
        input.type = "number";
        input.className = "input-box";
        input.style.position = "absolute";
        input.style.left = `${this.offset + col * this.cellSize + 3}px`;
        input.style.top = `${this.offset + row * this.cellSize + 70}px`;
        input.style.width = `${this.cellSize}px`;
        input.style.fontSize = "14px";
        input.style.textAlign = "center";

        document.body.appendChild(input);
        input.focus();

        input.addEventListener("blur", () => {
            const value = input.value;
            if (value !== "") {
                this.updateCellText(row, col, value);
            }
            document.body.removeChild(input);
        });
    }

    updateCellText(row, col, text) {
        this.cellValues[row][col] = text;
        this.createGrid();
    }

    showTooltip(row, col, cell) {
        // Créez un élément tooltip pour afficher le texte
        let tooltip = document.getElementById("tooltip");
        if (!tooltip) {
            tooltip = document.createElement("div");
            tooltip.id = "tooltip";
            tooltip.style.position = "absolute"; 
            document.body.appendChild(tooltip);
        }

        // Calculer la position de la cellule
        const rect = cell.getBoundingClientRect();
        const tooltipOffset = 10; // Décalage pour éviter que le tooltip soit collé à la cellule

        tooltip.innerHTML = `
            <div style="color: yellow; transform: rotate(-90deg); position: absolute; top: -60px; left: -12px; white-space: nowrap;">
            Colonne ${parseInt(col) + 1}
            </div>
            <div style="color: yellow; position: absolute; top: 10px; left: -64px; white-space: nowrap;">
            Ligne ${parseInt(row) + 1}
            </div>
        `;
        tooltip.style.left = `${rect.left + window.scrollX - tooltip.offsetWidth - tooltipOffset}px`; // Position à gauche de la cellule
        tooltip.style.top = `${rect.top + window.scrollY}px`; // Position au même niveau que la cellule
        tooltip.style.display = "block";
    }

    hideTooltip() {
        const tooltip = document.getElementById("tooltip");
        if (tooltip) {
            tooltip.style.display = "none";
        }
    }

    addExpandCollapseButtons() {
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";
        document.body.appendChild(buttonContainer);

        const expandButton = document.createElement("button");
        expandButton.innerHTML = "+";
        buttonContainer.appendChild(expandButton);

        const collapseButton = document.createElement("button");
        collapseButton.innerHTML = "-";
        buttonContainer.appendChild(collapseButton);

        expandButton.addEventListener("click", () => this.expandGrid());
        collapseButton.addEventListener("click", () => this.collapseGrid());
    }

    expandGrid() {
        this.expansionLevel++;
        this.cols = 16 * this.expansionLevel;
        this.rows = 16 * this.expansionLevel;
        this.cellValues = Array.from({ length: this.rows }, (_, i) =>
            Array.from({ length: this.cols }, (_, j) =>
                this.cellValues[i] && this.cellValues[i][j] !== undefined
                    ? this.cellValues[i][j]
                    : ""
            )
        );

        this.createGrid();
    }

    collapseGrid() {
        if (this.expansionLevel > 1) {
            this.expansionLevel--;
            this.cols = 16 * this.expansionLevel;
            this.rows = 16 * this.expansionLevel;
            this.cellValues = this.cellValues
                .slice(0, this.rows)
                .map((row) => row.slice(0, this.cols));
            this.createGrid();
        }
    }
}

function createMatrix() {
    return new Matrix("#mixerWindow", 16, 16, 34, 70);
}

createMatrix();

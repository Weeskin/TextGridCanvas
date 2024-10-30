
class Matrix {
	constructor(containerSelector, cols, rows, cellSize, offset) {
		this.container = document.querySelector(containerSelector);
		this.cols = cols;
		this.rows = rows;
		this.cellSize = cellSize;
		this.offset = offset;
		this.matrixMixerDiv = document.getElementById("matrixMixer");
		this.headerSize = 4;
		this.startCell = null; // La première cellule sélectionnée
        this.endCell = null;   // La dernière cellule sélectionnée
        this.isSelecting = false; // Indique si une sélection est en cours

		// Initialiser le tableau 2D pour stocker les valeurs des cellules
		this.cellValues = Array.from({ length: rows }, () => Array(cols).fill(""));
		this.expansionLevel = 1;

		this.init();
	}

	init() {
		this.createGrid();
		this.addEventListeners();
	}

	createGrid() {
		this.container.innerHTML = ""; // Réinitialiser le conteneur
		this.container.style.display = 'grid';
	
		const headerWidth = this.cellSize * 4; // Largeur de l'en-tête de ligne
		const headerHeight = this.cellSize * 4; // Hauteur de l'en-tête de colonne
	
		this.container.style.gridTemplateColumns = `${headerWidth}px repeat(${this.cols}, ${this.cellSize}px)`; 
		this.container.style.gridTemplateRows = `${headerHeight}px repeat(${this.rows}, ${this.cellSize}px)`;
	
		// Créer les en-têtes de colonne
		for (let colIndex = 0; colIndex <= this.cols; colIndex++) {
			const header = document.createElement("div");
			header.classList.add("header", "column-header");
	
			if (colIndex > 0) {
				const headerContent = document.createElement("div");
				headerContent.textContent = `Mixer ${colIndex}`;
				headerContent.style.transform = "rotate(-90deg)";
				// Centrer le contenu
				headerContent.style.display = 'flex';
				headerContent.style.alignItems = 'center';
				headerContent.style.justifyContent = 'center';
				header.appendChild(headerContent);
			
				header.style.border = `1px solid ${this.color}`;
				header.style.display = 'flex';
				header.style.alignItems = 'center';
				header.style.justifyContent = 'center';
			} else {
				header.textContent = ""; // Ne pas afficher de texte pour la première case
			}
			this.container.appendChild(header);
		}
	
		// Créer les cellules de la grille
		for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
			const rowHeader = document.createElement("div");
			rowHeader.classList.add("header", "row-header");
			rowHeader.textContent = `Output ${rowIndex + 1}`; // Afficher le numéro de la ligne
			rowHeader.style.border = `1px solid ${this.color}`;
			// Utiliser flexbox pour centrer le contenu
			rowHeader.style.display = 'flex';
			rowHeader.style.alignItems = 'center';
			rowHeader.style.justifyContent = 'center';
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
		
		this.updateHeaders();
	}

	addEventListeners() {
		this.container.addEventListener("mousedown", (event) => this.handleMouseDown(event));
		this.container.addEventListener("mouseup", (event) => this.handleMouseUp(event));
		this.container.addEventListener("mousemove", (event) =>	this.handleMouseMove(event));
		this.container.addEventListener("click", (event) => this.handleClick(event));
		this.container.addEventListener("dblclick", (event) => this.handleDoubleClick(event));
		this.container.addEventListener("mouseleave", (event) => this.handleMouseLeave(event));
	}

	handleMouseDown(event) {
        const cell = event.target;
        if (cell.classList.contains("grid-cell")) {
            this.isSelecting = true;
            this.startCell = { row: parseInt(cell.dataset.row), col: parseInt(cell.dataset.col) };
        }
    }
	
	handleMouseMove(event) {
		const cell = event.target;
		if (cell.classList.contains("grid-cell")) {
			const row = cell.dataset.row;
			const col = cell.dataset.col;
			this.crosshair(row, col);
			this.showTooltip(row, col, cell);
		} else {
			this.clearCrosshair();
			this.hideTooltip();
		}

		if (this.isSelecting) {
			const cell = event.target;
			if (cell.classList.contains("grid-cell")) {
				this.endCell = { row: parseInt(cell.dataset.row), col: parseInt(cell.dataset.col) };

				// Réinitialiser les surbrillances
				this.clearHighlights();

				// Calculer les bornes de sélection en prenant en compte le décalage
				const rowBegin = Math.min(this.startCell.row, this.endCell.row) - this.headerSize;
				const colBegin = Math.min(this.startCell.col, this.endCell.col) - this.headerSize;
				const rowEnd = Math.max(this.startCell.row, this.endCell.row) - this.headerSize;
				const colEnd = Math.max(this.startCell.col, this.endCell.col) - this.headerSize;

				// Appliquer la surbrillance aux cellules sélectionnées
				this.highlightCells(rowBegin, colBegin, rowEnd, colEnd);
			}
		}
	}
	
	handleMouseUp(event) {
        if (this.isSelecting) {
            this.isSelecting = false;
            if (this.startCell && this.endCell) {
                const rowBegin = Math.min(this.startCell.row, this.endCell.row) - this.headerSize;
                const colBegin = Math.min(this.startCell.col, this.endCell.col) - this.headerSize;
                const rowEnd = Math.max(this.startCell.row, this.endCell.row) - this.headerSize;
                const colEnd = Math.max(this.startCell.col, this.endCell.col) - this.headerSize;

                if (rowBegin >= 0 && colBegin >= 0) {
                    this.createFrame(rowBegin, colBegin, rowEnd, colEnd);
                }
            }
        }
    }

	handleClick(event) {
        const cell = event.target;
        if (cell.classList.contains("grid-cell") && !this.isSelecting) {
            const row = cell.dataset.row - this.headerSize;
            const col = cell.dataset.col - this.headerSize;

            if (row >= 0 && col >= 0) {
                this.createFrame(row, col, row, col);
            }
        }
    }
	
	handleDoubleClick(event) {
		const cell = event.target;
		if (
			cell.classList.contains("grid-cell") &&
			!cell.classList.contains("header")
		) {
			const row = cell.dataset.row;
			const col = cell.dataset.col;
			this.showInputBox(row, col);
		}
	}

	handleMouseLeave(event) {
		const cell = event.target;
		if (
			cell.classList.contains("grid-cell") 
		) {
			const row = cell.dataset.row;
			const col = cell.dataset.col;
			this.showInputBox(row, col);
		}
	}

	// Méthode pour appliquer la surbrillance aux cellules sélectionnées
    highlightCells(rowBegin, colBegin, rowEnd, colEnd) {
        const cells = this.container.querySelectorAll(".grid-cell");

        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row) - this.headerSize;
            const col = parseInt(cell.dataset.col) - this.headerSize;

            if (row >= rowBegin && row <= rowEnd && col >= colBegin && col <= colEnd) {
                cell.classList.add("highlight");
            }
        });
    }

    // Méthode pour réinitialiser la surbrillance
    clearHighlights() {
        const cells = this.container.querySelectorAll(".grid-cell");
        cells.forEach(cell => {
            cell.classList.remove("highlight");
        });
    }

	crosshair(row, col) {
		this.clearCrosshair();
		const cells = this.container.querySelectorAll(".grid-cell");
		const rowHeaders = this.container.querySelectorAll("row-header");
		const colHeaders = this.container.querySelectorAll("column-header");

		cells.forEach((cell) => {
			const cellRow = cell.dataset.row;
			const cellCol = cell.dataset.col;
			if (cellRow === row || cellCol === col) {
				cell.classList.add("highlight");
			}
			if (cellRow === row && cellCol === col) {
				cell.style.border = "1px solid white";
			}
		});

		rowHeaders.forEach((header) => {
			const headerRow = header.dataset.row;
			if (headerRow === row) {
				header.classList.add("highlight")
			}
		});
		
		colHeaders.forEach((header) => {
			const headerCol = header.dataset.row;
			if (headerCol === col) {
				header.classList.add("highlight")
			}
		});

	}

	clearCrosshair() {
		const cells = this.container.querySelectorAll(".grid-cell");
		const rowHeaders = this.container.querySelectorAll(".row-header");
		const colHeaders = this.container.querySelectorAll(".column-header");

		cells.forEach((cell) => {
			cell.classList.remove("highlight");
			cell.style.border = ""; // Reset border style
		});

		rowHeaders.forEach((header) => {
			header.classList.remove("highlight");
		});
	
		colHeaders.forEach((header) => {
			header.classList.remove("highlight");
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
		// Créer ou récupérer le tooltip
		let tooltip = document.getElementById("tooltip");
		if (!tooltip) {
			tooltip = document.createElement("div");
			tooltip.id = "tooltip";
			tooltip.style.position = "absolute";
			this.matrixMixerDiv.appendChild(tooltip);
		}
			
		// Masquer temporairement le tooltip pour éviter qu'il influence le calcul des positions
		tooltip.style.display = "none";
		
		// Calculer la position de la cellule
		const rect = cell.getBoundingClientRect();
		const tooltipOffset = 10; // Décalage pour éviter que le tooltip soit collé à la cellule
	
		// Numéros de mixer et output
		const mixerNumber = parseInt(col) + 1;
		const outputNumber = parseInt(row) + 1;
	
		// Mettre à jour le contenu du tooltip
		tooltip.innerHTML = `
			<div class="mixerTooltip" style="color: yellow; transform: rotate(-90deg); position: absolute; top: ${- this.cellSize - 5}px; left: ${this.cellSize * 4 - 5}px; white-space: nowrap;">
				Mixer ${mixerNumber}
			</div>
			<div class="outputTooltip" style="color: yellow; position: absolute; left: ${this.cellSize*2 + 5 }px; top: ${this.cellSize - 20}px; white-space: nowrap;">
				Output ${outputNumber}
			</div>
		`;
	
		// Ajuster le décalage horizontal en fonction de la longueur du numéro de mixer
		const mixerNumberLength = mixerNumber.toString().length;
		const additionalOffset = (mixerNumberLength - 1) * 5; 
	
		// Positionner le tooltip
		tooltip.style.left = `${rect.left + window.scrollX - (this.cellSize * 4) - tooltipOffset - additionalOffset}px`;
		tooltip.style.top = `${rect.top + window.scrollY - (this.cellSize * 3) + tooltipOffset}px`;

		// Vérifier si le tooltip est trop proche du bord supérieur
		const isTooCloseToTop = rect.top < this.cellSize * 9 + tooltipOffset;

		// Vérifier si le tooltip est trop proche du bord gauche
		const isTooCloseToLeft = rect.left < this.cellSize * 7 + tooltipOffset + additionalOffset;

		// Si trop proche du bord supérieur et gauche, masquer les deux divs
		if (isTooCloseToTop && isTooCloseToLeft) {
			tooltip.querySelector('.mixerTooltip').style.display = 'none';
			tooltip.querySelector('.outputTooltip').style.display = 'none';
		} else {
			// Sinon, vérifier individuellement
			if (isTooCloseToTop) {
				tooltip.querySelector('.mixerTooltip').style.display = 'none';
			}
			if (isTooCloseToLeft) {
				tooltip.querySelector('.outputTooltip').style.display = 'none';
			}
		}

		// Afficher le tooltip
		tooltip.style.display = "block";
	}

	hideTooltip() {
		const tooltip = document.getElementById("tooltip");
		if (tooltip) {
			tooltip.style.display = "none";
		}
	}

	createFrame(rowBegin, colBegin, rowEnd, colEnd) {
		// Supprimer le cadre existant
		const existingFrame = document.querySelector('.selection-frame');
		if (existingFrame) {
			existingFrame.remove();
		}
	
		// Créer un nouveau cadre
		const frame = document.createElement("div");
		frame.className = "selection-frame";
		frame.style.position = "absolute";
		frame.style.border = "2px solid white";
		
		// Positionner le cadre autour des cellules sélectionnées
		const top = rowBegin * this.cellSize;
		const left = colBegin * this.cellSize;
		const height = (rowEnd - rowBegin + 1) * this.cellSize;
		const width = (colEnd - colBegin + 1) * this.cellSize;
	
		frame.style.top = `${top}px`;
		frame.style.left = `${left}px`;
		frame.style.height = `${height}px`;
		frame.style.width = `${width}px`;
	
		// Ajouter le cadre au conteneur
		this.container.appendChild(frame);
	
		// Ajouter les boutons + et - aux extrémités du cadre
		this.addExpandCollapseButtons(frame, top, left, width, height);
	}

	addExpandCollapseButtons(frame, top, left, width, height) {		
		// Ajouter le bouton +
		const plusButton = document.createElement("button");
		plusButton.textContent = "+";
		plusButton.className = "expand-btn";
		plusButton.style.position = "absolute";
		plusButton.style.top = `${top - 20}px`; // Positionner au-dessus du cadre
		plusButton.style.left = `${left + width - 20}px`; // À l'extrémité droite
		plusButton.addEventListener("click", () => this.expandGrid());
		frame.appendChild(plusButton);
	
		// Ajouter le bouton -
		const minusButton = document.createElement("button");
		minusButton.textContent = "-";
		minusButton.className = "collapse-btn";
		minusButton.style.position = "absolute";
		minusButton.style.top = `${top + height}px`; // En dessous du cadre
		minusButton.style.left = `${left}px`; // À l'extrémité gauche
		minusButton.addEventListener("click", () => this.collapseGrid());
		frame.appendChild(minusButton);
	}

	updateHeaders() {
		const activeCols = this.cellValues[0].filter(cell => cell !== null).length;
		const activeRows = this.cellValues.filter(row => row[0] !== null).length;
	
		if (activeCols === 1 && activeRows === 1) {
			this.columnHeaders = Array.from({ length: 16 }, (_, i) => `mixer 1 - 16`);
			this.rowHeaders = Array.from({ length: 16 }, (_, i) => `output 1 - 16`);
		} else {
			this.columnHeaders = Array.from({ length: this.cols }, (_, i) => `Col ${i + 1}`);
			this.rowHeaders = Array.from({ length: this.rows }, (_, i) => `Row ${i + 1}`);
		}
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
		this.init();
	}


	collapseGrid() {
		if (this.expansionLevel > 0) {
			this.expansionLevel--;
			if (this.expansionLevel > 0) {
				this.cols = 16 * this.expansionLevel;
				this.rows = 16 * this.expansionLevel;
			} else {
				this.cols = 1;
				this.rows = 1;
			}
			this.cellValues = Array.from({ length: this.rows }, (_, i) =>
				Array.from({ length: this.cols }, (_, j) =>
					this.cellValues[i] && this.cellValues[i][j] !== undefined
						? this.cellValues[i][j]
						: null
				)
			);
			this.createGrid(); 
			this.addExpandCollapseButtons()
		}
	}
}

function createMatrix() {
	return new Matrix("#matrixMixer", 16, 16, 34, 70);
}

createMatrix();

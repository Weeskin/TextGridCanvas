class Matrix {
    constructor(canvasSelector, cols, rows, cellSize, offset) {
        this.canvas = document.querySelector(canvasSelector);
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext('2d');
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        this.offset = offset;

        // Initialiser le tableau 2D pour stocker les valeurs des cellules
        this.cellValues = Array.from({ length: rows }, () => Array(cols).fill(''));

        // Initialiser le niveau d'expansion
        this.expansionLevel = 1;

        this.init();
    }

    init() {
        this.canvas.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        this.canvas.addEventListener('dblclick', (event) => this.handleDoubleClick(event));
        this.drawGrid();
        this.addExpandCollapseButtons();
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const col = Math.floor((x - this.offset) / this.cellSize);
        const row = Math.floor((y - this.offset) / this.cellSize);

        // Vérifier que les coordonnées de la cellule survolée sont dans les limites de la grille
        if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
            this.drawGrid(row, col);
        } else {
            this.drawGrid();
        }
    }

    handleDoubleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const col = Math.floor((x - this.offset) / this.cellSize);
        const row = Math.floor((y - this.offset) / this.cellSize);

        if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
            this.showInputBox(row, col);
        }
    }

    showInputBox(row, col) {
        const input = document.createElement('input');
        input.type = 'number';
        input.style.position = 'absolute';
        input.style.left = `${this.offset + col * this.cellSize}px`;
        input.style.top = `${this.offset + row * this.cellSize}px`;
        input.style.width = `${this.cellSize}px`;
        input.style.height = `${this.cellSize}px`;
        input.style.fontSize = '14px';
        input.style.textAlign = 'center';

        document.body.appendChild(input);
        input.focus();

        input.addEventListener('blur', () => {
            const value = input.value;
            if (value !== '') {
                this.updateCellText(row, col, value);
            }
            document.body.removeChild(input);
        });
    }

    updateCellText(row, col, text) {
        // Enregistrer la valeur dans le tableau 2D
        this.cellValues[row][col] = text;
        this.drawGrid();
    }

    drawGrid(highlightRow = -1, highlightCol = -1) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#292929';
        this.ctx.fillRect(0, 0, this.width, this.height);
    
        // Dessiner les cellules surlignées
        for (let i = 0; i <= this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (i === highlightRow || j === highlightCol) {
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.20)';
                    this.ctx.fillRect(this.offset + j * this.cellSize, this.offset + i * this.cellSize, this.cellSize, this.cellSize);
                }
            }
        }
    
        // Dessiner les lignes de la grille et les valeurs des cellules
        for (let i = 0; i <= this.rows; i++) {
            for (let j = 0; j <= this.cols; j++) {
                this.ctx.strokeStyle = "#ffffff22";
                this.ctx.strokeRect(this.offset + j * this.cellSize, this.offset + i * this.cellSize, this.cellSize, this.cellSize);

                // Dessiner les valeurs des cellules
                if (this.cellValues[i] && this.cellValues[i][j] !== undefined && this.cellValues[i][j] !== '') {
                    this.ctx.fillStyle = 'white';
                    this.ctx.font = '14px Arial';
                    this.ctx.fillText(this.cellValues[i][j], this.offset + j * this.cellSize + 5, this.offset + i * this.cellSize + 16);
                }
            }
        }

        // Dessiner les entêtes des colonnes et des lignes
        for (let i = 0; i <= this.rows; i++) {
            for (let j = 0; j <= this.cols; j++) {
                if (i === 0 && j > 0) {
                    this.ctx.save();
                    this.ctx.translate(this.offset + j * this.cellSize - 10, this.offset - 5);
                    this.ctx.rotate(-Math.PI / 2);
                    this.ctx.fillStyle = 'white';
                    this.ctx.font = '14px Arial'; 
                    this.ctx.fillText(`Mixer ${j}`, 5, 0);
                    this.ctx.restore();
                }
                if (j === 0 && i > 0) {
                    this.ctx.fillStyle = 'white';
                    this.ctx.font = '14px Arial'; 
                    this.ctx.fillText(`Out ${i}`, this.offset - 55, this.offset + i * this.cellSize - 10);
                }
            }
        }

        if (highlightRow >= 0 && highlightCol >= 0) {
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(this.offset + highlightCol * this.cellSize, this.offset + highlightRow * this.cellSize, this.cellSize, this.cellSize);
            this.ctx.lineWidth = 1;

            const textMargin = 125; // Marge pour éviter les bords
            const textWidth = 50; // Largeur approximative du texte
            const textHeight = 20; // Hauteur approximative du texte
        
            const textX = this.offset + highlightCol * this.cellSize - textWidth;
            const textY = this.offset + highlightRow * this.cellSize + textHeight;
            const rotatedTextX = this.offset + highlightCol * this.cellSize;
            const rotatedTextY = this.offset + highlightRow * this.cellSize - textHeight;
        
            // Vérifier si la position de la souris est trop proche des bords haut et gauche
            const isNearLeftEdge = textX < textMargin;
            const isNearTopEdge = rotatedTextY < textMargin;
            this.ctx.fillStyle = 'yellow';
            this.ctx.font = '14px Arial';
        
            if (!isNearLeftEdge) {
                // Dessiner le texte "Ligne" à la gauche de la souris
                this.ctx.fillText(`Out ${highlightRow + 1}`, textX, textY);
            }
        
            if (!isNearTopEdge) {
                // Sauvegarder le contexte avant de le tourner
                this.ctx.save();
        
                // Déplacer le contexte au point où le texte "Colonne" doit être dessiné
                this.ctx.translate(rotatedTextX, rotatedTextY);
                this.ctx.rotate(-Math.PI / 2);
                this.ctx.fillText(`Mixer ${highlightCol + 1}`, 0, textHeight);
        
                // Restaurer le contexte à son état original
                this.ctx.restore();
            }        
        }
    }

    addExpandCollapseButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'buttonContainer';
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.left = `${this.offset - 34}px`;
        buttonContainer.style.top = `${this.offset - this.cellSize}px`;
        document.body.appendChild(buttonContainer);

        const expandButton = document.createElement('button');
        expandButton.id = 'expandButton';
        expandButton.innerHTML = '+';
        buttonContainer.appendChild(expandButton);

        const collapseButton = document.createElement('button');
        collapseButton.id = 'collapseButton';
        collapseButton.innerHTML = '-';
        buttonContainer.appendChild(collapseButton);

        expandButton.addEventListener('click', () => this.expandGrid());
        collapseButton.addEventListener('click', () => this.collapseGrid());
    }

    expandGrid() {
        this.expansionLevel++;
        this.cols = 16 * this.expansionLevel;
        this.rows = 16 * this.expansionLevel;
        this.cellValues = Array.from({ length: this.rows }, (_, i) => 
            Array.from({ length: this.cols }, (_, j) => (this.cellValues[i] && this.cellValues[i][j] !== undefined) ? this.cellValues[i][j] : '')
        );
        this.drawGrid();
    }

    collapseGrid() {
        if (this.expansionLevel > 1) {
            this.expansionLevel--;
            this.cols = 16 * this.expansionLevel;
            this.rows = 16 * this.expansionLevel;
            this.cellValues = this.cellValues.slice(0, this.rows).map(row => row.slice(0, this.cols));
            this.drawGrid();
        }
    }
}

const matrix = new Matrix('.myCanvas', 16, 16, 34, 70);
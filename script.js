class gridMatrix {
    color;
    constructor(p_containerSelector, p_numColumns, p_numRows, p_cellSize) {
        this.m_matrixMixer = document.querySelector(p_containerSelector);
        this.m_cellSize = p_cellSize;
        this.m_AudioWay = 0;
        this.m_isSelecting = false;
        this.m_isDragging = false;
        this.m_isSpacePressed = false;
        this.m_cols = p_numColumns;
        this.m_masterColumnsHeaders = [
            { name: "AES67", m_colIntervals: ['1-8', '9-16', '17-24', '25-32', '33-40', '41-48', '49-56', '57-64'] },
            // {name: "FLX2" , m_colIntervals :['1-8', '9-16', '17-24', '25-32', '33-40', '41-48', '49-56', '57-64'] },
            // {name: "MADI" , m_colIntervals :['1-8', '9-16', '17-24', '25-32', '33-40', '41-48', '49-56', '57-64'] }
        ]
        this.m_columnHeaders = [];
        this.m_rows = p_numRows;
        this.m_masterRowHeaders = [
            { name: "DANTE", m_rowIntervals: ['1-8', '9-16', '17-24', '25-32', '33-40', '41-48', '49-56', '57-64'] },
            // { name: "MADI", m_rowIntervals: ['1-8', '9-16', '17-24', '25-32', '33-40', '41-48', '49-56', '57-64'] },
            // { name: "FLX1", m_rowIntervals: ['1-8', '9-16', '17-24', '25-32', '33-40', '41-48', '49-56', '57-64'] }
        ];
        this.m_rowHeaders = [];
        this.m_cellValues = "";
        this.m_expansionLevel = 3;

        this.isHideColVisible = false
        this.isHideRowVisible = false

        this.init();
    }

    init() {
        this.createGrid();
        this.addEventListeners();
    }

    createGrid(p_expansion_lvl) {
        try {
            this.m_matrixMixer.innerHTML = "";
            this.m_matrixMixer.style.padding = "15px";

            // Buttons Container
            this.addExpandCollapseButtons();

            // Grid Container
            this.l_MatrixContainer = document.createElement("div");
            this.l_MatrixContainer.classList.add("matrixContainer");
            this.l_MatrixContainer.style.width = "fit-content";
            this.l_MatrixContainer.style.height = "fit-content";
            this.l_MatrixContainer.style.display = "grid";
            this.l_MatrixContainer.style.gridTemplateColumns = "auto auto";
            this.l_MatrixContainer.style.gridTemplateRows = "auto auto";

            this.m_matrixMixer.appendChild(this.l_MatrixContainer);

            // Empty Container
            this.createEmptyContainer();

            // Column Headers
            this.createColumnHeaders(p_expansion_lvl);

            // Row Headers
            this.createRowHeaders(p_expansion_lvl);

            // Grid Cells
            this.createGridCell(p_expansion_lvl);

        } catch (error) {
            console.error(`Erreur lors de l'exécution de createGrid : ${error}`);
        }
    }

    createEmptyContainer() {
        try {
            this.l_emptyContainer = document.createElement("div");
            this.l_emptyContainer.classList.add("gridContainer1", "emptyContainer", "header");
            this.l_emptyContainer.innerText = "New Grid";
            this.l_emptyContainer.style.borderTop = "1px solid #ffffff21";
            this.l_emptyContainer.style.borderLeft = "2px solid #ffffff21";
            this.l_emptyContainer.style.borderBottom = "2px solid #ffffff21";
            this.l_emptyContainer.style.borderLeft = "1px solid #ffffff21";
            this.l_emptyContainer.style.borderTopLeftRadius = "5px";
            this.l_emptyContainer.style.display = "flex";
            this.l_emptyContainer.style.justifyContent = "center";
            this.l_emptyContainer.style.alignItems = "center";
            this.l_MatrixContainer.appendChild(this.l_emptyContainer);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de createEmptyContainer : ${error}`);
        }
    }

    createColumnHeaders(p_expansion_lvl) {
        try {
            let cols = this.m_cols;
            if (p_expansion_lvl === 2) {
                cols = Math.ceil(this.m_cols / 8);
            } else if (p_expansion_lvl === 1) {
                cols = Math.ceil(this.m_cols / 64);
            }

            this.l_columnHeadersContainer = document.createElement("div");
            this.l_columnHeadersContainer.classList.add("gridContainer2", "columnHeaders");
            this.l_columnHeadersContainer.style.display = "grid";
            this.l_columnHeadersContainer.style.gridTemplateColumns = `repeat(${cols}, auto)`;

            this.m_masterColumnsHeaders.forEach((header) => {
                // colHeaders1
                this.l_colHeader1 = document.createElement('div');
                this.l_colHeader1.innerText = header.name;
                this.l_colHeader1.classList.add("header", "colHeader1");
                this.l_colHeader1.style.borderTop = "4px solid darkgreen";
                this.l_colHeader1.style.borderLeft = "2px solid #ffffff21";
                this.l_colHeader1.style.gridColumn = `span ${cols}`;
                this.l_colHeader1.style.height = `${this.m_cellSize * 5}px`;
                this.l_colHeader1.style.textAlign = 'left';
                this.l_colHeader1.style.verticalAlign = 'top';
                this.l_colHeader1.style.padding = "5px 0px 0px 5px";
                this.l_columnHeadersContainer.appendChild(this.l_colHeader1);

                header.m_colIntervals.forEach((colInterval, colIntervalIndex) => {
                    // colHeaders2
                    const l_colHeader2Content = document.createElement("div");
                    l_colHeader2Content.textContent = `${colInterval}`;
                    l_colHeader2Content.style.transform = "rotate(-90deg)";
                    l_colHeader2Content.style.position = "absolute";
                    l_colHeader2Content.style.top = "12px";
                    l_colHeader2Content.style.left = "0";

                    this.l_colHeader2 = document.createElement("div");
                    this.l_colHeader2.classList.add("header", "colHeader2");
                    this.l_colHeader2.style.gridColumn = `span ${cols / 8}`;
                    this.l_colHeader2.style.height = `${this.m_cellSize * 3}px`;
                    this.l_colHeader2.style.borderRight = "2px solid #ffffff21";
                    this.l_colHeader2.style.position = "relative";
                    this.l_colHeader2.style.textAlign = "right";
                    this.l_colHeader2.style.verticalAlign = "top";
                    this.l_colHeader2.style.padding = "5px";
                    this.l_colHeader2.setAttribute('data-col-interval-index', `${colIntervalIndex}`);
                    this.l_colHeader2.appendChild(l_colHeader2Content);
                    this.l_columnHeadersContainer.appendChild(this.l_colHeader2);

                    this.addMinusPlusBtn(this.l_colHeader2);
                });

                // colHeaders3
                for (let colIndex = 1; colIndex <= this.m_cols; colIndex++) {
                    const colIntervalIndex = Math.floor((colIndex - 1) / 8);

                    const l_colHeader3Content = document.createElement("div")
                    l_colHeader3Content.textContent = `${colIndex}`;
                    l_colHeader3Content.style.transform = "rotate(-90deg)";
                    l_colHeader3Content.style.position = "absolute";
                    l_colHeader3Content.style.textAlign = "center";
                    l_colHeader3Content.style.padding = "2px 2px"

                    this.l_colHeader3 = document.createElement("div");
                    this.l_colHeader3.classList.add("header", "colHeader3");
                    this.l_colHeader3.style.height = `${this.m_cellSize}px`;
                    this.l_colHeader3.style.width = `${this.m_cellSize}px`;
                    this.l_colHeader3.style.position = "relative";
                    this.l_colHeader3.setAttribute('data-interval-index', `${colIntervalIndex}`);
                    this.l_colHeader3.appendChild(l_colHeader3Content)
                    this.l_columnHeadersContainer.appendChild(this.l_colHeader3);

                    //hideColHeader3
                    if (colIndex % 8 === 0) {
                        this.l_colHeader3.style.borderRight = "2px solid #ffffff21";
                        const l_hideColHeader3Content = document.createElement("div");
                        l_hideColHeader3Content.textContent = `${colIndex/ 8}`;
                        l_hideColHeader3Content.style.transform = "rotate(-90deg)";
                        l_hideColHeader3Content.style.position = "absolute";
                        l_hideColHeader3Content.style.top = "14%";
                        l_hideColHeader3Content.style.left = "48%";

                        this.l_hideColHeader3 = document.createElement("div");
                        this.l_hideColHeader3.classList.add("header", "hideColHeader3","hidden");
                        this.l_hideColHeader3.style.position = "relative";
                        this.l_hideColHeader3.style.height = `${this.m_cellSize}px`;
                        this.l_hideColHeader3.style.gridColumn = `span 1`;
                        this.l_hideColHeader3.style.borderRight = "2px solid #ffffff21";
                        this.l_hideColHeader3.setAttribute('data-interval-index', `${colIntervalIndex}`);
                        this.l_hideColHeader3.appendChild(l_hideColHeader3Content)
                        this.l_columnHeadersContainer.appendChild(this.l_hideColHeader3);
                    }

                    if (colIndex >= 1 && colIndex <= 9) {
                        l_colHeader3Content.style.padding = "0px 6px"
                    }

                    if (p_expansion_lvl === 2) {
                        this.l_colHeader3.classList.remove("flex");
                        this.l_colHeader3.classList.add("hidden");
                        this.l_hideColHeader3.classList.remove("hidden");
                        this.l_hideColHeader3.classList.add("flex");
                    } else if (p_expansion_lvl === 1) {
                        this.l_colHeader2.style.display = "none";
                        this.l_colHeader3.style.display = "none";
                        this.l_hideColHeader3.classList.remove("flex");
                        this.l_hideColHeader3.classList.add("hidden");
                    }
                }
            });
            this.l_MatrixContainer.appendChild(this.l_columnHeadersContainer);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de createColumnHeaders : ${error}`);
        }
    }

    createRowHeaders(p_expansion_lvl) {
        try {
            let rows = this.m_rows;
            if (p_expansion_lvl === 2) {
                rows = Math.ceil(this.m_rows / 8);
            } else if (p_expansion_lvl === 1) {
                rows = Math.ceil(this.m_rows / 64);
            }

            this.l_rowHeadersContainer = document.createElement("div");
            this.l_rowHeadersContainer.classList.add("gridContainer3", "rowHeaders");
            this.l_rowHeadersContainer.style.display = "grid";
            this.l_rowHeadersContainer.style.gridTemplateColumns = "repeat(3, max-content)";
            this.l_rowHeadersContainer.style.gridAutoFlow = "column";


            this.m_masterRowHeaders.forEach(header => {
                //rowHeader1
                this.l_rowHeader1 = document.createElement("div");
                this.l_rowHeader1.innerText = header.name;
                this.l_rowHeader1.classList.add("header", "rowHeader1");
                this.l_rowHeader1.style.borderLeft = "4px solid darkgreen";
                this.l_rowHeader1.style.gridRow = `span ${rows}`;
                this.l_rowHeader1.style.width = `${this.m_cellSize * 5}px`;
                this.l_rowHeader1.style.padding = "5px 0px 0px 5px";
                this.l_rowHeadersContainer.appendChild(this.l_rowHeader1);

                // rowHeader2
                header.m_rowIntervals.forEach((rowInterval, rowIntervalIndex) => {
                    this.l_rowHeader2 = document.createElement("div");
                    this.l_rowHeader2.classList.add("header", "rowHeader2");
                    this.l_rowHeader2.innerText = `${rowInterval}`;
                    this.l_rowHeader2.style.gridRow = `span ${rows / 8}`;
                    this.l_rowHeader2.style.width = `${this.m_cellSize * 4}px`;
                    this.l_rowHeader2.style.padding = "5px 0px 0px 5px";
                    this.l_rowHeader2.setAttribute('data-row-interval-index', `${rowIntervalIndex}`);
                    this.l_rowHeadersContainer.appendChild(this.l_rowHeader2);
                    this.addMinusPlusBtn(this.l_rowHeader2);
                });

                // rowHeaders3
                for (let rowIndex = 1; rowIndex <= this.m_rows; rowIndex++) {
                    const rowIntervalIndex = Math.floor((rowIndex - 1) / 8);
                    this.l_rowHeader3 = document.createElement("div");
                    this.l_rowHeader3.innerText = `${rowIndex}`;
                    this.l_rowHeader3.classList.add("header", "rowHeader3", "flex");
                    this.l_rowHeader3.style.height = `${this.m_cellSize}px`;
                    this.l_rowHeader3.style.width = `${this.m_cellSize}px`;
                    this.l_rowHeader3.style.gridRow = `span ${rows / 64}`;
                    this.l_rowHeader3.setAttribute('data-interval-index', `${rowIntervalIndex}`);
                    this.l_rowHeadersContainer.appendChild(this.l_rowHeader3);

                    //hideRowHeader3
                    if (rowIndex % 8 === 0) {
                        this.l_rowHeader3.style.borderBottom = "2px solid #ffffff21";
                        this.l_hideRowHeader3 = document.createElement("div");
                        this.l_hideRowHeader3.classList.add("header", "hideRowHeader3", "hidden");
                        this.l_hideRowHeader3.textContent = `${rowIntervalIndex + 1}`;
                        this.l_hideRowHeader3.style.gridRow = `span 1`;
                        this.l_hideRowHeader3.style.minWidth = `19px`;
                        this.l_hideRowHeader3.style.borderBottom = "2px solid #ffffff21";
                        this.l_hideRowHeader3.setAttribute('data-interval-index', `${rowIntervalIndex}`);
                        this.l_rowHeadersContainer.appendChild(this.l_hideRowHeader3);
                    }

                    if (p_expansion_lvl === 2) {
                        this.l_rowHeader3.classList.remove("flex");
                        this.l_rowHeader3.classList.add("hidden");
                        this.l_hideRowHeader3.classList.remove("hidden");
                        this.l_hideRowHeader3.classList.add("flex");
                    } else if (p_expansion_lvl === 1) {
                        this.l_rowHeader2.style.display = "none";
                        this.l_rowHeader3.style.display = "none";
                        this.l_hideRowHeader3.classList.add("hidden");
                    }
                }

            });

            this.l_MatrixContainer.appendChild(this.l_rowHeadersContainer);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de createRowHeaders : ${error}`);
        }
    }

    createGridCell(p_expansion_lvl) {
        try {
            let cols = this.m_cols;
            let rows = this.m_rows;
            let cellSize = this.m_cellSize;
            if (p_expansion_lvl === 2) {
                cols = Math.ceil(this.m_cols / 8);
                rows = Math.ceil(this.m_rows / 8);
                cellSize = Math.ceil(this.m_cellSize * 4);
            } else if (p_expansion_lvl === 1) {
                cols = Math.ceil(this.m_cols / 64);
                rows = Math.ceil(this.m_rows / 64);
                cellSize = Math.ceil(this.m_cellSize * 16);
            }

            this.l_gridCellContainer = document.createElement("div");
            this.l_gridCellContainer.classList.add("gridContainer4");
            this.l_gridCellContainer.style.display = "grid";
            this.l_gridCellContainer.style.gridTemplateColumns = `repeat(${cols}, auto)`;
            this.l_gridCellContainer.style.gridTemplateRows = `repeat(${rows}, max-content)`;
            this.l_gridCellContainer.style.backgroundColor = "#222";
            this.l_gridCellContainer.style.color = "white";
            this.l_gridCellContainer.style.textAlign = "center";

            for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
                for (let colIndex = 0; colIndex < cols; colIndex++) {
                    const colIntervalIndex = Math.floor( (colIndex) / 8);
                    const rowIntervalIndex = Math.floor((rowIndex) / 8);

                    this.cell = document.createElement("div");
                    this.cell.classList.add("cell", "grid-cell");
                    this.cell.style.width = `${cellSize}px`;
                    this.cell.style.height = `${cellSize}px`;
                    this.cell.style.cursor = "pointer";
                    this.cell.style.border = "1px solid #ffffff21";
                    this.cell.setAttribute('data-row', `${rowIndex + 1}`);
                    this.cell.setAttribute('data-col', `${colIndex + 1}`);
                    this.cell.setAttribute('data-col-interval-index', `${colIntervalIndex}`);
                    this.cell.setAttribute('data-row-interval-index', `${rowIntervalIndex}`);

                    this.cell.innerText = this.m_cellValues;
                    this.cell.addEventListener('click', this.handleMouseClick.bind(this));
                    this.l_gridCellContainer.appendChild(this.cell);

                    // Ajout des bordures tous les 8 carreaux + ligne et row cachés
                    if ((rowIndex + 1) % 8 === 0) {
                        this.cell.style.borderBottom = "2px solid #ffffff21";

                        this.l_hiddenCellRow = document.createElement("div");
                        this.l_hiddenCellRow.classList.add("cell", "hiddenCellRow", "hidden");
                        this.l_hiddenCellRow.style.width = `${cellSize}px`;
                        this.l_hiddenCellRow.style.height = `167px`;
                        this.l_hiddenCellRow.style.cursor = "pointer";
                        this.l_hiddenCellRow.style.top = `${this.m_cellSize * (rowIndex + 1)}px`; // Décalage vertical
                        this.l_hiddenCellRow.style.left = `${this.m_cellSize}px`;
                        this.l_hiddenCellRow.style.border = "1px solid red";
                        this.l_hiddenCellRow.setAttribute('data-row', `${rowIndex + 1}`);
                        this.l_hiddenCellRow.setAttribute('data-col', `${colIndex + 1}`);
                        this.l_hiddenCellRow.setAttribute('data-row-interval-index', `${rowIntervalIndex}`);
                        this.l_gridCellContainer.appendChild(this.l_hiddenCellRow);

                    }
                    if ((colIndex + 1) % 8 === 0) {
                        this.cell.style.borderRight = "2px solid #ffffff21";

                        this.l_hiddenCellCol = document.createElement("div");
                        this.l_hiddenCellCol.classList.add("cell", "hiddenCellCol", "hidden");
                        this.l_hiddenCellCol.style.width = `166px`;
                        this.l_hiddenCellCol.style.height = `${cellSize}px`;
                        this.l_hiddenCellCol.style.gridColumn = "span 8";
                        this.l_hiddenCellCol.style.cursor = "pointer";
                        this.l_hiddenCellCol.style.top = `${this.m_cellSize}px`;
                        this.l_hiddenCellCol.style.left = `${this.m_cellSize * (colIndex + 1)}px`; // Décalage horizontal
                        this.l_hiddenCellCol.style.border = "1px solid blue";
                        this.l_hiddenCellCol.setAttribute('data-row', `${rowIndex + 1}`);
                        this.l_hiddenCellCol.setAttribute('data-col', `${colIndex + 1}`);
                        this.l_hiddenCellCol.setAttribute('data-col-interval-index', `${colIntervalIndex}`);
                        this.l_gridCellContainer.appendChild(this.l_hiddenCellCol);
                    }

                    // Ajout des cellules cachées
                    if ((rowIndex + 1) % 8 === 0 && (colIndex + 1) % 8 === 0) {
                        // Créer les cellules invisibles combinées (lignes + colonnes)
                        this.l_hiddenCellCombined = document.createElement("div");
                        this.l_hiddenCellCombined.classList.add("cell", "hiddenCellCombined", "hidden");
                        this.l_hiddenCellCombined.style.width = `${cellSize * 8}px`;
                        this.l_hiddenCellCombined.style.height = `${cellSize * 8}px`;
                        this.l_hiddenCellCombined.style.cursor = "pointer";
                        this.l_hiddenCellCombined.style.top = `${this.m_cellSize * (rowIndex + 1)}px`; // Décalage vertical
                        this.l_hiddenCellCombined.style.left = `${this.m_cellSize * (colIndex + 1)}px`; // Décalage horizontal
                        this.l_hiddenCellCombined.style.border = "1px solid green";
                        this.l_hiddenCellCombined.setAttribute('data-row', `${rowIndex + 1}`);
                        this.l_hiddenCellCombined.setAttribute('data-col', `${colIndex + 1}`);
                        this.l_hiddenCellCombined.setAttribute('data-col-interval-index', `${colIntervalIndex}`);
                        this.l_hiddenCellCombined.setAttribute('data-row-interval-index', `${rowIntervalIndex}`);
                        this.l_gridCellContainer.appendChild(this.l_hiddenCellCombined);
                    }
                }
            }

            this.l_MatrixContainer.appendChild(this.l_gridCellContainer);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de createGridCell : ${error}`);
        }
    }

    updateHeaders(p_audioWay, p_channelIdx) {
        const channelAlias = g_Gui.getDevice().getChanAlias(p_audioWay, p_channelIdx);

        if (p_audioWay === 0) {
            this.m_columnHeaders.push(channelAlias);
        } else {
            this.m_rowHeaders.push(channelAlias);
        }
        this.createGrid();
    }

    addEventListeners() {
        this.m_matrixMixer.addEventListener("mousedown", (p_event) => this.handleMouseDown(p_event));
        this.m_matrixMixer.addEventListener("mouseup", (p_event) => this.handleMouseUp(p_event));
        this.m_matrixMixer.addEventListener("mousemove", (p_event) => this.handleMouseMove(p_event));
        this.m_matrixMixer.addEventListener("dblclick", (p_event) => this.handleDoubleClick(p_event));
        this.m_matrixMixer.addEventListener("mouseleave", (p_event) => this.handleMouseLeave(p_event));
        window.addEventListener("keydown", (p_event) => this.handleSpaceKeydown(p_event))
        window.addEventListener("keyup", (p_event) => this.handleSpaceKeyup(p_event))
    }

    handleMouseClick(p_event) {
        p_event.preventDefault();
    }

    handleDoubleClick(p_event) {
        const l_cell = p_event.target;
        if (
            l_cell.classList.contains("cell") &&
            !l_cell.classList.contains("header")
        ) {
            const l_row = parseInt(l_cell.getAttribute('data-row'));
            const l_col = parseInt(l_cell.getAttribute('data-col'));
            this.showInputBox(l_row, l_col, l_cell);
        }
    }

    handleMouseDown(p_event) {
        if (this.m_isSpacePressed) {
            this.m_isDragging = true;
            this.startX = p_event.pageX - this.m_matrixMixer.scrollLeft;
            this.startY = p_event.pageY - this.m_matrixMixer.scrollTop;
            this.scrollLeft = this.m_matrixMixer.scrollLeft;
            this.scrollTop = this.m_matrixMixer.scrollTop;
            this.m_matrixMixer.style.cursor = 'grabbing'; // Changement du curseur
        }
    }

    handleMouseMove(p_event) {
        const l_cell = p_event.target;
        if (l_cell.classList.contains("cell")) {
            const l_row = parseInt(l_cell.getAttribute('data-row'));
            const l_col = parseInt(l_cell.getAttribute('data-col'));
            this.crossHair(l_row, l_col);
            this.gridInfos(l_row, l_col, l_cell);
        } else {
            this.clearCrossHair();
            this.hideGridInfos();
        }
        if (this.m_isDragging) {
            const x = p_event.pageX - this.m_matrixMixer.scrollLeft;
            const y = p_event.pageY - this.m_matrixMixer.scrollTop;
            const walkX = x - this.startX;
            const walkY = y - this.startY;
            this.m_matrixMixer.scrollLeft = this.scrollLeft - walkX;
            this.m_matrixMixer.scrollTop = this.scrollTop - walkY;
        }
    }

    handleMouseUp() {
        if (this.m_isSelecting) {
            this.m_isSelecting = false;
        }
        this.m_isDragging = false;
        this.m_matrixMixer.style.cursor = 'grab';
    }

    handleMouseLeave(p_event) {
        const l_cell = p_event.target;
        if (l_cell.classList.contains("cell")) {
            const l_row = parseInt(l_cell.getAttribute('data-row'));
            const l_col = parseInt(l_cell.getAttribute('data-col'));
            this.showInputBox(l_row, l_col, l_cell);
        }
        this.m_isDragging = false;
    }

    handleSpaceKeydown(p_event) {
        if (p_event.code === 'Space' && !this.m_isSpacePressed) {
            p_event.preventDefault();
            this.m_isSpacePressed = true;
            this.m_matrixMixer.style.cursor = 'grab';
            p_event.preventDefault();
        }
    }

    handleSpaceKeyup(p_event) {
        if (p_event.code === 'Space') {
            this.m_isSpacePressed = false;
            this.m_matrixMixer.style.cursor = '';
            this.m_isDragging = false;
        }
    }

    crossHair(p_row, p_col) {

        this.clearCrossHair();
        const l_gridCell = this.m_matrixMixer.querySelectorAll(".cell");

        l_gridCell.forEach((p_cell) => {
            const cellRow = parseInt(p_cell.getAttribute('data-row'));
            const cellCol = parseInt(p_cell.getAttribute('data-col'));
            if (cellRow === p_row || cellCol === p_col) {
                p_cell.classList.add("highlight");
            }
            if (cellRow === p_row && cellCol === p_col) {
                p_cell.classList.add("hovered");
            }
        });

        // Ajouter la classe highlight aux en-têtes de ligne et de colonne correspondants
        const rowHeaders3 = this.m_matrixMixer.querySelectorAll(".rowHeader3");
        const colHeaders3 = this.m_matrixMixer.querySelectorAll(".colHeader3");

        rowHeaders3.forEach((header) => {
            const headerRow = parseInt(header.textContent);
            if (headerRow === p_row) {
                header.style.backgroundColor = "#FFFFFF21";
            }
        });

        colHeaders3.forEach((header) => {
            const headerCol = parseInt(header.textContent);
            if (headerCol === p_col) {
                header.style.backgroundColor = "#FFFFFF21";
            }
        });
    }

    clearCrossHair() {
        const l_gridCell = this.m_matrixMixer.querySelectorAll(".cell");
        const rowHeaders3 = this.m_matrixMixer.querySelectorAll(".rowHeader3");
        const colHeaders3 = this.m_matrixMixer.querySelectorAll(".colHeader3");

        l_gridCell.forEach((p_cell) => {
            p_cell.classList.remove("highlight");
            p_cell.classList.remove("hovered");
        });

        rowHeaders3.forEach((header) => {
            header.style.backgroundColor = "#444";
        });

        colHeaders3.forEach((header) => {
            header.style.backgroundColor = "#444";
        });

    }

    showInputBox(p_row, p_col, p_cell) {
        const l_input = document.createElement("input");
        l_input.type = "number";
        l_input.className = "input-box";
        l_input.style.position = "relative";
        l_input.style.width = `${this.m_cellSize}px`;
        l_input.style.height = `${this.m_cellSize}px`;
        l_input.style.fontSize = "11px";
        l_input.style.left = `-5px`;
        l_input.style.top = `-5px`;
        l_input.style.textAlign = "center";
        l_input.style.alignItems = "center";
        p_cell.appendChild(l_input);
        l_input.focus();

        const updateCell = () => {
            const value = l_input.value;
            if (value !== "") {
                p_cell.innerText = value;
            }
        };

        l_input.addEventListener("blur", updateCell);

        l_input.addEventListener("keydown", (p_event) => {
            if (p_event.key === "Enter") {
                updateCell();
            }
        });

        document.addEventListener("click", (p_event) => {
            if (!p_cell.contains(p_event.target) && p_event.target !== l_input) {
                l_input.style.display = "none";
            }
        }, { once: true });
    }

    gridInfos(p_row, p_col, p_cell) {

        let l_gridInfos = document.getElementById("gridInfos");
        if (!l_gridInfos) {
            l_gridInfos = document.createElement("div");
            l_gridInfos.id = "gridInfos";
            l_gridInfos.style.position = "absolute";
            this.m_matrixMixer.appendChild(l_gridInfos);
        }

        l_gridInfos.style.display = "none";

        const l_rect = p_cell.getBoundingClientRect();
        const l_gridInfosOffset = 10;

        const l_mixerNumber = p_cell.getAttribute('data-col') || '';
        const l_outputNumber = p_cell.getAttribute('data-row') || '';

        l_gridInfos.innerHTML = `
		<div class="mixerGridInfos" style="color: #FFFFB4bb; transform: rotate(-90deg); position: absolute; top: -${this.m_cellSize * 4}px; left: ${this.m_cellSize * 4 - 2}px; white-space: nowrap;">
			Mixer ${l_mixerNumber}
		</div>
		<div class="outputGridInfos" style="color: #FFFFB4bb; position: absolute; left: ${this.m_cellSize}px; top: -${this.m_cellSize * 2 - 5}px; white-space: nowrap;">
			Output ${l_outputNumber}
		</div>
	`;

        const mixerNumberLength = l_mixerNumber.length;
        const additionalOffset = (mixerNumberLength - 1) * 5;

        l_gridInfos.style.left = `${l_rect.left + window.scrollX - (this.m_cellSize * 4) - l_gridInfosOffset - additionalOffset}px`;
        l_gridInfos.style.top = `${l_rect.top + window.scrollY - (this.m_cellSize * 3) + l_gridInfosOffset}px`;

        const isTooCloseToTop = l_rect.top < (this.m_cellSize * 9) + l_gridInfosOffset;
        const isTooCloseToLeft = l_rect.left < (this.m_cellSize * 7) + l_gridInfosOffset + additionalOffset;

        if (isTooCloseToTop && isTooCloseToLeft) {
            const mixerInfo = l_gridInfos.querySelector('.mixerGridInfos');
            const outputInfo = l_gridInfos.querySelector('.outputGridInfos');
            if (mixerInfo && outputInfo) {
                mixerInfo.style.display = 'none';
                outputInfo.style.display = 'none';
            }
        } else {
            if (isTooCloseToTop) {
                const mixerInfo = l_gridInfos.querySelector('.mixerGridInfos');
                if (mixerInfo) {
                    mixerInfo.style.display = 'none';
                }
            }
            if (isTooCloseToLeft) {
                const outputInfo = l_gridInfos.querySelector('.outputGridInfos');
                if (outputInfo) {
                    outputInfo.style.display = 'none';
                }
            }
        }

        l_gridInfos.style.display = "block";

    }

    hideGridInfos() {
        const l_gridInfos = document.getElementById("gridInfos");
        if (l_gridInfos) {
            l_gridInfos.style.display = "none";
        }
    }

    addExpandBtn(p_frame) {
        const l_addExpandBtn = document.createElement("button");
        l_addExpandBtn.textContent = "Expand";
        l_addExpandBtn.className = "expand-btn";
        l_addExpandBtn.style.borderRadius = "5px";
        l_addExpandBtn.addEventListener("click", () => this.expandGrid());
        p_frame.appendChild(l_addExpandBtn);
    }

    addCollapseBtn(p_frame) {
        const l_addCollapseBtn = document.createElement("button");
        l_addCollapseBtn.textContent = "Collapse";
        l_addCollapseBtn.className = "collapse-btn";
        l_addCollapseBtn.style.borderRadius = "5px";
        l_addCollapseBtn.addEventListener("click", () => this.collapseGrid());
        p_frame.appendChild(l_addCollapseBtn);
    }

    addOptimalBtn(p_frame) {
        const l_addOptimaleBtn = document.createElement("button");
        l_addOptimaleBtn.textContent = "Optimal";
        l_addOptimaleBtn.className = "optimal-btn";
        l_addOptimaleBtn.style.borderRadius = "5px";
        l_addOptimaleBtn.addEventListener("click", () => this.optimalGrid());
        p_frame.appendChild(l_addOptimaleBtn);
    }

    addExpandCollapseButtons() {
        const l_expandCollapseButtons = document.createElement("div");
        l_expandCollapseButtons.className = "btnContainer";

        this.addExpandBtn(l_expandCollapseButtons);
        this.addCollapseBtn(l_expandCollapseButtons);
        this.addOptimalBtn(l_expandCollapseButtons);

        this.m_matrixMixer.appendChild(l_expandCollapseButtons);
    }

    expandGrid() {
        if (this.m_expansionLevel < 3) {
            this.m_expansionLevel++;
            this.createGrid(this.m_expansionLevel);
        } else {
            console.log("Expansion_lvl max à ", this.m_expansionLevel);
        }

    }

    collapseGrid() {
        if (this.m_expansionLevel > 1) {
            this.m_expansionLevel--;
            this.createGrid(this.m_expansionLevel);
            if (this.m_expansionLevel === 1) {
                this.hideHeaders();
            }
        } else {
            console.log("Expansion_lvl min à ", this.m_expansionLevel);
        }
    }

    hideHeaders() {
        // Cache les en-têtes de colonnes
        this.l_columnHeadersContainer.querySelectorAll('.colHeader2, .colHeader3, .hideColHeader3').forEach(header => {
            header.classList.add('hidden'); // Utilisation de la classe 'hidden'
        });

        // Cache les en-têtes de lignes
        this.l_rowHeadersContainer.querySelectorAll('.rowHeader2, .rowHeader3, .hideRowHeader3').forEach(header => {
            header.classList.add('hidden');
        });
    }

    optimalGrid() {
        if (this.m_expansionLevel >= 1) {
            this.createGrid(this.m_expansionLevel = 2);
        }
    }

    addMinusPlusBtn(p_frame) {
        const l_addMinusPlusBtn = document.createElement("button");
        l_addMinusPlusBtn.textContent = "-";
        l_addMinusPlusBtn.classList.add("minus-btn");
        l_addMinusPlusBtn.style.backgroundColor = "transparent";
        l_addMinusPlusBtn.style.color = "white";
        l_addMinusPlusBtn.style.width = `${this.m_cellSize}px`;
        l_addMinusPlusBtn.style.border = "1px solid white";
        l_addMinusPlusBtn.style.borderRadius = "25%";
        l_addMinusPlusBtn.style.marginLeft = "5px";

        l_addMinusPlusBtn.addEventListener('click', () => {
            const p_type =
                p_frame.hasAttribute('data-col-interval-index')
                    ? "column"
                    : p_frame.hasAttribute('data-row-interval-index')
                        ? "row"
                        : "";

            if (!p_type) {
                console.error("Type non déterminé pour p_frame.");
                return;
            }

            const isMinus = l_addMinusPlusBtn.classList.contains('minus-btn');
            this.transformBtn(l_addMinusPlusBtn, p_frame, isMinus, p_type);
        });

        p_frame.appendChild(l_addMinusPlusBtn);
    }

    transformBtn(p_btn, p_frame, isMinus, p_type) {
        p_btn.textContent = isMinus ? "+" : "-";
        p_btn.classList.toggle("minus-btn", !isMinus);
        p_btn.classList.toggle("plus-btn", isMinus);

        if (p_type === "column") {
            this.toggleColumn(p_frame.dataset.colIntervalIndex, isMinus);
        } else if (p_type === "row") {
            this.toggleRow(p_frame.dataset.rowIntervalIndex, isMinus);
        }
    }

    toggleColumn(index, isMinus) {
        // Toggle la visibilité de la colonne
        let colCells = this.l_gridCellContainer.querySelectorAll(`.grid-cell[data-col-interval-index="${index}"]`);
        let colHideCells = this.l_gridCellContainer.querySelectorAll(`.hiddenCellCol[data-col-interval-index="${index}"]`);
        let headerHideColHeaders3 = this.l_columnHeadersContainer.querySelectorAll(`.hideColHeader3[data-interval-index="${index}"]`);
        let headerColHeaders3 = this.l_columnHeadersContainer.querySelectorAll(`.colHeader3[data-interval-index="${index}"]`);

        if (isMinus) {
            // Masquer les cellules de la colonne
            colCells.forEach(cell => {
                cell.classList.add('hidden');
            });
            colHideCells.forEach(hideCell => {
                hideCell.classList.remove('hidden');
            });

            // Gérer les en-têtes de colonnes
            headerHideColHeaders3.forEach(header => {
                header.classList.remove('hidden');
                header.style.gridColumn = `span 8`;
                header.style.width = `166px`;
            });
            headerColHeaders3.forEach(header => {
                header.classList.add('hidden');
            });

            // Synchroniser la visibilité des lignes affectées par la colonne
            this.l_gridCellContainer.querySelectorAll(`[data-col-interval-index="${index}"]`).forEach(cell => {
                let rowIndex = cell.getAttribute('data-row');
                // Masquer les cellules correspondantes dans la ligne
                if (this.isHideRowVisible) {
                    let rowCells = this.l_gridCellContainer.querySelectorAll(`[data-row="${rowIndex}"]`);
                    rowCells.forEach(rowCell => {
                        rowCell.classList.add('hidden');
                    });
                }
            });

            this.isHideColVisible = !this.isHideColVisible; // Mettre à jour l'état de la colonne
        } else {
            // Réafficher les cellules de la colonne et masquer les cellules cachées
            colCells.forEach(cell => {
                cell.classList.remove('hidden');
            });
            colHideCells.forEach(hideCell => {
                hideCell.classList.add('hidden');
            });

            // Gérer les en-têtes des colonnes
            headerHideColHeaders3.forEach(header => {
                header.classList.add('hidden');
            });
            headerColHeaders3.forEach(header => {
                header.classList.remove('hidden');
            });

            this.isHideColVisible = !this.isHideColVisible; // Remettre l'état de la colonne à visible

            // Ré-afficher toutes les lignes si visibles
            if (this.isHideRowVisible) {
                this.l_gridCellContainer.querySelectorAll(`[data-row]`).forEach(cell => {
                    let rowIndex = cell.getAttribute('data-row');
                    cell.classList.remove('hidden');
                });
            }
        }
    }


    toggleRow(index, isMinus) {
        // Toggle the visibility of the hidden row
        let rowCells = this.l_gridCellContainer.querySelectorAll(`.grid-cell[data-row-interval-index="${index}"]`);
        let rowHideCells = this.l_gridCellContainer.querySelectorAll(`.hiddenCellRow[data-row-interval-index="${index}"]`);
        let headerHideRowHeader3 = this.l_rowHeadersContainer.querySelectorAll(`.hideRowHeader3[data-interval-index="${index}"]`);
        let headerRowHeaders3 = this.l_rowHeadersContainer.querySelectorAll(`.rowHeader3[data-interval-index="${index}"]`);

        if (isMinus) {
            // Masquer les cellules de la ligne
            rowCells.forEach(cell => {
                cell.classList.add('hidden');
            });

            rowHideCells.forEach(hideCell => {
                hideCell.classList.remove('hidden');
            });

            // Gérer les en-têtes de lignes
            headerHideRowHeader3.forEach(header => {
                header.classList.remove('hidden');
                header.classList.add('flex');
                header.style.gridRow = `span 8`;
                header.style.height = `167px`;
            });
            headerRowHeaders3.forEach(header => {
                header.classList.remove('flex');
                header.classList.add('hidden');
            });

            this.isHideRowVisible = !this.isHideRowVisible; // Mettre à jour l'état de la ligne

            // Synchroniser la visibilité des colonnes affectées par la ligne
            this.l_gridCellContainer.querySelectorAll(`[data-row-interval-index="${index}"]`).forEach(cell => {
                let colIndex = cell.getAttribute('data-col');
                // Masquer les cellules correspondantes dans la colonne
                if (this.isHideColVisible) {
                    let colCells = this.l_gridCellContainer.querySelectorAll(`[data-col="${colIndex}"]`);
                    colCells.forEach(colCell => {
                        colCell.classList.add('hidden');
                    });
                }
            });

        } else {
            // Réafficher les cellules de la ligne et masquer les cellules cachées
            rowCells.forEach(cell => {
                cell.classList.remove('hidden');
            });

            rowHideCells.forEach(hideCell => {
                hideCell.classList.add('hidden');
            });

            // Gérer les en-têtes des lignes
            headerHideRowHeader3.forEach(header => {
                header.classList.remove('flex');
                header.classList.add('hidden');
                header.style.gridRow = `span 1`;
                header.style.height = ``;
            });

            headerRowHeaders3.forEach(header => {
                header.classList.remove('hidden');
            });

            this.isHideRowVisible = !this.isHideRowVisible; // Remettre l'état de la ligne à visible

            // Ré-afficher toutes les colonnes si visibles
            if (this.isHideColVisible) {
                this.l_gridCellContainer.querySelectorAll(`[data-col]`).forEach(cell => {
                    let colIndex = cell.getAttribute('data-col');
                    cell.classList.remove('hidden');
                });
            }
        }
    }


    toggleHeaders(p_intervalIdx, p_show, p_type) {
        try {
            if (p_show) {
                this.l_colHeader2.style.columnSpan = "4";

                //Colonnes
                this.l_colHeader3.classList.add ("hidden");
                if (this.l_hideColHeader3.classList.contains("hidden")) {
                    this.l_hideColHeader3.classList.remove ("hidden");
                    this.l_hideColHeader3.style.display = "flex";
                }

                //Lignes
                this.l_rowHeader3.classList.add ("hidden");
                if (this.l_hideRowHeader3.classList.contains("hidden")) {
                    this.l_hideRowHeader3.classList.remove("hidden")
                }

                //Grille
                this.cell.classList.add ("hidden");
                if(this.l_hiddenCell.classList.contains("hidden")) {
                    this.l_hiddenCell.classList.remove("hidden")
                }
            } else {
                //Colonnes
                if (this.l_colHeader3.classList.contains ("hidden")){
                    this.l_colHeader3.classList.remove ("hidden");
                }
                this.l_hideColHeader3.classList.add ("hidden");

                //Lignes
                if (this.l_rowHeader3.classList.contains ("hidden")){
                    this.l_rowHeader3.classList.remove ("hidden");
                }
                this.l_hideRowHeader3.classList.add ("hidden");

                //Grille
                if(this.cell.classList.contains ("hidden")) {
                    this.cell.classList.remove ("hidden");
                }
                this.l_hiddenCell.classList.add("hidden");
            }
        } catch (error) {
            console.error(`Erreur lors de l'exécution de toggleHeaders : ${error}`);
        }
    }
}

function createGridMatrix(p_containerSelector, p_numColumns, p_numRows, p_cellSize) {
    return new gridMatrix(p_containerSelector, p_numColumns, p_numRows, p_cellSize);
}

createGridMatrix("#matrixMixer", 64, 64, 19)
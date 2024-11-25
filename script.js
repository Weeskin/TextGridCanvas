class tableMatrix {
    color;
    constructor(p_containerSelector, p_numColumns, p_numRows, p_cellSize) {
        this.m_matrixMixer = document.querySelector(p_containerSelector);
        this.m_cellSize = p_cellSize;
        this.m_AudioWay = 0;
        this.m_isSelecting = false;
        this.m_isDragging = false;
        this.m_isSpacePressed = false;
        this.m_cols = p_numColumns;
        this.m_masterColumnsHeaders = [			{ name: "AES67", m_colIntervals: ['1-8', '9-16', '17-24', '25-32', '33-40', '41-48', '49-56', '57-64'] },
            // {name: "FLX2" , m_colIntervals :['1-8', '9-16', '17-24', '25-32', '33-40', '41-48', '49-56', '57-64'] },
            // {name: "MADI" , m_colIntervals :['1-8', '9-16', '17-24', '25-32', '33-40', '41-48', '49-56', '57-64'] }
        ]
        this.m_columnHeaders = [];
        this.m_rows = p_numRows;
        this.m_inputsGroups = [
            { name: "DANTE", m_rowIntervals: ['1-8', '9-16', '17-24', '25-32', '33-40', '41-48', '49-56', '57-64'] },
            // { name: "MADI", m_rowIntervals: ['1-8', '9-16', '17-24', '25-32', '33-40', '41-48', '49-56', '57-64'] },
            // { name: "FLX1", m_rowIntervals: ['1-8', '9-16', '17-24', '25-32', '33-40', '41-48', '49-56', '57-64'] }
        ];
        this.m_rowHeaders = [];
        this.m_cellValues = "";
        this.m_expansionLevel = 1;
        this.init();
    }

    init() {
        this.createTable();
        this.addEventListeners();
    }

    createTable() {
        try {
            this.m_matrixMixer.innerHTML = "";
            this.m_matrixMixer.style.padding = "15px";

            this.l_MatrixContainer = document.createElement("div");
            this.l_MatrixContainer.classList.add("matrixContainer");

            this.table = document.createElement("table");
            this.table.classList.add("matrixTable");
            this.table.style.borderRadius = "5px"

            this.l_MatrixContainer.appendChild(this.table);

            this.addExpandCollapseButtons();
            this.createColumnHeaders();
            this.createRow();

            this.m_matrixMixer.appendChild(this.l_MatrixContainer);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de createTable : ${error}`);
        }
    }

    createColumnHeaders() {
        const l_colHeaders1 = document.createElement("tr");
        const l_colHeaders2 = document.createElement("tr");
        const l_colHeaders3 = document.createElement("tr");

        const titleCell = document.createElement("th");
        titleCell.innerText = 'New Grid';
        titleCell.rowSpan = 3;
        titleCell.colSpan = 3;
        titleCell.style.borderRadius = "5px";
        titleCell.classList.add("header", "titleCell")
        titleCell.style.width = `${this.m_cellSize}px`;
        titleCell.style.height = `${this.m_cellSize}px`;
        l_colHeaders1.appendChild(titleCell);

        this.m_masterColumnsHeaders.forEach((group) => {
            //First line
            const masterHeaderColumn = document.createElement('th');
            masterHeaderColumn.innerText = group.name;
            masterHeaderColumn.colSpan = this.m_cols;
            masterHeaderColumn.classList.add("header", "colHeader1");
            masterHeaderColumn.style.borderTop = " 4px solid darkgreen ";
            masterHeaderColumn.style.width = `${this.m_cellSize * this.m_cols}px`;
            masterHeaderColumn.style.height = `${this.m_cellSize * 5}px`;
            masterHeaderColumn.style.textAlign = 'left';
            masterHeaderColumn.style.verticalAlign = 'top';
            l_colHeaders1.appendChild(masterHeaderColumn);

            //Second line
            group.m_colIntervals.forEach((interval, intervalIndex) => {
                const th = document.createElement("th");
                const div = document.createElement("div");
                div.textContent = `${interval}`;
                div.style.transform = "rotate(-90deg)";
                div.style.position = "absolute"
                div.style.top = "12px";
                div.style.left = "0";

                th.colSpan = 8;
                th.style.height = `${this.m_cellSize * 3}px`;
                th.style.position = "relative"
                th.style.textAlign = "right";
                th.style.verticalAlign = "top"
                th.style.overflow = "hidden";
                th.classList.add("header", "colHeader2")
                th.appendChild(div);
                l_colHeaders2.appendChild(th);

                th.setAttribute('data-interval-index', `${intervalIndex}`);

                this.addMinusPlusBtn(th)
            });

            //Third Line
            for (let colIndex = 1; colIndex <= this.m_cols; colIndex++) {

                if (colIndex % 8 === 0) {
                    const th = document.createElement("th");
                    const div = document.createElement("div");
                    const intervalIndex = Math.floor((colIndex - 1) / 8);
                    div.textContent = `${colIndex/8}`;
                    div.style.transform = "rotate(-90deg)";
                    div.style.whiteSpace = "nowrap";
                    div.style.display = "inline-block";
                    th.classList.add('hideColHeader3');
                    th.colSpan = 2;
                    th.style.width = `${this.m_cellSize}px`;
                    th.style.height = `${this.m_cellSize}px`;
                    th.style.display ="none";
                    th.classList.add("header", "colHeader3");
                    th.setAttribute('data-interval-index', `${intervalIndex}`);
                    th.appendChild(div);
                    l_colHeaders3.appendChild(th);
                }

                const th = document.createElement("th");
                const div = document.createElement("div");
                const intervalIndex = Math.floor((colIndex - 1) / 8);
                div.textContent = `${colIndex}`;
                div.style.transform = "rotate(-90deg)";
                div.style.whiteSpace = "nowrap";
                div.style.display = "inline-block";

                th.style.width = `${this.m_cellSize}px`;
                th.style.height = `${this.m_cellSize}px`;
                th.classList.add("header", "colHeader3");
                th.setAttribute('data-interval-index', `${intervalIndex}`);
                th.appendChild(div);
                l_colHeaders3.appendChild(th);
            }
        });

        const thead = document.createElement('thead');
        thead.appendChild(l_colHeaders1);
        thead.appendChild(l_colHeaders2);
        thead.appendChild(l_colHeaders3);
        this.table.appendChild(thead);
    }

    createRow() {
        this.m_inputsGroups.forEach(group => {
            group.m_rowIntervals.forEach((subgroup, subgroupIndex) => {
                for (let rowIndex = 1; rowIndex <= 8; rowIndex++) {
                    const tr = document.createElement("tr");

                    // First (Première cellule du groupe)
                    if (subgroupIndex === 0 && rowIndex === 1) {
                        const thGroup = document.createElement("th");
                        thGroup.innerText = group.name;
                        thGroup.rowSpan = this.m_rows;
                        thGroup.classList.add("header", "rowHeader1");
                        thGroup.style.borderLeft = "4px solid darkgreen";
                        thGroup.style.width = `${this.m_cellSize * 5}px`;
                        tr.appendChild(thGroup);
                    }

                    if (rowIndex === 1) {
                        const thSubGroup = document.createElement("th");
                        thSubGroup.innerText = `${subgroup}`;
                        thSubGroup.rowSpan = 8;
                        thSubGroup.classList.add("header", "rowHeader2");
                        thSubGroup.style.width = `${this.m_cellSize * 3}px`
                        thSubGroup.setAttribute('data-row-interval-index', `${subgroupIndex}`);
                        tr.appendChild(thSubGroup);
                        this.addMinusPlusBtn(thSubGroup); // Ajout du bouton +/- pour réduire/déplier
                    }

                    if ((rowIndex + (subgroupIndex * 8)) % 8 === 0) {
                        const thNumber = document.createElement("th");
                        thNumber.innerText = `${subgroupIndex + 1}`;
                        thNumber.classList.add("hideRowHeader3");
                        thNumber.style.width = `${this.m_cellSize}px`
                        thNumber.rowSpan = 1
                        thNumber.style.display = `none`;
                        thNumber.setAttribute('data-row-interval-index', `${subgroupIndex}`);
                        tr.appendChild(thNumber);
                    }

                    // Third (Numéro de la ligne)
                    const thNumber = document.createElement("th");
                    thNumber.innerText = `${rowIndex + (subgroupIndex * 8)}`;
                    thNumber.classList.add("header", "rowHeader3");
                    thNumber.style.width = `${this.m_cellSize}px`;
                    thNumber.style.height = `${this.m_cellSize}px`;
                    thNumber.style.minHeight = `${this.m_cellSize}px`;
                    thNumber.setAttribute('data-row-interval-index', `${subgroupIndex}`);
                    tr.appendChild(thNumber);


                    // Grid (Cellules du tableau)
                    for (let colIndex = 0; colIndex < this.m_cols; colIndex++) {
                        const intervalIndex = Math.floor((colIndex - 1) / 8);
                        // Ajout des colonnes masquées (foldColumn)
                        if (colIndex % 8 === 0) {
                            const hideFoldColumn = document.createElement('td');
                            hideFoldColumn.classList.add('hideFoldColumn');
                            hideFoldColumn.style.display = 'none';
                            hideFoldColumn.classList.add("grid-cell");
                            hideFoldColumn.colSpan = 2;
                            hideFoldColumn.style.minWidth = `${this.m_cellSize*2}px`;
                            hideFoldColumn.setAttribute('data-interval-index', `${intervalIndex + 1}`);
                            hideFoldColumn.addEventListener('click', this.handleMouseClick.bind(this));
                            tr.appendChild(hideFoldColumn);
                        }

                        // Ajout des cellules normales
                        const td = document.createElement('td');
                        td.setAttribute('data-row', `${rowIndex + (subgroupIndex * 8)}`);
                        td.setAttribute('data-col', `${colIndex + 1}`);
                        td.classList.add("grid-cell", "unFoldColumn");
                        td.style.maxWidth = `${this.m_cellSize}px`;
                        td.style.minWidth = `${this.m_cellSize}px`;
                        td.innerText = this.m_cellValues;
                        td.addEventListener('click', this.handleMouseClick);
                        tr.appendChild(td);

                        // Ajout des bordures tous les 8 carreaux
                        if ((rowIndex + (subgroupIndex * 8)) % 8 === 0) {
                            td.style.borderBottom = "2px solid rgba(255, 255, 255, 0.13)";
                        }
                        if ((colIndex + 1) % 8 === 0) {
                            td.style.borderRight = "2px solid rgba(255, 255, 255, 0.13)";
                        }
                    }

                    // Ajout de la ligne (tr) au tableau
                    this.table.appendChild(tr);
                }
            });
        });
    }

    updateHeaders(p_audioWay, p_channelIdx) {
        const channelAlias = g_Gui.getDevice().getChanAlias(p_audioWay, p_channelIdx);

        if (p_audioWay === 0) {
            this.m_columnHeaders.push(channelAlias);
        } else {
            this.m_rowHeaders.push(channelAlias);
        }
        this.createTable();
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
            l_cell.classList.contains("grid-cell") &&
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
        if (l_cell.classList.contains("grid-cell")) {
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
        if (l_cell.classList.contains("grid-cell")) {
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
        const l_gridCell = this.m_matrixMixer.querySelectorAll(".grid-cell");

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
        const l_gridCell = this.m_matrixMixer.querySelectorAll(".grid-cell");
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
        l_input.style.position = "absolute";
        l_input.style.width = `${this.m_cellSize}px`;
        l_input.style.height = `${this.m_cellSize}px`;
        l_input.style.fontSize = "12px";
        l_input.style.textAlign = "center";
        l_input.style.justifyContent = "flex-start";
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
            this.createTable(this.m_expansionLevel);
        } else {
            console.log("Le niveau d'expansion maximum de 3 est atteint.");
        }
        this.m_cellValues = Array.from({ length: this.m_rows }, (_, i) =>
            Array.from({ length: this.m_cols }, (_, j) =>
                this.m_cellValues[i] && this.m_cellValues[i][j] !== undefined
                    ? this.m_cellValues[i][j]
                    : ""
            )
        );
    }

    collapseGrid() {
        if (this.m_expansionLevel > 1) {
            this.m_expansionLevel--;
            this.createTable(this.m_expansionLevel);
        }
    }

    optimalGrid() {
        if (this.m_expansionLevel > 1) {
            this.m_expansionLevel--;
            this.createTable(this.m_expansionLevel);
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
            let p_type = "";
            if (p_frame.hasAttribute('data-interval-index')) {
                p_type = "column";
            } else if (p_frame.hasAttribute('data-row-interval-index')) {
                p_type = "row";
            } else {
                console.error("Type non déterminé pour p_frame.");
                return;
            }

            if (l_addMinusPlusBtn.classList.contains('minus-btn')) {
                this.transformBtn(l_addMinusPlusBtn, p_frame, true, p_type);
            } else {
                this.transformBtn(l_addMinusPlusBtn, p_frame, false, p_type);
            }
        });

        p_frame.appendChild(l_addMinusPlusBtn);
    }

    transformBtn(p_btn, p_frame, isMinus, p_type) {
        if (isMinus) {
            p_btn.textContent = "+";
            p_btn.classList.remove("minus-btn");
            p_btn.classList.add("plus-btn");

            if (p_type === "column") {
                this.toggleHeaders(p_frame.dataset.intervalIndex, false, "column");
            } else if (p_type === "row") {
                this.toggleHeaders(p_frame.dataset.rowIntervalIndex, false, "row");
            }
        } else {
            p_btn.textContent = "-";
            p_btn.classList.remove("plus-btn");
            p_btn.classList.add("minus-btn");

            if (p_type === "column") {
                this.toggleHeaders(p_frame.dataset.intervalIndex, true, "column");
            } else if (p_type === "row") {
                this.toggleHeaders(p_frame.dataset.rowIntervalIndex, true, "row");
            }
        }
    }

    toggleHeaders(p_intervalIdx, p_show, p_type) {
        if (p_type === "column") {
            console.log("Traitement des colonnes...");

            const colHeaders1 = document.querySelectorAll(`th.colHeader1[data-interval-index='${p_intervalIdx}']`);
            colHeaders1.forEach(header => {
                header.style.display = p_show ? "" : "none";
            });

            const colHeaders2 = document.querySelectorAll(`th.colHeader2[data-interval-index='${p_intervalIdx}']`);
            colHeaders2.forEach(header => {
                header.colSpan = p_show ? 8 : 2;
            });

            const colHeaders3 = document.querySelectorAll(`th.colHeader3[data-interval-index='${p_intervalIdx}']`);
            colHeaders3.forEach((header, index) => {
                const colIndex = p_intervalIdx * 8 + index + 1;
                const gridCells = document.querySelectorAll(`td[data-col='${colIndex}']`);

                if (p_show) {
                    header.style.display = ""
                    gridCells.forEach(cell => {
                        cell.style.display = "";
                    });
                } else {
                    header.style.display = "none";
                    gridCells.forEach(cell => {
                        cell.style.display = "none";
                    });
                }
            });

            const hideColHeader3 = document.querySelectorAll(`th.hideColHeader3[data-interval-index='${p_intervalIdx}']`);
            hideColHeader3.forEach(header => {
                header.style.display = p_show ? "none" : "";
            });

            const hideFoldColumn = document.querySelectorAll(`td.hideFoldColumn[data-interval-index='${p_intervalIdx}']`);
            console.log("hideFoldColumn:", hideFoldColumn);

            hideFoldColumn.forEach(cell => {
                cell.style.display = p_show ? "none" : "";

            });

        } else if (p_type === "row") {
            console.log("Traitement des lignes...");
            const rowHeaders1 = document.querySelectorAll(`th.rowHeader1[data-row-interval-index='${p_intervalIdx}']`);
            rowHeaders1.forEach(header => {
                header.style.display = p_show ? "" : "none";
            });

            const rowHeader2 = document.querySelectorAll(`th.rowHeader2[data-row-interval-index='${p_intervalIdx}']`);
            rowHeader2.forEach(header => {
                header.rowSpan = p_show ? 8 : 1;
            });

            const rowHeaders3 = document.querySelectorAll(`th.rowHeader3[data-row-interval-index='${p_intervalIdx}']`);
            rowHeaders3.forEach((header, index) => {
                const rowIndex = p_intervalIdx * 8 + index + 1;
                const gridCells = document.querySelectorAll(`td[data-row='${rowIndex}']`);

                if (gridCells && p_show) {
                    header.style.display = "";
                    gridCells.forEach(cell => {
                        cell.style.display = "";
                    });
                } else {
                    header.style.display = "none";
                    gridCells.forEach(cell => {
                        cell.style.display = "none";
                    });
                }
            });

            const hideRowHeader3 = document.querySelectorAll(`th.hideRowHeader3[data-row-interval-index='${p_intervalIdx}']`);
            hideRowHeader3.forEach(header => {
                header.style.display = p_show ? "none" : "";
            });
        } else {
            console.error("Type non reconnu. Utilisez 'column' ou 'row'.");
        }
    }

}

function createGridMatrix(p_containerSelector, p_numColumns, p_numRows, p_cellSize) {
    return new tableMatrix(p_containerSelector, p_numColumns, p_numRows, p_cellSize);
}

createGridMatrix("#matrixMixer", 64, 64, 19)